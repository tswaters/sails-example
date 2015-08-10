'use strict';

var expect = chai.expect;

describe('contact list', function () {

  var $compile;
  var $rootScope;
  var $httpBackend;

  beforeEach(module('ContactList'));

  beforeEach(inject(function ($templateCache, _$httpBackend_, _$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', '/api/contact/').respond();
    $httpBackend.when('POST', '/api/contact/').respond();
    $httpBackend.when('POST', '/api/contact/1').respond();
    $httpBackend.when('DELETE', '/api/contact/1').respond();
  }));

  describe('service', function () {
    var ContactService;

    beforeEach(inject(function(_ContactService_){
      ContactService = _ContactService_;
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

    beforeEach(inject(function (_ContactService_, $controller, $q) {
      ContactService = _ContactService_;
      sinon.stub(ContactService, 'list', promiseStub);
      sinon.stub(ContactService, 'delete', promiseStub);
      sinon.stub(ContactService, 'create', promiseStub);
      sinon.stub(ContactService, 'edit', promiseStub);
      scope = $rootScope.$new();
      vm = $controller('ContactController', {scope: scope});
      function promiseStub () {
        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
      }
    }));

    afterEach(function () {
      ContactService.list.restore();
      ContactService.delete.restore();
      ContactService.create.restore();
      ContactService.edit.restore();
    })

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
      expect(vm.data.contact.name).to.equal('Test');
      expect(vm.state).to.equal('dummy');
    })

  });

  describe('view', function () {

    var formElement;

    beforeEach(inject(function ($templateCache) {
      // load the html, render ejs if necessary
      var viewHtml = $templateCache.get('views/contact/index');
      if (!viewHtml) {
        var template = $.ajax('base/views/contact/index.ejs', {async: false}).responseText;
        viewHtml = ejs.render(template, {
          // add stubs for things server views might need.
          __: function (tag) { return tag; }
        });
        $templateCache.put('views/contact/index', viewHtml);
      }
      // create a form element and apply a new scope, append to body.
      formElement = angular.element(viewHtml);
      $compile(formElement)($rootScope.$new());
      angular.element('body').append(formElement);
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
