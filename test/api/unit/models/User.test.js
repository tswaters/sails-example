
'use strict'

require('../../base.js')

const assert = require('assert')
const sinon = require('sinon')
const {execStub} = require('../../helpers/database')

describe('User model', () => {

  let stub = null

  before(() => stub = execStub())

  afterEach(() => stub.reset())

  after(() => stub.restore())

  describe('#verify', () => {

    let user = null
    let payload = null

    beforeEach(() => {
      user = new sails.models.user._model()
      payload = {username: 'test', password: 'test'}
      sinon.stub(user, 'verify')
    })

    it('should throw of user not found', async () => {
      stub.callsArgWith(0, null, null)
      try {
        await User.verify(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(err.status, 401)
        assert.equal(err.error, 'USER-NOT-FOUND')
      }
    })

    it('should throw if password incorrect', async () => {
      stub.callsArgWith(0, null, user)
      user.verify.resolves(false)
      try {
        await User.verify(payload)
        assert.ok(false)
      } catch (err) {
        assert.equal(err.status, 401)
        assert.equal(err.error, 'PASSWORD-INVALID')
      }
    })

    it('should return the user', async () => {
      stub.callsArgWith(0, null, user)
      user.verify.resolves(true)
      const _user = await User.verify(payload)
      assert.deepEqual(user, _user)
    })

  })

})
