'use strict';
var when = require('when'),
  E = require('express-http-errors'),
  sqlite3 = require('sqlite3').verbose(),
  db = new sqlite3.Database(':memory:');

function executeQuery (query) {
  console.log(query);
  return when.promise(function (resolve, reject) {
    db.all(query, function (err, result) {
      if (err) {
        console.log(err);
        return reject(new E.InternalError('SQLITE ERROR'));
      }
      return resolve(result);
    });
  });
}

exports.query = function (query) {
  var queries = query.split(';');
  return queries.reduce(function (prev, item) {
    if (!/^\s*$/i.test(item)) {
      return prev.then(function () {
        return executeQuery(item + ';');
      });
    } else {
      return prev;
    }
  }, when.resolve());
};
exports.close = function(callback) {
  db.close(callback);
};
