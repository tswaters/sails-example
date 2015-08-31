
'use strict';

var _ = require('lodash');
var databaseHelper = require('../../helpers/database');
var assert = require('assert');

describe('Contact Service', function () {

  describe('#get', function () {
    var stub;
    var payload = {
      user: 1,
      id: 1
    };
    before(function () {
      stub = databaseHelper.stub();
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      stub.callsArgWith(0, 'error');
      ContactService.get(payload, function (err, contacts) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError, 'error');
        assert.equal(contacts, null);
        next();
      });
    });
    it('should return a given contact properly', function (next) {
      stub.callsArgWith(0, null, null)
      ContactService.get(payload, function (err, contact) {
        assert(err instanceof ExceptionService.NotFound);
        assert.equal(contact, null);
        next();
      });
    });
    it('should return a given contact properly', function (next) {
      stub.callsArgWith(0, null, {})
      ContactService.get(payload, function (err, contact) {
        assert.equal(err, null);
        assert(_.isObject(contact));
        next();
      });
    });
  });

  describe('#list', function () {
    var stub;
    var payload = {
      user: 1
    };
    before(function () {
      stub = databaseHelper.stub();
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      stub.callsArgWith(0, 'error');
      ContactService.list(payload, function (err, contacts) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError, 'error');
        assert.equal(contacts, null);
        next();
      });
    });
    it('should return contacts for a given user properly', function (next) {
      stub.callsArgWith(0, null, [])
      ContactService.list(payload, function (err, contacts) {
        assert.equal(err, null);
        assert.equal(contacts.length, 0);
        next();
      });
    });
  });

  describe('#create', function () {
    var stub;
    var payload = {
      name: 'hiya',
      owner: 1
    };
    before(function () {
      stub = databaseHelper.stub();
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      stub.callsArgWith(0, 'error');
      ContactService.create(payload, function (err, contact) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError, 'error');
        assert.equal(contact, null);
        next();
      });
    });
    it('should create a contact properly', function (next) {
      stub.callsArgWith(0, null, {});
      ContactService.create(payload, function (err) {
        assert.equal(err, null);
        next();
      });
    });
  });

  describe('#edit', function () {
    var stub;
    var payload = {
      'id': 1,
      'user': 1,
      'data': {name: 'new-name'}
    };
    before(function () {
      stub = databaseHelper.stub();
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      stub.callsArgWith(0, 'error');
      ContactService.edit(payload, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError, 'error');
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      stub.callsArgWith(0, null, []);
      ContactService.edit(payload, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should edit the contact properly', function (next) {
      stub.callsArgWith(0, null, [{}]);
      ContactService.edit(payload, function (err) {
        assert.equal(err, null);
        next();
      });
    });
  });

  describe('#delete', function () {
    var stub;
    var payload = {
      id: 1,
      user: 1
    };
    before(function () {
      stub = databaseHelper.stub();
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond with DatabaseError if encountering database problems', function (next) {
      stub.callsArgWith(0, 'error');
      ContactService.delete(payload, function (err) {
        assert(err instanceof ExceptionService.DatabaseError);
        assert.equal(err.originalError, 'error');
        next();
      });
    });
    it('should respond with NotFound if the contact was not found', function (next) {
      stub.callsArgWith(0, null, []);
      ContactService.delete(payload, function (err) {
        assert(err instanceof ExceptionService.NotFound);
        next();
      });
    });
    it('should delete the contact properly', function (next) {
      stub.callsArgWith(0, null, [{}])
      ContactService.delete(payload, function (err) {
        assert.equal(err, null);
        next();
      });
    });
  });

});
