'use strict';

var BaseException = module.exports = function BaseException (type, err) {
  var error = Error.call(this, type);
  error.name = this.name = type;
  this.error = 'Unknown Error';
  this.message = 'There was a problem';
  this.type = 'BaseException';
  this.originalError = err;
};

// do the unholy javascript prototype dance.
BaseException.prototype = Object.create(Error.prototype, {
  constructor: {
    value: BaseException,
    writable: true,
    configurable: true
  }
});
