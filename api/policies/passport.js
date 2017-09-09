/**
 * Passport policy
 *
 * @description
 * Registers passport initialize/session middleware
 * Loads the current user into req for ease of use.
 */

'use strict'

const async = require('async')

module.exports = (req, res, cb) => {
  async.series([
    function (next) { AuthService.initialize()(req, res, next) },
    function (next) { AuthService.session()(req, res, next) }
  ], err => {
    res.locals.user = req.user
    cb(err)
  })
}
