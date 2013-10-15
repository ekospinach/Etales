require.config({
	paths: {
		angular: '../bower_components/angular/angular',
		angularRoute: '../bower_components/angular-route/angular-route',
		angularResource: '../bower_components/angular-resource/angular-resource',
		angularMocks: '../bower_components/angular-mocks/angular-mocks',
		text: '../bower_components/requirejs-text/text',
		angularXeditable: '../bower_components/angular-xeditable/dist/js/xeditable',
		socketIO: '../bower_components/socket.io-client/dist/socket.io',
//		jquery:'../bower_components/jquery/jquery',
		require:'../bower_components/requirejs/require',
		underscore:'../bower_components/underscore/underscore',
		angularBootstrap:'../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls'
	},
	baseUrl: 'js',
	shim: {
		'angular' : {'exports' : 'angular'},
		'angularRoute': ['angular'],
		'angularResource':['angular'],
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

require([
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
