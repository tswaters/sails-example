
'use strict'

require('../../base.js')

const assert = require('assert')
const sinon = require('sinon')
const policyHooks = require('../../helpers/policy-hooks')

require('sinon-as-promised')

describe('ContactController', () => {

  before(policyHooks.before)
  beforeEach(policyHooks.beforeEach)
  after(policyHooks.after)

  beforeEach(function (done) {
    this.locals.locals = {user: {uuid: '12345'}}
    done()
  })

  describe('#home', () => {

    it('should render the page', async function () {
      await this.request.get('/en/contact').expect(200)
    })

  })

  describe('#get', () => {

    let stub = null
    let uri = null
    let contact = null

    before(() => stub = sinon.stub(ContactService, 'get'))

    beforeEach(() => {
      contact = {id: '12345'}
      uri = `/api/contact/${contact.id}`
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond to upstream errors properly', async function () {
      stub.rejects(new DatabaseError('aw snap!'))
      const res = await this.request.get(uri).expect(500)
      assert.equal(res.body.error, 'aw snap!')
      assert.equal(res.body.type, 'DatabaseError')
    })

    it('should return 404 for an invalid contact', async function () {
      stub.rejects(new NotFound('INVALID-CONTACT'))
      const res = await this.request.get(uri).expect(404)
      assert.equal(res.body.type, 'NotFound')
      assert.equal(res.body.error, 'INVALID-CONTACT')
    })

    it('should return the contact properly', async function () {
      stub.resolves(contact)
      await this.request.get(uri).expect(200, contact)
    })

  })

  describe('#list', () => {

    let stub = null
    let uri = null
    let response = null

    before(() => stub = sinon.stub(ContactService, 'list'))

    beforeEach(() => {
      uri = '/api/contact'
      response = [{id: '1234'}]
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond to upstream errors properly', async function () {
      stub.rejects(new DatabaseError('aw snap!'))
      const res = await this.request.get(uri).expect(500)
      assert.equal(res.body.error, 'aw snap!')
      assert.equal(res.body.type, 'DatabaseError')
    })

    it('should render a list of contacts properly', async function () {
      stub.resolves(response)
      await this.request.get(uri).expect(200, response)
    })

  })

  describe('#edit', () => {

    let stub = null
    let uri = null
    let contact = null
    let payload = null

    before(() => stub = sinon.stub(ContactService, 'edit'))

    beforeEach(() => {
      contact = {id: '1234'}
      uri = '/api/contact/' + contact.id
      payload = {name: 'dummy'}
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond to upstream errors properly', async function () {
      stub.rejects(new DatabaseError('aw snap!'))
      const res = await this.request.post(uri).send(payload).expect(500)
      assert.equal(res.body.error, 'aw snap!')
      assert.equal(res.body.type, 'DatabaseError')
    })

    it('should throw bad request with invalid name', async function () {
      delete payload.name
      const res = await this.request.post(uri).send(payload).expect(400)
      assert.equal(res.body.error, 'INVALID-NAME')
      assert.equal(res.body.type, 'BadRequest')
    })

    it('should respond with 404 if the contact wasnt found', async function () {
      stub.rejects(new NotFound())
      await this.request.post(uri).send(payload).expect(404)
    })

    it('should update the contact properly', async function () {
      stub.resolves(null)
      await this.request.post(uri).send(payload).expect(204, {})
    })

  })

  describe('#delete', () => {

    let stub = null
    let contact = null
    let uri = null

    before(() => stub = sinon.stub(ContactService, 'delete'))

    beforeEach(() => {
      contact = {id: '1234'}
      uri = '/api/contact/' + contact.id
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond to upstream errors properly', async function () {
      stub.rejects(new DatabaseError('aw snap!'))
      const res = await this.request.delete(uri).expect(500)
      assert.equal(res.body.error, 'aw snap!')
      assert.equal(res.body.type, 'DatabaseError')
    })

    it('should respond with 404 if the contact wasnt found', async function () {
      stub.rejects(new NotFound())
      await this.request.delete(uri).expect(404)
    })

    it('should delete the entity properly', async function () {
      stub.resolves()
      await this.request.delete(uri).expect(204, {})
    })

  })

  describe('#create', () => {

    let stub = null
    let uri = null
    let payload = null

    before(() => stub = sinon.stub(ContactService, 'create'))

    beforeEach(() => {
      uri = '/api/contact'
      payload = {name: 'hiya'}
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond to upstream errors properly', async function () {
      stub.rejects(new DatabaseError('aw snap!'))
      const res = await this.request.post(uri).send(payload).expect(500)
      assert.equal(res.body.error, 'aw snap!')
      assert.equal(res.body.type, 'DatabaseError')
    })

    it('should throw bad request with invalid name', async function () {
      delete payload.name
      const res = await this.request.post(uri).send(payload).expect(400)
      assert.equal(res.body.error, 'INVALID-NAME')
      assert.equal(res.body.type, 'BadRequest')
    })

    it('should create a contact properly', async function () {
      stub.resolves()
      await this.request.post(uri).send(payload).expect(204)
    })

  })
})
