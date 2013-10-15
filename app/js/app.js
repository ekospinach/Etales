define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	//'$rootScope',
	'angularRoute',
	'angularXeditable',
	'angularBootstrap'
	], function (angular, filters, services, directives, controllers) {
		'use strict';
		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers',
			'myApp.filters',
			'myApp.services',
			'myApp.directives',
			'xeditable',
			//'$rootScope',
			'ui.bootstrap'
		]).run(function(editableOptions){
			editableOptions.theme = 'bs3';
		}).run(['$rootScope', '$location', function ($rootScope, $location) {
		    $rootScope.decisionActive = "";
		    $rootScope.rootProducerID = 1;
		    $rootScope.rootPeriod = 0;
		    $rootScope.rootSeminar = "MAY";
		}]);
});
