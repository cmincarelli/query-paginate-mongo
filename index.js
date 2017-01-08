'use strict';
var MongoQS = require('mongo-querystring');
var queryToMongo = require('query-to-mongo');
var merge = require('lodash.merge');
module.exports = function QueryPageMongo(options) {
  const opts = options || {};
  let mongoQS = new MongoQS(opts);
  return function parse(config){
    let q2 = mongoQS.parse(req.query);
    let q1 = queryToMongo(req.query,opts);
    ['fields','sort','limit','offset'].forEach(function(field){
      delete q2[field];
    });
    q1.criteria = merge(q1.criteria, q2);
    return q1;
  }
};