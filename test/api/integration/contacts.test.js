
'use strict'

const assert = require('assert')
const _ = require('lodash')
const fixtures = require('../fixtures')

require('../base')

describe('contact integration', () => {

  let loginUser
  let loginUserContacts

  before(async () => {
    loginUser = _.first(fixtures.users)
    loginUserContacts = _.filter(fixtures.contacts, {owner: loginUser.uuid})
    await User.create(fixtures.users)
    await Contact.create(fixtures.contacts)
  })

  after(async () => {
    await User.destroy({})
    await Contact.destroy({})
  })

  it('should pass integration test', async function () {

    this.timeout(15000)
    this.slow(5000)

    let res = null
    let newContactUuid = null

    // attempt to visit contacts, returns 401
    res = await this.request.get('/en/contact').expect(401)
    assert.equal(res.body.error, 'USER-NOT-LOGGED-IN')

    // attempt bad post to login, no password; 400
    res = await this.request.post('/api/auth/login').send({username: 'invalid'}).expect(400)
    assert.equal(res.body.error, 'INVALID-PASSWORD')

    // attempt bad post to login, no username; 400
    res = await this.request.post('/api/auth/login').send({password: 'invalid'}).expect(400)
    assert.equal(res.body.error, 'INVALID-USERNAME')

    // attempt to login with invalid user, 401
    res = await this.request.post('/api/auth/login').send({username: 'invalid', password: 'invalid'}).expect(401)
    assert.equal(res.body.error, 'USER-NOT-FOUND')

    // attempt to login with invalid password, 401
    res = await this.request.post('/api/auth/login').send({username: loginUser.username, password: 'invalid'}).expect(401)
    assert.equal(res.body.error, 'PASSWORD-INVALID')

    // attempt to register with existing user, 400
    res = await this.request.post('/api/auth/register').send({username: loginUser.username, password: 'password'}).expect(400)
    assert.equal(res.body.error, 'USER-ALREADY-EXISTS')

    // register with new user, 200
    res = await this.request.post('/api/auth/register').send({username: 'new-user', password: 'password'}).expect(200)

    // visit contacts page, 200
    res = await this.request.get('/en/contact').expect(200)

    // create contact without name, 400
    res = await this.request.post('/api/contact').send({}).expect(400)
    assert.equal(res.body.error, 'INVALID-NAME')

    // create a contact, 200
    res = await this.request.post('/api/contact').send({name: 'Tyler'}).expect(204)
    assert.deepEqual(res.body, {})

    // list should show 1 contact
    res = await this.request.get('/api/contact').expect(200)
    assert.equal(res.body.length, 1)
    assert.equal(res.body[0].name, 'Tyler')
    newContactUuid = res.body[0].id

    // attempt to update with missing name
    res = await this.request.post(`/api/contact/${newContactUuid}`).send({name: ''}).expect(400)
    assert.equal(res.body.error, 'INVALID-NAME')

    // update the contact
    res = await this.request.post(`/api/contact/${newContactUuid}`).send({name: 'Mr. Waters'}).expect(204)
    assert.deepEqual(res.body, {})

    // list should show new name
    res = await this.request.get(`/api/contact/${newContactUuid}`).expect(200)
    assert.equal(res.body.id, newContactUuid)
    assert.equal(res.body.name, 'Mr. Waters')

    // logout, verify can't view contacts
    res = await this.request.get('/en/logout').redirects(2).expect(200)
    res = await this.request.get('/en/contact').expect(401)

    // login as existing fixture user
    res = await this.request.post('/api/auth/login').send(loginUser)
    assert.deepEqual(res.body, {})

    // attempt to fetch contact created above, 404
    res = await this.request.get(`/api/contact/${newContactUuid}`).expect(404)

    // attempt to delete contact created above, 404
    res = await this.request.delete(`/api/contact/${newContactUuid}`).expect(404)

    // attempt to update contact created above, 404
    res = await this.request.post(`/api/contact/${newContactUuid}`).send({name: 'Invalid'}).expect(404)

    // create a new contact, 204
    res = await this.request.post('/api/contact').send({name: 'Tyler'}).expect(204)

    // fetch list, should be fixtures + 1 length
    res = await this.request.get('/api/contact').expect(200)
    assert.equal(res.body.length, loginUserContacts.length + 1)
    assert.equal(res.body[loginUserContacts.length].name, 'Tyler')
    newContactUuid = res.body[loginUserContacts.length].id

    // edit contact, 204
    res = await this.request.post(`/api/contact/${newContactUuid}`).send({name: 'Mr. Waters'}).expect(204)

    // fetch contacts, 200
    res = await this.request.get(`/api/contact/${newContactUuid}`).expect(200)
    assert.deepEqual(res.body.name, 'Mr. Waters')
    assert.deepEqual(res.body.id, newContactUuid)

    // logout
    res = await this.request.get('/en/logout').redirects(2).expect(200)

  })


})
