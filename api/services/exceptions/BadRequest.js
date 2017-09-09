

'use strict'

const BaseError = require('./BaseError')

module.exports = class BadRequest extends BaseError {
  constructor (err) {
    super('BadRequest', err)
    this.error = 'The provided request was not complete'
    this.status = 400
  }
}
