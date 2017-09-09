
'use strict'


module.exports = grunt => {
  grunt.registerTask('syncAssets', [
    'ejs',
    'less:dev',
    'sync:dev',
    'coffee:dev'
  ])
}
