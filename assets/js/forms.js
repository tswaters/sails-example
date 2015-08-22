angular.module('sails-example')

.service('FormService', function () {
  return {
    isError: function ($scope, _form, _formField) {

      var form = $scope[_form];
      if (!form) {
        console.warn('form', _form, 'not found')
        return false;
      }

      var formField = form[_formField];
      if (!formField) {
        console.warn('form field', _formField, 'not found')
        return false;
      }

      return formField.$invalid && !formField.$pristine;
    }
  }
})
