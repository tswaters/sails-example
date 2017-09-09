
'use strict'

const BaseError = require('./BaseError')

module.exports = class Unauthorized extends BaseError {
  constructor (err) {
    super('Unauthorized', err)
    this.message = err
    this.status = 401
  }
}
