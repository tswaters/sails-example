'use strict';

var _ = require('lodash');
var sinon = require('sinon');
var base = require('../../base.js');

describe('UserController', function () {
  var request;
  var users;

  before(function () {
    request = this.request;
    users = base.fixtures.users;
  });

  beforeEach(function (done) {
    User.create(users).exec(done);
  });

  afterEach(function (done) {
    User.destroy({}).exec(done);
  });

  describe('#home', function () {
    it('should render the page', function (next) {
      this.request.get('/en/user').expect(200).end(next);
    });
  });

  describe('#list', function () {
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(UserService, 'list', function (cb) {
        cb(new Error('error'));
      });
      request.get('/api/user').expect(500).end(function (err) {
        UserService.list.restore();
        next(err);
      });
    });
    it('should render a list of users properly', function (next) {
      request.get('/api/user').expect(200).end(next);
    });
  });

  describe('#edit', function () {
    var user;
    before(function () {
      user = _.first(users);
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(UserService, 'edit', function (id, data, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.post('/api/user/' + user.id).expect(500).end(function (err) {
        UserService.edit.restore();
        next(err);
      });
    });
    it('should respond with 404 if the user wasnt found', function (next) {
      request.post('/api/user/999').send({name: 'dummy'}).expect(404).end(next);
    });
    it('should update the user properly', function (next) {
      request.post('/api/user/' + user.id).send({name: 'dummy'}).expect(204).end(next);
    });
  });

  describe('#delete', function () {
    var user;
    before(function () {
      user = _.first(users);
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(UserService, 'delete', function (id, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.delete('/api/user/' + user.id).expect(500).end(function (err) {
        UserService.delete.restore();
        next(err);
      });
    });
    it('should respond with 404 if the user wasnt found', function (next) {
      request.delete('/api/user/999').expect(404).end(next);
    });
    it('should delete the entity properly', function (next) {
      request.delete('/api/user/' + user.id).expect(204).end(next);
    });
  });

  describe('#create', function () {
    var url;
    before(function () {
      url = '/api/user';
    });
    it('should respond to upstream errors properly', function (next) {
      sinon.stub(UserService, 'create', function (id, cb) {
        cb(new ExceptionService.DatabaseError('error'));
      });
      request.post(url).expect(500).end(function (err) {
        UserService.create.restore();
        next(err);
      });
    });

    it('should create a user properly', function (next) {
      request.post(url).send({name: 'hiya'}).expect(204).end(next);
    });
  });
});
