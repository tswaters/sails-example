
'use strict'

require('../../base.js')

const {execStub} = require('../../helpers/database')
const assert = require('assert')

describe('Contact Service', () => {

  describe('#get', () => {

    let stub = null
    let payload = null

    before(() => stub = execStub())

    beforeEach(() => {
      payload = {
        user: 1,
        id: 1
      }
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond with DatabaseError if encountering database problems', async () => {
      stub.callsArgWith(0, new Error('aw snap!'))
      try {
        await ContactService.get(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof DatabaseError)
        assert.equal(err.error, 'aw snap!')
      }
    })

    it('should return a given contact properly', async () => {
      stub.callsArgWith(0, null, null)
      try {
        await ContactService.get(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof NotFound)
      }
    })

    it('should return a given contact properly', async () => {
      stub.callsArgWith(0, null, {id: '1234'})
      const contact = await ContactService.get(payload)
      assert.deepEqual(contact, {id: '1234'})
    })

  })

  describe('#list', () => {

    let stub = null
    let payload = null

    before(() => stub = execStub())

    beforeEach(() => {
      payload = {user: 1}
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond with DatabaseError if encountering database problems', async () => {
      stub.callsArgWith(0, new Error('aw snap!'))
      try {
        await ContactService.list(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof DatabaseError)
        assert.equal(err.error, 'aw snap!')
      }
    })

    it('should return contacts for a given user properly', async () => {
      stub.callsArgWith(0, null, [{id: '1234'}])
      const contacts = await ContactService.list(payload)
      assert.deepEqual(contacts, [{id: '1234'}])
    })

  })

  describe('#create', () => {
    let stub = null
    let payload = null

    before(() => stub = execStub())

    beforeEach(() => {
      payload = {name: 'hiya', owner: 1}
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond with DatabaseError if encountering database problems', async () => {
      stub.callsArgWith(0, new Error('aw snap!'))
      try {
        await ContactService.create(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof DatabaseError)
        assert.equal(err.error, 'aw snap!')
      }
    })

    it('should create a contact properly', async () => {
      stub.callsArgWith(0, null, {id: '1234'})
      const result = await ContactService.create(payload)
      assert.deepEqual(result, {id: '1234'})
    })

  })

  describe('#edit', () => {
    let stub = null
    let payload = null

    before(() => stub = execStub())

    beforeEach(() => {
      payload = {
        id: 1,
        user: 1,
        data: {name: 'new-name'}
      }
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond with DatabaseError if encountering database problems', async () => {
      stub.callsArgWith(0, new Error('aw snap!'))
      try {
        await ContactService.edit(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof DatabaseError)
        assert.equal(err.error, 'aw snap!')
      }
    })

    it('should respond with NotFound if the contact was not found', async () => {
      stub.callsArgWith(0, null, [])
      try {
        await ContactService.edit(payload)
      } catch (err) {
        assert(err instanceof NotFound)
      }
    })

    it('should edit the contact properly', async () => {
      stub.callsArgWith(0, null, [{}])
      await ContactService.edit(payload)
    })

  })

  describe('#delete', () => {
    let stub
    let payload = null

    before(() => stub = execStub())

    beforeEach(() => {
      payload = {
        id: 1,
        user: 1
      }
    })

    afterEach(() => stub.reset())

    after(() => stub.restore())

    it('should respond with DatabaseError if encountering database problems', async () => {
      stub.callsArgWith(0, new Error('aw snap!'))
      try {
        await ContactService.delete(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof DatabaseError)
        assert.equal(err.error, 'aw snap!')
      }
    })

    it('should respond with NotFound if the contact was not found', async () => {
      stub.callsArgWith(0, null, [])
      try {
        await ContactService.delete(payload)
        assert.ok(false)
      } catch (err) {
        assert(err instanceof NotFound)
      }
    })

    it('should delete the contact properly', async () => {
      stub.callsArgWith(0, null, [{}])
      await ContactService.delete(payload)
    })

  })

})
