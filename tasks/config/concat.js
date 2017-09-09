/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-concat
 */
'use strict'

const {jsFilesToInject, cssFilesToInject} = require('../pipeline')

module.exports = grunt => {

  grunt.config.set('concat', {
    js: {
      src: jsFilesToInject,
      dest: '.tmp/public/concat/production.js'
    },
    css: {
      src: cssFilesToInject,
      dest: '.tmp/public/concat/production.css'
    }
  })

  grunt.loadNpmTasks('grunt-contrib-concat')
}
