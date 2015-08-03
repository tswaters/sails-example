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
  .controller('UserList', [
    '$scope', 'UserService',
    function ($scope, UserService) {

      $scope.setState = function (state, user) {
        $scope.state = state;
        $scope.data.user = angular.copy(user);
      };

      $scope.delete = function () {
        UserService.delete($scope.data.user.id).then($scope.fetch);
      };

      $scope.create = function () {
        UserService.create($scope.data.user).then($scope.fetch);
      };

      $scope.edit = function () {
        UserService.edit($scope.data.user.id, $scope.data.user).then($scope.fetch);
      };

      $scope.fetch = function () {
        UserService.list().then(function (e) {
          $scope.data.users = e.data;
          $scope.data.user = {};
        });
        $scope.state = 'init';
      };

      $scope.data = {
        users: [],
        user: {}
      };
      $scope.fetch();


    }
  ]);
