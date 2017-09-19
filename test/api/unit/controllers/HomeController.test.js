
'use strict'

require('../../base.js')

const policyHooks = require('../../helpers/policy-hooks')

describe('HomeController', () => {

  before(policyHooks.before)
  beforeEach(policyHooks.beforeEach)
  after(policyHooks.after)

  describe('#home', () => {

    it('should render the page', function (next) {
      this.request.get('/en').expect(200).end(next)
    })
  })

})
