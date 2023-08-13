const bcrypt = require('bcrypt');
const constants = require('../config/constant');
exports.checkEmpty = function (data) {
  //true only when data is empty
  if (typeof data == 'object') {
    for (key in data) {
      if (Object.hasOwnProperty.bind(data)(key)) {
        return false;
      }
    }
    return true;
  }
  if (
    data == ' ' ||
    data == undefined ||
    data.length === 0 ||
    data == null ||
    !data
  )
    return true;
  else return false;
};

exports.checkEmailFormat = function (email) {
  const email_reg_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!email_reg_exp.test(email)) return true;
  else return false;
};

exports.encryptData = function (data) {
  const salt = bcrypt.genSaltSync(constants.namak);
  const hashedData = bcrypt.hashSync(data, salt);
  return hashedData;
};
