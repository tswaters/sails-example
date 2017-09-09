'use strict'

const sails = require('sails')
const sailsConfig = require('./sails.config')

process.chdir(__dirname)
sails.lift(sailsConfig())
