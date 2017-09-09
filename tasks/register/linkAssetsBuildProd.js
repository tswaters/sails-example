
'use strict'


module.exports = grunt => {
  grunt.registerTask('linkAssetsBuildProd', [
    'sails-linker:prodJsRelative',
    'sails-linker:prodStylesRelative',
    'sails-linker:prodJsRelativeJade',
    'sails-linker:prodStylesRelativeJade'
  ])
}
