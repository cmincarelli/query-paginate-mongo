var mongoose = require('mongoose');
var QPM = require('./index.js');

var expect = require('chai').expect;
var assert = require('chai').assert;

require('./tests/mongoose.js');
var User = mongoose.model('User');
var qpm = new QPM();

var testUserID;

before(function(done){
  User.find().remove(function(){
    testUser = new User({
      gender: 'unknown',
      age: 21,
      dob: new Date('1/1/1980'),
    });
    testUser.save(function(){
      testUserID = testUser._id.toString();
      done();
    });
  });
});

describe('Basic Promise Queries', function () {

  it('Find Single', function (done) {
    qpm
    .parse({id:testUserID}, User)
    .then(function(query){
      query
        .exec()
        .then(function(user){
          assert.equal(user._id, testUserID, 'returns the correct member');
          done();
        });
    });
  });

  it('Find Multi', function (done) {
    qpm
    .parse({}, User)
    .then(function(query){
      query
        .setEnvelope('users', '/api/users')
        .exec()
        .then(function(result){;
          assert(result.hasOwnProperty('users'), 'has the envelope');
          assert.equal(result.users.length, 1, 'has one member');
          done();
        });
    });
  });

});

describe('Basic Callback Queries', function () {

  it('Find Single', function (done) {
    qpm
    .parse({id:testUserID}, User)
    .then(function(query){
      query
        .exec(function(err, user){
          assert.equal(user._id, testUserID, 'returns the correct member');
          done();
        });
    });
  });

  it('Find Multi', function (done) {
    qpm
    .parse({}, User)
    .then(function(query){
      query
        .setEnvelope('users', '/api/users')
        .exec(function(err, result){
          assert(result.hasOwnProperty('users'), 'has the envelope');
          assert.equal(result.users.length, 1, 'has one member');
          done();
        })
    });
  });

});
