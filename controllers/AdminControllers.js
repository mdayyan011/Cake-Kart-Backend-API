const express = require('express');
const utility = require('../helpers/utility');
const dbquery = require('../helpers/query');
const methods = require('../helpers/method');
const dbcon = require('../config/connection_pool');
const customerController = require('./CustomerControllers');
const constants = require('../config/constant');

exports.admin_login = [
  async (req, res) => {
    try {
      if (utility.checkEmpty(constants.dbconn)) {
        constants.dbconn = await dbcon.connection().catch((e) => {
          console.log(e);
        });
      }
      let input = req.body;
      let response = {};
      console.log('Request is ---------------------', input);
      if (
        utility.checkEmpty(input) ||
        utility.checkEmpty(input.customer_email) ||
        utility.checkEmpty(input.customer_password)
      ) {
        response['status'] = 'error';
        response['msg'] = 'Invalid request';
        return res.send(response);
      }
      let customer_email = input.customer_email;
      let customer_password = input.customer_password;
      let authentication_status = await methods.authentication_status(
        customer_email,
        customer_password
      );
      console.log('Status++++++++++++++++++++++++++++ ', authentication_status);
      if (!authentication_status) {
        response['status'] = 'error';
        response['mssg'] = 'Wrong Email or Password';
        return res.send(response);
      }
      let details = await dbquery.getAllUserDataByEmail(customer_email);
      if (utility.checkEmpty(details)) {
        response['status'] = 'error';
        response['msg'] = 'No user with such email';
        return res.send(response);
      }
      let customer_role = details.customer_role;
      if (customer_role != 1) {
        response['status'] = 'error';
        response['mssg'] = 'Restricted Access.Only Admin Can Login Here.';
        return res.send(response);
      }

      let user_id = await methods.user_id(customer_email);
      // console.log(details);
      let profile_pic = details.customer_image_url;
      let first_name = details.customer_fname;
      response['status'] = 'success';
      response['mssg'] = '';
      response['user_id'] = user_id;
      response['profile_pic'] = profile_pic;
      response['first_name'] = first_name;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.addProduct = [
  async (req, res) => {
    try {
      // "product_image": "https://media.istockphoto.com/photos/pink-and-white-frosted-cupcake-isolated-on-white-picture-id167120918?k=20&m=167120918&s=612x612&w=0&h=SL7pPaRbqwf-7ewyqIF_aTvhMY-qKSbShkW5BetZtsI=",
      //   "product_title": "Choco Delite",
      //   "product_desc": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the fin",
      //   "product_rating_id":1,
      //   "product_review_count":0,
      //   "product_rating_count":0,
      //   "product_currency": "₹",
      //   "product_old_price": "50.00",
      //   "product_new_lesser_price":"25.00"
      let input = req.body;
      let product_image = input.product_image;
      let product_old_price = input.product_old_price;
      let product_new_lesser_price = input.product_new_lesser_price;
      let product_currency = input.product_currency;
      let product_title = input.product_title;
      let product_desc = input.product_desc;

      let param = {};
      param['product_image'] = product_image;
      param['product_title'] = product_title;
      param['product_desc'] = product_desc;
      param['product_currency'] = product_currency;
      param['product_old_price'] = product_old_price;
      param['product_new_lesser_price'] = product_new_lesser_price;
      dbquery.insertSingle('product_master_details', param);
      let response = {};
      response['status'] = 'success';
      response['mssg'] = 'successfully inserted';
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  },
];

exports.removeProduct = [
  async (req, res) => {
    try {
      let response = {};
      let input = req.body;
      console.log('************ ', input);
      let product_id = input.product_id;
      let check_if_product_exist = await dbquery.getProductDetails(product_id);
      if (utility.checkEmpty(check_if_product_exist)) {
        response['status'] = 'error';
        response['mssg'] = 'No product of given product id';
        return res.send(response);
      }
      dbquery.remove_product(product_id);
      response['status'] = 'success';
      response['mssg'] = 'product deleted successfully';
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.editProduct = [
  async (req, res) => {
    try {
      let response = {};
      let input = req.body;
      let product_id = input.product_id;
      let check_if_product_exist = await dbquery.getProductDetails(product_id);
      if (utility.checkEmpty(check_if_product_exist)) {
        response['status'] = 'error';
        response['mssg'] = 'No product of given product id';
        return res.send(response);
      }
      let params = {};
      params['product_image'] = input.product_image;
      params['product_title'] = input.product_title;
      params['product_desc'] = input.product_desc;
      params['product_currency'] = input.product_currency;
      params['product_old_price'] = input.product_old_price;
      params['product_new_lesser_price'] = input.product_new_lesser_price;
      dbquery.updateProduct(params, product_id);
      response['status'] = 'success';
      response['mssg'] = 'product edited successfully';
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.getUserByLimit = [
  async (req, res) => {
    try {
      let response = {};

      let user_details = await dbquery.getUserDetails();
      if (utility.checkEmpty(user_details)) {
        response['status'] = 'error';
        response['mssg'] = 'no user to show';
        response['data'] = user_details;
        return res.send(response);
      }
      let result_data = [];
      for (let i in user_details) {
        let user_detail = user_details[i];
        console.log('user_details', user_detail);
        let user_name =
          user_detail.customer_fname + ' ' + user_detail.customer_lname;

        let customer_role = '';
        if (user_detail.customer_role === 1) {
          customer_role = 'Admin';
        } else {
          customer_role = 'Customer';
        }
        let result_obj = {
          customer_id: user_detail.customer_id,
          user_name: user_name,
          image: user_detail.customer_image_url,
          customer_email: user_detail.customer_email,
          number_of_orders_made: user_detail.number_of_orders_made,
          customer_role: customer_role,
        };
        result_data.push(result_obj);
      }

      response['status'] = 'success';
      response['mssg'] = '';
      response['data'] = result_data;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.getProductCount = [
  async (req, res) => {
    try {
      if (utility.checkEmpty(constants.dbconn)) {
        constants.dbconn = await dbcon.connection().catch((e) => {
          console.log(e);
        });
      }
      let product_count = await dbquery.getProductCount();
      if (utility.checkEmpty(product_count)) {
        response['status'] = 'error';
        response['mssg'] = 'no user to show';
        return res.send(response);
      }

      let response = {};

      response['status'] = 'success';
      response['mssg'] = '';
      response['count'] = product_count.count;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.getOrderByLimits = [
  async (req, res) => {
    try {
      let order_details = await dbquery.getOrderDetailsByLimits();
      let response = {};

      let result_data = [];

      for (let i in order_details) {
        let order_detail = order_details[i];
        console.log('order_detail', order_detail.qty);
        console.log('product_id', order_detail.product_id);
        let product_id = order_detail.product_id;
        let order_date = order_detail.created_at;
        let product_detail = await dbquery.getAProduct(product_id);
        console.log('----------------------------- ', product_detail);

        if (!utility.checkEmpty(product_detail)) {
          console.log('******************************');
          product_detail = product_detail[0];
          console.log(product_detail.product_image);
          let customer_id = order_detail.customer_id;
          let customer_details = await dbquery.getAllUserDataById(customer_id);
          if (!utility.checkEmpty(customer_details)) {
            let result_obj = {
              product_title: product_detail.product_title,
              product_image: product_detail.product_image,
              qty: order_detail.qty,
              price_paid: order_detail.price_paid,
              ordered_by: customer_details.customer_fname,
              ordered_by_mail: customer_details.customer_email,
              order_date: order_date,
            };
            result_data.push(result_obj);
          }
        }
      }

      response['status'] = 'success';
      response['mssg'] = '';
      response['data'] = result_data;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.removeUser = [
  async (req, res) => {
    try {
      let input = req.body;
      let customer_id = input.customer_id;
      let response = {};
      if (utility.checkEmpty(customer_id)) {
        response['status'] = 'error';
        response['mssg'] = 'Empty customer id';
        return res.send(response);
      }
      dbquery.remove_user('customer_master_details', customer_id);
      dbquery.remove_user('customer_cart_details', customer_id);

      response['status'] = 'success';
      response['mssg'] = '';
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];
