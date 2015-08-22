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

module.exports.views = {
  engine: 'ejs',
  layout: 'layout',

  locals: {

    createLink: function (page) {
      var __ = this.req.__;
      var path = __(page + '.URL');
      var title = __(page + '.TITLE');
      var liClass = (new RegExp( '^' + path + '$')).test(this.req.path) ? 'active' : '';
      return '<li class="' + liClass + '"><a href="' + path +  '">' + title + '</a>';
    }

  }

};
