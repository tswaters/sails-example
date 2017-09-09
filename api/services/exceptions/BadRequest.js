

'use strict'

const BaseError = require('./BaseError')

module.exports = class BadRequest extends BaseError {
  constructor (err, replacements = []) {
    const error = err.message ? err.message : err
    super(error, replacements)

    this.error = error
    this.status = 400
    this.type = 'BadRequest'
  }
}
