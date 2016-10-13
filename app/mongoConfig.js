
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');



var linkSchema = new schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

var userSchema = new schema({
  username: String,
  password: String,
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('Attempted Pass ', this.password);
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    if (err) {
      console.log(err);
    }
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function() {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
   .then(function(hash) {
     this.password = hash;
   });
};

var Link = mongoose.model('Url', linkSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
  Link: Link,
  User: User
};