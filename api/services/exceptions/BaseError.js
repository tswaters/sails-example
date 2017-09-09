
'use strict'

module.exports = class BaseError extends Error {

  constructor (err, replacements) {
    super(err)
    this.error = 'UnknownError'
    this.type = 'BaseError'
    this.originalError = err
    this.status = 500
    this.replacements = replacements
  }

  translated (locale) {
    return sails.__({phrase: `ERRORS.${this.status}.${this.error}`, locale}, ...this.replacements)
  }

  toJSON (locale) {
    return {
      message: this.translated(locale),
      stack: this.stack,
      type: this.type
    }
  }
}
