'use strict';

module.exports = function (grunt) {
	grunt.registerTask('linkAssetsBuild', [
		'sails-linker:devJsRelative',
		'sails-linker:devStylesRelative',
		'sails-linker:devJsRelativeJade',
		'sails-linker:devStylesRelativeJade'
	]);
};
