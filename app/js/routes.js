define(['angular',
		'app',
		'routingConfig',
		'controllers/facilitatorDecisionCtrl',
		'controllers/contractCtrl',
		'controllers/contractDetailsCtrl',
		'controllers/loginCtrl',
		'controllers/adminCtrl',
		'controllers/adminDetailsCtrl',
		'controllers/homeCtrl',
		'controllers/testCtrl',
		'controllers/summaryReportCtrl',
		'controllers/generalReportCtrl',
		'controllers/marketReportCtrl',
		'controllers/confidentialReportCtrl',
		'controllers/facilitatorConfidentialReportCtrl',
		'controllers/facilitatorGeneralReportCtrl',
		'controllers/facilitatorMarketReportCtrl',		
		'controllers/supplierDecisionCtrl',
		'controllers/retailerDecisionCtrl',
		'controllers/navbarCtrl',
		'controllers/feedbackCtrl',
		'controllers/overviewReportCtrl'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider','$httpProvider', '$locationProvider',function($routeProvider, $httpProvider,$locationProvider) {

		//$locationProvider.hashPrefix('!');
		var access = routingConfig.accessLevels;
		$routeProvider.when('/home',{
			templateUrl:'partials/home.html',
			controller:'homeCtrl',
			access : access.playerView
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
		}).when('/login/:reportLocateId',{
			templateUrl:'partials/login.html',
			controller:'loginCtrl',
			access : access.public			
		}).when('/admin',{
			templateUrl:'partials/admin.html',
			controller:'adminCtrl',
			access : access.facilitatorView			
		}).when('/adminDetails',{
			templateUrl:'partials/adminDetails.html',
			controller:'adminDetailsCtrl',
			access : access.facilitatorView
		}).when('/test',{
			controller:'testCtrl',
			templateUrl:'partials/test.html',
			access:access.public
		}).when('/facilitatorDecision',{
			controller:'facilitatorDecisionCtrl',
			templateUrl:'partials/facilitatorDecision.html',
			access:access.playerView
		}).when('/feedback',{
			controller:'feedbackCtrl',
			templateUrl:'partials/feedback.html',
			access:access.facilitatorView
		}).when('/summaryReport',{
			controller:'summaryReportCtrl',
			templateUrl:'partials/summaryReport.html',
			access:access.playerView
		}).when('/facilitatorConfidentialReport',{
			controller:'facilitatorConfidentialReportCtrl',
			templateUrl:'partials/facilitatorConfidentialReport.html',
			access:access.facilitatorView
		}).when('/facilitatorGeneralReport',{
			controller:'facilitatorGeneralReportCtrl',
			templateUrl:'partials/facilitatorGeneralReport.html',
			access:access.facilitatorView
		}).when('/facilitatorMarketReport',{
			controller:'facilitatorMarketReportCtrl',
			templateUrl:'partials/facilitatorMarketReport.html',
			access:access.facilitatorView
		}).when('/supplierDecision',{
			templateUrl:'partials/supplierDecision.html',
			controller:'supplierDecisionCtrl',
			access : access.producerView			
		}).when('/retailerDecision',{
			templateUrl:'partials/retailerDecision.html',
			controller:'retailerDecisionCtrl',
			access : access.retailerView			
		}).when('/generalReport',{
			templateUrl:'partials/generalReport.html',
			controller:'generalReportCtrl',
			access : access.playerView
		}).when('/marketReport',{
			templateUrl:'partials/marketReport.html',
			controller:'marketReportCtrl',
			access: access.playerView
		}).when('/confidentialReport',{
			templateUrl:'partials/confidentialReport.html',
			controller:'confidentialReportCtrl',
			access: access.playerView
		}).when('/overviewReport',{
			templateUrl:'partials/overviewReport.html',
			controller:'overviewReportCtrl',
			access: access.playerView
		}).otherwise({redirectTo: '/login/:reportLocateId'});

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