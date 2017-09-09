
'use strict'


module.exports = grunt => {
  grunt.registerTask('prod', [
    'compileAssets',
    'concat',
    'uglify',
    'cssmin',
    'sails-linker:prodJs',
    'sails-linker:prodStyles',
    'sails-linker:prodJsJade',
    'sails-linker:prodStylesJade'
  ])
}
