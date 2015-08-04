'use strict';

var assert = require('assert');
require('../../base.js');

describe('error response', function () {

  before(function () {
    this.sails.get('/error-test/db-problem', function (req, res) {
      res.notOk(new ExceptionService.DatabaseError());
    });
    this.sails.get('/error-test/bad-request', function (req, res) {
      res.notOk(new ExceptionService.BadRequest('hmmm'));
    });
    this.sails.get('/error-test/forbidden', function (req, res) {
      res.notOk(new ExceptionService.Forbidden());
    });
    this.sails.get('/error-test/not-found', function (req, res) {
      res.notOk(new ExceptionService.NotFound());
    });
  });

  after(function () {
    this.sails.router.unbind('/error-test/db-problem');
    this.sails.router.unbind('/error-test/bad-request');
    this.sails.router.unbind('/error-test/forbidden');
    this.sails.router.unbind('/error-test/not-found');
  });

  describe('by status code', function () {
    it('should respond with 500 status properly', function (next) {
      this.request.get('/error-test/db-problem').expect(500).end(next);
    });
    it('should respond with 404 status properly', function (next) {
      this.request.get('/error-test/not-found').expect(404).end(next);
    });
    it('should respond with 401 status properly', function (next) {
      this.request.get('/error-test/forbidden').expect(403).end(next);
    });
    it('should respond with 400 status properly', function (next) {
      this.request.get('/error-test/bad-request').expect(400).end(next);
    });
  });

  describe('requesting html', function () {
    it('should respond with 500 status properly', function (next) {
      this.request.get('/error-test/db-problem').set('Accept', 'text/html').expect('Content-Type', /html/).expect(500).end(next);
    });

    it('should respond with 404 status properly', function (next) {
      this.request.get('/error-test/not-found').set('Accept', 'text/html').expect('Content-Type', /html/).expect(404).end(next);
    });

    it('should respond with 401 status properly', function (next) {
      this.request.get('/error-test/forbidden').set('Accept', 'text/html').expect('Content-Type', /html/).expect(403).end(next);
    });

    it('should respond with 400 status properly', function (next) {
      this.request.get('/error-test/bad-request').set('Accept', 'text/html').expect('Content-Type', /html/).expect(400).end(next);
    });
  });

  it('should not include data in the response when environment is production', function (next) {
    var self = this;
    this.sails.config.environment = 'production';
    this.request.get('/error-test/db-problem').expect(500).end(function (err, res) {
      assert.equal(res.body.message, null);
      assert.equal(res.body.type, null);
      assert.equal(res.body.originalError, null);
      assert.equal(res.body.error, 'unknown internal error');
      self.sails.config.environment = 'testing';
      next(err);
    });
  });

});
