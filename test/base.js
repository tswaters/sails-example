
'use strict';

var supertest = require('supertest');
var sails = require('sails');

module.exports.fixtures = require('./fixtures');

before(function (done) {
  var self = this;
  sails.lift({
    environment: 'testing',
    log: {level: 'silent'}
  });

  sails.on('lifted', function (err) {
    if (err) { return done(err); }
    self.sails = this;
    self.app = sails.hooks.http.app;
    done();
  });

});

after(function (done) {
  sails.lower(done);
});

beforeEach(function () {
  this.request = supertest(this.app);
});

afterEach(function () {
  this.request = null;
});
