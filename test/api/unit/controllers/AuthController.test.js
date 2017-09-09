
'use strict'

const assert = require('assert')
const _ = require('lodash')
const async = require('async')
const sinon = require('sinon')
const {fixtures, uris} = require('../../base.js')
const {stubError} = require('../../helpers/database')

describe('AuthController', () => {

  let loginUser
  let request

  before(function () {
    request = this.request
    this.sails.get('/:lang/testing-return-session', (req, res) => {
      res.json(req.session)
    })
  })

  after(function () {
    this.sails.router.unbind('/:lang/testing-return-session')
  })

  beforeEach(done => {
    loginUser = _.first(fixtures.users)
    User.create(fixtures.users).exec(done)
  })

  afterEach(done => {
    async.series([
      function (next) { request.get(uris.logout).redirects(2).end(next) },
      function (next) { User.destroy({}).exec(next) }
    ], done)
  })

  describe('#loginForm', () => {
    it('should render the page', function (next) {
      this.request.get('/en/login').expect(200).end(next)
    })
  })

  describe('#registerForm', () => {
    it('should render the page', function (next) {
      this.request.get('/en/register').expect(200).end(next)
    })
  })

  describe('#logout', () => {
    it('should log the user out', done => {
      async.series([
        function (next) { request.post(uris.login).send(loginUser).end(next)},
        function (next) { request.get(uris.logout).redirects(2).expect(200).end(next)},
        function (next) {
          request.get('/en/testing-return-session').end((err, res) => {
            assert.equal(res.body.authenticated, false)
            next(err)
          })
        }
      ], done)
    })
  })

  describe('#login', () => {

    it('should respond to authentication errors returned from the Auth Service', function (next) {

      // this stub muddies the session strategy in passport -
      // session is middleware which passes options to 2nd parameter
      // while our authenicate has cb as second parameter.
      // handle both cases.

      sinon.stub(AuthService, 'authenticate', (strategy, cb) => {
        return function (req, res, next) {
          if (cb) {return cb(null, false, new ExceptionService.Unauthorized())}
          next(null, null)
        }
      })
      this.request.post(uris.login).send(loginUser).expect(401).end(err => {
        AuthService.authenticate.restore()
        next(err)
      })
    })

    it('should respond to authentication errors returned from the Auth Service', function (next) {

      // this stub muddies the session strategy in passport -
      // session is middleware which passes options to 2nd parameter
      // while our authenicate has cb as second parameter.
      // handle both cases.

      sinon.stub(AuthService, 'authenticate', (strategy, cb) => {
        return (req, res, next) => {
          if (cb) {return cb(new ExceptionService.DatabaseError())}
          next(null, null)
        }
      })
      this.request.post(uris.login).send(loginUser).expect(500).end(err => {
        AuthService.authenticate.restore()
        next(err)
      })
    })


    it('should respond to errors in req.login properly', function (next) {
      const request = require('http').IncomingMessage.prototype
      sinon.stub(request, 'login', (user, done) => {
        done('error')
      })
      this.request.post(uris.login).send(loginUser).expect(500).end(err => {
        request.login.restore()
        next(err)
      })
    })

    it('should log the user in properly', done => {
      async.series([
        function (next) {request.post(uris.login).send(loginUser).expect(200).end(next)},
        function (next) {
          request.get('/en/testing-return-session').end((err, res) => {
            assert.equal(res.body.authenticated, true)
            next(err)
          })
        }
      ], done)
    })

  })

  describe('#register',  () => {
    it('should respond to database problems properly', function (next) {
      const stub = stubError('error')
      this.request.post(uris.register).send(loginUser).expect(500).end(err => {
        stub.restore()
        next(err)
      })
    })
    it('should respond to errors in req.login properly', function (next) {
      const request = require('http').IncomingMessage.prototype
      sinon.stub(request, 'login', (user, done) => {
        done('error')
      })
      this.request.post(uris.register).send(loginUser).expect(500).end(err => {
        request.login.restore()
        next(err)
      })
    })
    it('should register the user properly', function (next) {
      this.request.post(uris.register).send(loginUser).expect(200).end(next)
    })
  })

})
