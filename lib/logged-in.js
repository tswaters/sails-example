/**
 * Logged-in policy
 * Verifies a user is present.
 */
'use strict'

exports.middleware = function (req, res, next) {

  if (!res.locals.user) {
    return next(new Unauthorized('USER-NOT-LOGGED-IN'))
  }

  next()
}
