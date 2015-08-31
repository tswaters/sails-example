'use strict';

module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'ejs',
		'less:dev',
		'sync:dev',
		'coffee:dev'
	]);
};
