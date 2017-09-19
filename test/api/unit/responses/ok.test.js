
'use strict'

require('../../base.js')

describe('ok response', () => {

  before(() => {
    sails.get('/view-test/1', (req, res) => {
      res.ok({})
    })
    sails.get('/view-test/2', (req, res) => {
      res.ok({}, 'homepage')
    })
    sails.get('/view-test/3', (req, res) => {
      res.ok({}, {status: 204})
    })
  })

  after(() => {
    sails.router.unbind('/view-test/1')
    sails.router.unbind('/view-test/2')
    sails.router.unbind('/view-test/3')
  })

  it('should render json when route provides no view', function () {
    return this.request
      .get('/view-test/1')
      .set('Accept', 'text/html')
      .expect('Content-Type', /json/)
      .expect(200)
  })

  it('should render a route properly when string passed for view', function () {
    return this.request
      .get('/view-test/2')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200)
  })

  it('should send a 204 properly with content-type plain', function () {
    return this.request
      .get('/view-test/3')
      .set('Accept', 'text/html')
      .expect('Content-Type', /plain/)
      .expect(204)
  })

})
