'use strict'

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'sinon', 'chai', 'jquery-expect', 'commonjs'],
    files: [
      'assets/vendor/jquery/dist/jquery.js',
      'assets/vendor/lodash/lodash.min.js',
      'assets/vendor/angular/angular.js',
      'assets/vendor/angular-mocks/angular-mocks.js',
      'node_modules/ejs/ejs.js',
      {pattern: 'views/**/*.ejs', included: false, served: true},
      'assets/js/*.js',
      'test/assets/**/*.js'
    ],
    exclude: [
    ],

    preprocessors: {
      'assets/js/*.js': ['coverage'],
      'test/assets/**/*.js': ['commonjs']
    },

    coverageReporter: {
      reporters: [
        {type: 'json', subdir: 'coverage-json/assets'},
        {type: 'text-summary', subdir: '.'}
      ],
      dir : 'reports'
    },

    reporters: ['dot', 'progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    browsers: ['Chrome' /*, 'Firefox', 'IE', 'Safari', 'Opera'*/],
    autoWatch: false,
    singleRun: true
  })
}
