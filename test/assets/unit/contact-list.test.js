'use strict';

var templateHelper = require('../helpers/templateHelper');
var promiseHelper = require('../helpers/promiseHelper');
var expect = chai.expect;

describe('contact list', function () {

  describe('service', function () {
    var ContactService;
    var $httpBackend;

    beforeEach(angular.mock.module('ContactList'));

    beforeEach(inject(function(_ContactService_, _$httpBackend_){
      ContactService = _ContactService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', '/api/contact/').respond();
      $httpBackend.when('POST', '/api/contact/').respond();
      $httpBackend.when('POST', '/api/contact/1').respond();
      $httpBackend.when('DELETE', '/api/contact/1').respond();
    }));

    it('should call list properly', function () {
      ContactService.list()
      $httpBackend.flush();
      $httpBackend.expect('GET', '/api/contact/');
    });

    it('should call edit properly', function () {
      ContactService.edit(1, {})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/contact/1');
    });

    it('should call create properly', function () {
      ContactService.create({})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/contact/');
    });

    it('should call delete properly', function () {
      ContactService.delete(1)
      $httpBackend.flush();
      $httpBackend.expect('DELETE', '/api/contact/1');
    });
  });

  describe('controller', function () {
    var ContactService;
    var vm;
    var scope;

    beforeEach(angular.mock.module('ContactList'));

    beforeEach(inject(function (_ContactService_, $controller, $q, $rootScope) {
      ContactService = _ContactService_;
      var promiseStub = promiseHelper($q).resolve('data');
      sinon.stub(ContactService, 'list', promiseStub);
      sinon.stub(ContactService, 'delete', promiseStub);
      sinon.stub(ContactService, 'create', promiseStub);
      sinon.stub(ContactService, 'edit', promiseStub);
      scope = $rootScope.$new();
      scope.editCreateForm = {
        $setPristine: sinon.stub()
      }
      vm = $controller('ContactController', {$scope: scope});
    }));

    afterEach(function () {
      ContactService.list.restore();
      ContactService.delete.restore();
      ContactService.create.restore();
      ContactService.edit.restore();
    });

    it('should call fetch during initializaiton', function () {
      expect(ContactService.list.callCount).to.equal(1);
    });

    it('should call edit and fetch when calling edit', function () {
      vm.edit();
      scope.$root.$apply();
      expect(ContactService.edit.callCount).to.equal(1);
      expect(ContactService.list.callCount).to.equal(2);
    });

    it('should call delete and fetch when calling edit', function () {
      vm.delete();
      scope.$root.$apply();
      expect(ContactService.delete.callCount.length, 1);
      expect(ContactService.list.callCount.length, 2);
    });

    it('should call create and fetch when calling edit', function () {
      vm.create();
      scope.$root.$apply();
      expect(ContactService.create.callCount.length, 1);
      expect(ContactService.list.callCount.length, 2);
    });

    it('should set the state and contact properly when calling setState', function () {
      vm.setState('dummy', {name:'Test'});
      expect(scope.editCreateForm.$setPristine.calledOnce);
      expect(vm.data.contact.name).to.equal('Test');
      expect(vm.state).to.equal('dummy');
    })

  });

  describe('view', function () {

    var formElement;

    beforeEach(angular.mock.module('ContactList'));

    beforeEach(inject(function ($templateCache, $compile, $rootScope, $httpBackend) {
      formElement = templateHelper($templateCache, $compile, $rootScope, 'views/contact/index.ejs');
      angular.element('body').append(formElement);
      $httpBackend.when('GET', '/api/contact/').respond();
    }));

    afterEach(function () {
      // clean up the element from body.
      formElement.remove();
    });

    it('should show/hide no contacts div and contacts table based on lengths of contacts', function () {

      formElement.scope().$apply(function (scope) { scope.vm.data = {'contacts': []}; });
      $expect('#contacts').to.be.hidden();
      $expect('#no-contacts').not.to.be.hidden();

      formElement.scope().$apply(function (scope) { scope.vm.data = {'contacts': [{}]}; });
      $expect('#contacts').not.to.be.hidden();
      $expect('#no-contacts').to.be.hidden();

    });

    it('should show/hide elements based upon state', function () {

      formElement.scope().$apply(function (scope) { scope.vm.state = 'init'; });
      $expect('#edit-form').to.be.hidden();
      $expect('#delete-form').to.be.hidden();

      formElement.scope().$apply(function (scope) { scope.vm.state = 'edit'; });
      $expect('#edit-form').not.to.be.hidden();
      $expect('#delete-form').to.be.hidden();

      formElement.scope().$apply(function (scope) { scope.vm.state = 'create'; });
      $expect('#edit-form').not.to.be.hidden();
      $expect('#delete-form').to.be.hidden();

      formElement.scope().$apply(function (scope) { scope.vm.state = 'delete'; });
      $expect('#edit-form').to.be.hidden();
      $expect('#delete-form').not.to.be.hidden();

    });

  });

});
