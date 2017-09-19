'use strict'

exports.policies = {

  '*': ['localize', 'authentication'],

  ContactController: {
    '*': ['localize', 'authentication', 'logged-in']
  }
}
