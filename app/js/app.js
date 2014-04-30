 define([
	'angular',
	'filters',
	'services',
	'directives/basicDirectives',
	'directives/chartLibraryWrapper',
	'directives/TE_GR_performanceHighlights',
	'directives/TE_GR_marketShare',	
	'directives/TE_GR_marketSales',
	'directives/TE_GR_emallPrices',
	'directives/TE_GR_productPortfolio',
	'directives/TE_GR_segmentLeadership',
	'directives/TE_GR_crossSegmentSales',
	'directives/TE_SCR_supplierConsolidate',
	'directives/TE_SCR_supplierBMBusiness',
	'directives/TE_SCR_supplierOnlineBusiness',
	'directives/TE_SCR_supplierProfitability',
	'directives/TE_SCR_supplierNegotiations',
	'directives/TE_SCR_supplierElecssoriesConsumer',
	'directives/TE_SCR_supplierElecssoriesShopper',
	'directives/TE_SCR_supplierElecssoriesVolume',
	'directives/TE_SCR_supplierHealthBeautiesConsumer',
	'directives/TE_SCR_supplierHealthBeautiesShopper',
	'directives/TE_SCR_supplierHealthBeautiesVolume',
	'directives/TE_SCR_supplierKey',
	'directives/TE_RCR_retailerConsolidate',
	'directives/TE_RCR_retailerRuralProfit',
	'directives/TE_RCR_retailerUrbanProfit',
	'directives/TE_RCR_retailerProfitability',
	'directives/TE_RCR_retailerNegotiations',
	'directives/TE_RCR_retailerRuralConsumer',
	'directives/TE_RCR_retailerUrbanConsumer',
	'directives/TE_RCR_retailerRuralShopper',
	'directives/TE_RCR_retailerUrbanShopper',
	'directives/TE_RCR_retailerRuralVolume',
	'directives/TE_RCR_retailerUrbanVolume',
	'directives/TE_RCR_retailerKey',	
	'directives/TE_MR_awarenessElecssories',	
	'directives/TE_MR_awarenessHealthBeauties',	
	'directives/TE_MR_ruralElecssoriesBrand',	
	'directives/TE_MR_urbanElecssoriesBrand',	
	'directives/TE_MR_ruralHealthBeautiesBrand',	
	'directives/TE_MR_urbanHealthBeautiesBrand',
	'directives/TE_MR_retailerPerceptions',	
	'directives/TE_MR_supplierIntelligence',
	'directives/TE_MR_retailerIntelligence',
	'directives/TE_MR_forecastsConsumer',
	'directives/TE_MR_forecastsShopper',
	'directives/TE_MR_forecastsCategory',
	'directives/TE_MR_forecastsInternet',
	'directives/TE_MR_bMElecssories',
	'directives/TE_MR_bMHealthBeauties',
	'directives/TE_MR_promotionElecssories',
	'directives/TE_MR_promotionHealthBeauties',
	'directives/TE_MR_ruralElecssoriesConsumerSales',
	'directives/TE_MR_ruralElecssoriesConsumerShare',
	'directives/TE_MR_urbanElecssoriesConsumerSales',
	'directives/TE_MR_urbanElecssoriesConsumerShare',
	'directives/TE_MR_ruralHealthBeautiesConsumerSales',
	'directives/TE_MR_ruralHealthBeautiesConsumerShare',
	'directives/TE_MR_urbanHealthBeautiesConsumerSales',
	'directives/TE_MR_urbanHealthBeautiesConsumerShare',
	'directives/TE_MR_ruralElecssoriesShopperSales',
	'directives/TE_MR_ruralElecssoriesShopperShare',
	'directives/TE_MR_urbanElecssoriesShopperSales',
	'directives/TE_MR_urbanElecssoriesShopperShare',
	'directives/TE_MR_ruralHealthBeautiesShopperSales',
	'directives/TE_MR_ruralHealthBeautiesShopperShare',
	'directives/TE_MR_urbanHealthBeautiesShopperSales',
	'directives/TE_MR_urbanHealthBeautiesShopperShare',
	'directives/TE_SD_productPortfolioManagement',
	'directives/TE_SD_bMListPrices',
	'directives/TE_SD_productionVolume',
	'directives/TE_SD_generalMarketing',
	'directives/TE_SD_onlineStoreManagement',
	'directives/TE_SD_assetInvestments',
	'directives/TE_SD_marketResearchOrders',
	'directives/TE_RD_marketing',
	'directives/TE_RD_privateLabelPortfolioManagement',
	'directives/TE_RD_storeManagement',
	'directives/TE_RD_marketResearchOrders',
	'angularRoute',
	'angularXeditable',
	'angularBootstrap',
	'underscore',
	'socketIO',
	'bootstrap',
	'angularLoadingBar',
	'angularCookies',
	'jqplot',
	'bubbleRenderer',
	'labelRenderer',
	'textRenderer',
	'tree',
	'highchart',
	'highchartMore',
	'angularHighcharts',
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
			'highcharts-ng'
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
							$rootScope.loadShow=false;
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
