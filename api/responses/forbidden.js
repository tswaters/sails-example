/**
 * @module responses/forbidden
 * @description
 * <p>403 (Forbidden) Handler</p>
 */
'use strict';

module.exports = require('./error')(403, 'Forbidden');
