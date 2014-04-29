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

		    var switching=function(type){
		    	$scope.ProductPortfolioManagement=$scope.BMListPrices=$scope.NegotiationAgreements=$scope.ProductionVolume=$scope.GeneralMarketing=$scope.OnlineStoreManagement=$scope.AssetInvestments=$scope.MarketResearchOrders=false;
		    	switch(type){
		    		case 'showProductPortfolioManagement':$scope.ProductPortfolioManagement=true;break;
		    		case 'showBMListPrices':$scope.BMListPrices=true;break;
		    		case 'showNegotiationAgreements':$scope.NegotiationAgreements=true;break;
		    		case 'showProductionVolume':$scope.ProductionVolume=true;break;
		    		case 'showGeneralMarketing':$scope.GeneralMarketing=true;break;
		    		case 'showOnlineStoreManagement':$scope.OnlineStoreManagement=true;break;
		    		case 'showAssetInvestments':$scope.AssetInvestments=true;break;
		    		case 'showMarketResearchOrders':$scope.MarketResearchOrders=true;break;
		    	}
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

	    	showProductPortfolioManagement();
		    
	}]);

});
