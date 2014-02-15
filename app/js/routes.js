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
		'controllers/facilitatorDecisionCtrl',
		'controllers/contractCtrl',
		'controllers/contractDetailsCtrl',
		'controllers/loginCtrl',
		'controllers/adminCtrl',
		'controllers/adminDetailsCtrl',
		'controllers/homeCtrl',
		'controllers/mapCtrl',
		'controllers/marketReportCtrl',
		'controllers/lineChartCtrl',
		'controllers/reportCtrl',
		'controllers/testCtrl',
		'controllers/navbarCtrl'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider','$httpProvider', function($routeProvider, $httpProvider) {

		var access = routingConfig.accessLevels;
		$routeProvider.when('/home',{
			templateUrl:'partials/home.html',
			controller:'homeCtrl',
			access : access.public
		}).when('/producerDecisionStep1',{
			templateUrl:'partials/producerDecisionStep1.html',
			controller:'producerDecisionStep1Ctrl',
			access : access.producerView			
		}).when('/producerDecisionStep2',{
			templateUrl:'partials/producerDecisionStep2.html',
			controller:'producerDecisionStep2Ctrl',
			access : access.producerView			
		}).when('/producerDecisionStep3',{
			templateUrl:'partials/producerDecisionStep3.html',
			controller:'producerDecisionStep3Ctrl',
			access : access.producerView			
		}).when('/producerDecisionStep4',{
			templateUrl:'partials/producerDecisionStep4.html',
			controller:'producerDecisionStep4Ctrl',
			access : access.producerView			
		}).when('/retailerDecisionStep1',{
			templateUrl:'partials/retailerDecisionStep1.html',
			controller:'retailerDecisionStep1Ctrl',
			access : access.retailerView			
		}).when('/retailerDecisionStep2',{
			templateUrl:'partials/retailerDecisionStep2.html',
			controller:'retailerDecisionStep2Ctrl',
			access : access.retailerView			
		}).when('/retailerDecisionStep3',{
			templateUrl:'partials/retailerDecisionStep3.html',
			controller:'retailerDecisionStep3Ctrl',
			access : access.retailerView			
		}).when('/retailerDecisionStep4',{
			templateUrl:'partials/retailerDecisionStep4.html',
			controller:'retailerDecisionStep4Ctrl',
			access : access.retailerView			
		}).when('/contract',{
			templateUrl:'partials/contract.html',
			controller:'contractCtrl',
			access : access.playerView,	
		}).when('/contractDetails',{
			templateUrl:'partials/contractDetails.html',
			controller:'contractDetailsCtrl',
			access : access.playerView,		
		}).when('/login',{
			templateUrl:'partials/login.html',
			controller:'loginCtrl',
			access : access.public
		}).when('/admin',{
			templateUrl:'partials/admin.html',
			controller:'adminCtrl',
			access : access.public			
		}).when('/adminDetails',{
			templateUrl:'partials/adminDetails.html',
			controller:'adminDetailsCtrl',
			access : access.public
		}).when('/map',{
			controller: 'mapCtrl',
			templateUrl:'partials/map.html',
			access:access.playerView,
			resolve:{
				map:function(MapLoader){
					return MapLoader();
          		}
        	}
		}).when('/marketReport',{
			controller:'marketReportCtrl',
			templateUrl:'partials/marketReport.html',
			access:access.playerView
		}).when('/lineChart',{
			controller:'lineChartCtrl',
			templateUrl:'partials/lineChart.html',
			access:access.playerView
		}).when('/report',{
			controller:'reportCtrl',
			templateUrl:'partials/report.html',
			access:access.playerView
		}).when('/test',{
			controller:'testCtrl',
			templateUrl:'partials/test.html',
			access:access.public
		}).when('/facilitatorDecision',{
			controller:'facilitatorDecisionCtrl',
			templateUrl:'partials/facilitatorDecision.html',
			access:access.facilitatorView
		});	

		$routeProvider.otherwise({redirectTo: '/login'});

      var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

	}]);
});