
'use strict';

var _ = require('lodash');
var databaseHelper = require('../../helpers/database');
var base = require('../../base.js');
var assert = require('assert');

describe('Contact Service', function () {
  var fixtures;

  before(function () {
    fixtures = base.fixtures.contacts;
  });

  beforeEach(function (done) {
    Contact.create(fixtures).exec(done);
  });

  afterEach(function (done) {
    Contact.destroy({}).exec(done);
  });

  describe('#list', function () {
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.list(function (err, contacts) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        assert.equal(contacts, null);
        databaseHelper.restore();
        next();
      });
    });
    it('should return all contacts properly', function (next) {
      ContactService.list(function (err, contacts) {
        assert.equal(contacts.length, fixtures.length);
        next(err);
      });
    });
  });

  describe('#create', function () {
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.create({}, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should create a contact properly', function (next) {
      ContactService.create({name: 'hiya'}, function (err) {
        assert.equal(err, null);
        Contact.findOne({name: 'hiya'}).exec(function (dbErr, dbContact) {
          assert.equal(dbErr, null);
          assert.equal(dbContact.name, 'hiya');
          next();
        });
      });
    });
  });

  describe('#edit', function () {
    var contact;
    before(function () {
      contact = _.first(fixtures);
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.edit(1, {}, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      ContactService.edit(-1, {}, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should edit the contact properly', function (next) {
      ContactService.edit(contact.id, {name: 'dummy'}, function (err) {
        assert.equal(err, null);
        Contact.findOne(contact.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data.name, 'dummy');
          next();
        });
      });
    });
  });

  describe('#delete', function () {
    var contact;

    before(function () {
      contact = _.first(fixtures);
    });

    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.delete(1, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      ContactService.delete(-1, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should delete the contact properly', function (next) {
      ContactService.delete(contact.id, function (err) {
        assert.equal(err, null);
        Contact.findOne(contact.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data, null);
          next();
        });
      });
    });
  });

});
