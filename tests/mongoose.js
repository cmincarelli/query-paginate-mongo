var mongoose = require('mongoose');

mongoose.Promise = require('q').Promise;
mongoose.connect('mongodb://localhost/query-paginate-mongo');

require('./user');
require('./comment');