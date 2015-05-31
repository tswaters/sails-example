'use strict';

var path = require('path');
var _ = require('lodash');
var expect = require('chai').expect;
var base = require('../../base.js');

describe('UserController', function () {

  // these all do http requests.
  this.slow(150);

  describe('database failures', function () {

    // monkey patch away waterline's exec function to raise errors.
    // this is for verifying the app returns 500 errors properly.
    // return the old function when finished.

    var user = base.fixtures.users[0];
    var Deferred;
    var exec;

    before(function () {
      Deferred = require(path.join.apply(null, [
        process.cwd(),
        'node_modules/sails',
        'node_modules/waterline',
        'lib/waterline/query/deferred'
      ]));
      exec = Deferred.prototype.exec;
      Deferred.prototype.exec = function (cb) {
        return cb('Error');
      };
    });

    after(function () {
      Deferred.prototype.exec = exec;
    });

    _.forEach({
      'get /user': null,
      'get /user/edit/{0}': null,
      'get /user/delete/{0}': null,
      'post /user/edit/{0}': {name: 'test'},
      'post /user/delete/{0}': null,
      'post /user/create': {name: 'test'}
    }, function (data, route) {
      var method = route.split(' ')[0];
      var url = route.split(' ')[1].replace('{0}', user.id);
      it('should throw an error for ' + url + ' when db is unavailable', function (next) {
        this.request
          [method](url)
          .send(data)
          .set('Accept', 'text/html')
          .expect('Content-Type', /html/)
          .expect(500)
          .end(next);
      });
    });

  });

  describe('get requests', function () {

    var user = base.fixtures.users[0];

    before(function (next) { User.create(user).exec(next); });

    after(function (next) { User.destroy({id: user.id}).exec(next); });

    [
      '/user',
      '/user/edit/:id',
      '/user/delete/:id',
      '/user/create'
    ].forEach(function (url) {

      describe(url, function () {
        if (url.indexOf(':id') > -1) {

          it('should return 400 if ID not provided', function (next) {
            this.request
              .get(url.replace('/:id', ''))
              .set('Accept', 'text/html')
              .expect('Content-Type', /html/)
              .expect(400)
              .end(next);
          });

          it('should return 404 if invalid ID provided', function (next) {
            this.request
              .get(url.replace(':id', '-1'))
              .set('Accept', 'text/html')
              .expect('Content-Type', /html/)
              .expect(404)
              .end(next);
          });

          it('should return 200 if Id has been provided', function (next) {
            this.request
              .get(url.replace(':id', user.id))
              .set('Accept', 'text/html')
              .expect('Content-Type', /html/)
              .expect(200)
              .end(next);
          });

        }
        else {

          it('should return 200, requesting html', function (next) {
            this.request
              .get(url)
              .set('Accept', 'text/html')
              .expect('Content-Type', /html/)
              .expect(200)
              .end(next);
          });

          it('should return 200, requesting json', function (next) {
            this.request
              .get(url.replace(':id', user.id))
              .set('Accept', 'text/json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(next);
          });

        }
      });
    });

  });

  describe('#edit', function () {
    var user = base.fixtures.users[0];

    before(function (next) { User.create(user).exec(next); });

    after(function (next) { User.destroy({id: user.id}).exec(next); });

    it('should throw bad request on post if id not provided', function (next) {
      this.request
        .post('/user/edit')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(400)
        .end(next);
    });

    it('should throw bad request on post if name not provided', function (next) {
      this.request
        .post('/user/edit/' + user.id)
        .send({}).set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(400)
        .end(next);
    });

    it('should update the user properly on a valid post', function (next) {
      this.request
        .post('/user/edit/' + user.id)
        .send({name: 'test123'})
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(302)
        .end(function () {
          User.findOne({id: 1}).exec(function (err, dbUser) {
            expect(err).to.be.null;
            expect(dbUser).to.have.property('name').and.to.equal('test123');
            next();
          });
        });
    });

  });

  describe('#delete', function () {
    var user = base.fixtures.users[0];

    before(function (next) { User.create(user).exec(next); });

    after(function (next) { User.destroy({id: user.id}).exec(next); });

    it('should throw bad request on post if id not provided', function (next) {
      this.request
        .post('/user/delete')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(400)
        .end(next);
    });

    it('should remove the record properly', function (next) {
      this.request
        .post('/user/delete/' + user.id)
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(204)
        .end(function () {
          User.findOne({id: user.id}).exec(function (err, dbUser) {
            expect(err).to.be.null;
            expect(dbUser).to.be.undefined;
            next();
          });
        });
    });

  });

  describe('#create', function () {
    var user = base.fixtures.users[0];

    it('should throw bad request on post with bad data', function (next) {
      this.request
        .post('/user/create')
        .send(_.omit(user, 'name'))
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(400)
        .end(next);
    });

    it('should insert the user properly', function (next) {
      this.request
        .post('/user/create')
        .send(user)
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/)
        .expect(302)
        .end(function () {
          User.findOne({name: user.name}).exec(function (err, dbUser) {
            expect(err).to.be.null;
            expect(dbUser).to.have.property('name').and.to.equal(user.name);
            next();
          });
        });
    });

  });

});
