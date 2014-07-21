define(['app', 'socketIO', 'routingConfig'], function(app) {
	app.controller('generalReportCtrl', ['$scope', '$http', 'ProducerDecisionBase', '$rootScope', 'Auth', '$anchorScroll', '$q', 'PlayerInfo', 'SeminarInfo', 'PeriodInfo', 'Label', 'RoleInfo',
		function($scope, $http, ProducerDecisionBase, $rootScope, Auth, $anchorScroll, $q, PlayerInfo, SeminarInfo, PeriodInfo, Label, RoleInfo) {

			$scope.$watch('isPageLoading', function(newValue, oldValue) {
				$scope.isPageLoading = newValue;
			})

			var switching = function(type) {
				$scope.Performance = $scope.MarketShare = $scope.MarketSales = $scope.Segment = $scope.Cross = $scope.Product = $scope.EMallPrices = $scope.ProducerConsolidate = $scope.ProducerBMBusiness = $scope.ProducerOnlineBusiness = $scope.ProducerProfitability = $scope.ProducerNegotiations = $scope.ElecssoriesConsumer = $scope.ElecssoriesShopper = $scope.ElecssoriesVolume = $scope.HealthBeautiesConsumer = $scope.HealthBeautiesShopper = $scope.HealthBeautiesVolume = $scope.ProducerKey = $scope.RuralConsumer = $scope.RuralShopper = $scope.RuralVolume = $scope.UrbanConsumer = $scope.UrbanShopper = $scope.UrbanVolume = $scope.RetailerKey = $scope.RetailerConsolidate = $scope.RetailerRuralProfit = $scope.RetailerUrbanProfit = $scope.RetailerProfitability = $scope.RetailerNegotiations = false;
				$scope.AwarenessElecssories = $scope.AwarenessHealthBeauties = $scope.RuralElecssoriesBrand = $scope.UrbanElecssoriesBrand = $scope.RuralHealthBeautiesBrand = $scope.UrbanHealthBeautiesBrand = $scope.RetailerPerceptions = $scope.RuralElecssoriesConsumerShare = $scope.UrbanElecssoriesConsumerShare = $scope.RuralHealthBeautiesConsumerShare = $scope.UrbanHealthBeautiesConsumerShare = $scope.RuralElecssoriesConsumerSales = $scope.UrbanElecssoriesConsumerSales = $scope.RuralHealthBeautiesConsumerSales = $scope.UrbanHealthBeautiesConsumerSales = $scope.RuralElecssoriesShopperShare = $scope.UrbanElecssoriesShopperShare = $scope.RuralHealthBeautiesShopperShare = $scope.UrbanHealthBeautiesShopperShare = $scope.RuralElecssoriesShopperSales = $scope.UrbanElecssoriesShopperSales = $scope.RuralHealthBeautiesShopperSales = $scope.UrbanHealthBeautiesShopperSales = $scope.BMElecssories = $scope.BMHealthBeauties = $scope.PromotionElecssories = $scope.PromotionHealthBeauties = $scope.SupplierIntelligence = $scope.RetailerIntelligence = $scope.ForecastsConsumer = $scope.ForecastsShopper = $scope.ForecastsCategory = $scope.ForecastsInternet = false;
				switch (type) {
					case 'showPerformance':
						$scope.Performance = true;
						break;
					case 'showMarketShare':
						$scope.MarketShare = true;
						break;
					case 'showMarketSales':
						$scope.MarketSales = true;
						break;
					case 'showSegment':
						$scope.Segment = true;
						break;
					case 'showCross':
						$scope.Cross = true;
						break;
					case 'showProduct':
						$scope.Product = true;
						break;
					case 'showEMallPrices':
						$scope.EMallPrices = true;
						break;
				}
			}

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

			var showPerformance = function() {
				switching('showPerformance');
			}

			$scope.showMarketShare = function() {
				switching('showMarketShare');
			}

			$scope.showMarketSales = function() {
				switching('showMarketSales');
			}

			$scope.showSegment = function() {
				switching('showSegment');
			}

			$scope.showCross = function() {
				switching('showCross');
			}

			$scope.showProduct = function() {
				switching('showProduct');
			}

			$scope.showEMallPrices = function() {
				switching('showEMallPrices');
			}


			$scope.switching = switching;
			$scope.showPerformance = showPerformance;
			showPerformance();

			$scope.currentPeriod = PeriodInfo.getCurrentPeriod();
			$scope.historyPeriod = PeriodInfo.getCurrentPeriod() - 1;
		}
	]);

});