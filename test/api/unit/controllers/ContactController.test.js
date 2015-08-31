'use strict';

var _ = require('lodash');
var async = require('async')
var sinon = require('sinon');
var base = require('../../base.js');

describe('ContactController', function () {
  var request;
  var contact;
  var contacts;
  var users;
  var loginUser;

  before(function () {
    request = this.request;
    contacts = base.fixtures.contacts;
    users = base.fixtures.users;
    loginUser = _.first(base.fixtures.users);
    contact = _.first(contacts);
  });

  beforeEach(function (done) {
    async.series([
      function (next) {Contact.create(contacts).exec(next);},
      function (next) {User.create(users).exec(next);},
      function (next) {request.post(base.uris.login).send(loginUser).end(next); }
    ], done)
  });

  afterEach(function (done) {
    async.series([
      function (next) {request.get(base.uris.logout).redirects(2).end(next) },
      function (next) {Contact.destroy({}).exec(next);},
      function (next) {User.destroy({}).exec(next);}
    ], done);
  });

  describe('#home', function () {
    it('should throw unauthorized if user is not authorized', function (done) {
      async.series([
        function (next) {request.get(base.uris.logout).redirects(2).end(next)},
        function (next) {request.get('/en/contact').expect(401).end(next);}
      ], done);
    });
    it('should render the page', function (next) {
      this.request.get('/en/contact').expect(200).end(next);
    });
  });

  describe('#get', function () {
    var stub;
    var uri;
    var contact;
    before(function () {
      contact = _.first(contacts);
      stub = sinon.stub(ContactService, 'get');
      uri = '/api/contact/' + contact.id;
    });
    afterEach(function () {
      stub.reset();
    })
    after(function () {
      stub.restore();
    })
    it('should respond to upstream errors properly', function (next) {
      stub.callsArgWith(1, new ExceptionService.DatabaseError());
      request.get(uri).expect(500).end(next);
    });
    it('should return 404 for an invalid contact', function (next) {
      stub.callsArgWith(1, new ExceptionService.NotFound(), null);
      request.get(uri).expect(404).end(next);
    });
    it('should return the contact properly', function (next) {
      stub.callsArgWith(1, null, contact);
      request.get(uri).expect(200).end(next);
    });
  });

  describe('#list', function () {
    var stub;
    var uri;
    before(function () {
      stub = sinon.stub(ContactService, 'list');
      uri = '/api/contact';
    })
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond to upstream errors properly', function (next) {
      stub.callsArgWith(1, new Error('error'));
      request.get(uri).expect(500).end(next);
    });
    it('should render a list of contacts properly', function (next) {
      stub.callsArgWith(1, null, [])
      request.get(uri).expect(200).end(next);
    });
  });

  describe('#edit', function () {
    var stub;
    var uri;
    var payload;
    before(function () {
      stub = sinon.stub(ContactService, 'edit');
      uri = '/api/contact/' + contact.id;
      payload = {name: 'dummy'};
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore()
    });
    it('should respond to upstream errors properly', function (next) {
      stub.callsArgWith(1, new ExceptionService.DatabaseError());
      request.post(uri).send(payload).expect(500).end(next);
    });
    it('should respond with 404 if the contact wasnt found', function (next) {
      stub.callsArgWith(1, new ExceptionService.NotFound());
      request.post(uri).send(payload).expect(404).end(next);
    });
    it('should update the contact properly', function (next) {
      stub.callsArgWith(1, null);
      request.post(uri).send(payload).expect(204).end(next);
    });
  });

  describe('#delete', function () {
    var stub;
    var uri;
    before(function () {
      stub = sinon.stub(ContactService, 'delete');
      uri = '/api/contact/' + contact.id;
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond to upstream errors properly', function (next) {
      stub.callsArgWith(1, new ExceptionService.DatabaseError());
      request.delete(uri).expect(500).end(next);
    });
    it('should respond with 404 if the contact wasnt found', function (next) {
      stub.callsArgWith(1, new ExceptionService.NotFound());
      request.delete(uri).expect(404).end(next);
    });
    it('should delete the entity properly', function (next) {
      stub.callsArgWith(1, null);
      request.delete(uri).expect(204).end(next);
    });
  });

  describe('#create', function () {
    var stub;
    var uri;
    var payload;
    before(function () {
      stub = sinon.stub(ContactService, 'create');
      uri = '/api/contact';
      payload = {name: 'hiya'};
    });
    afterEach(function () {
      stub.reset();
    });
    after(function () {
      stub.restore();
    });
    it('should respond to upstream errors properly', function (next) {
      stub.callsArgWith(1, new ExceptionService.DatabaseError());
      request.post(uri).send(payload).expect(500).end(next);
    });
    it('should create a contact properly', function (next) {
      stub.callsArgWith(1, null, null);
      request.post(uri).send(payload).expect(204).end(next);
    });
  });
});
