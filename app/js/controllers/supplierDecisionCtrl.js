define(['app','socketIO','routingConfig'], function(app) {
	app.controller('supplierDecisionCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo','notify', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo, notify) {
			
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.isCollapsed=true;

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

			var loadBackgroundData = function() {
				var categoryID = 0,
					acMax = 0,
					abMax = 0,
					productExpend = 0,
					r1ContractExpend = 0,
					r2ContractExpend = 0,
					avaiableMax = 0;

				//check with server, make sure that isPortfolioDecisionCommitted = true = $scope.isReady 
				var url = '/checkProducerDecision/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
				$http({
					method: 'GET',
					url: url
				}).then(function(data) {
					if (data.data == "isReady") {
						$scope.isReady = true;
					} else {
						$scope.isReady = false;
					}

				//Get company history information (available budget, capacity, acquired TL...)
					url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + parseInt(PlayerInfo.getPlayer());
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
				//assign available budget, capacity for two categories 

					$scope.abMax = data.data.budgetAvailable + data.data.budgetSpentToDate;
					$scope.acEleMax = data.data.productionCapacity[0];
					$scope.acHeaMax = data.data.productionCapacity[1];

				//get how much money have been spent in current period, money left = $scope.surplusExpend
					url = "/producerExpend/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
					return $http({
						method: 'GET',
						url: url,
					});
				}).then(function(data) {
					productExpend = data.data.result;
					url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/1/brandName/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					r1ContractExpend = data.data.result;
					url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+PlayerInfo.getPlayer()+'/2/brandName/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					r2ContractExpend = data.data.result;
					$scope.surplusExpend = ($scope.abMax - productExpend- r1ContractExpend - r2ContractExpend).toFixed(2);
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/EName/varName';
					return $http({
						method: 'GET',
						url: url
					});
				}).then(function(data) {
					$scope.eleSurplusProduction = ($scope.acEleMax - data.data.result).toFixed(2);

				//get production capacity left = $scope.eleSurplusProduction (Health Beauties)
					url = "/productionResult/" + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer()) + '/HName/varName';
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

            ProducerDecisionBase.startListenChangeFromServer(); 
			loadBackgroundData();
			showProductPortfolioManagement();
			$scope.switching = switching;
			$scope.showProductPortfolioManagement = showProductPortfolioManagement;
			$scope.loadBackgroundData = loadBackgroundData();

		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	$scope.isPageLoading = newValue;	    	
		    })
			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase) {
				loadBackgroundData();
				console.log('here is a test for notify');
				notify({
					message:'Decision has been updated to latest version...',
					template:'/partials/gmail-template.html',
					position:'center'
				});
			});
	}]);

});
