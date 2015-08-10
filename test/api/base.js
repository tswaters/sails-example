
'use strict';

var path = require('path');
var supertest = require('supertest');
var agent = supertest.agent;
var sails = require('sails');
var sailsConfig = require(path.join(process.cwd(), 'sails.config'))({environment: 'testing'});

module.exports.fixtures = require('./fixtures');

module.exports.uris = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/en/logout'
};

before(function (done) {
  var self = this;
  var lifted = false;
  sails.lift(sailsConfig);

  sails.on('lifted', function () {
    lifted = true;
    self.sails = this;
    self.request = agent(sails.hooks.http.app);
    done();
  });

  sails.after('lower', function (e) {
    if (!lifted) {
      return done(new Error([
        'Sails were lowered before the http app listening event was fired.',
        'All signs point to an exception in bootstrap via invalid test config.',
        'Try turning on logging to see what the problem is.',
        e
      ].join('\n')));
    }
  });

});

after(function (done) {
  sails.lower(done);
});
