'use strict'

const _ = require('lodash')
const rc = require('rc')
const buildDictionary = require('sails-build-dictionary')

module.exports = overrides => {
  const config = {}

  _.merge(config, {

    /**
     * Whoa who knew you could overload how things are loaded.
     * This is identical to sails/lib/hooks/moduleloader/index.js#L370-L377
     * But with once difference, "dont call bindToSails on the services!"
     * This allows for checking instanceof on returned objects.
     */
    moduleLoaderOverride (sails) {
      return {
        loadServices (cb) {
          buildDictionary.optional({
            dirname: sails.config.paths.services,
            filter: /(.+)\.(js|coffee|litcoffee)$/,
            depth: 1,
            caseSensitive: true
          }, cb)
        }
      }
    }
  })

  _.merge(config, overrides)
  _.merge(config, rc('sails'))
  return config
}
