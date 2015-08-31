'use strict';

module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'ejs',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
