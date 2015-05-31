'use strict';

var path = require('path');
var _ = require('lodash');
var glob = require('glob');
var httpMocks = require('node-mocks-http');

module.exports = function (done) {

  var cwd = path.join(process.cwd(), '/api/responses');
  glob('*.js', {'cwd': cwd}, function (err, files) {
    if (err) { done(err); }

    var req = httpMocks.createRequest();
    req._sails = require('./sails');
    req.options = {};

    var res = httpMocks.createResponse();
    require('sails/lib/hooks/views/res.view')(req, res, function () {});
    res._sails = require('./sails');
    _(files).transform(function (result, file) {
      var name = file.replace('.js', '');
      var fileName = path.join(cwd, file);
      result[name] = require(fileName);
    }, {}).forEach(function (response, name) {
      res[name] = response.bind({res: res, req: req});
    }).value();

    done(null, {res: res, req: req});

  });
};
