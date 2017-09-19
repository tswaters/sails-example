

'use strict'

const BaseError = require('./BaseError')

module.exports = class DatabaseError extends BaseError {
  constructor (err = 'DatabaseError', replacements = []) {
    const error = err.message ? err.message : err
    super(error, replacements)

    this.error = error
    this.status = 500
    this.type = 'DatabaseError'
  }
}
