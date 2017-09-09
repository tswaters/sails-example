'use strict'

angular.module('Login', ['Forms'])

  .service('AuthService', [
    '$http',
    function ($http) {
      const endPoint = '/api/auth'
      return {
        login (data) {
          return $http.post(endPoint + '/login', data)
        },
        register (data) {
          return $http.post(endPoint + '/register', data)
        }
      }
    }
  ])

  .controller('AuthController', [
    'AuthService',
    'FormService',
    '$scope',
    '$window',
    function (AuthService, FormService, $scope, $window) {
      const vm = this

      vm.error = null
      vm.data = {
        username: null,
        password: null
      }

      vm.isError = _.curry(FormService.isError)($scope)

      vm.register = function () {
        vm.error = null
        AuthService.register(vm.data).then(
          () => {
            $window.location.replace('/')
          },
          res => {
            vm.error = res.data
          }
        )
      }

      vm.login = function () {
        vm.error = null
        AuthService.login(vm.data).then(
          () => {
            $window.location.replace('/')
          },
          res => {
            vm.error = res.data
          }
        )
      }

    }
  ])
