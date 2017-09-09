
'use strict'

const _ = require('lodash')
const assert = require('assert')
const sinon = require('sinon')
const {stubError} = require('../../helpers/database')
const {fixtures} = require('../../base.js')

describe('User model', () => {

  let users
  let user

  before(() => {
    users = fixtures.users
    user = _.first(fixtures.users)
  })

  describe('#verify', () => {

    beforeEach(next => {
      User.create(users).exec(next)
    })

    afterEach(next => {
      User.destroy({}).exec(next)
    })

    it('should respond to database errors properly', next => {
      const stub = stubError('error')
      User.verify(user, err => {
        stub.restore()
        assert(err instanceof ExceptionService.DatabaseError)
        next()
      })
    })

    it('should respond to errors in crypto service properly', next => {
      sinon.stub(CryptoService, 'compare', (pass, userHash, cb) => {
        cb('error')
      })
      User.verify(user, err => {
        CryptoService.compare.restore()
        assert.equal(err, 'error')
        next()
      })
    })

    it('should respond with an error if the user is not found', next => {
      User.verify({username: 'invalid'}, (err, isValid, data) => {
        assert.equal(err, null)
        assert.equal(isValid, false)
        assert(data instanceof ExceptionService.Unauthorized)
        next()
      })
    })

    it('should return errors back to the caller', next => {
      sinon.stub(CryptoService, 'compare', (pass, userHash, cb) => {
        cb(null, false, {})
      })
      User.verify(user, (err, isValid, data) => {
        CryptoService.compare.restore()
        assert.equal(err, null)
        assert.equal(isValid, false)
        assert(data instanceof ExceptionService.Unauthorized)
        next()
      })
    })

    it('should function properly', next => {
      User.verify(user, (err, isValid, user) => {
        assert.equal(err, null)
        assert.equal(isValid, true)
        assert(_.isObject(user))
        next()
      })
    })

  })

  describe('#beforeCreate', () => {
    let createdUser
    beforeEach(done => {
      User.create(user).exec((err, user) => {
        createdUser = user
        done(err)
      })
    })
    afterEach(done => {
      User.destroy({}).exec(done)
    })
    it('should hash the user password properly', next => {
      assert.notEqual(createdUser.password, user.password)
      next()
    })
  })

  describe('#beforeUpdate', () => {
    let createdUser
    beforeEach(done => {
      User.create(user).exec((err, user) => {
        createdUser = user
        done(err)
      })
    })
    afterEach(done => {
      User.destroy({}).exec(done)
    })
    it('should hash the user password properly', next => {
      const oldHash = user.password
      createdUser.password = 'new password'
      createdUser.save(err => {
        assert.equal(err, null)
        assert.notEqual(createdUser.password, oldHash)
        next()
      })
    })
  })

})
