'use strict';

module.exports = function (grunt) {
	grunt.registerTask('reports', ['compileAssets', 'linkAssets', 'mocha_istanbul:coverage', 'mochaTest:test']);
};
