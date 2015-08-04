'use strict';

module.exports = function (grunt) {

	grunt.registerTask('reports', ['mocha_istanbul', 'karma', 'makeReport', 'mochaTest', 'eslint']);

};
