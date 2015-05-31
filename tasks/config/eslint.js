
'use strict';

module.exports = function (grunt) {

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
        format: require('eslint-html-reporter'),
        outputFile: 'reports/eslint/report.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-eslint');

};
