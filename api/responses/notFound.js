/**
 * @module responses/notFound
 * @description
 * <p>404 (Not Found) Handler</p>
 * <p><strong>NOTE:</strong></p>
 * <p>If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.</p>
 */

'use strict';
module.exports = require('./error')(404, 'Not Found');
