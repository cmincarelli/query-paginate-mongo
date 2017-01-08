'use strict';

var MongoQS = require('mongo-querystring');
var queryToMongo = require('query-to-mongo');
var merge = require('lodash.merge');

var QueryPageMongo = function (options) {
  let opts = options || {};
  opts = merge(opts,{ignore: ['near', 'bbox', 'after', 'before', 'between']});
  let mongoQS = new MongoQS(opts);

  return function parse(config){
    let query = {};
    if(config.populate){
      query.options.populate = config.populate;
      delete config.populate;
    }
    let q2 = mongoQS.parse(config);
    let q1 = queryToMongo(config, opts);
    ['fields','sort','limit','offset'].forEach(function(field){
      delete q2[field];
    });
    q1.criteria = merge(q1.criteria, q2);
    query = merge(query,q1);
    return query;
  }

};

module.exports = QueryPageMongo;