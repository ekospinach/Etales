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
		$routeProvider.when('/producerDecisionStep1',{
			templateUrl:'partials/producerDecisionStep1.html',
			controller:'ProducerDecisionStep1Ctrl',
			resolve:{
				producerDecision: function(ProducerDecisionLoader) {
					return ProducerDecisionLoader();
				}
			}
		});
		$routeProvider.when('/producerDecisionStep2',{
			templateUrl:'partials/producerDecisionStep2.html',
			controller:'ProducerDecisionStep2Ctrl'
		});
		$routeProvider.when('/producerDecisionStep3',{
			templateUrl:'partials/producerDecisionStep3.html',
			controller:'ProducerDecisionStep3Ctrl'
		});
		$routeProvider.when('/producerDecisionStep4',{
			templateUrl:'partials/producerDecisionStep4.html',
			controller:'ProducerDecisionStep4Ctrl'
		});
		$routeProvider.when('/retailerDecisionStep1',{
			templateUrl:'partials/retailerDecisionStep1.html',
			controller:'RetailerDecisionStep1Ctrl'
		});		
		$routeProvider.when('/retailerDecisionStep2',{
			templateUrl:'partials/retailerDecisionStep2.html',
			controller:'RetailerDecisionStep2Ctrl'
		});	
		$routeProvider.when('/retailerDecisionStep3',{
			templateUrl:'partials/retailerDecisionStep3.html',
			controller:'RetailerDecisionStep3Ctrl'
		});	
		$routeProvider.when('/retailerDecisionStep4',{
			templateUrl:'partials/retailerDecisionStep4.html',
			controller:'RetailerDecisionStep4Ctrl'
		});	
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});