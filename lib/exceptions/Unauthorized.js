

'use strict'

const BaseError = require('./BaseError')

module.exports = class Unauthorized extends BaseError {
  constructor (err = 'Unauthorized', replacements = []) {
    const error = err.message ? err.message : err
    super(error, replacements)

    this.error = error
    this.status = 401
    this.type = 'Unauthorized'
  }
}
