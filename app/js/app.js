define([
	'angular',
	'filters',
	'services',
	'directives',
	'angularRoute',
	'angularXeditable',
	'angularBootstrap',
	'underscore',
	'socketIO',
	'bootstrap',
	'angularLoadingBar',
	'angularCookies',
	'jqplot',
	'bubbleRenderer',
	'tree',
	'producerPopInfo',
	'retailerPopInfo'
	], function (angular, filters, services, directives, controllers) {
		'use strict';
		return angular.module('myApp', [
			'ngRoute',
			'myApp.filters',
			'myApp.services',
			'myApp.directives',
			'xeditable',
			'ui.bootstrap',
			'chieffancypants.loadingBar',
			'ngCookies'
		]).run(function(editableOptions){
			editableOptions.theme = 'bs3';
		}).run(['$rootScope', '$location','Auth', function ($rootScope, $location, Auth) {
		    $rootScope.currentPeriod = 0;
		    $rootScope.mapPeriod=0;
		    $rootScope.rootStartFrom=-2;
		    $rootScope.rootEndWith=0; 

		    /*controller*/
		    $rootScope.loginBody="bs-docs-home";
		    $rootScope.loginFooter="container";
		    $rootScope.loginCss="bs-docs-home";
		    $rootScope.loginLink="bs-masthead-links";
		    $rootScope.loginDiv="";

	        $rootScope.$on("$routeChangeStart", function (event, next, current) {
	            console.log('handle rootscope...');
	            if (!Auth.authorize(next.access)) {
	                if(!Auth.isLoggedIn()) $location.path('/login');
	                //else                  $location.path('/login');
	            }
	        });
		}]);
});
