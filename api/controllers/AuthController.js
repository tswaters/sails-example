/**
 * Auth controller
 *
 * @description
 * Provides authentication end points for the application.
 */

'use strict'

/**
 * Renders the login form.
 * @param {*} req request - expecting nothing
 * @param {*} res response - renders view.
 */
exports.loginForm = (req, res) => {
  res.ok({
    title: req.__('AUTH.LOGIN.TITLE')
  }, 'auth/login')
}

/**
 * Logs the user out
 * @param {*} req request - expecting nothing
 * @param {*} res response - redirects to home.
 */
exports.logout = (req, res) => {
  req.logout()
  req.session.authenticated = false
  res.redirect('/')
}

/**
 * Renders the register form
 * @param {*} req request - expecting nothing
 * @param {*} res response - renders view.
 */
exports.registerForm = (req, res) => {
  res.ok({
    title: req.__('AUTH.REGISTER.TITLE')
  }, 'auth/register')
}

exports.login = (req, res) => {
  return AuthService.authenticate('local', (err, verified, data) => {
    if (err) {
      return res.notOk(err)
    }
    if (!verified) {
      return res.notOk(data)
    }
    req.login(data, err => {
      if (err) { return res.notOk(err) }
      req.session.authenticated = true
      res.ok({})
    })
  })(req, res)
}

exports.register = (req, res) => {
  User.create({
    username: req.param('username'),
    password: req.param('password')
  }).exec((err, user) => {
    if (err) {
      return res.notOk(new ExceptionService.DatabaseError())
    }
    req.login(user, err => {
      if (err) return res.notOk(err)
      req.session.authenticated = true
      res.ok({})
    })
  })
}
