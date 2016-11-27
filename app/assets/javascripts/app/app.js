(function() {
    'use strict';


    angular.module('myApp', ['LocalStorageModule',
        'ngRoute',
        'ui.router',
        'ngAnimate',
        'templates'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
        $stateProvider
        .state('index', {
            url: '/home',
            templateUrl: 'index.html',
            controller: 'IndexController',
            authenticate: true,
            revoke: false
        });
        $urlRouterProvider.otherwise('/home');

        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
      });
    }])


    angular.module('myApp').factory('httpRequestInterceptor',['localStorageService', function (localStorageService) {
        return {
            request: function (config) {
                if (localStorageService.get('current_user') !== null) {
                    if (config.url.includes('api/')) {            
                        config.headers['token'] = localStorageService.get('current_user').token;
                    }
                }
                config.headers['Accept'] = 'application/json;odata=verbose';

                return config;
            }
        };
    }]);


})();
