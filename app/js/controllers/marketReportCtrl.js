define(['app', 'socketIO', 'routingConfig'], function(app) {
	app.controller('marketReportCtrl', ['$scope', '$http', 'ProducerDecisionBase', '$rootScope', 'Auth', '$anchorScroll', '$q', 'PlayerInfo', 'SeminarInfo', 'PeriodInfo', 'Label', 'RoleInfo',
		function($scope, $http, ProducerDecisionBase, $rootScope, Auth, $anchorScroll, $q, PlayerInfo, SeminarInfo, PeriodInfo, Label, RoleInfo) {

			$scope.$watch('isPageLoading', function(newValue, oldValue) {
				$scope.isPageLoading = newValue;
			})

			var switching = function(type) {
				$scope.Performance = $scope.MarketShare = $scope.MarketSales = $scope.Segment = $scope.Cross = $scope.Product = $scope.EMallPrices = $scope.ProducerConsolidate = $scope.ProducerBMBusiness = $scope.ProducerOnlineBusiness = $scope.ProducerProfitability = $scope.ProducerNegotiations = $scope.ElecssoriesConsumer = $scope.ElecssoriesShopper = $scope.ElecssoriesVolume = $scope.HealthBeautiesConsumer = $scope.HealthBeautiesShopper = $scope.HealthBeautiesVolume = $scope.ProducerKey = $scope.RuralConsumer = $scope.RuralShopper = $scope.RuralVolume = $scope.UrbanConsumer = $scope.UrbanShopper = $scope.UrbanVolume = $scope.RetailerKey = $scope.RetailerConsolidate = $scope.RetailerRuralProfit = $scope.RetailerUrbanProfit = $scope.RetailerProfitability = $scope.RetailerNegotiations = 0;
				$scope.AwarenessElecssories = $scope.AwarenessHealthBeauties = $scope.RuralElecssoriesBrand = $scope.UrbanElecssoriesBrand = $scope.RuralHealthBeautiesBrand = $scope.UrbanHealthBeautiesBrand = $scope.RetailerPerceptions = $scope.RuralElecssoriesConsumerShare = $scope.UrbanElecssoriesConsumerShare = $scope.RuralHealthBeautiesConsumerShare = $scope.UrbanHealthBeautiesConsumerShare = $scope.RuralElecssoriesConsumerSales = $scope.UrbanElecssoriesConsumerSales = $scope.RuralHealthBeautiesConsumerSales = $scope.UrbanHealthBeautiesConsumerSales = $scope.RuralElecssoriesShopperShare = $scope.UrbanElecssoriesShopperShare = $scope.RuralHealthBeautiesShopperShare = $scope.UrbanHealthBeautiesShopperShare = $scope.RuralElecssoriesShopperSales = $scope.UrbanElecssoriesShopperSales = $scope.RuralHealthBeautiesShopperSales = $scope.UrbanHealthBeautiesShopperSales = $scope.RuralElecssoriesSalesByChannel = $scope.UrbanElecssoriesSalesByChannel = $scope.RuralHealthBeautiesSalesByChannel = $scope.UrbanHealthBeautiesSalesByChannel = $scope.BMElecssories = $scope.BMHealthBeauties = $scope.PromotionElecssories = $scope.PromotionHealthBeauties = $scope.SupplierIntelligence = $scope.RetailerIntelligence = $scope.ForecastsConsumer = $scope.ForecastsShopper = $scope.ForecastsCategory = $scope.ForecastsInternet = 0;
				$scope.SocialBrand = $scope.SocialPlayer = 0;
				switch (type) {
					case 'showAwarenessElecssories':
						$scope.AwarenessElecssories = 1;
						break;
					case 'showAwarenessHealthBeauties':
						$scope.AwarenessHealthBeauties = 1;
						break;
					case 'showRuralElecssoriesBrand':
						$scope.RuralElecssoriesBrand = 1;
						break;
					case 'showUrbanElecssoriesBrand':
						$scope.UrbanElecssoriesBrand = 1;
						break;
					case 'showRuralHealthBeautiesBrand':
						$scope.RuralHealthBeautiesBrand = 1;
						break;
					case 'showUrbanHealthBeautiesBrand':
						$scope.UrbanHealthBeautiesBrand = 1;
						break;
					case 'showRetailerPerceptions':
						$scope.RetailerPerceptions = 1;
						break;
					case 'showRuralElecssoriesConsumerShare':
						$scope.RuralElecssoriesConsumerShare = 1;
						break;
					case 'showUrbanElecssoriesConsumerShare':
						$scope.UrbanElecssoriesConsumerShare = 1;
						break;
					case 'showRuralHealthBeautiesConsumerShare':
						$scope.RuralHealthBeautiesConsumerShare = 1;
						break;
					case 'showUrbanHealthBeautiesConsumerShare':
						$scope.UrbanHealthBeautiesConsumerShare = 1;
						break;
					case 'showRuralElecssoriesConsumerSales':
						$scope.RuralElecssoriesConsumerSales = 1;
						break;
					case 'showUrbanElecssoriesConsumerSales':
						$scope.UrbanElecssoriesConsumerSales = 1;
						break;
					case 'showRuralHealthBeautiesConsumerSales':
						$scope.RuralHealthBeautiesConsumerSales = 1;
						break;
					case 'showUrbanHealthBeautiesConsumerSales':
						$scope.UrbanHealthBeautiesConsumerSales = 1;
						break;
					case 'showRuralElecssoriesShopperShare':
						$scope.RuralElecssoriesShopperShare = 1;
						break;
					case 'showUrbanElecssoriesShopperShare':
						$scope.UrbanElecssoriesShopperShare = 1;
						break;
					case 'showRuralHealthBeautiesShopperShare':
						$scope.RuralHealthBeautiesShopperShare = 1;
						break;
					case 'showUrbanHealthBeautiesShopperShare':
						$scope.UrbanHealthBeautiesShopperShare = 1;
						break;
					case 'showRuralElecssoriesShopperSales':
						$scope.RuralElecssoriesShopperSales = 1;
						break;
					case 'showUrbanElecssoriesShopperSales':
						$scope.UrbanElecssoriesShopperSales = 1;
						break;
					case 'showRuralHealthBeautiesShopperSales':
						$scope.RuralHealthBeautiesShopperSales = 1;
						break;
					case 'showUrbanHealthBeautiesShopperSales':
						$scope.UrbanHealthBeautiesShopperSales = 1;
						break;
					case 'showRuralElecssoriesSalesByChannel':
						$scope.RuralElecssoriesSalesByChannel = 1;
						break;
					case 'showUrbanElecssoriesSalesByChannel':
						$scope.UrbanElecssoriesSalesByChannel = 1;
						break;
					case 'showRuralHealthBeautiesSalesByChannel':
						$scope.RuralHealthBeautiesSalesByChannel = 1;
						break;
					case 'showUrbanHealthBeautiesSalesByChannel':
						$scope.UrbanHealthBeautiesSalesByChannel = 1;
						break;
					case 'showBMElecssories':
						$scope.BMElecssories = 1;
						break;
					case 'showBMHealthBeauties':
						$scope.BMHealthBeauties = 1;
						break;
					case 'showPromotionElecssories':
						$scope.PromotionElecssories = 1;
						break;
					case 'showPromotionHealthBeauties':
						$scope.PromotionHealthBeauties = 1;
						break;
					case 'showSupplierIntelligence':
						$scope.SupplierIntelligence = 1;
						break;
					case 'showRetailerIntelligence':
						$scope.RetailerIntelligence = 1;
						break;
					case 'showForecastsConsumer':
						$scope.ForecastsConsumer = 1;
						break;
					case 'showForecastsShopper':
						$scope.ForecastsShopper = 1;
						break;
					case 'showForecastsCategory':
						$scope.ForecastsCategory = 1;
						break;
					case 'showForecastsInternet':
						$scope.ForecastsInternet = 1;
						break;
					case 'showSocialBrand':
					    $scope.SocialBrand = 1;
					    break;
					case 'showSocialPlayer':
					    $scope.SocialPlayer = 1;
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

			var showSocialBrand = function() {
			    switching('showSocialBrand');
			}

			$scope.showSocialPlayer = function() {
			    switching('showSocialPlayer');
			}


			$scope.switching = switching;
			$scope.showAwarenessElecssories = showAwarenessElecssories;
			$scope.showSocialBrand = showSocialBrand;
			var setReportShown = function(data, type) {
				$scope.forecasts                    = 1;
				$scope.retailerIntelligence         = 1;
				$scope.supplierIntelligence         = 1;
				$scope.promotionIntensity           = 1;
				$scope.BMRetailerPrices             = 1;
				$scope.salesByShopperSegment        = 1;
				$scope.marketShareByShopperSegment  = 1;
				$scope.salesByConsumerSegment       = 1;
				$scope.marketShareByConsumerSegment = 1;
				$scope.salesByChannel               = 1;
				$scope.retailerPerceptions          = 1;
				$scope.brandPerceptions             = 1;
				$scope.awareness                    = 1;
				$scope.social                       = 1;
				//if()
				if (type != 'Full') {
					//not set now
					$scope.social                       = data[13] ? 1 : 0;
					$scope.salesByChannel               = data[12] ? 1 : 0; //
					$scope.forecasts                    = data[11] ? 1 : 0; //
					$scope.retailerIntelligence         = data[10] ? 1 : 0;
					$scope.supplierIntelligence         = data[9] ? 1 : 0;
					$scope.promotionIntensity           = data[8] ? 1 : 0;
					$scope.BMRetailerPrices             = data[7] ? 1 : 0; //
					$scope.salesByShopperSegment        = data[6] ? 1 : 0;
					$scope.marketShareByShopperSegment  = data[5] ? 1 : 0;
					$scope.salesByConsumerSegment       = data[4] ? 1 : 0;
					$scope.marketShareByConsumerSegment = data[3] ? 1 : 0;
					$scope.retailerPerceptions          = data[2] ? 1 : 0; //
					$scope.brandPerceptions             = data[1] ? 1 : 0; //
					$scope.awareness                    = data[0] ? 1 : 0; //
					if(type=="SP"){//special producer
						$scope.social                       = -1;
						$scope.retailerIntelligence         = -1;
						$scope.supplierIntelligence         = -1;
						$scope.promotionIntensity           = -1;
						$scope.salesByShopperSegment        = -1;
						$scope.marketShareByShopperSegment  = -1;
						$scope.salesByConsumerSegment       = -1;
						$scope.marketShareByConsumerSegment = -1;
					}
				}
				if ($scope.awareness==1) {
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
					var url = '/getRetailerReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) +'/'+  PlayerInfo.getPlayer();
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

					if (PeriodInfo.getCurrentPeriod() == 1) {
					    $q.all([
					        $http.get('/checkProducerDecisionStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer()),
					        $http.get('/getSupplierReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer())
					    ]).then(function(data) {
					        if(data[0].data.isPortfolioDecisionCommitted){
					        	setReportShown(data[1].data, 'P');
					        }else{
					        	setReportShown(data[1].data, 'SP');
					        }

					    }, function(data) {
					        console.log('fail');
					        $scope.isPageLoading = false;
					    })
					} else {

					    var url = '/getSupplierReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer();
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
			}

			initializePage();

			$scope.$on('SeminarPeriodChanged', function(event, data) {
				if (data.seminarCode == SeminarInfo.getSelectedSeminar().seminarCode) {
					$scope.currentPeriod = data.currentPeriod;
					$scope.span = data.simulationSpan;
					$scope.seminar = data.seminarCode;
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
			});

			$scope.setReportShown = setReportShown;


		}
	]);

});