
'use strict'

const path = require('path')
const i18n = require('i18n')
const {i18n: i18nConfig} = require('../../config/i18n')
const {templateFilesToInject} = require('../pipeline')

module.exports = grunt => {

  const gruntConfig = {}

  i18n.configure({
    locales: i18nConfig.locales,
    defaultLocale: i18nConfig.defaultLocale,
    updateFiles: false,
    objectNotation: true,
    directory: path.join(process.cwd(), 'config', 'locales')
  })

  i18nConfig.locales.forEach(locale => {
    gruntConfig[locale] = {
      src: templateFilesToInject,
      dest: '.tmp/public/templates/' + locale,
      ext: '.html',
      expand: true,
      flatten: true,
      options: {
        __ (key) {
          return i18n.__({locale, phrase: key})
        }
      }
    }
  })

  grunt.config.set('ejs', gruntConfig)
  grunt.loadNpmTasks('grunt-ejs')
}
