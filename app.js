'use strict'

const sails = require('sails')
const sailsConfig = require('./sails.config')

require('./lib/exceptions')

process.chdir(__dirname)
sails.lift(sailsConfig())
