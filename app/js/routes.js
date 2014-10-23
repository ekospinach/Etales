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
		'controllers/supplierDecisionCtrl',
		'controllers/retailerDecisionCtrl',
		'controllers/navbarCtrl',
		'controllers/feedbackCtrl',
		'controllers/overviewReportCtrl'], function(angular, app) {
	'use strict';
	return app.config(['$routeProvider','$httpProvider', '$locationProvider', function($routeProvider, $httpProvider,$locationProvider) {

		//$locationProvider.hashPrefix('!');
		var access = routingConfig.accessLevels;
		$routeProvider.when('/home',{
			pageTitle : 'Manual',
			templateUrl:'partials/home.html',
			controller:'homeCtrl',
			access : access.playerView
		// }).when('/contract',{
		// 	templateUrl:'partials/contract.html',
		// 	controller:'contractCtrl',
		// 	access : access.playerView,	
		// }).when('/contractDetails',{
		// 	templateUrl:'partials/contractDetails.html',
		// 	controller:'contractDetailsCtrl',
		// 	access : access.playerView,		
		}).when('/login',{
			pageTitle : 'Login',
			templateUrl:'partials/login.html',
			controller:'loginCtrl',
			access : access.public
		// }).when('/login/:reportLocateId',{
		// 	templateUrl:'partials/login.html',
		// 	controller:'loginCtrl',
		// 	access : access.public			
		}).when('/admin',{
			pageTitle : 'Admin',
			templateUrl:'partials/admin.html',
			controller:'adminCtrl',
			access : access.facilitatorView			
		}).when('/adminDetails',{
			pageTitle : 'Seminar Details',
			templateUrl:'partials/adminDetails.html',
			controller:'adminDetailsCtrl',
			access : access.facilitatorView
		// }).when('/test',{
		// 	controller:'testCtrl',
		// 	templateUrl:'partials/test.html',
		// 	access:access.public
		}).when('/facilitatorDecision',{
			pageTitle : 'Facilitator Decision',
			controller:'facilitatorDecisionCtrl',
			templateUrl:'partials/facilitatorDecision.html',
			access:access.playerView
		}).when('/feedback',{
			pageTitle : 'Feedback',
			controller:'feedbackCtrl',
			templateUrl:'partials/feedback.html',
			access:access.facilitatorView
		// }).when('/summaryReport',{
		// 	controller:'summaryReportCtrl',
		// 	templateUrl:'partials/summaryReport.html',
		// 	access:access.playerView
		}).when('/supplierDecision',{
			pageTitle : 'Supplier Decision',
			templateUrl:'partials/supplierDecision.html',
			controller:'supplierDecisionCtrl',
			access : access.producerView			
		}).when('/retailerDecision',{
			pageTitle : 'Retailer Decision',
			templateUrl:'partials/retailerDecision.html',
			controller:'retailerDecisionCtrl',
			access : access.retailerView			
		}).when('/generalReport',{
			pageTitle : 'General Report',
			templateUrl:'partials/generalReport.html',
			controller:'generalReportCtrl',
			access : access.playerView
		}).when('/marketReport',{
			pageTitle : 'Market Report',
			templateUrl:'partials/marketReport.html',
			controller:'marketReportCtrl',
			access: access.playerView
		}).when('/confidentialReport',{
			pageTitle : 'Confidential Report',
			templateUrl:'partials/confidentialReport.html',
			controller:'confidentialReportCtrl',
			access: access.playerView
		}).when('/overviewReport',{
			pageTitle : 'Overview',
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