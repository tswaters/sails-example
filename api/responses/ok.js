/**
 * @module responses/ok
 * @description 200 (OK) Response
 *
 * @example
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param {Object} data
 * @param {String|Object} options pass string to render specified view
 * @param {string} [options.view] can provide view, uses json if not provided.
 */

'use strict';

module.exports = function sendOK (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');

  // If second argument is a string, we take that to mean it refers to a view.
  // If it was omitted, use an empty object (`{}`)
  options = (typeof options === 'string') ? { view: options } : options || {};

  // guess the status is 200 if not provided.
  if (!options.status) {
    options.status = 200;
  }

  if (options.status === 204) {
    // FF bug, 'no element found' because it assumes xml when no content type.
    // express also "strips irrelevant headers" in the send routine; just die.
    return res.set('Content-Type', 'text/plain').status(204).end(null);
  }

  // Set status code
  res.status(options.status);

  // If appropriate, serve data as JSON(P)
  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  // If a view was provided in options, serve it.
  // Otherwise try to guess an appropriate view, or if that doesn't
  // work, just send JSON.
  if (options.view) {
    return res.view(options.view, data);
  }


  // If no second argument provided, try to serve the implied view,
  // but fall back to sending JSON(P) if no view can be inferred.
  else {
    return res.guessView({ data: data }, function () {
      return res.jsonx(data);
    });
  }

};
