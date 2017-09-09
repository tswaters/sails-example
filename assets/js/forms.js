'use strict'

angular.module('Forms', [])

  .service('FormService', [function () {

    return {
      isError ($scope, _form, _formField) {

        const form = $scope[_form]
        if (!form) {
          throw new Error('form ' + _form + ' not found')
        }

        const formField = form[_formField]
        if (!formField) {
          throw new Error('form field ' + _formField + ' not found')
        }

        return formField.$invalid && !formField.$pristine
      }
    }
  }])
