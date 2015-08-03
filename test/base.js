
'use strict';

var path = require('path');
var supertest = require('supertest');
var sails = require('sails');
var sailsConfig = require(path.join(process.cwd(), 'sails.config'))({environment: 'testing'});

module.exports.fixtures = require('./fixtures');

before(function (done) {


  var self = this;
  var lifted = false;
  sails.lift(sailsConfig);

  sails.on('lifted', function (err) {
    if (err) { return done(err); }
    lifted = true;
    self.sails = this;
    self.request = supertest(sails.hooks.http.app);
    done();
  });

  sails.on('lowered', function (err) {
    if (!lifted) { return done(err); }
  });

});

after(function (done) {
  sails.lower(done);
});
