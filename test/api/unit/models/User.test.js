var _ = require('lodash');
var assert = require('assert');
var sinon = require('sinon');
var databaseHelper = require('../../helpers/database');
var base = require('../../base.js');

describe('User model', function () {

  var users;
  var user;

  before(function () {
    users = base.fixtures.users;
    user = _.first(base.fixtures.users);
  });

  describe('#verify', function () {

    beforeEach(function (next) {
      User.create(users).exec(next);
    });

    afterEach(function (next) {
      User.destroy({}).exec(next);
    });

    it('should respond to database errors properly', function (next) {
      var stub = databaseHelper.stubError('error');
      User.verify(user, function (err) {
        stub.restore();
        assert(err instanceof ExceptionService.DatabaseError);
        next();
      });
    });

    it('should respond to errors in crypto service properly', function (next) {
      sinon.stub(CryptoService, 'compare', function (pass, userHash, cb) {
        cb('error');
      });
      User.verify(user, function (err) {
        CryptoService.compare.restore();
        assert.equal(err, 'error');
        next();
      });
    });

    it('should respond with an error if the user is not found', function (next) {
      User.verify({username: 'invalid'}, function (err, isValid, data) {
        assert.equal(err, null);
        assert.equal(isValid, false);
        assert(data instanceof ExceptionService.Unauthorized);
        next();
      });
    });

    it('should return errors back to the caller', function (next) {
      sinon.stub(CryptoService, 'compare', function (pass, userHash, cb) {
        cb(null, false, {});
      });
      User.verify(user, function (err, isValid, data) {
        CryptoService.compare.restore();
        assert.equal(err, null);
        assert.equal(isValid, false);
        assert(data instanceof ExceptionService.Unauthorized);
        next();
      });
    });

    it('should function properly', function (next) {
      User.verify(user, function (err, isValid, user) {
        assert.equal(err, null);
        assert.equal(isValid, true);
        assert(_.isObject(user))
        next();
      });
    });

  });

  describe('#beforeCreate', function () {
    var createdUser;
    beforeEach(function (done) {
      User.create(user).exec(function (err, user) {
        createdUser = user;
        done(err);
      });
    })
    afterEach(function (done) {
      User.destroy({}).exec(done);
    })
    it('should hash the user password properly', function (next) {
      assert.notEqual(createdUser.password, user.password);
      next();
    });
  });

  describe('#beforeUpdate', function () {
    var createdUser;
    beforeEach(function (done) {
      User.create(user).exec(function (err, user) {
        createdUser = user;
        done(err);
      });
    })
    afterEach(function (done) {
      User.destroy({}).exec(done);
    })
    it('should hash the user password properly', function (next) {
      var oldHash = user.password;
      createdUser.password = 'new password';
      createdUser.save(function (err) {
        assert.equal(err, null)
        assert.notEqual(createdUser.password, oldHash);
        next();
      });
    });
  });

});
