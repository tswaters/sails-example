
'use strict'

require('../../base.js')

const assert = require('assert')
const sinon = require('sinon')
const policyHooks = require('../../helpers/policy-hooks')

describe('AuthController', () => {

  before(policyHooks.before)
  beforeEach(policyHooks.beforeEach)
  after(policyHooks.after)

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

    let logoutStub = null

    before(() => {
      logoutStub = sinon.stub(AuthService, 'logout')
    })

    afterEach(() => {
      logoutStub.reset()
    })

    after(() => {
      logoutStub.restore()
    })

    it('should not hit service is user not logged in', async function () {
      this.locals.session = {token: null}
      await this.request.get('/en/logout').redirects(2).expect(200)
      assert.equal(logoutStub.callCount, 0)
    })

    it('should log the user out', async function () {
      this.locals.session = {token: '12345'}
      logoutStub.resolves()
      await this.request.get('/en/logout').redirects(2).expect(200)
      assert.equal(logoutStub.callCount, 1)
    })

    it('should handle errors', async function () {
      this.locals.session = {token: '12345'}
      logoutStub.rejects(new DatabaseError('aw snap!'))
      await this.request.get('/en/logout').expect(500)
      assert.equal(logoutStub.callCount, 1)
    })

  })

  describe('#login', () => {

    let loginStub = null
    let payload = null

    before(() => {
      loginStub = sinon.stub(AuthService, 'login')
    })

    beforeEach(() => {
      payload = {username: '12345', password: '12345'}
    })

    afterEach(() => {
      loginStub.reset()
    })

    after(() => {
      loginStub.restore()
    })

    it('should throw for no username', async function () {
      delete payload.username
      const res = await this.request.post('/api/auth/login').send(payload).expect(400)
      assert.equal(res.body.type, 'BadRequest')
      assert.equal(res.body.error, 'INVALID-USERNAME')
    })

    it('should throw for no password', async function () {
      delete payload.password
      const res = await this.request.post('/api/auth/login').send(payload).expect(400)
      assert.equal(res.body.type, 'BadRequest')
      assert.equal(res.body.error, 'INVALID-PASSWORD')
    })

    it('should log the user in', async function () {
      loginStub.resolves()
      const res = await this.request.post('/api/auth/login').send(payload).expect(200)
      assert.deepEqual(res.body, {})
    })

    it('should handle errors', async function () {
      loginStub.rejects(new Unauthorized('aw snap!'))
      const res = await this.request.post('/api/auth/login').send(payload).expect(401)
      assert.equal(res.body.type, 'Unauthorized')
      assert.equal(res.body.error, 'aw snap!')
    })

  })

  describe('#register', () => {

    let registerStub = null
    let payload = null

    before(() => {
      registerStub = sinon.stub(AuthService, 'register')
    })

    beforeEach(() => {
      payload = {username: '12345', password: '12345'}
    })

    afterEach(() => {
      registerStub.reset()
    })

    after(() => {
      registerStub.restore()
    })

    it('should throw for no username', async function () {
      delete payload.username
      const res = await this.request.post('/api/auth/register').send(payload).expect(400)
      assert.equal(res.body.type, 'BadRequest')
      assert.equal(res.body.error, 'INVALID-USERNAME')
    })

    it('should throw for no password', async function () {
      delete payload.password
      const res = await this.request.post('/api/auth/register').send(payload).expect(400)
      assert.equal(res.body.type, 'BadRequest')
      assert.equal(res.body.error, 'INVALID-PASSWORD')
    })

    it('should log the user in', async function () {
      registerStub.resolves()
      const res = await this.request.post('/api/auth/register').send(payload).expect(200)
      assert.deepEqual(res.body, {})
    })

    it('should handle errors', async function () {
      registerStub.rejects(new Unauthorized('aw snap!'))
      const res = await this.request.post('/api/auth/register').send(payload).expect(401)
      assert.equal(res.body.type, 'Unauthorized')
      assert.equal(res.body.error, 'aw snap!')
    })

  })

})
