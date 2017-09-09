
'use strict'

const BaseError = require('./exceptions/BaseError')
const DatabaseError = require('./exceptions/DatabaseError')
const NotFound = require('./exceptions/NotFound')
const BadRequest = require('./exceptions/BadRequest')
const Forbidden = require('./exceptions/Forbidden')
const Unauthorized = require('./exceptions/Unauthorized')

module.exports = {
  BaseError,
  DatabaseError,
  NotFound,
  BadRequest,
  Forbidden,
  Unauthorized
}
