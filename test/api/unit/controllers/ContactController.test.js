
'use strict'

const _ = require('lodash')
const assert = require('assert')
const sinon = require('sinon')
const {fixtures, uris} = require('../../base.js')

require('sinon-as-promised')

describe('ContactController', () => {

  let users
  let loginUser

  before(() => {
    users = fixtures.users
    loginUser = _.first(fixtures.users)
  })

  beforeEach(async function () {
    await User.create(users)
    await this.request.post(uris.login).send(loginUser)
  })

  afterEach(async function () {
    await this.request.get(uris.logout).redirects(2)
    await User.destroy({})
  })

  describe('#home', () => {

    it('should throw unauthorized if user is not authorized', async function () {
      await this.request.get(uris.logout).redirects(2)
      await this.request.get('/en/contact').expect(401)
    })

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
      stub.rejects(new ExceptionService.DatabaseError('aw snap!'))
      const res = await this.request.get(uri).expect(500)
      assert.equal(res.body.originalError, 'aw snap!')
    })

    it('should return 404 for an invalid contact', async function () {
      stub.rejects(new ExceptionService.NotFound())
      await this.request.get(uri).expect(404)
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
      stub.rejects(new ExceptionService.DatabaseError('aw snap!'))
      const res = await this.request.get(uri).expect(500)
      assert.equal(res.body.originalError, 'aw snap!')
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
      stub.rejects(new ExceptionService.DatabaseError('aw snap!'))
      const res = await this.request.post(uri).send(payload).expect(500)
      assert.equal(res.body.originalError, 'aw snap!')
    })

    it('should respond with 404 if the contact wasnt found', async function () {
      stub.rejects(new ExceptionService.NotFound())
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
      stub.rejects(new ExceptionService.DatabaseError('aw snap!'))
      const res = await this.request.delete(uri).expect(500)
      assert.equal(res.body.originalError, 'aw snap!')
    })

    it('should respond with 404 if the contact wasnt found', async function () {
      stub.rejects(new ExceptionService.NotFound())
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
      stub.rejects(new ExceptionService.DatabaseError('aw snap!'))
      const res = await this.request.post(uri).send(payload).expect(500)
      assert.equal(res.body.originalError, 'aw snap!')
    })

    it('should create a contact properly', async function () {
      stub.resolves()
      await this.request.post(uri).send(payload).expect(204)
    })

  })
})
