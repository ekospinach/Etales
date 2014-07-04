 define([
 	'angular',
 	'filters',
 	'services',
 	'directives/basicDirectives',
 	'highchart',
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
 	'directives/TE_SD_negotiationAgreements',
 	'directives/TE_SD_productionVolume',
 	'directives/TE_SD_generalMarketing',
 	'directives/TE_SD_onlineStoreManagement',
 	'directives/TE_SD_assetInvestments',
 	'directives/TE_SD_marketResearchOrders',
 	'directives/TE_RD_negotiationAgreements',
 	'directives/TE_RD_marketing',
 	'directives/TE_RD_privateLabelPortfolioManagement',
 	'directives/TE_RD_storeManagement',
 	'directives/TE_RD_marketResearchOrders',
 	'directives/TE_OR_sales',
	'directives/TE_OR_marketShares',
	'directives/TE_OR_profits',
	'directives/TE_OR_shelfSpaceAllocation',
 	'directives/revealJSWrapper',
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
 	'highchartMore',
 	'angularHighcharts',
 	'reveal',
 	'ngNotify',
 	'doubleScroll'
 ], function(angular, filters, services, directives, bootstrap, controllers) {
 	'use strict';
 	return angular.module('myApp', [
 			'ngRoute',
 			'myApp.filters',
 			'myApp.services',
 			'myApp.directives',
 			'xeditable',
 			'ui.bootstrap',
 			'chieffancypants.loadingBar',
 			'ngCookies',
 			'highcharts-ng',
 			'cgNotify'
 		]).run(function(editableOptions, editableThemes) {
 			editableThemes.bs3.inputClass = 'input-sm';
 			editableThemes.bs3.buttonsClass = 'btn-sm';
 			editableOptions.theme = 'bs3';
 		}).run(['$rootScope', '$location', 'Auth', '$http','$cookieStore','SeminarInfo','PeriodInfo','PlayerInfo','RoleInfo',
 			function($rootScope, $location, Auth, $http, $cookieStore, SeminarInfo, PeriodInfo, PlayerInfo, RoleInfo) {

			    var userRoles = routingConfig.userRoles;
 				var cookiesUserInfo = $cookieStore.get('user') || {
 					username: '',
 					role: userRoles.guest
 				};

 				//$rootScope.user is used for authorizing user(.role) in directive layer 
 				$rootScope.user = cookiesUserInfo;
 				//if cookies is not empty, Initialize main services with information from cookies  				 				
 				if (cookiesUserInfo.username) {
 					SeminarInfo.setSelectedSeminar(cookiesUserInfo.seminar);
 					PlayerInfo.setPlayer(cookiesUserInfo.roleID);
 					RoleInfo.setRole(cookiesUserInfo.role);
 					PeriodInfo.setCurrentPeriod(cookiesUserInfo.seminar.currentPeriod);
 				}

 				//when route change, keep authorizing user 
 				$rootScope.$on("$routeChangeStart", function(event, next, current) {
 					if (!Auth.authorize(next.access)) {
 						//console.log('authorize fail, jump to login page...');
 						if (!Auth.isLoggedIn()) $location.path('/login');
 					} else {
 						//TODO: update Seminar info from server where route changed, just in case currentPeriod has been changed and SocketIO doesn't work right.	            	
 						if (Auth.isLoggedIn()) {
 							var url = "/seminarInfo/" + SeminarInfo.getSelectedSeminar().seminarCode;
 							$http.get(url).success(function(data) {

 							});
 						}
 					}
 				});
 			}
 		])
 		.config(function(LabelProvider) {
 			//config default language
 			LabelProvider.initialiseLanguage('ENG');
 		}).config(function(cfpLoadingBarProvider) {
 			cfpLoadingBarProvider.includeSpinner = true;
 		});
 });
