
'use strict'


module.exports = grunt => {
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'ejs',
    'less:dev',
    'copy:dev',
    'coffee:dev'
  ])
}
