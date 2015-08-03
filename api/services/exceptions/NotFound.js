'use strict';

var BaseException = require('./BaseException');

var NotFound = module.exports = function NotFound (err) {
  BaseException.call(this, 'NotFound', err);
  this.error = 'the requested resource was not found';
};

// do the unholy javascript prototype dance.
NotFound.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: NotFound,
    writable: true,
    configurable: true
  }
});
