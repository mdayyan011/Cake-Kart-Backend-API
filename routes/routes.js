const express = require('express');
const middleware = require('../middlewares/middlewares');
const customerController = require('../controllers/CustomerControllers');
const adminController = require('../controllers/AdminControllers');
const productController = require('../controllers/ProductControllers');
const app = express();

//customer management
app.use('/auth/signup', customerController.customer_signup);
app.use('/auth/signin', customerController.customer_signin);

//cart management
app.use('/cart/addProduct', middleware, customerController.addToCart);
app.use('/cart/qty', middleware, customerController.countProductInCart);
app.use('/cart/readAllCartItems', middleware, customerController.readCart);
app.use('/cart/removeFromCart', middleware, customerController.removeFromCart);

//product management
app.use('/product/giveStar', middleware, productController.giveStar);
app.use('/product/addComment', middleware, productController.addComment);
app.use(
  '/product/addReviewRatingCombined',
  middleware,
  productController.addReviewRatingCombined
);
app.use('/product/updateComment', middleware, productController.updateComment); //remove also in this
app.use('/product/readOthersComment', productController.readOthersComment);
app.use(
  '/product/readOwnComment',
  middleware,
  productController.readOwnComment
);
app.use('/product/getProductByLimit', productController.getProductByLimit);
app.use('/product/readAProduct/:id', productController.readAProduct);

//order management
app.use('/order/placeOrder', middleware, productController.placeOrder);
app.use(
  '/order/getOrderByCustId',
  middleware,
  productController.getOrderByCustId
);

//***************** A D M I N     R O U T E S*************/
app.use('/admin/login', adminController.admin_login);
app.use('/admin/getProductCount', adminController.getProductCount);
app.use('/admin/addProduct', middleware, adminController.addProduct);
app.use('/admin/removeProduct', middleware, adminController.removeProduct);
app.use('/admin/editProduct', middleware, adminController.editProduct);
app.use('/admin/getUserByLimit', middleware, adminController.getUserByLimit);
app.use(
  '/admin/getOrderByLimits',
  middleware,
  adminController.getOrderByLimits
);
app.use('/admin/removeUser', middleware, adminController.removeUser);

module.exports = app;
