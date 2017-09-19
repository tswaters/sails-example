/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

'use strict'

const {hash, compare} = require('hashifier')

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      primaryKey: true,
      required: true
    },
    username: {
      type: 'string',
      required: true
    },
    hash: 'string',
    salt: 'string',
    async verify (pass) {
      return await compare(pass, this.hash, this.salt)
    }
  },

  /**
   * Verifies a username/password combination is correct.
   * @param {string} username username to check
   * @param {string} password password to check
   * @param {function} cb callback (err, isVerified, data)
   */
  async verify (opts) {

    const {username, password} = opts

    const user = await User.findOne({username})
    if (!user) { throw new Unauthorized('USER-NOT-FOUND') }

    const isValid = await user.verify(password)
    if (!isValid) { throw new Unauthorized('PASSWORD-INVALID') }

    return user

  },

  /**
   * Before create lifecycle event, hash the password
   * @param {function} cb callback when done
   */
  beforeCreate (values, cb) {
    hash(values.password)
      .then(result => {
        values.salt = result.salt
        values.hash = result.hash
        delete values.password
        cb()
      })
      .catch(err => cb(err))
  },

  /**
   * Before create lifecycle event, hash the password
   * @param {function} cb callback when done
   */
  beforeUpdate (values, cb) {
    hash(values.password)
      .then(result => {
        values.salt = result.salt
        values.hash = result.hash
        delete values.password
        cb()
      })
      .catch(err => cb(err))
  }

}
