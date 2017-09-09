/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

'use strict'

module.exports = {

  attributes: {
    username: 'string',
    password: 'string',
    verify (pass, next) {
      CryptoService.compare(pass, this.password, next)
    }
  },

  /**
   * Verifies a username/password combination is correct.
   * @param {string} username username to check
   * @param {string} password password to check
   * @param {function} cb callback (err, isVerified, data)
   */
  verify (opts, cb) {
    User.findOne({username: opts.username}).exec((err, user) => {
      if (err) { return cb(new ExceptionService.DatabaseError(err)) }
      if (!user) { return cb(null, false, new ExceptionService.Unauthorized('not found')) }
      user.verify(opts.password, (err, isValid) => {
        if (err) {  return cb(err) }
        if (!isValid) { return cb(null, false, new ExceptionService.Unauthorized('invalid password')) }
        return cb(null, true, user)
      })
    })
  },

  /**
   * Before create lifecycle event, hash the password
   * @param {function} cb callback when done
   */
  beforeCreate (values, cb) {
    CryptoService.hash(values.password, (err, hash) => {
      values.password = hash
      cb(err, values)
    })
  },

  /**
   * Before create lifecycle event, hash the password
   * @param {function} cb callback when done
   */
  beforeUpdate (values, cb) {
    CryptoService.hash(values.password, (err, hash) => {
      values.password = hash
      cb(err, values)
    })
  }

}
