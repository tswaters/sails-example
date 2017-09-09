'use strict'

exports.policies = {

  '*': ['localize', 'passport'],

  ContactController: {
    '*': ['localize', 'passport', 'logged-in']
  }
}
