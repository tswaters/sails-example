/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */

'use strict'

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
exports.cssFilesToInject = [
  'styles/**/*.css'
].map(path => {
  return '.tmp/public/' + path
})


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
exports.jsFilesToInject = [

  // Dependencies like jQuery, or Angular are brought in here
  'vendor/jquery/dist/jquery.min.js',
  'vendor/angular/angular.min.js',
  'vendor/lodash/lodash.min.js',

  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
].map(path => {
  return '.tmp/public/' + path
})


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
exports.templateFilesToInject = [
  'templates/**/*.html',
  'templates/**/*.ejs'
].map(path => {
  return 'assets/' + path
})
