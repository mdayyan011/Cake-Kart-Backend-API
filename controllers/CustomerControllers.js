const utility = require('../helpers/utility');
const dbquery = require('../helpers/query.js');
const methods = require('../helpers/method');
const dbcon = require('../config/connection_pool');
const constants = require('../config/constant');

exports.customer_signup = async (req, res) => {
  if (utility.checkEmpty(constants.dbconn)) {
    constants.dbconn = await dbcon.connection().catch((e) => {
      console.log(e);
    });
  }

  console.log('----------------------------- input --' + req.body.input);
  const input = req.body;
  const fname = input.fname;
  const lname = input.lname;
  const customer_email = input.customer_email;
  const customer_password = input.customer_password;
  console.log(req.body);
  console.log(req.body.input);
  let response = {};
  //checking for empties
  if (utility.checkEmpty(fname)) {
    response['status'] = 'error';
    response['msg'] = 'Empty First Name';
    return res.send(response);
  }

  if (utility.checkEmpty(customer_email)) {
    response['status'] = 'error';
    response['msg'] = 'Empty Customer Email';
    return res.send(response);
  }

  if (utility.checkEmpty(customer_password)) {
    response['status'] = 'error';
    response['msg'] = 'Empty Customer Password';
    return res.send(response);
  }

  if (utility.checkEmailFormat(customer_email)) {
    response['status'] = 'error';
    response['msg'] = 'Enter Correct Email';
    return res.send(response);
  }

  let email_duplicacy_data = await dbquery.getAllUserDataByEmail(
    customer_email
  );
  if (!utility.checkEmpty(email_duplicacy_data)) {
    response['status'] = 'error';
    response['msg'] = 'email_duplicacy';
    return res.send(response);
  }
  let encryped_password = await utility.encryptData(customer_password);
  // db, table, params;
  let params = {};
  params['customer_fname'] = fname;
  params['customer_lname'] = lname;
  params['customer_email'] = customer_email;
  params['customer_password'] = encryped_password;
  if (!utility.checkEmpty(input.profile_pic)) {
    params['customer_image_url'] = input.profile_pic;
  }

  await dbquery.insertSingle('customer_master_details', params);

  response['status'] = 'success';
  response['msg'] = 'Registered';
  return res.send(response);
};

exports.customer_signin = async (req, res) => {
  try {
    if (utility.checkEmpty(constants.dbconn)) {
      constants.dbconn = await dbcon.connection().catch((e) => {
        console.log(e);
      });
    }
    let input = req.body;
    let customer_email = input.customer_email;
    let customer_password = input.customer_password;
    let response = {};
    if (utility.checkEmpty(customer_password)) {
      response['status'] = 'error';
      response['mssg'] = 'Enter password to login';
      return res.send(response);
    }
    if (utility.checkEmpty(customer_email)) {
      response['status'] = 'error';
      response['mssg'] = 'Enter email to login';
      return res.send(response);
    }

    let user_id = await methods.user_id(customer_email);
    let details = await dbquery.getAllUserDataByEmail(customer_email);
    if (utility.checkEmpty(details)) {
      response['status'] = 'error';
      response['msg'] = 'no_such_email_user';
      return res.send(response);
    }
    let authentication_status = await methods.authentication_status(
      customer_email,
      customer_password
    );
    if (!authentication_status) {
      response['status'] = 'error';
      response['msg'] = 'wrong_email_or_password';
      return res.send(response);
    }

    // console.log(details);
    let profile_pic = details.customer_image_url;
    let first_name = details.customer_fname;
    response['status'] = 'success';
    response['msg'] = '';
    response['user_id'] = user_id;
    response['profile_pic'] = profile_pic;
    response['first_name'] = first_name;
    return res.send(response);
  } catch (error) {
    console.log(error);
  }
};

exports.addToCart = [
  async (req, res) => {
    try {
      let input = req.body;
      let customer_id = req.locals.customer_id;
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ', input);
      let response = {};
      let product_id = input.product_id;
      let qty = input.qty;
      let params = {};
      params['customer_id'] = customer_id;
      params['product_id'] = product_id;
      params['qty'] = qty;
      dbquery.insertSingle('customer_cart_details', params);

      response['status'] = 'success';
      response['mssg'] = 'product_added_sucessfully';
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  },
];

exports.countProductInCart = [
  async (req, res) => {
    let customer_id = req.locals.customer_id;
    let details = await dbquery.getCartProductCount(customer_id);
    if (utility.checkEmpty(details)) {
      response['status'] = 'error';
      response['msg'] = 'No user with such customer id';
      return res.send(response);
    }
    let response = {};
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = {};
    response['data']['countProductInCart'] = details;
    return res.send(response);
  },
];

exports.readCart = [
  async (req, res) => {
    let mrp = 0;
    let total_price_to_pay = 0;
    let money_saved = 0;
    let customer_id = req.locals.customer_id;
    let details = {};
    let response = {};
    details = await dbquery.getAllCartProduct(customer_id);

    response['status'] = 'success';
    response['mssg'] = '';
    let result = [];
    for (let i in details) {
      let detail = details[i];
      let product_details = await dbquery.getProductDetails(detail.product_id);
      if (!utility.checkEmpty(product_details)) {
        product_details = product_details[0];
      }
      let qty = details[i].qty;
      console.log('%%%%%%%%%%%%%%%%%%%%%%%% ', details[i].qty);
      //pricing

      total_price_to_pay += product_details.product_new_lesser_price * qty;
      mrp += product_details.product_old_price * qty;
      let desired_detail = {};
      desired_detail['product_image'] = product_details.product_image;
      desired_detail['product_id'] = product_details.product_id;
      desired_detail['product_title'] = product_details.product_title;
      desired_detail['product_currency'] = product_details.product_currency;
      desired_detail['product_new_lesser_price'] =
        product_details.product_new_lesser_price;
      desired_detail['qty'] = detail.qty;

      result.push(desired_detail);
    }
    console.log('MRP here ', mrp);
    console.log('total price here ', total_price_to_pay);

    money_saved = mrp - total_price_to_pay;
    console.log('saved price here ', money_saved);

    response['mrp'] = mrp;
    response['price_to_pay'] = total_price_to_pay;
    response['money_saved'] = money_saved;
    response['data'] = result;
    return res.send(response);
  },
];

exports.removeFromCart = [
  async (req, res) => {
    let input = req.body;
    let product_id = input.product_id;
    let customer_id = req.locals.customer_id;
    await dbquery.remove_product_from_cart(customer_id, product_id);
    let response = {};
    response['status'] = 'success';
    response['mssg'] = 'product removed from cart successfully';
    return res.send(response);
  },
];
