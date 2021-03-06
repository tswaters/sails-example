/**
 * Test environment settings
 */
'use strict'

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/
  models: {
    connection: 'disk',
    migrate: 'drop'
  },

  log: {
    level: 'silent'
  }

}
