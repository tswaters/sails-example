'use strict'

const sinon = require('sinon')
const Deferred = require('waterline/lib/waterline/query/deferred')

exports.execStub = () => {
  return sinon.stub(Deferred.prototype, 'exec')
}

exports.stubError = message => {
  return sinon.stub(Deferred.prototype, 'exec', cb => {
    cb(message)
  })
}

