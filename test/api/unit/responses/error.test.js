
'use strict'

require('../../base.js')

const assert = require('assert')

describe('error response', () => {

  before(() => {
    sails.get('/error-test/unhandled', (req, res) => {
      res.notOk(new Error())
    })
    sails.get('/error-test/db-problem', (req, res) => {
      res.notOk(new DatabaseError())
    })
    sails.get('/error-test/bad-request', (req, res) => {
      res.notOk(new BadRequest('hmmm'))
    })
    sails.get('/error-test/forbidden', (req, res) => {
      res.notOk(new Forbidden())
    })
    sails.get('/error-test/not-found', (req, res) => {
      res.notOk(new NotFound())
    })
  })

  after(() => {
    sails.router.unbind('/error-test/db-problem')
    sails.router.unbind('/error-test/bad-request')
    sails.router.unbind('/error-test/forbidden')
    sails.router.unbind('/error-test/not-found')
  })

  describe('by status code', () => {
    it('should respond with 500 status for unhandled', function () {
      return this.request.get('/error-test/unhandled').expect(500)
    })
    it('should respond with 500 status properly', function () {
      return this.request.get('/error-test/db-problem').expect(500)
    })
    it('should respond with 404 status properly', function () {
      return this.request.get('/error-test/not-found').expect(404)
    })
    it('should respond with 401 status properly', function () {
      return this.request.get('/error-test/forbidden').expect(403)
    })
    it('should respond with 400 status properly', function () {
      return this.request.get('/error-test/bad-request').expect(400)
    })
  })

  describe('requesting html', () => {
    it('should respond with 500 status for unhandled', function () {
      return this.request.get('/error-test/unhandled').set('Accept', 'text/html').expect('Content-Type', /html/).expect(500)
    })
    it('should respond with 500 status properly', function () {
      return this.request.get('/error-test/db-problem').set('Accept', 'text/html').expect('Content-Type', /html/).expect(500)
    })
    it('should respond with 404 status properly', function () {
      return this.request.get('/error-test/not-found').set('Accept', 'text/html').expect('Content-Type', /html/).expect(404)
    })
    it('should respond with 401 status properly', function () {
      return this.request.get('/error-test/forbidden').set('Accept', 'text/html').expect('Content-Type', /html/).expect(403)
    })
    it('should respond with 400 status properly', function () {
      return this.request.get('/error-test/bad-request').set('Accept', 'text/html').expect('Content-Type', /html/).expect(400)
    })
  })

  it('should not include data in the response when environment is production', async function () {
    sails.config.environment = 'production'
    const res = await this.request.get('/error-test/db-problem').expect(500)
    assert.equal(res.body.stack, null)
    assert.equal(res.body.message, 'ERRORS.500.DatabaseError')
    assert.equal(res.body.type, null)
    assert.equal(res.body.error, null)
    sails.config.environment = 'testing'
  })

})
