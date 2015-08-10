/**
 * Passport policy
 *
 * @description
 * Registers passport initialize/session middleware
 * Loads the current user into req for ease of use.
 */
var async = require('async');

module.exports = function (req, res, cb) {
  async.series([
    function (next) { AuthService.initialize()(req, res, next) },
    function (next) { AuthService.session()(req, res, next) }
  ], function (err) {
    if (err) { return cb(err); }
    res.locals.user = req.user;
    cb();
  });
}
