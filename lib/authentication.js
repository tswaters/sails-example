/**
 * Authentication policy
 * Makes sure the user is populated if available
 * If not, don't worry about it - res.locals.user is null
 */

'use strict'

exports.middleware = function (req, res, next) {
  AuthService.authenticate(req.session.token)
    .then(user => {
      res.locals.user = user
      next()
    })
    .catch(err => next(err))
}
