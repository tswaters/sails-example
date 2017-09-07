'use strict';

var path = require('path');
var i18n = require('i18n');
var i18nConfig = require('../../config/i18n').i18n;

module.exports = function (grunt) {

  var gruntConfig = {};

  i18n.configure({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    updateFiles: false,
    objectNotation: true,
    directory: path.join(process.cwd(), 'config', 'locales')
  });

  i18nConfig.locales.forEach(function (locale) {
    gruntConfig[locale] = {
      src: require('../pipeline').templateFilesToInject,
      dest: '.tmp/public/templates/' + locale,
      ext: '.html',
      expand: true,
      flatten: true,
      options: {
        __: function (key) {
          return i18n.__({locale: locale, phrase: key});
        }
      }
    };
  });

  grunt.config.set('ejs', gruntConfig)
  grunt.loadNpmTasks('grunt-ejs');
};
