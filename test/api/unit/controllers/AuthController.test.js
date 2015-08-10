'use strict';

var assert = require('assert');
var _ = require('lodash');
var async = require('async')
var sinon = require('sinon');
var base = require('../../base.js');
var databaseHelper = require('../../helpers/database');

describe('AuthController', function () {

  var loginUser;
  var request;

  before(function () {
    request = this.request;
    this.sails.get('/:lang/testing-return-session', function (req, res) {
      res.json(req.session);
    });
  })

  after(function () {
    this.sails.router.unbind('/:lang/testing-return-session')
  });

  beforeEach(function (done) {
    loginUser = _.first(base.fixtures.users);
    User.create(base.fixtures.users).exec(done);
  });

  afterEach(function (done) {
    async.series([
      function (next) { request.get(base.uris.logout).redirects(1).end(next); },
      function (next) { User.destroy({}).exec(next); }
    ], done)
  });

  describe('#loginForm', function () {
    it('should render the page', function (next) {
      this.request.get('/en/login').expect(200).end(next);
    });
  });

  describe('#registerForm', function () {
    it('should render the page', function (next) {
      this.request.get('/en/register').expect(200).end(next);
    });
  });

  describe('#logout', function () {
    it('should log the user out', function (done) {
      async.series([
        function (next) { request.post(base.uris.login).send(loginUser).end(next)},
        function (next) { request.get(base.uris.logout).redirects(1).expect(200).end(next)},
        function (next) {
          request.get('/en/testing-return-session').end(function (err, res) {
            assert.equal(res.body.authenticated, false);
            next(err);
          });
        }
      ], done);
    })
  });

  describe('#login', function () {

    it('should respond to authentication errors returned from the Auth Service', function (next) {

      // this stub muddies the session strategy in passport -
      // session is middleware which passes options to 2nd parameter
      // while our authenicate has cb as second parameter.
      // handle both cases.

      sinon.stub(AuthService, 'authenticate', function (strategy, cb) {
        return function (req, res, next) {
          if (cb) {return cb(null, false, new ExceptionService.Unauthorized());}
          next(null, null);
        };
      });
      this.request.post(base.uris.login).send(loginUser).expect(401).end(function (err) {
        AuthService.authenticate.restore();
        next(err);
      });
    });

    it('should respond to authentication errors returned from the Auth Service', function (next) {

      // this stub muddies the session strategy in passport -
      // session is middleware which passes options to 2nd parameter
      // while our authenicate has cb as second parameter.
      // handle both cases.

      sinon.stub(AuthService, 'authenticate', function (strategy, cb) {
        return function (req, res, next) {
          if (cb) {return cb(new ExceptionService.DatabaseError());}
          next(null, null);
        };
      });
      this.request.post(base.uris.login).send(loginUser).expect(500).end(function (err) {
        AuthService.authenticate.restore();
        next(err);
      });
    });


    it('should respond to errors in req.login properly', function (next) {
      var request = require('http').IncomingMessage.prototype;
      sinon.stub(request, 'login', function (user, done) {
        done('error');
      });
      this.request.post(base.uris.login).send(loginUser).expect(500).end(function (err) {
        request.login.restore();
        next(err);
      });
    });

    it('should log the user in properly', function (done) {
      async.series([
        function (next) {request.post(base.uris.login).send(loginUser).expect(200).end(next);},
        function (next) {request.get('/en/testing-return-session').end(function (err, res) {
          assert.equal(res.body.authenticated, true);
          next(err);
        })}
      ], done)
    });

  });

  describe('#register', function () {
    it('should respond to database problems properly', function (next) {
      databaseHelper.stub('error');
      this.request.post(base.uris.register).send(loginUser).expect(500).end(function (err) {
        databaseHelper.restore();
        next(err);
      });
    });
    it('should respond to errors in req.login properly', function (next) {
      var request = require('http').IncomingMessage.prototype;
      sinon.stub(request, 'login', function (user, done) {
        done('error');
      });
      this.request.post(base.uris.register).send(loginUser).expect(500).end(function (err) {
        request.login.restore();
        next(err);
      });
    });
    it('should register the user properly', function (next) {
      this.request.post(base.uris.register).send(loginUser).expect(200).end(next);
    })
  });

});
