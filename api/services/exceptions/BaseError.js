
'use strict'

module.exports = class BaseError extends Error {
  constructor (type, err) {
    super(err)
    this.name = type
    this.error = 'Unknown Error'
    this.message = 'There was a problem'
    this.type = 'BaseError'
    this.originalError = err
    this.status = 500
  }
}
