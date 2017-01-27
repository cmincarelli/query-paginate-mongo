var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Comment = new Schema({
  comment: String,
});

module.exports = mongoose.model('Comment', Comment);