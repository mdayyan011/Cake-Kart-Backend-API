var Promise = require('bluebird'),
  mysql = require('mysql2'),
  using = Promise.using;
//distributed system

var db = require('../config/db');
var constants = require('../config/constant');

var pools = {};
var base = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: undefined,
  connectionLimit: 100,
  multipleStatements: true,
  dateStrings: true,
  //acquireTimeout: 30000,
  typeCast: function (field, next) {
    if (field.type == 'BIT' && field.length == 1) {
      var bit = field.string();
      return bit === null ? null : bit.charCodeAt(0);
    }

    return next();
  },
};

exports.connection = async () =>
  new Promise((resolve, reject) => {
    Object.keys(db).forEach(function (d) {
      var o = Object.assign({}, base);
      Object.keys(db[d]).forEach(function (k) {
        o[k] = db[d][k];
      });
      pools[d] = mysql.createPool(o);
    });
    constants.dbconn = {};
    resolve(pools);
  });

exports.query = async (database, q, params) =>
  new Promise((resolve, reject) => {
    // console.log("constants.dbconn[database] === >>" , database);

    // console.log("constants.dbconn[database] === >>" , constants.dbconn);
    const handler = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    };
    constants.dbconn[database].getConnection(function (err, connection) {
      if (err) {
        console.error('runQry-cannot getConnection ERROR:', err);
        return callback(err);
      }
      connection.query(q, params, function (err, result) {
        connection.release();
        if (err) {
          console.log(
            '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
          );
          console.log(mysql.format(q, params));
          console.log(
            '------------------------------------------------------------------------------------------------'
          );
          console.error('runQry-cannot run qry ERROR:', err);
          reject(err);
        }
        resolve(result);
      });
    });

    // var con = mysql.createConnection(constants.vals.dbconn[database]);
    // console.log("Connected!",database);
    //  con.query(q, params, handler);
    //   con.connect(function(err) {
    //   if (err) throw err;
    //   console.log("Connected!",database);

    //   });

    //   console.log('++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    // console.log(mysql.format(q, params));
    // console.log('------------------------------------------------------------------------------------------------');
  });
