define([
	'angular',
	'filters',
	'services',
	'directives',
	'controllers',
	'angularRoute',
	'angularXeditable'
	], function (angular, filters, services, directives, controllers) {
		'use strict';
		return angular.module('myApp', [
			'ngRoute',
			'myApp.controllers',
			'myApp.filters',
			'myApp.services',
			'myApp.directives',
			'xeditable'
		]).run(function(editableOptions){
			editableOptions.theme = 'bs3';
		});
});
