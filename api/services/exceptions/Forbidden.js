
'use strict'

const BaseError = require('./BaseError')

module.exports = class Forbidden extends BaseError {
  constructor (err) {
    super('Forbidden', err)
    this.error = 'you are not permitted to perform that operation'
    this.status = 403
  }
}
