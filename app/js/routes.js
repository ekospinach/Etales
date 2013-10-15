define(['angular',
		'app',
		'controllers/producerDecisionStep1Ctrl'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/view1', {
			templateUrl: 'partials/partial1.html',
			controller: 'MyCtrl1'
		}).when('/view2', {
			templateUrl: 'partials/partial2.html',
			controller: 'MyCtrl2'
		}).when('/home',{
			templateUrl:'partials/home.html',
			controller:'HomeCtrl'
		}).when('/producerDecisionStep1',{
			templateUrl:'partials/producerDecisionStep1.html',
			controller:'producerDecisionStep1Ctrl',
			resolve:{
				tk: function(ProducerDecisionLoader) {
					return ProducerDecisionLoader();
				}
			}
		}).when('/producerDecisionStep2',{
			templateUrl:'partials/producerDecisionStep2.html',
			controller:'producerDecisionStep2Ctrl'
		}).when('/producerDecisionStep3',{
			templateUrl:'partials/producerDecisionStep3.html',
			controller:'producerDecisionStep3Ctrl'
		}).when('/producerDecisionStep4',{
			templateUrl:'partials/producerDecisionStep4.html',
			controller:'producerDecisionStep4Ctrl'


		}).when('/retailerDecisionStep1',{
			templateUrl:'partials/retailerDecisionStep1.html',
			controller:'retailerDecisionStep1Ctrl'
		}).when('/retailerDecisionStep2',{
			templateUrl:'partials/retailerDecisionStep2.html',
			controller:'retailerDecisionStep2Ctrl'
		}).when('/retailerDecisionStep3',{
			templateUrl:'partials/retailerDecisionStep3.html',
			controller:'retailerDecisionStep3Ctrl'
		}).when('/retailerDecisionStep4',{
			templateUrl:'partials/retailerDecisionStep4.html',
			controller:'retailerDecisionStep4Ctrl'
		});	

		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});