
angular.module('Login', [])

  .service('AuthService', [
    '$http',
    function ($http) {
      var endPoint = '/api/auth'
      return {
        login: function (data) {
          return $http.post(endPoint + '/login', data);
        },
        register: function (data) {
          return $http.post(endPoint + '/register', data);
        }
      }
    }
  ])

  .controller('AuthController', [
    'AuthService',
    function (AuthService) {
      var vm = this;

      vm.error = null;
      vm.data = {
        username: null,
        password: null
      };

      vm.register = function () {
        vm.error = null;
        AuthService.register(vm.data).then(
          function () {
            location.replace('/');
          },
          function (res) {
            vm.error = res.data;
          }
        );
      }

      vm.login = function () {
        vm.error = null;
        AuthService.login(vm.data).then(
          function () {
            location.replace('/');
          },
          function (res) {
            vm.error = res.data;
          }
        );
      }

    }
  ])
