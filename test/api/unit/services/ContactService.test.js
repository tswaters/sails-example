
'use strict'

const _ = require('lodash')
const {execStub} = require('../../helpers/database')
const assert = require('assert')

describe('Contact Service', () => {

  describe('#get', () => {
    let stub
    const payload = {
      user: 1,
      id: 1
    }
    before(() => {
      stub = execStub()
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond with DatabaseError if encountering database problems', next => {
      stub.callsArgWith(0, 'error')
      ContactService.get(payload, (err, contacts) => {
        assert(err instanceof ExceptionService.DatabaseError)
        assert.equal(err.originalError, 'error')
        assert.equal(contacts, null)
        next()
      })
    })
    it('should return a given contact properly', next => {
      stub.callsArgWith(0, null, null)
      ContactService.get(payload, (err, contact) => {
        assert(err instanceof ExceptionService.NotFound)
        assert.equal(contact, null)
        next()
      })
    })
    it('should return a given contact properly', next => {
      stub.callsArgWith(0, null, {})
      ContactService.get(payload, (err, contact) => {
        assert.equal(err, null)
        assert(_.isObject(contact))
        next()
      })
    })
  })

  describe('#list', () => {
    let stub
    const payload = {
      user: 1
    }
    before(() => {
      stub = execStub()
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond with DatabaseError if encountering database problems', next => {
      stub.callsArgWith(0, 'error')
      ContactService.list(payload, (err, contacts) => {
        assert(err instanceof ExceptionService.DatabaseError)
        assert.equal(err.originalError, 'error')
        assert.equal(contacts, null)
        next()
      })
    })
    it('should return contacts for a given user properly', next => {
      stub.callsArgWith(0, null, [])
      ContactService.list(payload, (err, contacts) => {
        assert.equal(err, null)
        assert.equal(contacts.length, 0)
        next()
      })
    })
  })

  describe('#create', () => {
    let stub
    const payload = {
      name: 'hiya',
      owner: 1
    }
    before(() => {
      stub = execStub()
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond with DatabaseError if encountering database problems', next => {
      stub.callsArgWith(0, 'error')
      ContactService.create(payload, (err, contact) => {
        assert(err instanceof ExceptionService.DatabaseError)
        assert.equal(err.originalError, 'error')
        assert.equal(contact, null)
        next()
      })
    })
    it('should create a contact properly', next => {
      stub.callsArgWith(0, null, {})
      ContactService.create(payload, err => {
        assert.equal(err, null)
        next()
      })
    })
  })

  describe('#edit', () => {
    let stub
    const payload = {
      id: 1,
      user: 1,
      data: {name: 'new-name'}
    }
    before(() => {
      stub = execStub()
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond with DatabaseError if encountering database problems', next => {
      stub.callsArgWith(0, 'error')
      ContactService.edit(payload, err => {
        assert(err instanceof ExceptionService.DatabaseError)
        assert.equal(err.originalError, 'error')
        next()
      })
    })
    it('should respond with NotFound if the contact was not found', next => {
      stub.callsArgWith(0, null, [])
      ContactService.edit(payload, err => {
        assert(err instanceof ExceptionService.NotFound)
        next()
      })
    })
    it('should edit the contact properly', next => {
      stub.callsArgWith(0, null, [{}])
      ContactService.edit(payload, err => {
        assert.equal(err, null)
        next()
      })
    })
  })

  describe('#delete', () => {
    let stub
    const payload = {
      id: 1,
      user: 1
    }
    before(() => {
      stub = execStub()
    })
    afterEach(() => {
      stub.reset()
    })
    after(() => {
      stub.restore()
    })
    it('should respond with DatabaseError if encountering database problems', next => {
      stub.callsArgWith(0, 'error')
      ContactService.delete(payload, err => {
        assert(err instanceof ExceptionService.DatabaseError)
        assert.equal(err.originalError, 'error')
        next()
      })
    })
    it('should respond with NotFound if the contact was not found', next => {
      stub.callsArgWith(0, null, [])
      ContactService.delete(payload, err => {
        assert(err instanceof ExceptionService.NotFound)
        next()
      })
    })
    it('should delete the contact properly', next => {
      stub.callsArgWith(0, null, [{}])
      ContactService.delete(payload, err => {
        assert.equal(err, null)
        next()
      })
    })
  })

})
