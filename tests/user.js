var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Comment = new Schema({
  comment: String,
});

var User = new Schema({
  gender: String,
  age: Number,
  dob: Date,
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('User', User);