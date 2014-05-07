define(['app','socketIO','routingConfig'], function(app) {
	app.controller('supplierDecisionCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {
			
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.isCollapsed=true;

		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	$scope.isPageLoading = newValue;	    	
		    })
            
            ProducerDecisionBase.startListenChangeFromServer(); 

		    var switching=function(type){
		    	$scope.ProductPortfolioManagement=$scope.BMListPrices=$scope.NegotiationAgreements=$scope.ProductionVolume=$scope.GeneralMarketing=$scope.OnlineStoreManagement=$scope.AssetInvestments=$scope.MarketResearchOrders=$scope.isNegotiation=false;
		    	switch(type){
		    		case 'showProductPortfolioManagement':$scope.ProductPortfolioManagement=true;break;
		    		case 'showBMListPrices':$scope.BMListPrices=true;break;
		    		case 'showNegotiationAgreements':$scope.NegotiationAgreements=true;$scope.isNegotiation=true;break;
		    		case 'showProductionVolume':$scope.ProductionVolume=true;break;
		    		case 'showGeneralMarketing':$scope.GeneralMarketing=true;break;
		    		case 'showOnlineStoreManagement':$scope.OnlineStoreManagement=true;break;
		    		case 'showAssetInvestments':$scope.AssetInvestments=true;break;
		    		case 'showMarketResearchOrders':$scope.MarketResearchOrders=true;break;
		    	}
		    }

		    var showView=function(){
                var categoryID=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
                var url='/checkProducerDecision/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer());
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						if(data.data=="isReady"){
							$scope.isReady=true;
						}else{
							$scope.isReady=false;
						}
		    			url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
                    	return $http({
	                        method:'GET',
	                        url:url
	                    });
                    }).then(function(data){
                        avaiableMax=data.data.budgetAvailable;
                        if(PeriodInfo.getCurrentPeriod()<=1){
                            abMax=data.data.budgetAvailable;
                        }else{
                            abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                        }
                        $scope.abMax=abMax;
                        $scope.acEleMax=data.data.productionCapacity[0];
                        $scope.acHeaMax=data.data.productionCapacity[1];
                        url="/producerExpend/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/brandName/location/1';
                        return  $http({
                            method:'GET',
                            url:url,
                        });
                    }).then(function(data){
                        expend=data.data.result;
                        $scope.surplusExpend=($scope.abMax-expend).toFixed(2);
                        url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/EName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        $scope.eleSurplusProduction=($scope.acEleMax-data.data.result).toFixed(2);
                        url="/productionResult/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/HName/varName';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        $scope.heaSurplusProduction=($scope.acHeaMax-data.data.result).toFixed(2);
                    },function(){
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

	    	$scope.switching=switching;
	    	$scope.showProductPortfolioManagement=showProductPortfolioManagement;
	    	$scope.showView=showView();
	    	showView();
	    	showProductPortfolioManagement();
	    	$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
                showView();
            });
		    
	}]);

});
