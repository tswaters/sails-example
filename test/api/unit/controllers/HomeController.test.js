
'use strict'

require('../../base.js')

describe('HomeController', () => {

  describe('#home', () => {
    it('should render the page', function (next) {
      this.request.get('/en').expect(200).end(next)
    })
  })

})
