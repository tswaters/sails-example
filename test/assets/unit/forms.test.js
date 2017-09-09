'use strict'

const expect = chai.expect

describe('form', () => {

  describe('service', () => {
    let FormService

    beforeEach(angular.mock.module('Forms'))

    beforeEach(inject(_FormService_ => {
      FormService = _FormService_
    }))

    it('should throw warning and return false if unable to find form', () => {
      expect(() => {FormService.isError({}, 'form', 'field') }).to.throw(Error)
    })

    it('should throw warning and return false if unable to find field', () => {
      expect(() => {FormService.isError({form: {}}, 'form', 'field') }).to.throw(Error)
    })

    it('should return false under expected conditions', () => {
      expect(FormService.isError({form: {field: {$pristine: true, $invalid: true} }}, 'form', 'field')).to.equal(false)
      expect(FormService.isError({form: {field: {$pristine: true, $invalid: false} }}, 'form', 'field')).to.equal(false)
      expect(FormService.isError({form: {field: {$pristine: false, $invalid: false} }}, 'form', 'field')).to.equal(false)
    })

    it('should return true under expected conditions', () => {
      expect(FormService.isError({form: {field: {$pristine: false, $invalid: true} }}, 'form', 'field')).to.equal(true)
    })



  })

})
