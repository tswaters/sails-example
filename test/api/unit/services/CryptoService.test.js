
var crypto = require('crypto');
var sinon = require('sinon');
var assert = require('assert');

require('../../base.js');

describe('Crypto Service', function () {

  describe('#hash', function () {

    it('should respond with errors generating salt properly', function (done) {
      sinon.stub(crypto, 'randomBytes', function (length, cb) {
        cb('error');
      });
      CryptoService.hash('password', function (err, hash) {
        crypto.randomBytes.restore();
        assert.equal(err, 'error');
        assert.equal(hash, null);
        done();
      });
    });

    it('should respond with errors generating hash properly', function (done) {
      sinon.stub(crypto, 'pbkdf2', function (value, salt, iterations, saltLength, algorithm, cb) {
        cb('error');
      });
      CryptoService.hash('password', function (err, hash) {
        crypto.pbkdf2.restore();
        assert.equal(err, 'error');
        assert.equal(hash, null);
        done();
      });
    });

    it('should create a hash properly', function (done) {
      CryptoService.hash('password', function (err, hash) {
        assert.equal(err, null);
        assert.equal(hash.split('$').length, 2);
        done();
      });
    });

  });

  describe('#compare', function () {
    var generatedHash;
    before(function (done) {
      CryptoService.hash('password', function (err, hash) {
        generatedHash = hash;
        done();
      });
    });

    it('should respond with errors generating hash properly', function (done) {
      sinon.stub(crypto, 'pbkdf2', function (value, salt, iterations, saltLength, algorithm, cb) {
        cb('error');
      });
      CryptoService.compare('password', generatedHash, function (err, hash) {
        crypto.pbkdf2.restore();
        assert.equal(err, 'error');
        assert.equal(hash, null);
        done();
      });
    });

    it('should compare hashes properly', function (done) {
      CryptoService.compare('password', generatedHash, function (err, isValid) {
        assert.equal(err, null);
        assert.equal(isValid, true);
        done();
      });
    });

  });

});
