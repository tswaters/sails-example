'use strict'

const {agent} = require('supertest')
const sails = require('sails')
const sailsConfig = require('../../sails.config')
const config = sailsConfig({environment: 'testing'})

before(function (done) {

  this.lifted = false
  sails.lift(config)

  sails.on('lifted', () => {
    this.lifted = true
    this.request = agent(sails.hooks.http.app)
    done()
  })

})

after(function (done) {

  if (!this.lifted) {
    return done(new Error([
      'Sails were lowered before the http app listening event was fired.',
      'All signs point to an exception in bootstrap via invalid test config.',
      'Try turning on logging to see what the problem is.',
    ].join('\n')))
  }

  sails.lower(done)
})

