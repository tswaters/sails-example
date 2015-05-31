
'use strict';

module.exports = function (grunt) {

  grunt.config.set('mocha_istanbul', {
    coverage: {
      src: 'test', // a folder works nicely
      options: {
          mask: 'unit/**/*.test.js',
          istanbulOptions: ['-x', '**/config/**'],
          coverageFolder: 'reports/coverage',
          quiet: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');

};
