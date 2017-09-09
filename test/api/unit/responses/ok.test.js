
'use strict'

require('../../base.js')

describe('ok response', () => {
  before(function () {
    this.sails.get('/view-test/1', (req, res) => {
      res.ok({})
    })
    this.sails.get('/view-test/2', (req, res) => {
      res.ok({}, 'homepage')
    })
    this.sails.get('/view-test/3', (req, res) => {
      res.ok({}, {status: 204})
    })
  })

  after(function () {
    this.sails.router.unbind('/view-test/1')
    this.sails.router.unbind('/view-test/2')
    this.sails.router.unbind('/view-test/3')
  })

  it('should render json when route provides no view', function (next) {
    this.request
      .get('/view-test/1')
      .set('Accept', 'text/html')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(next)
  })

  it('should render a route properly when string passed for view', function (next) {
    this.request
      .get('/view-test/2')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(next)
  })

  it('should send a 204 properly with content-type plain', function (next) {
    this.request
      .get('/view-test/3')
      .set('Accept', 'text/html')
      .expect('Content-Type', /plain/)
      .expect(204)
      .end(next)
  })

})
