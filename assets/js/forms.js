angular.module('Forms', [])

.service('FormService', [function () {

  return {
    isError: function ($scope, _form, _formField) {

      var form = $scope[_form];
      if (!form) {
        throw new Error('form ' + _form + ' not found')
      }

      var formField = form[_formField];
      if (!formField) {
        throw new Error('form field ' + _formField + ' not found')
      }

      return formField.$invalid && !formField.$pristine;
    }
  }
}])
