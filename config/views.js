/**
 * View Engine Configuration
 * (sails.config.views)
 *
 * Server-sent views are a classic and effective way to get your app up
 * and running. Views are normally served from controllers.  Below, you can
 * configure your templating language/framework of choice and configure
 * Sails' layout support.
 *
 * For more information on views and layouts, check out:
 * http://sailsjs.org/#/documentation/concepts/Views
 */
'use strict'

exports.views = {
  engine: 'ejs',
  layout: 'layout',

  locals: {

    createLink (page) {
      const __ = this.req.__
      const path = __(page + '.URL')
      const title = __(page + '.TITLE')
      const liClass = (new RegExp( '^' + path + '$')).test(this.req.path) ? 'active' : ''
      return `<li class="${liClass}"><a href="${path}">${title}</a>`
    }

  }

}
