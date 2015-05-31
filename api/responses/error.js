/**
 * @module respones/error
 * @description Common error handler
 */

'use strict';

/**
 * Returns a common error handler for provided status codes.
 * @param {number} status status number to use (e.g., 404)
 * @param {string} statusName name of the status (e.g., Not found)
 */
module.exports = function (status, statusName) {

  /**
   * Returns middleware for handling errors.
   * - Logs the error,
   * - Removes data in prod,
   * - Renders a view (or JSON if requested)
   * @param {Object} data
   * @param {String|Object} options pass string to render specified view
   * @param {string} [options.view] can provide view, uses json if not provided.
   */
  return function (data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.error('Sending ' + status + ' ("' + statusName + '") response.', data);

    // Only include errors in response if application environment
    // is not set to 'production'.  In production, we shouldn't
    // send back any identifying information about errors.
    if (sails.config.environment === 'production') {
      data = undefined;
    }

    // If the user-agent wants JSON, always respond with JSON
    if (req.wantsJSON) {
      return res.status(status).jsonx(data);
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string') ? { view: options } : options || {};

    // If a view was not provided in options, default to 400.
    if (!options.view) {
      options.view = status;
    }

    options.title = statusName;

    return res.view(options.view, { data: data }, function (err, html) {

      res.status(status);

      // If a view error occured, fall back to JSON(P).
      if (err) {
        return res.jsonx(data);
      }

      return res.send(html);
    });
  };
};
