/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

'use strict'

exports.http = {
  middleware: {

    404: (req, res, next) => {
      next(new NotFound('GENERIC', [req.path]))
    },

    500: (err, req, res, next) => {
      if (res.headersSent) { return next(err) }
      if (err.status === 500) {
        sails.log.error(err)
      }
      res.notOk(err)
    },

    initializeLogger: (req, res, next) => {
      const getTransactionKey = req => req.session.id
      sails.hooks.pino.requestLogger(getTransactionKey)(
        req,
        res,
        () => {
          req.log.verbose(req)
          next()
        }
      )
    },

    order: [
      'www', 'favicon', // static files match first/quick
      'cookieParser', 'session', // parse out user info
      'bodyParser', 'handleBodyParserError', // handle body
      'initializeLogger',
      'router', // sails router
      '404', '500' // error handling
    ]
  }
}
