
'use strict';

var _ = require('lodash');
var databaseHelper = require('../../helpers/database');
var base = require('../../base.js');
var assert = require('assert');

describe('User Service', function () {
  var fixtures;

  before(function () {
    fixtures = base.fixtures.users;
  });

  beforeEach(function (done) {
    User.create(fixtures).exec(done);
  });

  afterEach(function (done) {
    User.destroy({}).exec(done);
  });

  describe('#list', function () {
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      UserService.list(function (err, users) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        assert.equal(users, null);
        databaseHelper.restore();
        next();
      });
    });
    it('should return all users properly', function (next) {
      UserService.list(function (err, users) {
        assert.equal(users.length, fixtures.length);
        next(err);
      });
    });
  });

  describe('#create', function () {
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      UserService.create({}, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should create a user properly', function (next) {
      UserService.create({name: 'hiya'}, function (err) {
        assert.equal(err, null);
        User.findOne({name: 'hiya'}).exec(function (dbErr, dbUser) {
          assert.equal(dbErr, null);
          assert.equal(dbUser.name, 'hiya');
          next();
        });
      });
    });
  });

  describe('#edit', function () {
    var user;
    before(function () {
      user = _.first(fixtures);
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      UserService.edit(1, {}, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should respond with NotFound if the user was not found', function (next) {
      UserService.edit(-1, {}, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should edit the user properly', function (next) {
      UserService.edit(user.id, {name: 'dummy'}, function (err) {
        assert.equal(err, null);
        User.findOne(user.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data.name, 'dummy');
          next();
        });
      });
    });
  });

  describe('#delete', function () {
    var user;

    before(function () {
      user = _.first(fixtures);
    });

    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      UserService.delete(1, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should respond with NotFound if the user was not found', function (next) {
      UserService.delete(-1, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should delete the user properly', function (next) {
      UserService.delete(user.id, function (err) {
        assert.equal(err, null);
        User.findOne(user.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data, null);
          next();
        });
      });
    });
  });

});
