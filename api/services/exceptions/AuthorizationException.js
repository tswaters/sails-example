'use strict';

var BaseException = require('./BaseException');

var AuthorizationException = module.exports = function DatabaseError (err) {
  BaseException.call(this, 'AuthorizationException', err);
  this.error = 'you cant do that';
};

// do the unholy javascript prototype dance.
AuthorizationException.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: AuthorizationException,
    writable: true,
    configurable: true
  }
});
