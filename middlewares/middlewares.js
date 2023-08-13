const express = require('express');
const utility = require('../helpers/utility');
const url = require('url');
const Router = express.Router();
const dbcon = require('../config/connection_pool.js');
const constants = require('../config/constant');
const query = require('../helpers/query');
Router.use(async (req, res, next) => {
  if (utility.checkEmpty(constants.dbconn)) {
    constants.dbconn = await dbcon.connection().catch((e) => {
      console.log(e);
    });
  }
  const user_id = req.headers.user_id;

  if (utility.checkEmpty(user_id)) {
    if (
      req.url === '/auth/signup' ||
      req.url === '/auth/signin' ||
      req.url === '/admin/login' ||
      req.url === '/product/getProductByLimit' ||
      req.url === '/product/readOthersComment' ||
      req.url === '/admin/getUserByLimit' ||
      req.url === '/product/readAProduct/:id' ||
      req.url === '/admin/getProductCount'
    ) {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaa');
      next();
    } else {
      console.log('req.url', req.url);
      console.log('header is empty');
    }
  } else {
    const encrypt_user_id_arr = user_id.split(':::');
    //check if the route is of admin then confirm the user is admin
    if (
      req.url === '/admin/addUpdateProduct' ||
      req.url === '/admin/removeProduct' ||
      req.url === '/admin/editProduct' ||
      req.url === '/admin/removeUser' ||
      req.url === '/admin/getOrderByLimits'
    ) {
      let customer_id = encrypt_user_id_arr[1];
      console.log('customer_id', customer_id);
      let customer_details = await query.getAllUserDataById(customer_id);
      if (!utility.checkEmpty(customer_details)) {
        let customer_role = customer_details.customer_role;
        console.log('customer_role', customer_role);
        if (customer_role == 1) {
          req.locals = {};
          req.locals.customer_id = encrypt_user_id_arr[1];
          next();
        }
      }
    } else {
      req.locals = {};
      req.locals.customer_id = encrypt_user_id_arr[1];
      next();
    }
  }
});

module.exports = Router;
