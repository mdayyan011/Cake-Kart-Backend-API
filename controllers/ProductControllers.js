const utility = require('../helpers/utility');
const dbquery = require('../helpers/query.js');
const methods = require('../helpers/method');
const constants = require('../config/constant');
const dbcon = require('../config/connection_pool');

exports.giveStar = [
  async (req, res) => {
    try {
      let input = req.body;
      let customer_id = req.locals.customer_id;
      let product_id = input.product_id;
      let number_star = input.number_star;

      let params = {};
      params['customer_id'] = customer_id;
      params['product_id'] = product_id;
      params['number_star'] = number_star;

      let number_start_in_db = await dbquery.getProductStar(
        customer_id,
        product_id
      );
      if (utility.checkEmpty(number_start_in_db)) {
        dbquery.insertSingle('rating_review_details', params);
      } else {
        dbquery.update_number_star(number_star, customer_id, product_id);
      }

      //increase product rating count in product table
      let product_rating_count = await dbquery.getProductRatingCount(
        product_id
      );
      product_rating_count = product_rating_count.product_rating_count;
      console.log(
        'product_rating_count++++++++++++++++++++++++++++++++++++',
        product_rating_count
      );
      //   product_rating_count = product_rating_count.product_rating_count;
      if (utility.checkEmpty(product_rating_count)) {
        console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', product_rating_count);
        product_rating_count = 1;
      } else {
        product_rating_count += 1;
      }
      console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', product_rating_count);

      await dbquery.updateProductRatingCount(product_rating_count, product_id);

      //increase avg rating
      let total_rating_star = await dbquery.getAllRatingStar(product_id);
      let sum_rating_star = 0;
      let number_of_rating_star = 0;
      for (let i in total_rating_star) {
        rating_star = total_rating_star[i];
        if (rating_star.number_star != null) {
          sum_rating_star =
            parseInt(sum_rating_star) + parseInt(rating_star.number_star);
          number_of_rating_star++;
        }
      }
      console.log('Sum Rating ', sum_rating_star);
      console.log('number_of_rating_star ', number_of_rating_star);
      let avg_rating_star = sum_rating_star / number_of_rating_star;
      console.log('--------------------- ', avg_rating_star);
      avg_rating_star = parseFloat(avg_rating_star.toFixed(1));
      console.log('--------------------- ', avg_rating_star);

      await dbquery.updateAvgRatingStar(avg_rating_star, product_id);
      let response = {};
      response['status'] = 'success';
      response['mssg'] = '';
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  },
];

exports.addComment = [
  async (req, res) => {
    try {
      let response = {};
      let customer_id = req.locals.customer_id;
      let input = req.body;
      let product_id = input.product_id;
      let rating_review_comment = input.rating_review_comment;
      let params = {};
      params['customer_id'] = customer_id;
      params['product_id'] = product_id;
      params['rating_review_comment'] = rating_review_comment;
      dbquery.insertSingle('rating_review_details', params);

      //add review count in product table

      let product_review_count = await dbquery.getPresentReviewCount(
        product_id
      );
      product_review_count = product_review_count.product_review_count;
      if (utility.checkEmpty(product_review_count)) {
        product_review_count = 1;
      } else {
        product_review_count += 1;
      }

      await dbquery.updateProductReviewCount(product_review_count, product_id);
      response['status'] = 'success';
      response['mssg'] = product_review_count;
      ('successfully inserted feedback in feedback table as well as in product table');
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  },
];

exports.addReviewRatingCombined = [
  async (req, res) => {
    try {
      let response = {};
      let customer_id = req.locals.customer_id;
      let input = req.body;
      let product_id = input.product_id;
      let rating_review_comment = input.rating_review_comment;
      let number_star = input.number_star;

      console.log(
        '---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- ',
        input
      );
      let params = {};
      params['customer_id'] = customer_id;
      params['product_id'] = product_id;
      params['rating_review_comment'] = rating_review_comment;
      params['number_star'] = number_star;

      let number_start_in_db = await dbquery.getProductStar(
        customer_id,
        product_id
      );
      if (utility.checkEmpty(number_start_in_db)) {
        dbquery.insertSingle('rating_review_details', params);
      } else {
        dbquery.update_number_star(
          rating_review_comment,
          number_star,
          customer_id,
          product_id
        );
      }

      //add review count in product table

      let product_review_count = await dbquery.getPresentReviewCount(
        product_id
      );
      product_review_count = product_review_count.product_review_count;
      if (utility.checkEmpty(product_review_count)) {
        product_review_count = 1;
      } else {
        product_review_count += 1;
      }

      await dbquery.updateProductReviewCount(product_review_count, product_id);

      //increase product rating count in product table
      let product_rating_count = await dbquery.getProductRatingCount(
        product_id
      );
      product_rating_count = product_rating_count.product_rating_count;
      console.log(
        'product_rating_count++++++++++++++++++++++++++++++++++++',
        product_rating_count
      );
      //   product_rating_count = product_rating_count.product_rating_count;
      if (utility.checkEmpty(product_rating_count)) {
        console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH', product_rating_count);
        product_rating_count = 1;
      } else {
        product_rating_count += 1;
      }
      console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE', product_rating_count);

      await dbquery.updateProductRatingCount(product_rating_count, product_id);

      //increase avg rating
      let total_rating_star = await dbquery.getAllRatingStar(product_id);
      let sum_rating_star = 0;
      let number_of_rating_star = 0;
      for (let i in total_rating_star) {
        rating_star = total_rating_star[i];
        if (rating_star.number_star != null) {
          sum_rating_star =
            parseInt(sum_rating_star) + parseInt(rating_star.number_star);
          number_of_rating_star++;
        }
      }
      console.log('Sum Rating ', sum_rating_star);
      console.log('number_of_rating_star ', number_of_rating_star);
      let avg_rating_star = sum_rating_star / number_of_rating_star;
      console.log('--------------------- ', avg_rating_star);
      avg_rating_star = parseFloat(avg_rating_star.toFixed(1));
      console.log('--------------------- ', avg_rating_star);

      await dbquery.updateAvgRatingStar(avg_rating_star, product_id);

      response['status'] = 'success';
      response['mssg'] = product_review_count;
      ('successfully inserted feedback in feedback table as well as in product table');
      return res.send(response);
    } catch (error) {
      console.log(error);
    }
  },
];

exports.updateComment = [
  async (req, res) => {
    try {
      let response = {};
      let input = req.body.inputData;
      let rating_review_id = input.rating_review_id;
      let updatedComment = input.updatedComment;
      if (utility.checkEmpty(updatedComment)) {
        await dbquery.updateComment('', rating_review_id);
        response['status'] = 'success';
        response['mssg'] = 'Deleted The Feedback Successfully';
      } else {
        await dbquery.updateComment(updatedComment, rating_review_id);
        response['status'] = 'success';
        response['mssg'] = 'Updated The Feedback Successfully';
      }

      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.getProductByLimit = [
  async (req, res) => {
    if (utility.checkEmpty(constants.dbconn)) {
      constants.dbconn = await dbcon.connection().catch((e) => {
        console.log(e);
      });
    }
    let input = req.body;
    let lower_limit = input.lower_limit;
    let upper_limit = input.upper_limit;
    let response = {};

    console.log('--------------------------------- lower_limit  ', lower_limit);
    console.log('--------------------------------- upper_limit  ', upper_limit);
    let detail = {};
    if (upper_limit == 'no') {
      details = await dbquery.getAllProductDetailsNoUpper(
        lower_limit,
        upper_limit
      );
    } else {
      details = await dbquery.getAllProductDetails(lower_limit, upper_limit);
    }
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = details;
    console.log('Response here is', response);
    return res.send(response);
  },
];

exports.readAProduct = [
  async (req, res) => {
    if (utility.checkEmpty(constants.dbconn)) {
      constants.dbconn = await dbcon.connection().catch((e) => {
        console.log(e);
      });
    }
    let product_id = req.params.id;
    let response = {};
    console.log('sssssssssssssssss', product_id);
    let details = await dbquery.getAProduct(product_id);
    console.log('detailsssssssssssssssssssss', details);
    if (utility.checkEmpty(details)) {
      console.log('herrrrrrrreeeeeeeeee');
      response['status'] = 'error';
      response['msg'] = 'no_product_found';
      return res.send(response);
    }
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = details;
    return res.send(response);
  },
];

exports.searchProduct = [
  //pending
  async (req, res) => {
    let input = req.body.inputData;
    let product_title = input.product_title;
    let upper_limit = input.upper_limit;
    let response = {};

    let details = await dbquery.getProductByTitle(product_title, upper_limit);
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = details;
    return res.send(response);
  },
];

function convertToMonth(number) {
  const date = new Date(null, number - 1);
  const monthName = date.toLocaleString('default', { month: 'long' });
  return monthName;
}

exports.readOthersComment = [
  async (req, res) => {
    if (utility.checkEmpty(constants.dbconn)) {
      constants.dbconn = await dbcon.connection().catch((e) => {
        console.log(e);
      });
    }
    let input = req.body;
    let product_id = input.product_id;
    console.log('************************ ', input);
    let response = {};
    let details = await dbquery.getOthersComment(product_id);
    let resp = [];
    let detArr = {};
    console.log('[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]');
    for (let i in details) {
      let customer_id = details[i].customer_id;
      detArr = {};

      console.log('----------------------------------- ', customer_id);
      let customer_name = await dbquery.getCustomerName(customer_id);
      let month = convertToMonth(details[i].created_at.split('-')[1]);
      let year = details[i].created_at.split('-')[0];
      console.log('++++++++++++++ ', month);
      console.log('-------------------Name---------------- ', customer_name);
      detArr['rating_review_id'] = details[i].rating_review_id;
      detArr['customer_name'] = customer_name[0].customer_fname;
      detArr['product_id'] = details[i].product_id;
      detArr['number_star'] = details[i].number_star;
      detArr['rating_review_comment'] = details[i].rating_review_comment;
      detArr['created_at_month'] = month;
      detArr['created_at_year'] = year;
      console.log('Det arr ', detArr);
      console.log('Resp   ', resp);
      resp.push(detArr);
    }
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = resp;
    return res.send(response);
  },
];

exports.readOwnComment = [
  async (req, res) => {
    try {
      let response = {};
      let customer_id = req.locals.customer_id;
      let input = req.body.inputData;
      let product_id = input.product_id;
      let upper_limit = input.upper_limit;
      console.log(input);
      let comment = await dbquery.getOwnComment(
        customer_id,
        product_id,
        upper_limit
      );
      if (utility.checkEmpty(comment)) {
        response['status'] = 'error';
        response['mssg'] = 'No comment To Show';
        return res.send(response);
      }
      response['status'] = 'success';
      response['mssg'] = '';
      response['data'] = comment;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];

exports.placeOrder = [
  async (req, res) => {
    let input_ar = req.body;
    console.log('------------------------ ', input_ar);
    let response = {};
    let customer_id = req.locals.customer_id;
    for (let i in input_ar) {
      let input = input_ar[i];
      if (utility.checkEmpty(input.product_id)) {
        response['status'] = 'error';
        response['mssg'] = 'Empty product id';
        return res.send(response);
      }
      if (utility.checkEmpty(input.price_paid)) {
        response['status'] = 'error';
        response['mssg'] = 'Empty price paid';
        return res.send(response);
      }
      if (utility.checkEmpty(input.qty)) {
        response['status'] = 'error';
        response['mssg'] = 'Empty qty';
        return res.send(response);
      }
      let params = {};
      params['customer_id'] = customer_id;
      params['product_id'] = input.product_id;
      params['price_paid'] = input.price_paid;
      params['qty'] = input.qty;
      params['order_token'] = input.order_token;
      dbquery.insertSingle('order_details', params);

      //update number of orders in customer_master_details
      let quantity = 0;
      let present_number = await dbquery.getNumberOfOrdersMade(customer_id);
      present_number = present_number.number_of_orders_made;
      if (utility.checkEmpty(present_number)) {
        quantity = 1;
      } else {
        quantity = present_number + 1;
      }
      console.log(quantity);
      dbquery.updateOrderQty(quantity, customer_id);
    }
    response['status'] = 'success';
    response['mssg'] = '';
    response['data'] = '';
    return res.send(response);
  },
];

exports.getOrderByCustId = [
  async (req, res) => {
    try {
      let response = {};
      let customer_id = req.locals.customer_id;
      console.log('customer id ', customer_id);
      let order_details = await dbquery.getOrdersByCustId(customer_id);
      console.log(
        '-------------------------------------------- ',
        order_details
      );
      response['status'] = 'success';
      response['mssg'] = '';
      response['data'] = order_details;
      return res.send(response);
    } catch (e) {
      console.log(e);
    }
  },
];
