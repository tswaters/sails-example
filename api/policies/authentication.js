/**
 * Authentication policy
 * Makes sure the user is populated if available
 * If not, don't worry about it - res.locals.user is null
 */

'use strict'

const policy = require('../../lib/authentication')

module.exports = function (req, res, next) {
  policy.middleware(req, res, next)
}
