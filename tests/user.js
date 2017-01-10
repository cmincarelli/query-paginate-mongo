var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var User = new Schema({
  gender: String,
  age: Number,
  dob: Date,
});

module.exports = mongoose.model('User', User);