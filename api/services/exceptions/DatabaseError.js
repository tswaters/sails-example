
'use strict'

const BaseError = require('./BaseError')

module.exports = class DatabaseError extends BaseError {
  constructor (err) {
    super('DatabaseError', err)
    this.error = 'unknown internal error'
    this.status = 500
  }
}
