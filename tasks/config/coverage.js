
'use strict';

module.exports = function (grunt) {

  // generates coverage report based upon json files.
  grunt.config.set('makeReport', {
    src: ['reports/coverage-json/**/*.json'],
    options : {
      type : ['lcov', 'html'],
      dir : 'reports/coverage',
      print : 'detail'
    }
  });

  grunt.config.set('karma', {
    test: {
      configFile: 'karma.conf.js'
    }
  });

  // runs mocha with istanbul instrumentation, outputs json file.
  grunt.config.set('mocha_istanbul', {
    test: {
      src: 'test', // a folder works nicely
      options: {
          istanbulOptions: ['-x', '**/config/**'],
          coverageFolder: 'reports/coverage-json/api',
          reportFormats: ['lcovonly']
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

};
