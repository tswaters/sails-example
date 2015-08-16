
'use strict';

var async = require('async');
//var _ = require('lodash');
var databaseHelper = require('../../helpers/database');
var base = require('../../base.js');
var assert = require('assert');


function beforeEachAll (done) {
  async.series([
    function (next) {Contact.create(base.fixtures.contacts).exec(next);},
    function (next) {User.create(base.fixtures.users).exec(next);}
  ], done);
}

function afterEachAll (done) {
  async.series([
    function (next) {Contact.destroy({}).exec(next);},
    function (next) {User.destroy({}).exec(next);}
  ], done);
}

describe('Contact Service', function () {
  describe('#list', function () {
    var payload;
    beforeEach(beforeEachAll);
    beforeEach(function () {
      payload = {user: 1};
    });
    afterEach(afterEachAll);
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.list(payload, function (err, contacts) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        assert.equal(contacts, null);
        databaseHelper.restore();
        next();
      });
    });
    it('should return contacts for a given user properly', function (next) {
      ContactService.list(payload, function (err, contacts) {
        assert.equal(contacts.length, 2);
        next(err);
      });
    });
  });

  describe('#create', function () {
    var payload;
    beforeEach(beforeEachAll);
    beforeEach(function () {
      payload = {name: 'hiya', owner: 1};
    });
    afterEach(afterEachAll);
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.create(payload, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should create a contact properly', function (next) {
      ContactService.create(payload, function (err) {
        assert.equal(err, null);
        Contact.findOne({name: 'hiya'}).exec(function (dbErr, dbContact) {
          assert.equal(dbErr, null);
          assert.equal(dbContact.name, 'hiya');
          assert.equal(dbContact.owner, 1);
          next();
        });
      });
    });
  });

  describe('#edit', function () {
    var payload;
    beforeEach(beforeEachAll);
    beforeEach(function () {
      payload = {
        'id': 1,
        'user': 1,
        'data': {name: 'new-name'}
      }
    });
    afterEach(afterEachAll);
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.edit(payload, function (err) {
        databaseHelper.restore();
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      payload.id = -1;
      ContactService.edit(payload, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should edit the contact properly', function (next) {
      ContactService.edit(payload, function (err) {
        assert.equal(err, null);
        Contact.findOne(payload.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data.name, 'new-name');
          next();
        });
      });
    });
  });

  describe('#delete', function () {
    var payload;
    beforeEach(beforeEachAll);
    beforeEach(function () {
      payload = {id: 1, user: 1};
    });
    afterEach(afterEachAll);
    it('should respond with DatabaseError if encountering database problems', function (next) {
      databaseHelper.stub('error');
      ContactService.delete(payload, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError.message, 'error');
        databaseHelper.restore();
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      payload.id = -1;
      ContactService.delete(payload, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should delete the contact properly', function (next) {
      ContactService.delete(payload, function (err) {
        assert.equal(err, null);
        Contact.findOne(payload.id).exec(function (dbErr, data) {
          if (dbErr) { return next(dbErr); }
          assert.equal(data, null);
          next();
        });
      });
    });
  });

});
