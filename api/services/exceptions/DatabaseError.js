'use strict';

var BaseException = require('./BaseException');

var DatabaseError = module.exports = function DatabaseError (err) {
  BaseException.call(this, 'DatabaseError', err);
  this.error = 'unknown internal error';
};

// do the unholy javascript prototype dance.
DatabaseError.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: DatabaseError,
    writable: true,
    configurable: true
  }
});
