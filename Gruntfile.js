/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt` or `sails lift`.
 * It's purpose is to load the Grunt tasks in your project's `tasks`
 * folder, and allow you to add and remove tasks as you see fit.
 * For more information on how this works, check out the `README.md`
 * file that was generated in your `tasks` folder.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks` directory instead.
 */

'use strict'

const includeAll = require('include-all')
const path = require('path')

module.exports = grunt => {

  /**
	 * Loads Grunt configuration modules from the specified
	 * relative path. These modules should export a function
	 * that, when run, should either load/configure or register
	 * a Grunt task.
	 */
  function loadTasks(relPath) {
    return includeAll({
      dirname: path.resolve(__dirname, relPath),
      filter: /(.+)\.js$/
    }) || {}
  }

  /**
	 * Invokes the function from a Grunt configuration module with
	 * a single argument - the `grunt` object.
	 */
  function invokeConfigFn(tasks) {
    for (const taskName in tasks) {
      if (tasks.hasOwnProperty(taskName)) {
        tasks[taskName](grunt)
      }
    }
  }




  // Load task functions
  const taskConfigurations = loadTasks('./tasks/config')
  const registerDefinitions = loadTasks('./tasks/register')

  // (ensure that a default task exists)
  if (!registerDefinitions.default) {
    registerDefinitions.default = function (grunt) { grunt.registerTask('default', []) }
  }

  // Run task functions to configure Grunt.
  invokeConfigFn(taskConfigurations)
  invokeConfigFn(registerDefinitions)

}
