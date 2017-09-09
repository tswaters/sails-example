
'use strict'


module.exports = grunt => {
  grunt.registerTask('linkAssetsBuild', [
    'sails-linker:devJsRelative',
    'sails-linker:devStylesRelative',
    'sails-linker:devJsRelativeJade',
    'sails-linker:devStylesRelativeJade'
  ])
}
