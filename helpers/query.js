const pool = require('../config/connection_pool');
const utility = require('../helpers/utility');

//**********************  I  N  S  E  R  T  **********************

exports.insertSingle = async (table, param) => {
  let sql = 'INSERT INTO ?? SET ?';
  await pool.query('master_common_db', sql, [table, param]).catch(console.log);
};

//**********************  S E L E C T  **********************

exports.getAllUserDataByEmail = async (customer_email) => {
  let sql =
    'SELECT * FROM customer_master_details WHERE customer_email=? AND is_active=1 AND is_delete=0';
  let result = await pool
    .query('master_common_db', sql, [customer_email])
    .catch(console.log);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.getProductCount = async () => {
  let sql =
    'SELECT count(*) as count FROM product_master_details WHERE is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql).catch(console.log);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.getAllUserDataById = async (customer_id) => {
  let sql =
    'SELECT * FROM customer_master_details WHERE customer_id=? AND is_active=1 AND is_delete=0';
  let result = await pool
    .query('master_common_db', sql, [customer_id])
    .catch(console.log);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};
exports.getCartProductCount = async (customer_id) => {
  let sql =
    'SELECT COUNT(*) AS Count FROM customer_cart_details WHERE customer_id= ? AND is_active=1 AND is_delete=0 ';
  let result = await pool.query('master_common_db', sql, [customer_id]);
  return result;
};

exports.getAllCartProduct = async (customer_id) => {
  let sql =
    'SELECT * FROM customer_cart_details WHERE  customer_id = ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [customer_id]);

  return result;
};

exports.getProductDetails = async (product_id) => {
  let sql =
    'SELECT * FROM product_master_details WHERE  product_id = ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [product_id]);

  return result;
};

exports.getProductDetailsByCustomer_id = async (customer_id) => {
  let sql =
    'SELECT * FROM order_details WHERE  customer_id = ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [customer_id]);

  return result;
};

exports.getOrderDetailsByLimits = async () => {
  let sql = 'SELECT * FROM order_details WHERE    is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql);

  return result;
};

exports.getAProduct = async (product_id) => {
  console.log('Queryyyyyyyyyyyyyyyyy product_id ', product_id);
  let sql =
    'SELECT * FROM product_master_details WHERE product_id=?  AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [product_id]);
  console.log('Herrrrrrrrrrrrrrrrrrr result ', result);

  return result;
};

exports.getUserDetails = async () => {
  let sql =
    'SELECT * FROM customer_master_details  WHERE   is_active=1 AND is_delete=0 ';
  let result = await pool.query('master_common_db', sql);

  return result;
};

exports.getAllProductDetails = async (lower_limit, upper_limit) => {
  let sql =
    'SELECT * FROM product_master_details WHERE  is_active=1 AND is_delete=0 LIMIT ?,?';
  let result = await pool.query('master_common_db', sql, [
    lower_limit,
    upper_limit,
  ]);

  return result;
};

exports.getOrdersByCustId = async (customer_id) => {
  let sql =
    'SELECT * FROM order_details WHERE  is_active=1 AND is_delete=0 AND customer_id=?';
  let result = await pool.query('master_common_db', sql, [customer_id]);

  return result;
};

exports.getAllProductDetailsNoUpper = async () => {
  let sql =
    'SELECT * FROM product_master_details WHERE  is_active=1 AND is_delete=0 ';
  let result = await pool.query('master_common_db', sql);

  return result;
};

exports.getProductStar = async (customer_id, product_id) => {
  let sql =
    'SELECT number_star FROM rating_review_details WHERE  customer_id = ? AND  product_id=? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [
    customer_id,
    product_id,
  ]);

  return result;
};

exports.getProductRatingCount = async (product_id) => {
  let sql =
    'SELECT product_rating_count FROM product_master_details WHERE product_id=? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [product_id]);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.getPresentReviewCount = async (product_id) => {
  let sql =
    'SELECT product_review_count FROM product_master_details WHERE product_id=? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [product_id]);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.getAllRatingStar = async (product_id) => {
  let sql =
    'SELECT number_star FROM rating_review_details WHERE product_id=? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [product_id]);

  return result;
};

exports.getOthersComment = async (product_id) => {
  let sql =
    'SELECT * FROM rating_review_details WHERE product_id=? AND  is_active=1 AND is_delete=0 ';
  let result = await pool.query('master_common_db', sql, product_id);
  return result;
};
exports.getCustomerName = async (customer_id) => {
  let sql =
    'SELECT customer_fname FROM customer_master_details WHERE customer_id=? AND  is_active=1 AND is_delete=0 ';
  let result = await pool.query('master_common_db', sql, customer_id);
  return result;
};

exports.getOwnComment = async (customer_id, product_id, upper_limit) => {
  let sql =
    'SELECT * FROM rating_review_details WHERE customer_id=? AND product_id=? AND  is_active=1 AND is_delete=0 LIMIT 0,?';
  let result = await pool.query('master_common_db', sql, [
    customer_id,
    product_id,
    upper_limit,
  ]);
  return result;
};

exports.getNumberOfOrdersMade = async (customer_id) => {
  let sql =
    'SELECT number_of_orders_made FROM customer_master_details WHERE customer_id=? AND    is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [customer_id]);
  return result;
};

//**********************  R E M O V E    U P D A T E **********************

exports.remove_product = async (product_id) => {
  let sql =
    'UPDATE product_master_details SET is_active = 0 ,is_delete=1 WHERE product_id= ?';
  let result = await pool.query('master_common_db', sql, [product_id]);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.remove_user = async (table, customer_id) => {
  let sql = 'UPDATE ?? SET is_active = 0 ,is_delete=1 WHERE customer_id= ?';
  let result = await pool.query('master_common_db', sql, [table, customer_id]);
  if (!utility.checkEmpty(result)) {
    result = result[0];
  }
  return result;
};

exports.remove_product_from_cart = async (customer_id, product_id) => {
  let sql =
    'UPDATE customer_cart_details SET is_active = 0 ,is_delete=1 WHERE customer_id=? AND product_id= ?';
  let result = await pool.query('master_common_db', sql, [
    customer_id,
    product_id,
  ]);
  return result;
};

exports.update_number_star = async (
  rating_review_comment,
  number_star,
  customer_id,
  product_id
) => {
  let sql =
    'UPDATE rating_review_details SET rating_review_comment=?,number_star=? WHERE customer_id=? AND product_id= ?';
  let result = await pool.query('master_common_db', sql, [
    rating_review_comment,
    number_star,
    customer_id,
    product_id,
  ]);
  return result;
};

exports.updateProductRatingCount = async (count, product_id) => {
  console.log('product rating count in query', count);
  let sql =
    'UPDATE product_master_details SET product_rating_count= ? WHERE  product_id= ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [count, product_id]);
  return result;
};

exports.updateProductReviewCount = async (product_review_count, product_id) => {
  let sql =
    'UPDATE product_master_details SET  product_review_count=? WHERE  product_id= ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [
    product_review_count,
    product_id,
  ]);
  return result;
};

exports.updateAvgRatingStar = async (avg_rating_star, product_id) => {
  console.log('--------------------------- ', avg_rating_star);
  let sql =
    'UPDATE product_master_details SET  product_avg_rating=? WHERE  product_id= ? AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [
    avg_rating_star,
    product_id,
  ]);
  return result;
};

exports.updateComment = async (comment, rating_review_id) => {
  let sql =
    'UPDATE rating_review_details SET  rating_review_comment=? WHERE rating_review_id=?  AND is_active=1 AND is_delete=0';
  let result = await pool.query('master_common_db', sql, [
    comment,
    rating_review_id,
  ]);
  return result;
};

exports.updateProduct = async (params, product_id) => {
  let sql =
    'UPDATE product_master_details SET ? WHERE product_id=?  AND is_active=1 AND is_delete=0';
  await pool.query('master_common_db', sql, [params, product_id]);
};

exports.updateOrderQty = async (qty, customer_id) => {
  let sql =
    'UPDATE customer_master_details SET number_of_orders_made=? WHERE customer_id=?  AND is_active=1 AND is_delete=0';
  await pool.query('master_common_db', sql, [qty, customer_id]);
};
