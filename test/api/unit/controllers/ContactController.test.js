
'use strict'

const _ = require('lodash')
const async = require('async')
const sinon = require('sinon')
const {fixtures, uris} = require('../../base.js')

describe('ContactController', () => {
  let request
  let contact
  let contacts
  let users
  let loginUser

  before(function () {
    request = this.request
    contacts = fixtures.contacts
    users = fixtures.users
    loginUser = _.first(fixtures.users)
    contact = _.first(contacts)
  })

  beforeEach(done => {
    async.series([
      function (next) {Contact.create(contacts).exec(next)},
      function (next) {User.create(users).exec(next)},
      function (next) {request.post(uris.login).send(loginUser).end(next) }
    ], done)
  })

  afterEach(done => {
    async.series([
      function (next) {request.get(uris.logout).redirects(2).end(next) },
      function (next) {Contact.destroy({}).exec(next)},
      function (next) {User.destroy({}).exec(next)}
    ], done)
  })

  describe('#home', () => {
    it('should throw unauthorized if user is not authorized', done => {
      async.series([
        function (next) {request.get(uris.logout).redirects(2).end(next)},
        function (next) {request.get('/en/contact').expect(401).end(next)}
      ], done)
    })
    it('should render the page', function (next) {
      this.request.get('/en/contact').expect(200).end(next)
    })
  })

  describe('#get', () => {
    let stub
    let uri
    let contact
    before(() => {
      contact = _.first(contacts)
      stub = sinon.stub(ContactService, 'get')
      uri = '/api/contact/' + contact.id
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond to upstream errors properly', next => {
      stub.callsArgWith(1, new ExceptionService.DatabaseError())
      request.get(uri).expect(500).end(next)
    })
    it('should return 404 for an invalid contact', next => {
      stub.callsArgWith(1, new ExceptionService.NotFound(), null)
      request.get(uri).expect(404).end(next)
    })
    it('should return the contact properly', next => {
      stub.callsArgWith(1, null, contact)
      request.get(uri).expect(200).end(next)
    })
  })

  describe('#list', () => {
    let stub
    let uri
    before(() => {
      stub = sinon.stub(ContactService, 'list')
      uri = '/api/contact'
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond to upstream errors properly', next => {
      stub.callsArgWith(1, new Error('error'))
      request.get(uri).expect(500).end(next)
    })
    it('should render a list of contacts properly', next => {
      stub.callsArgWith(1, null, [])
      request.get(uri).expect(200).end(next)
    })
  })

  describe('#edit', () => {
    let stub
    let uri
    let payload
    before(() => {
      stub = sinon.stub(ContactService, 'edit')
      uri = '/api/contact/' + contact.id
      payload = {name: 'dummy'}
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond to upstream errors properly', next => {
      stub.callsArgWith(1, new ExceptionService.DatabaseError())
      request.post(uri).send(payload).expect(500).end(next)
    })
    it('should respond with 404 if the contact wasnt found', next => {
      stub.callsArgWith(1, new ExceptionService.NotFound())
      request.post(uri).send(payload).expect(404).end(next)
    })
    it('should update the contact properly', next => {
      stub.callsArgWith(1, null)
      request.post(uri).send(payload).expect(204).end(next)
    })
  })

  describe('#delete', () => {
    let stub
    let uri
    before(() => {
      stub = sinon.stub(ContactService, 'delete')
      uri = '/api/contact/' + contact.id
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond to upstream errors properly', next => {
      stub.callsArgWith(1, new ExceptionService.DatabaseError())
      request.delete(uri).expect(500).end(next)
    })
    it('should respond with 404 if the contact wasnt found', next => {
      stub.callsArgWith(1, new ExceptionService.NotFound())
      request.delete(uri).expect(404).end(next)
    })
    it('should delete the entity properly', next => {
      stub.callsArgWith(1, null)
      request.delete(uri).expect(204).end(next)
    })
  })

  describe('#create', () => {
    let stub
    let uri
    let payload
    before(() => {
      stub = sinon.stub(ContactService, 'create')
      uri = '/api/contact'
      payload = {name: 'hiya'}
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond to upstream errors properly', next => {
      stub.callsArgWith(1, new ExceptionService.DatabaseError())
      request.post(uri).send(payload).expect(500).end(next)
    })
    it('should create a contact properly', next => {
      stub.callsArgWith(1, null, null)
      request.post(uri).send(payload).expect(204).end(next)
    })
  })
})
