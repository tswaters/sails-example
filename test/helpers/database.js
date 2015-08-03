'use strict';

var path = require('path');
var sinon = require('sinon');

var Deferred = require(path.join(
  process.cwd(),
  'node_modules/sails',
  'node_modules/waterline',
  'lib/waterline/query/deferred'
));

module.exports.stub = function (message) {
  sinon.stub(Deferred.prototype, 'exec', function (cb) {
    cb(new Error(message));
  });
};

module.exports.restore = function () {
  Deferred.prototype.exec.restore();
};
