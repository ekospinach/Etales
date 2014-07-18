define(['app','socketIO','routingConfig'], function(app) {
	app.controller('supplierDecisionCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo','notify', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo, notify) {

			var switching = function(type) {
				$scope.isNegotiationChange 
				= $scope.ProductPortfolioManagement 
				= $scope.BMListPrices 
				= $scope.NegotiationAgreements 
				= $scope.ProductionVolume 
				= $scope.GeneralMarketing 
				= $scope.OnlineStoreManagement 
				= $scope.AssetInvestments 
				= $scope.MarketResearchOrders 
				= $scope.isNegotiation = false;
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
				var url = '/checkProducerPortfolioDecision/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
				$http({
					method: 'GET',
					url: url
				}).then(function(data) {
					if (data.data == "isReady") {
						$scope.isPortfolioDecisionReady = true;
					} else {
						$scope.isPortfolioDecisionReady = false;
					}

				//make sure that isFinalDeicisonCommitted = $scope.FinalDecisionReady
					url = '/checkProducerFinalDecision/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					if (data.data == "isReady") {
						$scope.isFinalDecisionReady = true;
					} else {
						$scope.isFinalDecisionReady = false;
					}					

				//Get company history information (available budget, capacity, acquired TL...)
					url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + parseInt(PlayerInfo.getPlayer());
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
				//assign available budget, capacity for two categories 

					$scope.abMax = (data.data.budgetAvailable + data.data.budgetSpentToDate).toFixed(2);
					$scope.acEleMax = data.data.productionCapacity[0];
					$scope.acHeaMax = data.data.productionCapacity[1];

				//get how much money have been spent in current period, money left = $scope.surplusExpend
					url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
					return $http({
						method: 'GET',
						url: url,
					});
				}).then(function(data) {
					productExpend = data.data.result;
					url='/getContractExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/brandName/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					ContractExpend = data.data.result;
					url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/P/'+PlayerInfo.getPlayer();
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					reportExpend=data.data.result;
					$scope.surplusExpend = ($scope.abMax - productExpend- ContractExpend - reportExpend).toFixed(2);
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/EName/varName';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					$scope.eleSurplusProduction = ($scope.acEleMax - data.data.result).toFixed(2);

				//get production capacity left = $scope.eleSurplusProduction (Health Beauties)
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/HName/varName';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					$scope.heaSurplusProduction = ($scope.acHeaMax - data.data.result).toFixed(2);

				}, function() {
					console.log('fail');
				})
			}
	    	var showProductPortfolioManagement=function(){
	    		switching('showProductPortfolioManagement');
	    	}

	    	$scope.showBMListPrices=function(){
	    		switching('showBMListPrices');
	    	}
	    	
	    	$scope.showNegotiationAgreements=function(){
	    		switching('showNegotiationAgreements');
	    	}

	    	$scope.showProductionVolume=function(){
	    		switching('showProductionVolume');
	    	}

	    	$scope.showGeneralMarketing=function(){
	    		switching('showGeneralMarketing');
	    	}

	    	$scope.showOnlineStoreManagement=function(){
	    		switching('showOnlineStoreManagement');
	    	}

	    	$scope.showAssetInvestments=function(){
	    		switching('showAssetInvestments');
	    	}

	    	$scope.showMarketResearchOrders=function(){
	    		switching('showMarketResearchOrders');
	    	}


			loadBackgroundDataAndCalculateDecisionInfo();
			showProductPortfolioManagement();
			$scope.switching = switching;
			$scope.showProductPortfolioManagement = showProductPortfolioManagement;
			$scope.loadBackgroundDataAndCalculateDecisionInfo = loadBackgroundDataAndCalculateDecisionInfo();

		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	$scope.isPageLoading = newValue;	    	
		    })

		    //handle Supplier Decision module push notification messages

		    $scope.$on('reloadSupplierBudgetMonitor', function(event){
				loadBackgroundDataAndCalculateDecisionInfo();
		    });

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, data, newBase) {  
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Decision has been saved, Supplier ' + data.producerID  + ' Period ' + data.period + '.');
			});

			$scope.$on('producerReportPurchaseDecisionChanged', function(event, data, newBase) {  
				loadBackgroundDataAndCalculateDecisionInfo();
				notify('Report purchase decision saved, Supplier ' + data.producerID  + ' Period ' + data.period + '.');				
			});

			$scope.$on('producerDecisionReloadError', function(event, data, newBase) {  
				notify('Decision reload Error occur, Supplier ' + data.producerID  + ' Period ' + data.period + '.');
			});

            $scope.$on('producerMarketResearchOrdersChanged', function(event, data, newSeminarData) {  
				notify('Decision has been saved, Supplier ' + data.producerID  + ' Period ' + data.period + '.');
				loadBackgroundDataAndCalculateDecisionInfo();
            });

            $scope.$on('producerDecisionLocked', function(event, data) {  
            	loadBackgroundDataAndCalculateDecisionInfo();
                notify('Time is up, Lock Decision. Supplier ' + data.roleID  + ' Period ' + data.period + '.');

            });            

		    $scope.currentPeriod = PeriodInfo.getCurrentPeriod();
		    $scope.historyPeriod = PeriodInfo.getCurrentPeriod();	            

		    // var userRoles = routingConfig.userRoles;
		    // if(RoleInfo.getRole() == userRoles.producer){
		    // 	$scope.roleName = 'Supplier';
		    // } else if(RoleInfo.getRole() == userRoles.retailer){
		    // 	$scope.roleName = 'Retailer';
		    // } else if(RoleInfo.getRole() == userRoles.facilitator){
		    // 	$scope.roleName = 'Facilitator';
		    // }

		    $scope.PlayerID = PlayerInfo.getPlayer();
		    $scope.currentPeriod = PeriodInfo.getCurrentPeriod();

	}]);

});
