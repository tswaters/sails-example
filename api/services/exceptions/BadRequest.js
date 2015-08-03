'use strict';

var BaseException = require('./BaseException');

var BadRequest = module.exports = function DatabaseError (err) {
  BaseException.call(this, 'BadRequest', err);
  this.error = 'The provided request was not complete';
};

// do the unholy javascript prototype dance.
BadRequest.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: BadRequest,
    writable: true,
    configurable: true
  }
});
