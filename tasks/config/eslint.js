'use strict'

const eslintHtmlReporter = require('eslint-html-reporter')

module.exports = grunt => {
  grunt.config.set('eslint', {
    eslint: {
      src: [
        'api/**/*.js',
        'config/**/*.js',
        'assets/js/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ],
      options: {
        format: eslintHtmlReporter,
        outputFile: 'reports/eslint/report.html'
      }
    }
  })

  grunt.loadNpmTasks('grunt-eslint')

}
