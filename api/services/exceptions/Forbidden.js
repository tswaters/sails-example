

'use strict'

const BaseError = require('./BaseError')

module.exports = class Forbidden extends BaseError {
  constructor (err, replacements = []) {
    const error = err.message ? err.message : err
    super(error, replacements)

    this.error = error
    this.status = 403
    this.type = 'Forbidden'
  }
}
