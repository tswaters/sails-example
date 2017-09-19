

'use strict'

const BaseError = require('./BaseError')

module.exports = class NotFound extends BaseError {
  constructor (err = 'NotFound', replacements = []) {
    const error = err.message ? err.message : err
    super(error, replacements)

    this.error = error
    this.status = 404
    this.type = 'NotFound'
  }
}
