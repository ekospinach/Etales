define(['angular', 'app'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'partials/partial1.html',
			controller: 'MyCtrl1'
		});
		$routeProvider.when('/view2', {
			templateUrl: 'partials/partial2.html',
			controller: 'MyCtrl2'
		});
		$routeProvider.when('/home',{
			templateUrl:'partials/home.html',
			controller:'HomeCtrl'
		});
		$routeProvider.when('/decision',{
			templateUrl:'partials/decision.html',
			controller:'DecisionCtrl'
		});
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});