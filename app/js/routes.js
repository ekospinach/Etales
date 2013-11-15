define(['angular',
		'app',
		'routingConfig',
		'controllers/producerDecisionStep1Ctrl',
		'controllers/producerDecisionStep2Ctrl',
		'controllers/producerDecisionStep3Ctrl',
		'controllers/producerDecisionStep4Ctrl',
		'controllers/retailerDecisionStep1Ctrl',
		'controllers/retailerDecisionStep2Ctrl',
		'controllers/retailerDecisionStep3Ctrl',
		'controllers/retailerDecisionStep4Ctrl',
		'controllers/contractCtrl',
		'controllers/loginCtrl',
		'controllers/adminCtrl',
		'controllers/homeCtrl'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {

		var access = routingConfig.accessLevels;
		$routeProvider.when('/home',{
			templateUrl:'partials/home.html',
			controller:'HomeCtrl',
			access : access.public
		}).when('/producerDecisionStep1',{
			templateUrl:'partials/producerDecisionStep1.html',
			controller:'producerDecisionStep1Ctrl',
			access : access.public			
		}).when('/producerDecisionStep2',{
			templateUrl:'partials/producerDecisionStep2.html',
			controller:'producerDecisionStep2Ctrl',
			access : access.public			
		}).when('/producerDecisionStep3',{
			templateUrl:'partials/producerDecisionStep3.html',
			controller:'producerDecisionStep3Ctrl',
			access : access.public			
		}).when('/producerDecisionStep4',{
			templateUrl:'partials/producerDecisionStep4.html',
			controller:'producerDecisionStep4Ctrl',
			access : access.public			
		}).when('/retailerDecisionStep1',{
			templateUrl:'partials/retailerDecisionStep1.html',
			controller:'retailerDecisionStep1Ctrl',
			access : access.public			
		}).when('/retailerDecisionStep2',{
			templateUrl:'partials/retailerDecisionStep2.html',
			controller:'retailerDecisionStep2Ctrl',
			access : access.public			
		}).when('/retailerDecisionStep3',{
			templateUrl:'partials/retailerDecisionStep3.html',
			controller:'retailerDecisionStep3Ctrl',
			access : access.public			
		}).when('/retailerDecisionStep4',{
			templateUrl:'partials/retailerDecisionStep4.html',
			controller:'retailerDecisionStep4Ctrl',
			access : access.public			
		}).when('/contract',{
			templateUrl:'partials/contract.html',
			controller:'contractCtrl',
			access : access.public			
		}).when('/login',{
			templateUrl:'partials/login.html',
			controller:'loginCtrl',
			access : access.public			
		}).when('/admin',{
			templateUrl:'partials/admin.html',
			controller:'adminCtrl',
			access : access.public			
		});	

		$routeProvider.otherwise({redirectTo: '/login'});
	}]);
});