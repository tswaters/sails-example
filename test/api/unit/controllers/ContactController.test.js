'use strict';

var _ = require('lodash');
var async = require('async')
var sinon = require('sinon');
var base = require('../../base.js');

describe('ContactController', function () {
  var request;
  var contacts;
  var users;
  var loginUser;

  before(function () {
    request = this.request;
    contacts = base.fixtures.contacts;
    users = base.fixtures.users;
    loginUser = _.first(base.fixtures.users);
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

  describe('#list', function () {
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(ContactService, 'list', function (opts, cb) {
        cb(new Error('error'));
      });
      request.get('/api/contact').expect(500).end(function (err) {
        ContactService.list.restore();
        next(err);
      });
    });
    it('should render a list of contacts properly', function (next) {
      request.get('/api/contact').expect(200).end(next);
    });
  });

  describe('#edit', function () {
    var contact;
    before(function () {
      contact = _.first(contacts);
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(ContactService, 'edit', function (id, data, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.post('/api/contact/' + contact.id).expect(500).end(function (err) {
        ContactService.edit.restore();
        next(err);
      });
    });
    it('should respond with 404 if the contact wasnt found', function (next) {
      request.post('/api/contact/999').send({name: 'dummy'}).expect(404).end(next);
    });
    it('should update the contact properly', function (next) {
      request.post('/api/contact/' + contact.id).send({name: 'dummy'}).expect(204).end(next);
    });
  });

  describe('#delete', function () {
    var contact;
    before(function () {
      contact = _.first(contacts);
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(ContactService, 'delete', function (id, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.delete('/api/contact/' + contact.id).expect(500).end(function (err) {
        ContactService.delete.restore();
        next(err);
      });
    });
    it('should respond with 404 if the contact wasnt found', function (next) {
      request.delete('/api/contact/999').expect(404).end(next);
    });
    it('should delete the entity properly', function (next) {
      request.delete('/api/contact/' + contact.id).expect(204).end(next);
    });
  });

  describe('#create', function () {
    var url;
    before(function () {
      url = '/api/contact';
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(ContactService, 'create', function (id, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.post(url).expect(500).end(function (err) {
        ContactService.create.restore();
        next(err);
      });
    });

    it('should create a contact properly', function (next) {
      request.post(url).send({name: 'hiya'}).expect(204).end(next);
    });
  });
});
