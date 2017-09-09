'use strict'

const supertest = require('supertest')
const sails = require('sails')
const sailsConfig = require('../../sails.config')

const agent = supertest.agent
const config = sailsConfig({environment: 'testing'})

const {users, contacts} = require('./fixtures')
exports.fixtures = {users, contacts}

exports.uris = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/en/logout'
}

before(function (done) {
  const self = this
  let lifted = false
  sails.lift(config)

  sails.on('lifted', function () {
    lifted = true
    self.sails = this
    self.request = agent(sails.hooks.http.app)
    done()
  })

  sails.after('lower', e => {
    if (!lifted) {
      return done(new Error([
        'Sails were lowered before the http app listening event was fired.',
        'All signs point to an exception in bootstrap via invalid test config.',
        'Try turning on logging to see what the problem is.',
        e
      ].join('\n')))
    }
  })

})

after(done => {
  sails.lower(done)
})
