'use strict';

angular.module('UserList', [])
  .factory('UserService', [
    '$http',
    function ($http) {
      var endPoint = '/api/user/';
      return {
        list: function () {
          return $http.get(endPoint);
        },
        delete: function (id) {
          return $http.delete(endPoint + id);
        },
        create: function (data) {
          return $http.post(endPoint, data);
        },
        edit: function (id, data) {
          return $http.post(endPoint + id, data);
        }
      };
    }
  ])
  .controller('UserController', [
    'UserService',
    function (UserService) {
      var vm = this;

      vm.setState = function (state, user) {
        vm.state = state;
        vm.data.user = angular.copy(user);
      };

      vm.delete = function () {
        UserService.delete(vm.data.user.id).then(vm.fetch);
      };

      vm.create = function () {
        UserService.create(vm.data.user).then(vm.fetch);
      };

      vm.edit = function () {
        UserService.edit(vm.data.user.id, vm.data.user).then(vm.fetch);
      };

      vm.fetch = function () {
        UserService.list().then(function (e) {
          vm.data.users = e.data;
          vm.data.user = {};
        });
        vm.state = 'init';
      };

      vm.data = {
        users: [],
        user: {}
      };
      vm.fetch();


    }
  ]);
