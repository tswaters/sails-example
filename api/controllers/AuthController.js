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
  req.log.info('AuthController.loginForm called')
  res.ok({title: req.__('AUTH.LOGIN.TITLE')}, 'auth/login')
}

/**
 * Renders the register form
 * @param {*} req request - expecting nothing
 * @param {*} res response - renders view.
 */
exports.registerForm = (req, res) => {
  req.log.info('AuthController.registerForm called')
  res.ok({title: req.__('AUTH.REGISTER.TITLE')}, 'auth/register')
}

/**
 * Logs the user out
 * @param {*} req request - expecting token in session, not required
 * @param {*} res response - clears login token, redirects to '/'
 * @param {function} next return errors to error middleware
 */
exports.logout = function (req, res, next) {
  req.log.info('AuthController.logout called')

  if (!req.session.token) {
    return res.redirect('/')
  }

  AuthService.logout(req.session.token)
    .then(() => {
      req.session.token = null
      res.redirect('/')
    })
    .catch(err => next(err))
}

/**
 * Logs the user in
 * @param {*} req request - expecting POST with username/password in body
 * @param {*} res response - sets session token, blank ok response
 * @param {function} next return errors to error middleware
 */
exports.login = (req, res, next) => {

  const {username, password} = req.body
  req.log.info('AuthController.login called for', username)

  if (!username) { return next(new BadRequest('INVALID-USERNAME')) }
  if (!password) { return next(new BadRequest('INVALID-PASSWORD')) }

  AuthService.login(username, password)
    .then(key => {
      req.session.token = key
      res.ok({})
    })
    .catch(err => next(err))
}

/**
 * Registers a new user
 * @param {*} req request - expecting POST with username/password in body
 * @param {*} res response - sets session token, blank ok response
 * @param {function} next return errors to error middleware
 */
exports.register = (req, res, next) => {

  const {username, password} = req.body
  req.log.info('AuthController.register called for', username)

  if (!username) { return next(new BadRequest('INVALID-USERNAME')) }
  if (!password) { return next(new BadRequest('INVALID-PASSWORD')) }

  AuthService.register(username, password)
    .then(key => {
      req.session.token = key
      res.ok({})
    })
    .catch(err => next(err))
}
