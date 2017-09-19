/**
 * Logged-in policy
 * Verifies a user is present.
 */
'use strict'

const policy = require('../../lib/logged-in')

module.exports = function (req, res, next) {
  policy.middleware(req, res, next)
}
