require.config({
	paths: {
		angular: '../../bower_components/angular/angular',
		jquery:'../../bower_components/jquery/jquery',
		require:'../../bower_components/requirejs/require',
		angularRoute: '../../bower_components/angular-route/angular-route',
		angularMocks: '../../bower_components/angular-mocks/angular-mocks',
		text: '../../bower_components/requirejs-text/text',
		angularXeditable:'../../bower_components/angular-xeditable/dist/js/xeditable',
		underscore:'../../bower_components/underscore/underscore',
		angularBootstrap:'../../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls'
		//bootstrap:'../../bower_components/bootstrap/dist/js/bootstrap'
	},
	baseUrl: 'app/js',
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularMocks': {
			deps:['angular'],
			'exports':'angular.mock'
		},
		'angularXeditable': ['angular'],
		'angularBootstrap':['jquery','angular']
	},
	priority: [
		"angular"
	]
});

// hey Angular, we're bootstrapping manually!
window.name = "NG_DEFER_BOOTSTRAP!";

require( [
	'angular',
	'app',
	'routes'
], function(angular, app, routes) {
	'use strict';
	var $html = angular.element(document.getElementsByTagName('html')[0]);

	angular.element().ready(function() {
		$html.addClass('ng-app');
		angular.bootstrap($html, [app['name']]);
	});
});
