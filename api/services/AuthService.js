/**
 * Auth Service
 *
 * @description
 * Handles the heavy lifting related to passport integreation
 */
'use strict'

const passport = require('passport')
const {Strategy: LocalStrategy} = require('passport-local')

passport.use(new LocalStrategy(
  ((username, password, done) => {
    User.verify({username, password}, done)
  })
))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findOne(id).exec(done)
})

module.exports = passport
