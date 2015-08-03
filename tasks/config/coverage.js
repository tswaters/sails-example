
'use strict';

module.exports = function (grunt) {

  grunt.config.set('mocha_istanbul', {
    coverage: {
      src: 'test', // a folder works nicely
      options: {
          istanbulOptions: ['-x', '**/config/**'],
          coverageFolder: 'reports/coverage'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');

};
