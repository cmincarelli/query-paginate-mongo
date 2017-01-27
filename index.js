'use strict';
let MongoQS = require('mongo-querystring');
let queryToMongo = require('query-to-mongo');
let _ = require('lodash');
let Q = require('q');
let QueryPageMongo = function(options) {
    let opts = options || {};
    opts = _.extend({ id: '_id', ignore: ['near', 'bbox', 'after', 'before', 'between'] }, opts);
    let mongoQS = new MongoQS(opts);
    return {
        parse: function(params, collection, callback) {
            let query = { options: {} };
            if (params.envelope) {
                query.options.envelope = params.envelope;
                delete params.envelope;
            }
            if (params.populate) {
                query.options.populate = params.populate.split(',').join(' ');
                delete params.populate;
            }
            let mqs = mongoQS.parse(params);
            let qtm = queryToMongo(params, opts);
            ['fields', 'sort', 'limit', 'offset'].forEach(function(field) {
                delete mqs[field];
            });
            qtm.criteria = _.extend(qtm.criteria, mqs);
            query = _.merge(query, qtm);
            if (query.criteria.id) {
                var deferred = Q.defer();
                var response = {
                    exec: function(callback) {
                        let ques = {};
                        ques[opts.id] = query.criteria.id;
                        let docs = collection.findOne(ques);
                        if (query.options.fields) {
                            docs.select(query.options.fields);
                        }
                        if (query.options.populate) {
                            docs.populate(query.options.populate);
                        }
                        let that = this;
                        return docs
                            .exec()
                            .then(function(_docs) {
                                if (callback) {
                                    callback(null, _docs);
                                }
                                return _docs;
                            })
                            .catch(function(error) {
                                if (callback) {
                                    callback(error);
                                }
                                return error;
                            });
                    }
                };
                deferred.resolve(response);
                if (callback) {
                    callback(null, response);
                }
                return deferred.promise;
            }
            return collection
                .count(query.criteria)
                .exec()
                .then(function(count) {
                    let response = {
                        setEnvelope: function(envelope, linkPath) {
                            if (envelope && 'string' === typeof envelope) {
                                query.options.envelope = envelope;
                            }
                            if (linkPath && 'string' === typeof linkPath) {
                                query.options.linkPath = linkPath;
                            }
                            return this;
                        },
                        getCount: function() {
                            return count;
                        },
                        getLinks: function(path) {
                            return query.links(path, count);
                        },
                        exec: function(callback) {
                            let docs = collection.find(query.criteria);
                            if (query.options.fields) {
                                docs.select(query.options.fields);
                            }
                            if (query.options.sort) {
                                docs.sort(query.options.sort);
                            }
                            if (query.options.populate) {
                                docs.populate(query.options.populate);
                            }
                            if (query.options.limit) {
                                docs.limit(query.options.limit);
                            }
                            if (query.options.offset) {
                                docs.skip(query.options.offset);
                            }
                            let that = this;
                            let response = docs
                                .exec()
                                .then(function(_docs) {
                                    if (query.options.envelope) {
                                        let enveloped = {};
                                        enveloped[query.options.envelope] = _docs;
                                        if (query.options.linkPath) {
                                            let links = that.getLinks(query.options.linkPath);
                                            if (links) {
                                                enveloped.links = links;
                                            }
                                        }
                                        if (callback) {
                                            callback(null, enveloped);
                                        }
                                        return enveloped;
                                    } else {
                                        if (callback) {
                                            callback(null, _docs);
                                        }
                                        return _docs;
                                    }
                                })
                                .catch(function(error) {
                                    if (callback) {
                                        callback(error);
                                    }
                                    return error;
                                });
                            return response;
                        }
                    }
                    if (callback) {
                        callback(null, response)
                    }
                    return response;
                })
                .catch(function(error) {
                    if (callback) {
                        callback(error);
                    }
                    return error;
                });
        }
    }
};
module.exports = QueryPageMongo;
