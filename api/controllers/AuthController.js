/**
 * Auth controller
 *
 * @description
 * Provides authentication end points for the application.
 */

'use strict';

/**
 * Renders the login form.
 * @param {*} req request - expecting nothing
 * @param {*} res response - renders view.
 */
module.exports.loginForm = function (req, res) {
  res.ok({
    title: req.__('AUTH.LOGIN.TITLE')
  }, 'auth/login');
};

/**
 * Logs the user out
 * @param {*} req request - expecting nothing
 * @param {*} res response - redirects to home.
 */
module.exports.logout =  function (req, res) {
  req.logout();
  req.session.authenticated = false;
  res.redirect('/');
};

/**
 * Renders the register form
 * @param {*} req request - expecting nothing
 * @param {*} res response - renders view.
 */
module.exports.registerForm = function (req, res) {
  res.ok({
    title: req.__('AUTH.REGISTER.TITLE')
  }, 'auth/register');
};

module.exports.login = function (req, res) {
  return AuthService.authenticate('local', function (err, verified, data) {
    if (err) {
      return res.notOk(err);
    }
    if (!verified) {
      return res.notOk(data);
    }
    req.login(data, function (err) {
      if (err) { return res.notOk(err); }
      req.session.authenticated = true;
      res.ok({});
    });
  })(req, res);
}

module.exports.register = function (req, res) {
  User.create({
    username: req.param('username'),
    password: req.param('password')
  }).exec(function (err, user) {
    if (err) {
      return res.notOk(new ExceptionService.DatabaseException());
    }
    req.login(user, function (err) {
      if (err) return res.notOk(err);
      req.session.authenticated = true;
      res.ok({});
    });
  });
};
