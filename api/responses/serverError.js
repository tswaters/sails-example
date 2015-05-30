/**
 * @module responses/serverError
 * @description
 * <p>500 (Server Error) Response</p>
 * <p><strong>NOTE:</strong></p>
 * <p>If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.</p>
 */

'use strict';
module.exports = require('./error')(500, 'Server Error');
