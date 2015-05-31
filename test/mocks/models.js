'use strict';

var path = require('path');
var glob = require('glob');
var wolfpack = require('wolfpack');

module.exports = function (done) {
  var cwd = path.join(process.cwd(), '/api/models');
  glob('*.js', {'cwd': cwd}, function (err, files) {
    if (err) { done(err); }
    files.forEach(function (file) {
      var fileName = path.join(cwd, file);
      var name = file.replace('.js', '');
      var model = require(fileName);
      global[name] = wolfpack(model);
    });
    done();
  });
};
