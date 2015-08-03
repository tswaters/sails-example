'use strict';

var BaseException = require('./BaseException');

var Forbidden = module.exports = function Forbidden (err) {
  BaseException.call(this, 'Forbidden', err);
  this.error = 'you are not permitted to perform that operation';
};

// do the unholy javascript prototype dance.
Forbidden.prototype = Object.create(BaseException.prototype, {
  constructor: {
    value: Forbidden,
    writable: true,
    configurable: true
  }
});
