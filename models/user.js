var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    picture: {
      type: String,
      match: /^http:\/\//i
    },
    admin: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Editor'
    },
    description: {
        type: String,
        default: ""
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);