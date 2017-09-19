
'use strict'

const sinon = require('sinon')
const authentication = require('../../../lib/authentication')
const loggedIn = require('../../../lib/logged-in')

// stub out the policies.
// auth is a global policy that is run everywhere
// use that opporunity to populate session, etc.

exports.before = function () {
  this.loggedInStub = sinon.stub(loggedIn, 'middleware', (req, res, next) => next())
  this.authenticationStub = sinon.stub(authentication, 'middleware', (req, res, next) => {
    if (this.locals.session) {
      for (const [key, value] of Object.entries(this.locals.session)) {
        req.session[key] = value
      }
    }
    if (this.locals.locals) {
      for (const [key, value] of Object.entries(this.locals.locals)) {
        res.locals[key] = value
      }
    }
    next()
  })
}

exports.beforeEach = function(done) {
  this.locals = {
    session: null,
    locals: null
  }
  done()
}

exports.after = function() {
  this.loggedInStub.restore()
  this.authenticationStub.restore()
}
