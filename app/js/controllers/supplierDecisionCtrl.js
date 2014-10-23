define(['app', 'socketIO', 'routingConfig'], function(app) {
	app.controller('supplierDecisionCtrl', ['$scope', '$http', 'ProducerDecisionBase', '$rootScope', 'Auth', '$anchorScroll', '$q', 'PlayerInfo', 'SeminarInfo', 'PeriodInfo', 'Label', 'RoleInfo', 'notify', '$timeout',
		function($scope, $http, ProducerDecisionBase, $rootScope, Auth, $anchorScroll, $q, PlayerInfo, SeminarInfo, PeriodInfo, Label, RoleInfo, notify, $timeout) {

			var switching = function(type) {
				$scope.isNegotiationChange = $scope.ProductPortfolioManagement = $scope.BMListPrices = $scope.NegotiationAgreements = $scope.ProductionVolume = $scope.GeneralMarketing = $scope.OnlineStoreManagement = $scope.AssetInvestments = $scope.MarketResearchOrders = $scope.isNegotiation = false;
				switch (type) {
					case 'showProductPortfolioManagement':
						$scope.ProductPortfolioManagement = true;
						break;
					case 'showBMListPrices':
						$scope.BMListPrices = true;
						break;
					case 'showNegotiationAgreements':
						$scope.NegotiationAgreements = true;
						$scope.isNegotiation = true;
						break;
					case 'showProductionVolume':
						$scope.ProductionVolume = true;
						break;
					case 'showGeneralMarketing':
						$scope.GeneralMarketing = true;
						break;
					case 'showOnlineStoreManagement':
						$scope.OnlineStoreManagement = true;
						break;
					case 'showAssetInvestments':
						$scope.AssetInvestments = true;
						break;
					case 'showMarketResearchOrders':
						$scope.MarketResearchOrders = true;
						break;
				}
			}

			var loadBackgroundDataAndCalculateDecisionInfo = function() {
				var categoryID = 0,
					acMax = 0,
					abMax = 0,
					productExpend = 0,
					ContractExpend = 0,
					reportExpend = 0,
					avaiableMax = 0;

				//check with server, make sure that isPortfolioDecisionCommitted = true = $scope.isReady 
				var url = '/checkProducerDecisionStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
				$http({
					method: 'GET',
					url: url
				}).then(function(data) {
					$scope.isPortfolioDecisionCommitted=data.data.isPortfolioDecisionCommitted;
					$scope.isContractDeal=data.data.isContractDeal;
					$scope.isContractFinalized=data.data.isContractFinalized;
					$scope.isDecisionCommitted=data.data.isDecisionCommitted;

					//Get company history information (available budget, capacity, acquired TL...)
					url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getDecisionPeriod() - 1) + '/P/' + parseInt(PlayerInfo.getPlayer());
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					//assign available budget, capacity for two categories 

					$scope.abMax = (Math.floor(data.data.budgetAvailable * 100) / 100) ;
					$scope.acEleMax = (Math.floor(data.data.productionCapacity[0] * 100) / 100) ;
					$scope.acHeaMax = (Math.floor(data.data.productionCapacity[1] * 100) / 100) ;

					$scope.initialBudget = (Math.floor(data.data.initialBudget * 100) / 100);
					$scope.budgetExtensions = (Math.floor(data.data.budgetExtensions * 100) / 100);
					$scope.totalPreviousMarketing = (Math.floor(data.data.totalPreviousMarketing * 100) / 100);
					$scope.totalPreviousTradeSupport = (Math.floor(data.data.totalPreviousTradeSupport * 100) / 100);


					

					//get how much money have been spent in current period, money left = $scope.surplusExpend
					url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getDecisionPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
					return $http({
						method: 'GET',
						url: url,
					});
				}).then(function(data) {
					productExpend = data.data.result;
					url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + PlayerInfo.getPlayer() + '/brandName/varName/ignoreItem/1';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					ContractExpend = data.data.result;
					url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/P/' + PlayerInfo.getPlayer();
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					reportExpend = data.data.result;

					$scope.estimatedSpending = -(Math.floor((productExpend + ContractExpend + reportExpend) * 100) / 100);
					$scope.surplusExpend = (Math.floor(($scope.abMax - productExpend - ContractExpend - reportExpend) * 100) / 100);
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/EName/varName';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					$scope.eleSurplusProduction = (Math.floor(($scope.acEleMax - data.data.result) * 100) / 100);

					//get production capacity left = $scope.eleSurplusProduction (Health Beauties)
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/HName/varName';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {

					$scope.heaSurplusProduction = (Math.floor(($scope.acHeaMax - data.data.result) * 100) / 100);

					return $http({
                        method:'GET',
                        url:'/getTimerActiveInfo/'+SeminarInfo.getSelectedSeminar().seminarCode
                    });
                }).then(function(data){
                    $scope.isTimerActived=data.data.result;

					return $http({
                        method:'GET',
                        url:'/producerMarketingSpending/'+SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + PlayerInfo.getPlayer()
                    });
                }).then(function(data){

					$scope.totalCurrentMarketing = (Math.floor(data.data.result * 100) / 100);

					return $http({
                        method:'GET',
                        url:'/producerTradeSupportSpending/'+SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getDecisionPeriod() + '/' + PlayerInfo.getPlayer()
                    });
                }).then(function(data){
                	
					$scope.totalCurrentTradeSupport = (Math.floor(data.data.result * 100) / 100);

                }, function() {
					console.log('fail');
				});
			}

			var showProductPortfolioManagement = function() {
				switching('showProductPortfolioManagement');
			}

			$scope.showBMListPrices = function() {
				switching('showBMListPrices');
			}

			$scope.showNegotiationAgreements = function() {
				switching('showNegotiationAgreements');
			}

			$scope.showProductionVolume = function() {
				switching('showProductionVolume');
			}

			$scope.showGeneralMarketing = function() {
				switching('showGeneralMarketing');
			}

			$scope.showOnlineStoreManagement = function() {
				switching('showOnlineStoreManagement');
			}

			$scope.showAssetInvestments = function() {
				switching('showAssetInvestments');
			}

			$scope.showMarketResearchOrders = function() {
				switching('showMarketResearchOrders');
			}


			
			$scope.switching = switching;
			$scope.showProductPortfolioManagement = showProductPortfolioManagement;
			$scope.loadBackgroundDataAndCalculateDecisionInfo = loadBackgroundDataAndCalculateDecisionInfo;
			loadBackgroundDataAndCalculateDecisionInfo();
			showProductPortfolioManagement();

			$scope.$watch('isPageLoading', function(newValue, oldValue) {
				$scope.isPageLoading = newValue;
			})

			//handle Supplier Decision module push notification messages

			$scope.$on('reloadSupplierBudgetMonitor', function(event) {
				loadBackgroundDataAndCalculateDecisionInfo();
			});

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, data, newBase) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Decision has been saved, Supplier ' + data.producerID + ' Period ' + data.period + '.'+'in '+data.page);
			});

			$scope.$on('producerReportPurchaseDecisionChanged', function(event, data, newBase) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Report purchase decision saved, Supplier ' + data.producerID + ' Period ' + data.period + '.');
			});

			$scope.$on('producerDecisionReloadError', function(event, data, newBase) {
				notify('Decision reload Error occur, Supplier ' + data.producerID + ' Period ' + data.period + '.');
			});

			$scope.$on('producerMarketResearchOrdersChanged', function(event, data, newSeminarData) {
				notify('Decision has been saved, Supplier ' + data.producerID + ' Period ' + data.period + '.');
				loadBackgroundDataAndCalculateDecisionInfo();
			});


			$scope.$on('producerPortfolioDecisionStatusChanged', function(event, data) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Commiting Portfolio Decision By Supplier ' + data.roleID + ' Period ' + data.period + '.');

			});
			
			$scope.$on('producerContractDeal', function(event, data) {
				console.log(data);
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Time is up, Contract Deal. Supplier ' + data.producerID + ' Period ' + data.period + '.');

			});

			$scope.$on('producerContractFinalized', function(event, data) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Time is up, ContractFinalized. Supplier ' + data.producerID + ' Period ' + data.period + '.');

			});

			$scope.$on('producerDecisionLocked', function(event, data) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Time is up, Lock Decision. Supplier ' + data.roleID + ' Period ' + data.period + '.');
			});

			$scope.$on('committedPortfolio',function(event,data){
				for(var i=0;i<data.result.length;i++){
					if(data.result[i].producerID==PlayerInfo.getPlayer()){
						loadBackgroundDataAndCalculateDecisionInfo();
						notify('Commiting Portfolio Decision By Supplier ' + data.result[i].producerID + ' Period ' + data.period + '.');
						break;
					}
				}
			});

			$scope.$on('finalizeContract', function(event, data) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Time is up, Lock Contract. ' + ' Period ' + data.period + '.');
			});

			$scope.$on('committeDecision', function(event, data) {
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Time is up, Lock Decision.' + ' Period ' + data.period + '.');
			});

			var drawChart=function(data){
				$scope.chartInit=true;
				$timeout(function() {
					if(data.portfolio>0){
						$scope.supplierClockTitle=Label.getContent('Product Portfolio')+' '+Label.getContent('Left Time')+':'+data.portfolio+'mins';
					}else if(data.contractDeal>0){
						$scope.supplierClockTitle=Label.getContent('Contract Deal')+' '+Label.getContent('Left Time')+':'+data.contractDeal+'mins';
					}else if(data.contractFinalized>0){
						$scope.supplierClockTitle=Label.getContent('Contract Finalize')+' '+Label.getContent('Left Time')+':'+data.contractFinalized+'mins';
					}else if(data.contractDecisionCommitted>0){
						$scope.supplierClockTitle=Label.getContent('Decision Committe')+' '+Label.getContent('Left Time')+':'+data.contractDecisionCommitted+'mins';
					}else{
						$scope.supplierClockTitle=Label.getContent('Time up');
					}

					$scope.supplierChartSeries = [{
						name: Label.getContent('Total Time'),
						data: [{
							'name': Label.getContent('Gone'),
							'y': data.pass
						}, {
							'name': Label.getContent('Product Portfolio'),
							'y': data.portfolio,
						}, {
							'name': Label.getContent('Contract Deal'),
							'y': data.contractDeal,
						}, {
							'name': Label.getContent('Contract Finalize'),
							'y': data.contractFinalized,
						},{
							'name':Label.getContent('Decision Committe'),
							'y': data.contractDecisionCommitted
						}]
					}]
					$scope.supplierModel=data;
				});
			}
			// $scope.$on('timerWork', function(event, data) {
			// 	drawChart(data);
			// });
			// $scope.$on('deadlinePortfolio', function(event, data) {
			// 	drawChart(data);
			// });
			// $scope.$on('deadlineContractDeal', function(event, data) {
			// 	drawChart(data);
			// });
			// $scope.$on('deadlineContractFinalized', function(event, data) {
			// 	drawChart(data);
			// });
			// $scope.$on('deadlineDecisionCommitted', function(event, data) {
			// 	drawChart(data);
			// });

			// $scope.$on('timerChanged', function(event, data) {
   //              $scope.isTimerActived=data.isTimerActived;
   //          });


			$scope.selectedPlayer = PlayerInfo.getPlayer();
			$scope.selectedPeriod = PeriodInfo.getDecisionPeriod();

		}
	]);

});
