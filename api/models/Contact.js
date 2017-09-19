'use strict'

module.exports = {
  attributes: {
    uuid: {
      primaryKey: true,
      type: 'string'
    },
    name: 'string',
    owner: {
      model: 'User'
    }
  }
}
