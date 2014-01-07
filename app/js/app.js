define([
	'angular',
	'filters',
	'services',
	'placeholder',
	'directives',
	'angularRoute',
	'angularXeditable',
	'angularBootstrap',
	'underscore',
	'socketIO',
	'bootstrap',
	'angularLoadingBar',
	'angularCookies',
	'jqplot',
	'angular_ui_chart',
	'bubbleRenderer',
	'labelRenderer',
	'textRenderer',
	'tree',
	//'highchart',
	'highcharts'
	], function (angular, filters, services,directives,bootstrap, controllers) {
		'use strict';
		return angular.module('myApp', [
			'ngRoute',
			'myApp.filters',
			'myApp.services',
			//'placeholders',
			'myApp.directives',
			'xeditable',
			'ui.bootstrap',
			'chieffancypants.loadingBar',
			'ngCookies',
			'highcharts-ng',
			'ui.chart',
		]).run(function(editableOptions){
			editableOptions.theme = 'bs3';
		}).run(['$rootScope', '$location','Auth','$http', function ($rootScope, $location, Auth, $http) {		    
		    $rootScope.currentPeriod = 0;
		    $rootScope.mapPeriod=0;
		    $rootScope.rootStartFrom=-2;
		    $rootScope.rootEndWith=0; 
		    /*controller*/
		    $rootScope.loginBody="bs-docs-home";
		    $rootScope.loginFooter="container";
		    $rootScope.loginCss="bs-docs-home";
		    $rootScope.loginLink="bs-masthead-links";
		    $rootScope.loginDiv="";

	        $rootScope.$on("$routeChangeStart", function (event, next, current) {
	            //console.log('handle rootscope...');
	            if (!Auth.authorize(next.access)) {
	                if(!Auth.isLoggedIn()) $location.path('/login');
	                //else                  $location.path('/login');
	            } else {
	            	if(Auth.isLoggedIn()){
						var url="/currentPeriod/"+$rootScope.user.seminar;
						$http.get(url).success(function(data){
							$rootScope.currentPeriod=data.currentPeriod;
							$rootScope.rootStartFrom=-2;
							$rootScope.rootEndWith=$rootScope.currentPeriod-1;
							console.log('set currentPeriod:' + $rootScope.currentPeriod);
						});	   	            		
	            	}
	            }
	        });
		}]).config(function(LabelProvider){
			//config default language
			LabelProvider.initialiseLanguage('CHN');
		}).config(function(cfpLoadingBarProvider){
			 cfpLoadingBarProvider.includeSpinner = true;
		});
});
