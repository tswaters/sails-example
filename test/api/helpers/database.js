'use strict';

var path = require('path');
var sinon = require('sinon');

var Deferred = require(path.join(
  process.cwd(),
  'node_modules/waterline',
  'lib/waterline/query/deferred'
));

module.exports.stub = function () {
  return sinon.stub(Deferred.prototype, 'exec');
};

module.exports.stubError = function (message) {
  return sinon.stub(Deferred.prototype, 'exec', function (cb) {
    cb(message);
  })
}
