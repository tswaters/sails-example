/**
 * Auth Service
 *
 * @description
 * Handles the heavy lifting related to passport integreation
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.verify({username: username, password: password}, done);
  }
))

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne(id).exec(function (err, user){
    done(err, user)
  });
});

module.exports = passport;
