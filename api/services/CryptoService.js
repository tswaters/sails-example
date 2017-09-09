/**
 * Crypto Service
 *
 * @description
 * Handles crytographic operations (i.e. password hash)
 */

'use strict'

const crypto = require('crypto')

const ALGORITHM = 'sha512'
const ITERATIONS = 4096
const SALT_LENGTH = 32

/**
 * Creates a hash from a password
 * @param {string} password password to hash
 * @param {function(object?,string)} cb callback (err, 'hash$salt')
 */
exports.hash = (password, cb) => {
  crypto.randomBytes(SALT_LENGTH, (err, salt) => {
    if (err) { return cb(err) }
    crypto.pbkdf2(password, salt, ITERATIONS, SALT_LENGTH, ALGORITHM, (err, hash) => {
      if (err) { return cb(err) }
      cb(null, [hash.toString('hex'), salt.toString('hex')].join('$'))
    })
  })
}

/**
 * Compares a provided password with previously created hash.
 * @param {string} password plaintext password to check
 * @param {string} userHash previously created hash ('hash$salt')
 * @param {function(object?,boolean)} cb callback (err, isValid)
 */
exports.compare = (password, userHash, cb) => {
  const hash = userHash.split('$')[0]
  const salt = userHash.split('$')[1]
  crypto.pbkdf2(password, new Buffer(salt, 'hex'), ITERATIONS, SALT_LENGTH, ALGORITHM, (err, compare) => {
    if (err) { return cb(err) }
    cb(null, hash === compare.toString('hex'))
  })
}
