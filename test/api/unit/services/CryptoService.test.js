
'use strict'

const crypto = require('crypto')
const sinon = require('sinon')
const assert = require('assert')
require('../../base.js')

describe('Crypto Service', () => {

  describe('#hash', () => {

    it('should respond with errors generating salt properly', done => {
      sinon.stub(crypto, 'randomBytes', (length, cb) => {
        cb('error')
      })
      CryptoService.hash('password', (err, hash) => {
        crypto.randomBytes.restore()
        assert.equal(err, 'error')
        assert.equal(hash, null)
        done()
      })
    })

    it('should respond with errors generating hash properly', done => {
      sinon.stub(crypto, 'pbkdf2', (value, salt, iterations, saltLength, algorithm, cb) => {
        cb('error')
      })
      CryptoService.hash('password', (err, hash) => {
        crypto.pbkdf2.restore()
        assert.equal(err, 'error')
        assert.equal(hash, null)
        done()
      })
    })

    it('should create a hash properly', done => {
      CryptoService.hash('password', (err, hash) => {
        assert.equal(err, null)
        assert.equal(hash.split('$').length, 2)
        done()
      })
    })

  })

  describe('#compare', () => {
    let generatedHash
    before(done => {
      CryptoService.hash('password', (err, hash) => {
        generatedHash = hash
        done()
      })
    })

    it('should respond with errors generating hash properly', done => {
      sinon.stub(crypto, 'pbkdf2', (value, salt, iterations, saltLength, algorithm, cb) => {
        cb('error')
      })
      CryptoService.compare('password', generatedHash, (err, hash) => {
        crypto.pbkdf2.restore()
        assert.equal(err, 'error')
        assert.equal(hash, null)
        done()
      })
    })

    it('should compare hashes properly', done => {
      CryptoService.compare('password', generatedHash, (err, isValid) => {
        assert.equal(err, null)
        assert.equal(isValid, true)
        done()
      })
    })

  })

})
