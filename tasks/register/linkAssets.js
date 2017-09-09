

'use strict'

module.exports = grunt => {
  grunt.registerTask('linkAssets', [
    'sails-linker:devJs',
    'sails-linker:devStyles',
    'sails-linker:devJsJade',
    'sails-linker:devStylesJade'
  ])
}
