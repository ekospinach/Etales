define(['app','socketIO','routingConfig'], function(app) {
	app.controller('retailerDecisionCtrl',['$scope', '$http', 'RetailerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo', function($scope, $http, RetailerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {
			
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
		    	$scope.NegotiationAgreements=$scope.Marketing=$scope.PrivateLabelPortfolioManagement=$scope.StoreManagement=$scope.MarketResearchOrders=false;
		    	switch(type){
		    		case 'showNegotiationAgreements':$scope.NegotiationAgreements=true;break;
		    		case 'showMarketing':$scope.Marketing=true;break;
		    		case 'showPrivateLabelPortfolioManagement':$scope.PrivateLabelPortfolioManagement=true;break;
		    		case 'showMarketResearchOrders':$scope.MarketResearchOrders=true;break;
		    		case 'showStoreManagement':$scope.StoreManagement=true;break;
		    	}
		    }

	    	var showNegotiationAgreements=function(){
	    		switching('showNegotiationAgreements');
	    	}

	    	$scope.showMarketing=function(){
	    		switching('showMarketing');
	    	}

	    	$scope.showPrivateLabelPortfolioManagement=function(){
	    		switching('showPrivateLabelPortfolioManagement');
	    	}

	    	$scope.showStoreManagement=function(){
	    		switching('showStoreManagement');
	    	}

	    	$scope.showMarketResearchOrders=function(){
	    		switching('showMarketResearchOrders');
	    	}

	    	$scope.switching=switching;
	    	$scope.showNegotiationAgreements=showNegotiationAgreements;

	    	showNegotiationAgreements();
		    
	}]);

});
