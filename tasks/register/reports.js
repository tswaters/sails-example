
'use strict'


module.exports = grunt => {

  grunt.registerTask('reports', ['mocha_istanbul', 'karma', 'makeReport', 'eslint'])

}
