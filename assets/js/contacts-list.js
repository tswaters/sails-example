
'use strict'

angular.module('ContactList', ['Forms'])
  .factory('ContactService', [
    '$http',
    function ($http) {
      const endPoint = '/api/contact/'
      return {
        list () {
          return $http.get(endPoint)
        },
        delete (id) {
          return $http.delete(endPoint + id)
        },
        create (data) {
          return $http.post(endPoint, data)
        },
        edit (id, data) {
          return $http.post(endPoint + id, data)
        }
      }
    }
  ])
  .controller('ContactController', [
    'ContactService',
    'FormService',
    '$scope',
    function (ContactsService, FormService, $scope) {
      const vm = this

      vm.isError = _.curry(FormService.isError)($scope)

      vm.setState = function (state, contact) {
        $scope.editCreateForm.$setPristine()
        vm.state = state
        vm.data.contact = angular.copy(contact)
      }

      vm.delete = function () {
        ContactsService.delete(vm.data.contact.id).then(vm.fetch)
      }

      vm.create = function () {
        ContactsService.create(vm.data.contact).then(vm.fetch)
      }

      vm.edit = function () {
        ContactsService.edit(vm.data.contact.id, vm.data.contact).then(vm.fetch)
      }

      vm.fetch = function () {
        ContactsService.list().then(e => {
          vm.data.contacts = e.data
          vm.data.contact = {}
        })
        vm.state = 'init'
      }

      vm.data = {
        contacts: [],
        contact: {}
      }
      vm.fetch()


    }
  ])
