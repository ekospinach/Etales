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
	'angularCookies'
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
		    $rootScope.decisionActive = "";
		    $rootScope.rootRetailerID = 1;
		    $rootScope.rootProducerID = 1;
		    $rootScope.rootPeriod = 0;
		    $rootScope.rootSeminar = "MAY";
		    $rootScope.rootContractUserID=1;

	        $rootScope.$on("$routeChangeStart", function (event, next, current) {
	            console.log('handle rootscope...');
	            if (!Auth.authorize(next.access)) {
	                if(!Auth.isLoggedIn()) $location.path('/login');
	                //else                  $location.path('/login');
	            }
	        });
		}]);
});
