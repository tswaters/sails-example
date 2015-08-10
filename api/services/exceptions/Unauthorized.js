'use strict';

var BaseException = require('./BaseException');

var Unauthorized = module.exports = function Unauthorized (err) {
  BaseException.call(this, 'Unauthorized', err);
  this.message = err;
};

// do the unholy javascript prototype dance.
Unauthorized.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: Unauthorized,
    writable: true,
    configurable: true
  }
});
