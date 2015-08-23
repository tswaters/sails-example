'use strict';

var templateHelper = require('../helpers/templateHelper');
var promiseHelper = require('../helpers/promiseHelper');
var expect = chai.expect;

describe('login', function () {

  describe('service', function () {
    var $httpBackend;
    var AuthService;

    beforeEach(angular.mock.module('Login'));

    beforeEach(inject(function (_$httpBackend_, _AuthService_) {
      AuthService = _AuthService_;
      $httpBackend = _$httpBackend_;
      $httpBackend.when('POST', '/api/auth/login').respond();
      $httpBackend.when('POST', '/api/auth/register').respond();
    }));

    it('should call login properly', function () {
      AuthService.login({})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/auth/login');
    });

    it('should call register properly', function () {
      AuthService.register({})
      $httpBackend.flush();
      $httpBackend.expect('POST', '/api/auth/register');
    });

  });

  describe('controller', function () {

    var $q;
    var AuthService;
    var scope;
    var vm;

    beforeEach(angular.mock.module('Login', function ($provide) {
      $provide.value('$window', {location: {replace: angular.noop}});
    }));

    beforeEach(inject(function ($controller, $rootScope, _AuthService_, _$q_) {
      $q = _$q_;
      AuthService = _AuthService_;
      scope = $rootScope.$new();
      vm = $controller('AuthController', {$scope: scope});
    }));

    it('should call login with current state data', function () {
      var args;

      // test that service is called properly during resolution
      sinon.stub(AuthService, 'login', promiseHelper($q).resolve('data'));
      scope.$apply(function () {
        vm.data = {username: 'test1', password: 'test2'}
        vm.login();
      });
      expect(AuthService.login.callCount).to.equal(1);
      args = AuthService.login.firstCall.args[0];
      expect(args.username).to.equal('test1');
      expect(args.password).to.equal('test2');
      AuthService.login.restore();

      // test that error comes back during a rejection
      sinon.stub(AuthService, 'login', promiseHelper($q).reject({data: 'reject'}));
      scope.$apply(function () {
        vm.data = {username: 'test1', password: 'test2'}
        vm.login();
      });
      expect(AuthService.login.callCount).to.equal(1);
      args = AuthService.login.firstCall.args[0];
      expect(args.username).to.equal('test1');
      expect(args.password).to.equal('test2');
      expect(vm.error).to.equal('reject');
      AuthService.login.restore();

    });

    it('should call register with current state data', function () {
      var args;

      // test that service is called properly during resolution
      sinon.stub(AuthService, 'register', promiseHelper($q).resolve('data'));
      scope.$apply(function () {
        vm.data = {username: 'test1', password: 'test2'}
        vm.register();
      });
      expect(AuthService.register.callCount).to.equal(1);
      args = AuthService.register.firstCall.args[0];
      expect(args.username).to.equal('test1');
      expect(args.password).to.equal('test2');
      AuthService.register.restore();

      // test that error comes back during a rejection
      sinon.stub(AuthService, 'register', promiseHelper($q).reject({data: 'reject'}));
      scope.$apply(function () {
        vm.data = {username: 'test1', password: 'test2'}
        vm.register();
      });
      expect(AuthService.register.callCount).to.equal(1);
      args = AuthService.register.firstCall.args[0];
      expect(args.username).to.equal('test1');
      expect(args.password).to.equal('test2');
      expect(vm.error).to.equal('reject');
      AuthService.register.restore();

    });

  });

  describe('view - login', function () {

    var formElement;
    var loginSpy

    beforeEach(angular.mock.module('Login', function($controllerProvider) {
      // stub out the controller
      $controllerProvider.register('AuthController', function () {
        this.login = loginSpy = sinon.spy();
        this.data = {};
      });
    }));

    beforeEach(inject(function ($templateCache, $compile, $rootScope) {
      formElement = templateHelper($templateCache, $compile, $rootScope, 'views/auth/login.ejs');
      angular.element('body').append(formElement);
    }));

    afterEach(function () {
      // clean up the element from body.
      formElement.remove();
    });

    it('should call login when the login button is pressed', function () {
      angular.element('#login').click();
      expect(loginSpy.called).to.equal(true);
    });

    it('should update scope with values in the form', function () {
      formElement.scope().$apply(function () {
        angular.element('#username').val('username').trigger('input');
        angular.element('#password').val('password').trigger('input');
      });
      expect(formElement.scope().vm.data.username).to.equal('username');
      expect(formElement.scope().vm.data.password).to.equal('password');
    });
  });

  describe('view - register', function () {
    var formElement;
    var registerSpy

    beforeEach(angular.mock.module('Login', function($controllerProvider) {
      // stub out the controller
      $controllerProvider.register('AuthController', function () {
        this.register = registerSpy = sinon.spy();
      });
    }));

    beforeEach(inject(function ($templateCache, $compile, $rootScope) {
      formElement = templateHelper($templateCache, $compile, $rootScope, 'views/auth/register.ejs');
      angular.element('body').append(formElement);
    }));

    afterEach(function () {
      // clean up the element from body.
      formElement.remove();
    });

    it('should call login when the login button is pressed', function () {
      angular.element('#register').click();
      expect(registerSpy.called).to.equal(true);
    });

    it('should update scope with values in the form', function () {
      formElement.scope().$apply(function () {
        angular.element('#username').val('username').trigger('input');
        angular.element('#password').val('password').trigger('input');
      });
      expect(formElement.scope().vm.data.username).to.equal('username');
      expect(formElement.scope().vm.data.password).to.equal('password');
    });

  });

});
