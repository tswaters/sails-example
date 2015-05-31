'use strict';

var path = require('path');
var glob = require('glob');

/**
 * Load all controllers into global namespace.
 * @param {function{object}} done callback(err)
 */
module.exports = function (done) {
  var cwd = path.join(process.cwd(), '/api/controllers');
  glob('*.js', {'cwd': cwd}, function (err, files) {
    if (err) { done(err); }
    files.forEach(function (file) {
      var fileName = path.join(cwd, file);
      var name = file.replace('.js', '');
      global[name] = require(fileName);
    });
    done();
  });
};
