

'use strict';

module.exports = function (grunt) {

  grunt.config.set('mochaTest', {
    test: {
      options: {
        reporter: 'mochawesome',
        reporterOptions: {'reportDir': 'reports/mocha/'},
        //captureFile: 'reports/mocha/index.htm', // Optionally capture the reporter output to a file
        quiet: true, // Optionally suppress output to standard out (defaults to false)
        clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
      },
      src: ['test/unit/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');

};
