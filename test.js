var mongoose = require('mongoose');
var QPM = require('./index.js');

var expect = require('chai').expect;
var assert = require('chai').assert;

require('./tests/mongoose.js');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var qpm = new QPM();

var testUserID;

before(function(done){
  Comment.find().remove(function(){
    User.find().remove(function(){
      testUser = new User({
        gender: 'unknown',
        age: 21,
        dob: new Date('1/1/1980'),
      });
      testComment = new Comment({
        comment: 'test',
      });
      testComment.save(function(){
        testUser.comments.push(testComment._id);
        testUser.save(function(){
          testUserID = testUser._id.toString();
          done();
        });
      });
    });
  });
});

describe('Basic Promise Queries', function () {

  it('Find Single', function (done) {
    qpm
    .parse({ id: testUserID, populate: 'comments', fields: 'comments' }, User)
    .then(function(query){
      query
        .exec()
        .then(function(user){
          assert.equal(user._id, testUserID, 'returns the correct member');
          assert.equal(typeof user.gender, 'undefined', 'gender doesnt exist');
          assert.equal(typeof user.comments, 'object', 'comments do exist');
          assert.equal(user.comments.length, 1, 'comment array contains value');
          assert.equal(user.comments[0].comment, 'test', 'comment populated correctly');
          done();
        });
    });
  });

  it('Find Multi', function (done) {
    qpm
    .parse({ populate: 'comments', fields: 'comments' }, User)
    .then(function(query){
      query
        .setEnvelope('users', '/api/users')
        .exec()
        .then(function(result){;
          assert(result.hasOwnProperty('users'), 'has the envelope');
          assert.equal(result.users.length, 1, 'has one member');
          assert.equal(typeof result.users[0].gender, 'undefined', 'gender doesnt exist');
          assert.equal(typeof result.users[0].comments, 'object', 'comments do exist');
          assert.equal(result.users[0].comments.length, 1, 'comment array contains value');
          assert.equal(result.users[0].comments[0].comment, 'test', 'comment populated correctly');
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
