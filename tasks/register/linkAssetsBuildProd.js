'use strict';

module.exports = function (grunt) {
	grunt.registerTask('linkAssetsBuildProd', [
		'sails-linker:prodJsRelative',
		'sails-linker:prodStylesRelative',
		'sails-linker:prodJsRelativeJade',
		'sails-linker:prodStylesRelativeJade'
	]);
};
