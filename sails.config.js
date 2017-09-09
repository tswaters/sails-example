'use strict'

const _ = require('lodash')
const rc = require('rc')

module.exports = overrides => {
  const config = {}
  _.merge(config, overrides)
  _.merge(config, rc('sails'))
  return config
}
