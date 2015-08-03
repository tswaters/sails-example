'use strict';

var _ = require('lodash');
var buildDictionary = require('sails/node_modules/sails-build-dictionary');

module.exports = function (overrides) {
  var config = {};

  _.merge(config, {

    /**
     * Whoa who knew you could overload how things are loaded.
     * This is identical to sails/lib/hooks/moduleloader/index.js#L370-L377
     * But with once difference, "dont call bindToSails on the services!"
     * This allows for checking instanceof on returned objects.
     */
    moduleLoaderOverride: function (sails) {
      return {
        loadServices: function (cb) {
          buildDictionary.optional({
            'dirname': sails.config.paths.services,
            'filter': /(.+)\.(js|coffee|litcoffee)$/,
            'depth': 1,
            'caseSensitive': true
          }, cb);
        }
      };
    }
  });

  _.merge(config, overrides);
  _.merge(config, require('rc')('sails'));
  return config;
};
