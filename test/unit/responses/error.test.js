'use strict';

var expect = require('chai').expect;
require('../../base.js');

describe('error response', function () {

  before(function () {
    this.sails.get('/error-test/1', function (req, res) {
      res.serverError({'aw': 'snap'});
    });
    this.sails.get('/error-test/2', function (req, res) {
      res.serverError({'aw': 'snap'}, 'bad-view');
    });
  });

  after(function () {
    this.sails.router.unbind('/error-test/1');
    this.sails.router.unbind('/error-test/2');
  });

  it('should not include data in the response when environment is production', function (next) {
    var self = this;
    this.sails.config.environment = 'production';
    this.request
      .get('/error-test/1')
      .expect(500)
      .end(function (err, res) {
        expect(res.text).to.equal('');
        self.sails.config.environment = 'testing';
        next(err, res);
      });
  });

  it('should render json when the view isnt found', function (next) {
    this.request
      .get('/error-test/2')
      .set('Accept', 'text/html')
      .expect(500)
      .expect('Content-Type', /json/)
      .end(next);
  });

});
