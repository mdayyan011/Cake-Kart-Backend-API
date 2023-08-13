const query = require('../helpers/query');
const utility = require('../helpers/utility');
const bcrypt = require('bcrypt');
const constants = require('../config/constant');

exports.authentication_status = async (customer_email, customer_password) => {
  let correct_data = await query.getAllUserDataByEmail(customer_email);
  console.log('mail ------------------ ', correct_data);
  if (utility.checkEmpty(correct_data)) {
    return false;
  }
  let encrypted_customer_password = correct_data.customer_password;
  flag = bcrypt.compareSync(customer_password, encrypted_customer_password);
  return flag;
};

exports.user_id = async (email) => {
  let data = await query.getAllUserDataByEmail(email);
  let customer_id = data.customer_id;
  let string_customer_id = customer_id + '';
  let encrypted_id = await utility.encryptData(string_customer_id);
  let encrypted_email = await utility.encryptData(email);
  let usrid = encrypted_id + ':::' + customer_id + ':::' + encrypted_email;
  return usrid;
};

exports.admin_id = async (email) => {
  let data = await query.getAllUserDataByEmail(email);
  let customer_id = data.customer_id;
  let string_customer_id = customer_id + '';
  let customer_email = data.customer_email;
  let encrypted_id = await utility.encryptData(string_customer_id);
  let encrypted_email = await utility.encryptData(customer_email);
  let usrid = encrypted_id + ':::' + customer_id + ':::' + encrypted_email;
  return usrid;
};
