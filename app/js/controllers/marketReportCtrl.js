define(['app', 'socketIO', 'routingConfig'], function(app) {
	app.controller('marketReportCtrl', ['$scope', '$http', 'ProducerDecisionBase', '$rootScope', 'Auth', '$anchorScroll', '$q', 'PlayerInfo', 'SeminarInfo', 'PeriodInfo', 'Label', 'RoleInfo',
		function($scope, $http, ProducerDecisionBase, $rootScope, Auth, $anchorScroll, $q, PlayerInfo, SeminarInfo, PeriodInfo, Label, RoleInfo) {

			$scope.$watch('isPageLoading', function(newValue, oldValue) {
				$scope.isPageLoading = newValue;
			})

			var switching = function(type) {
				$scope.Performance = $scope.MarketShare = $scope.MarketSales = $scope.Segment = $scope.Cross = $scope.Product = $scope.EMallPrices = $scope.ProducerConsolidate = $scope.ProducerBMBusiness = $scope.ProducerOnlineBusiness = $scope.ProducerProfitability = $scope.ProducerNegotiations = $scope.ElecssoriesConsumer = $scope.ElecssoriesShopper = $scope.ElecssoriesVolume = $scope.HealthBeautiesConsumer = $scope.HealthBeautiesShopper = $scope.HealthBeautiesVolume = $scope.ProducerKey = $scope.RuralConsumer = $scope.RuralShopper = $scope.RuralVolume = $scope.UrbanConsumer = $scope.UrbanShopper = $scope.UrbanVolume = $scope.RetailerKey = $scope.RetailerConsolidate = $scope.RetailerRuralProfit = $scope.RetailerUrbanProfit = $scope.RetailerProfitability = $scope.RetailerNegotiations = false;
				$scope.AwarenessElecssories = $scope.AwarenessHealthBeauties = $scope.RuralElecssoriesBrand = $scope.UrbanElecssoriesBrand = $scope.RuralHealthBeautiesBrand = $scope.UrbanHealthBeautiesBrand = $scope.RetailerPerceptions = $scope.RuralElecssoriesConsumerShare = $scope.UrbanElecssoriesConsumerShare = $scope.RuralHealthBeautiesConsumerShare = $scope.UrbanHealthBeautiesConsumerShare = $scope.RuralElecssoriesConsumerSales = $scope.UrbanElecssoriesConsumerSales = $scope.RuralHealthBeautiesConsumerSales = $scope.UrbanHealthBeautiesConsumerSales = $scope.RuralElecssoriesShopperShare = $scope.UrbanElecssoriesShopperShare = $scope.RuralHealthBeautiesShopperShare = $scope.UrbanHealthBeautiesShopperShare = $scope.RuralElecssoriesShopperSales = $scope.UrbanElecssoriesShopperSales = $scope.RuralHealthBeautiesShopperSales = $scope.UrbanHealthBeautiesShopperSales = $scope.RuralElecssoriesSalesByChannel = $scope.UrbanElecssoriesSalesByChannel = $scope.RuralHealthBeautiesSalesByChannel = $scope.UrbanHealthBeautiesSalesByChannel = $scope.BMElecssories = $scope.BMHealthBeauties = $scope.PromotionElecssories = $scope.PromotionHealthBeauties = $scope.SupplierIntelligence = $scope.RetailerIntelligence = $scope.ForecastsConsumer = $scope.ForecastsShopper = $scope.ForecastsCategory = $scope.ForecastsInternet = false;
				switch (type) {
					case 'showAwarenessElecssories':
						$scope.AwarenessElecssories = true;
						break;
					case 'showAwarenessHealthBeauties':
						$scope.AwarenessHealthBeauties = true;
						break;
					case 'showRuralElecssoriesBrand':
						$scope.RuralElecssoriesBrand = true;
						break;
					case 'showUrbanElecssoriesBrand':
						$scope.UrbanElecssoriesBrand = true;
						break;
					case 'showRuralHealthBeautiesBrand':
						$scope.RuralHealthBeautiesBrand = true;
						break;
					case 'showUrbanHealthBeautiesBrand':
						$scope.UrbanHealthBeautiesBrand = true;
						break;
					case 'showRetailerPerceptions':
						$scope.RetailerPerceptions = true;
						break;
					case 'showRuralElecssoriesConsumerShare':
						$scope.RuralElecssoriesConsumerShare = true;
						break;
					case 'showUrbanElecssoriesConsumerShare':
						$scope.UrbanElecssoriesConsumerShare = true;
						break;
					case 'showRuralHealthBeautiesConsumerShare':
						$scope.RuralHealthBeautiesConsumerShare = true;
						break;
					case 'showUrbanHealthBeautiesConsumerShare':
						$scope.UrbanHealthBeautiesConsumerShare = true;
						break;
					case 'showRuralElecssoriesConsumerSales':
						$scope.RuralElecssoriesConsumerSales = true;
						break;
					case 'showUrbanElecssoriesConsumerSales':
						$scope.UrbanElecssoriesConsumerSales = true;
						break;
					case 'showRuralHealthBeautiesConsumerSales':
						$scope.RuralHealthBeautiesConsumerSales = true;
						break;
					case 'showUrbanHealthBeautiesConsumerSales':
						$scope.UrbanHealthBeautiesConsumerSales = true;
						break;
					case 'showRuralElecssoriesShopperShare':
						$scope.RuralElecssoriesShopperShare = true;
						break;
					case 'showUrbanElecssoriesShopperShare':
						$scope.UrbanElecssoriesShopperShare = true;
						break;
					case 'showRuralHealthBeautiesShopperShare':
						$scope.RuralHealthBeautiesShopperShare = true;
						break;
					case 'showUrbanHealthBeautiesShopperShare':
						$scope.UrbanHealthBeautiesShopperShare = true;
						break;
					case 'showRuralElecssoriesShopperSales':
						$scope.RuralElecssoriesShopperSales = true;
						break;
					case 'showUrbanElecssoriesShopperSales':
						$scope.UrbanElecssoriesShopperSales = true;
						break;
					case 'showRuralHealthBeautiesShopperSales':
						$scope.RuralHealthBeautiesShopperSales = true;
						break;
					case 'showUrbanHealthBeautiesShopperSales':
						$scope.UrbanHealthBeautiesShopperSales = true;
						break;
					case 'showRuralElecssoriesSalesByChannel':
						$scope.RuralElecssoriesSalesByChannel = true;
						break;
					case 'showUrbanElecssoriesSalesByChannel':
						$scope.UrbanElecssoriesSalesByChannel = true;
						break;
					case 'showRuralHealthBeautiesSalesByChannel':
						$scope.RuralHealthBeautiesSalesByChannel = true;
						break;
					case 'showUrbanHealthBeautiesSalesByChannel':
						$scope.UrbanHealthBeautiesSalesByChannel = true;
						break;
					case 'showBMElecssories':
						$scope.BMElecssories = true;
						break;
					case 'showBMHealthBeauties':
						$scope.BMHealthBeauties = true;
						break;
					case 'showPromotionElecssories':
						$scope.PromotionElecssories = true;
						break;
					case 'showPromotionHealthBeauties':
						$scope.PromotionHealthBeauties = true;
						break;
					case 'showSupplierIntelligence':
						$scope.SupplierIntelligence = true;
						break;
					case 'showRetailerIntelligence':
						$scope.RetailerIntelligence = true;
						break;
					case 'showForecastsConsumer':
						$scope.ForecastsConsumer = true;
						break;
					case 'showForecastsShopper':
						$scope.ForecastsShopper = true;
						break;
					case 'showForecastsCategory':
						$scope.ForecastsCategory = true;
						break;
					case 'showForecastsInternet':
						$scope.ForecastsInternet = true;
						break;
				}
			}

			var showAwarenessElecssories = function() {
				switching('showAwarenessElecssories');
			}

			$scope.showAwarenessHealthBeauties = function() {
				switching('showAwarenessHealthBeauties');
			}


			$scope.showRuralElecssoriesBrand = function() {
				switching('showRuralElecssoriesBrand');
			}
			$scope.showUrbanElecssoriesBrand = function() {
				switching('showUrbanElecssoriesBrand');
			}
			$scope.showRuralHealthBeautiesBrand = function() {
				switching('showRuralHealthBeautiesBrand');
			}
			$scope.showUrbanHealthBeautiesBrand = function() {
				switching('showUrbanHealthBeautiesBrand');
			}
			$scope.showRetailerPerceptions = function() {
				switching('showRetailerPerceptions');
			}

			$scope.showRuralElecssoriesConsumerShare = function() {
				switching('showRuralElecssoriesConsumerShare');
			}
			$scope.showUrbanElecssoriesConsumerShare = function() {
				switching('showUrbanElecssoriesConsumerShare');
			}
			$scope.showRuralHealthBeautiesConsumerShare = function() {
				switching('showRuralHealthBeautiesConsumerShare');
			}
			$scope.showUrbanHealthBeautiesConsumerShare = function() {
				switching('showUrbanHealthBeautiesConsumerShare');
			}


			$scope.showRuralElecssoriesConsumerSales = function() {
				switching('showRuralElecssoriesConsumerSales');
			}
			$scope.showUrbanElecssoriesConsumerSales = function() {
				switching('showUrbanElecssoriesConsumerSales');
			}
			$scope.showRuralHealthBeautiesConsumerSales = function() {
				switching('showRuralHealthBeautiesConsumerSales');
			}
			$scope.showUrbanHealthBeautiesConsumerSales = function() {
				switching('showUrbanHealthBeautiesConsumerSales');
			}
			$scope.showRuralElecssoriesShopperShare = function() {
				switching('showRuralElecssoriesShopperShare');
			}
			$scope.showUrbanElecssoriesShopperShare = function() {
				switching('showUrbanElecssoriesShopperShare');
			}
			$scope.showRuralHealthBeautiesShopperShare = function() {
				switching('showRuralHealthBeautiesShopperShare');
			}
			$scope.showUrbanHealthBeautiesShopperShare = function() {
				switching('showUrbanHealthBeautiesShopperShare');
			}

			$scope.showRuralElecssoriesShopperSales = function() {
				switching('showRuralElecssoriesShopperSales');
			}
			$scope.showUrbanElecssoriesShopperSales = function() {
				switching('showUrbanElecssoriesShopperSales');
			}
			$scope.showRuralHealthBeautiesShopperSales = function() {
				switching('showRuralHealthBeautiesShopperSales');
			}
			$scope.showUrbanHealthBeautiesShopperSales = function() {
				switching('showUrbanHealthBeautiesShopperSales');
			}

			$scope.showRuralElecssoriesSalesByChannel = function() {
				switching('showRuralElecssoriesSalesByChannel');
			}
			$scope.showUrbanElecssoriesSalesByChannel = function() {
				switching('showUrbanElecssoriesSalesByChannel');
			}
			$scope.showRuralHealthBeautiesSalesByChannel = function() {
				switching('showRuralHealthBeautiesSalesByChannel');
			}
			$scope.showUrbanHealthBeautiesSalesByChannel = function() {
				switching('showUrbanHealthBeautiesSalesByChannel');
			}

			$scope.showBMElecssories = function() {
				switching('showBMElecssories');
			}
			$scope.showBMHealthBeauties = function() {
				switching('showBMHealthBeauties');
			}

			$scope.showPromotionElecssories = function() {
				switching('showPromotionElecssories');
			}
			$scope.showPromotionHealthBeauties = function() {
				switching('showPromotionHealthBeauties');
			}

			$scope.showSupplierIntelligence = function() {
				switching('showSupplierIntelligence');
			}
			$scope.showRetailerIntelligence = function() {
				switching('showRetailerIntelligence');
			}
			$scope.showForecastsConsumer = function() {
				switching('showForecastsConsumer');
			}
			$scope.showForecastsShopper = function() {
				switching('showForecastsShopper');
			}
			$scope.showForecastsCategory = function() {
				switching('showForecastsCategory');
			}
			$scope.showForecastsInternet = function() {
				switching('showForecastsInternet');
			}
			$scope.switching = switching;
			$scope.showAwarenessElecssories = showAwarenessElecssories;
			var setReportShown = function(data, type) {
				$scope.forecasts = true;
				$scope.retailerIntelligence = true;
				$scope.supplierIntelligence = true;
				$scope.promotionIntensity = true;
				$scope.BMRetailerPrices = true;
				$scope.salesByShopperSegment = true;
				$scope.marketShareByShopperSegment = true;
				$scope.salesByConsumerSegment = true;
				$scope.marketShareByConsumerSegment = true;
				$scope.salesByChannel = true;
				$scope.retailerPerceptions = true;
				$scope.brandPerceptions = true;
				$scope.awareness = true;
				//if()
				if (type != 'Full') {
					$scope.forecasts                    = data.forecasts;
					$scope.retailerIntelligence         = data.retailerIntelligence;
					$scope.supplierIntelligence         = data.supplierIntelligence;
					$scope.promotionIntensity           = data.promotionIntensity;
					$scope.BMRetailerPrices             = data.BMRetailerPrices;
					$scope.salesByShopperSegment        = data.salesByShopperSegment;
					$scope.marketShareByShopperSegment  = data.marketShareByShopperSegment;
					$scope.salesByConsumerSegment       = data.salesByConsumerSegment;
					$scope.marketShareByConsumerSegment = data.marketShareByConsumerSegment;
					//salesByChannel
					$scope.salesByChannel               = data.salesByChannel;
					$scope.retailerPerceptions          = data.retailerPerceptions;
					$scope.brandPerceptions             = data.brandPerceptions;
					$scope.awareness                    = data.awareness;
				}
				if ($scope.awareness) {
					showAwarenessElecssories();
				}
			}

			var userRoles = routingConfig.userRoles;
			$scope.selectedPeriod = PeriodInfo.getCurrentPeriod() - 1;
			$scope.nextBtn = false;
			$scope.previousBtn = true;

			$scope.changePeriod = function(type) {
				if (type == "add") {
					$scope.selectedPeriod = $scope.selectedPeriod + 1;
				} else {
					$scope.selectedPeriod = $scope.selectedPeriod - 1;
				}
				if ($scope.selectedPeriod < PeriodInfo.getCurrentPeriod() - 1) {
					$scope.nextBtn = true;
				} else {
					$scope.nextBtn = false;
				}
				if ($scope.selectedPeriod > -3) {
					$scope.previousBtn = true;
				} else {
					$scope.previousBtn = false;
				}
			}
			var initializePage = function() {
				$scope.isPageLoading = true;
				if ($rootScope.user.role == userRoles.facilitator) {
					setReportShown('', 'Full');
					showAwarenessElecssories();
					$scope.isPageLoading = false;
				} else if ($rootScope.user.role == userRoles.retailer) {
					var url = '/getSeminarReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/R/' + PlayerInfo.getPlayer();
					$http({
						method: 'GET',
						url: url
					}).then(function(data) {
						setReportShown(data.data, 'R');
						$scope.isPageLoading = false;
					}, function() {
						console.log('fail');
						$scope.isPageLoading = false;
					})
				} else if ($rootScope.user.role == userRoles.producer) {
					var url = '/getSeminarReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + PlayerInfo.getPlayer();
					$http({
						method: 'GET',
						url: url
					}).then(function(data) {
						setReportShown(data.data, 'P');
						$scope.isPageLoading = false;
					}, function() {
						console.log('fail');
						$scope.isPageLoading = false;
					})
				}
			}

			initializePage();
			$scope.setReportShown = setReportShown;


		}
	]);

});