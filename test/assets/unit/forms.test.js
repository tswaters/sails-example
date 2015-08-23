var expect = chai.expect;

describe('form', function () {

  describe('service', function () {
    var FormService;

    beforeEach(angular.mock.module('Forms'));

    beforeEach(inject(function (_FormService_) {
      FormService = _FormService_;
    }));

    it('should throw warning and return false if unable to find form', function () {
      expect(function () {FormService.isError({}, 'form', 'field'); }).to.throw(Error);
    });

    it('should throw warning and return false if unable to find field', function () {
      expect(function () {FormService.isError({form: {}}, 'form', 'field'); }).to.throw(Error);
    });

    it('should return false under expected conditions', function () {
      expect(FormService.isError({form: {field: {$pristine: true, $invalid: true} }}, 'form', 'field')).to.equal(false);
      expect(FormService.isError({form: {field: {$pristine: true, $invalid: false} }}, 'form', 'field')).to.equal(false);
      expect(FormService.isError({form: {field: {$pristine: false, $invalid: false} }}, 'form', 'field')).to.equal(false);
    });

    it('should return true under expected conditions', function () {
      expect(FormService.isError({form: {field: {$pristine: false, $invalid: true} }}, 'form', 'field')).to.equal(true);
    })



  });

});
