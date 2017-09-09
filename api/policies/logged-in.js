/**
 * Login policy
 *
 * @description
 * Hooks into passport and verifies the user.
 */
'use strict'

module.exports = function (req, res, next) {
  if (req.session.authenticated) {
    return next()
  }

  return res.notOk(new ExceptionService.Unauthorized())
}
