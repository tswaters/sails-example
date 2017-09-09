
'use strict'

const BaseError = require('./BaseError')

module.exports = class NotFound extends BaseError {
  constructor (err) {
    super('NotFound', err)
    this.error = 'the requested resource was not found'
    this.status = 404
  }
}
