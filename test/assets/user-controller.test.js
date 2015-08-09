'use strict';

var expect = chai.expect;

describe('user list', function () {

  var $compile;
  var $rootScope;
  var $httpBackend;

  beforeEach(module('UserList'));

  beforeEach(inject(function ($templateCache, _$httpBackend_, _$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $httpBackend.when('GET', '/api/user/').respond();
    $httpBackend.when('POST', '/api/user/').respond();
    $httpBackend.when('POST', '/api/user/1').respond();
    $httpBackend.when('DELETE', '/api/user/1').respond();
  }));

  describe('service', function () {
    var UserService;

    beforeEach(inject(function(_UserService_){
      UserService = _UserService_;
    }));

    it('should call list properly', function () {
      UserService.list()
      $httpBackend.flush();
      $httpBackend.expect('GET', '/api/user/');
    });

    it('should call edit properly', function () {
      UserService.edit(1, {})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/user/1');
    });

    it('should call create properly', function () {
      UserService.create({})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/user/');
    });

    it('should call delete properly', function () {
      UserService.delete(1)
      $httpBackend.flush();
      $httpBackend.expect('DELETE', '/api/user/1');
    });
  });

  describe('controller', function () {
    var UserService;
    var vm;
    var scope;

    beforeEach(inject(function (_UserService_, $controller, $q) {
      UserService = _UserService_;
      sinon.stub(UserService, 'list', promiseStub);
      sinon.stub(UserService, 'delete', promiseStub);
      sinon.stub(UserService, 'create', promiseStub);
      sinon.stub(UserService, 'edit', promiseStub);
      scope = $rootScope.$new();
      vm = $controller('UserController', {scope: scope});
      function promiseStub () {
        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
      }
    }));

    afterEach(function () {
      UserService.list.restore();
      UserService.delete.restore();
      UserService.create.restore();
      UserService.edit.restore();
    })

    it('should call fetch during initializaiton', function () {
      expect(UserService.list.callCount).to.equal(1);
    });

    it('should call edit and fetch when calling edit', function () {
      vm.edit();
      scope.$root.$apply();
      expect(UserService.edit.callCount).to.equal(1);
      expect(UserService.list.callCount).to.equal(2);
    });

    it('should call delete and fetch when calling edit', function () {
      vm.delete();
      scope.$root.$apply();
      expect(UserService.delete.callCount.length, 1);
      expect(UserService.list.callCount.length, 2);
    });

    it('should call create and fetch when calling edit', function () {
      vm.create();
      scope.$root.$apply();
      expect(UserService.create.callCount.length, 1);
      expect(UserService.list.callCount.length, 2);
    });

    it('should set the state and user properly when calling setState', function () {
      vm.setState('dummy', {name:'Test'});
      expect(vm.data.user.name).to.equal('Test');
      expect(vm.state).to.equal('dummy');
    })

  });

  describe('view', function () {

    var formElement;

    beforeEach(inject(function ($templateCache) {
      // load the html, render ejs if necessary
      var viewHtml = $templateCache.get('views/user/index');
      if (!viewHtml) {
        var template = $.ajax('base/views/user/index.ejs', {async: false}).responseText;
        viewHtml = ejs.render(template, {
          // add stubs for things server views might need.
          __: function (tag) { return tag; }
        });
        $templateCache.put('views/user/index', viewHtml);
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

    it('should show/hide no users div and users table based on lengths of users', function () {

      formElement.scope().$apply(function (scope) { scope.vm.data = {'users': []}; });
      $expect('#users').to.be.hidden();
      $expect('#no-users').not.to.be.hidden();

      formElement.scope().$apply(function (scope) { scope.vm.data = {'users': [{}]}; });
      $expect('#users').not.to.be.hidden();
      $expect('#no-users').to.be.hidden();

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
