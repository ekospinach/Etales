define(['app','socketIO','routingConfig'], function(app) {
	app.controller('confidentialReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	$scope.isPageLoading = newValue;	    	
		    })

		    var switching=function(type){
		    	$scope.Performance=$scope.MarketShare=$scope.MarketSales=$scope.Segment=$scope.Cross=$scope.Product=$scope.EMallPrices=$scope.ProducerConsolidate=$scope.ProducerBMBusiness=$scope.ProducerOnlineBusiness=$scope.ProducerProfitability=$scope.ProducerNegotiations=$scope.ElecssoriesConsumer=$scope.ElecssoriesShopper=$scope.ElecssoriesVolume=$scope.HealthBeautiesConsumer=$scope.HealthBeautiesShopper=$scope.HealthBeautiesVolume=$scope.ProducerKey=$scope.RuralConsumer=$scope.RuralShopper=$scope.RuralVolume=$scope.UrbanConsumer=$scope.UrbanShopper=$scope.UrbanVolume=$scope.RetailerKey=$scope.RetailerConsolidate=$scope.RetailerRuralProfit=$scope.RetailerUrbanProfit=$scope.RetailerProfitability=$scope.RetailerNegotiations=false;
		    	$scope.AwarenessElecssories=$scope.AwarenessHealthBeauties=$scope.RuralElecssoriesBrand=$scope.UrbanElecssoriesBrand=$scope.RuralHealthBeautiesBrand=$scope.UrbanHealthBeautiesBrand=$scope.RetailerPerceptions=$scope.RuralElecssoriesConsumerShare=$scope.UrbanElecssoriesConsumerShare=$scope.RuralHealthBeautiesConsumerShare=$scope.UrbanHealthBeautiesConsumerShare=$scope.RuralElecssoriesConsumerSales=$scope.UrbanElecssoriesConsumerSales=$scope.RuralHealthBeautiesConsumerSales=$scope.UrbanHealthBeautiesConsumerSales=$scope.RuralElecssoriesShopperShare=$scope.UrbanElecssoriesShopperShare=$scope.RuralHealthBeautiesShopperShare=$scope.UrbanHealthBeautiesShopperShare=$scope.RuralElecssoriesShopperSales=$scope.UrbanElecssoriesShopperSales=$scope.RuralHealthBeautiesShopperSales=$scope.UrbanHealthBeautiesShopperSales=$scope.BMElecssories=$scope.BMHealthBeauties=$scope.PromotionElecssories=$scope.PromotionHealthBeauties=$scope.SupplierIntelligence=$scope.RetailerIntelligence=$scope.ForecastsConsumer=$scope.ForecastsShopper=$scope.ForecastsCategory=$scope.ForecastsInternet=false;
		    	switch(type){
		    		case'showProducerConsolidate':$scope.ProducerConsolidate=true;break;
				    case'showProducerBMBusiness':$scope.ProducerBMBusiness=true;break;
				    case'showProducerOnlineBusiness':$scope.ProducerOnlineBusiness=true;break;
				    case'showProducerProfitability':$scope.ProducerProfitability=true;break;
				    case'showProducerNegotiations':$scope.ProducerNegotiations=true;break;
				    case'showElecssoriesConsumer':$scope.ElecssoriesConsumer=true;break;
				    case'showElecssoriesShopper':$scope.ElecssoriesShopper=true;break;
				    case'showElecssoriesVolume':$scope.ElecssoriesVolume=true;break;
				    case'showHealthBeautiesConsumer':$scope.HealthBeautiesConsumer=true;break;
				    case'showHealthBeautiesShopper':$scope.HealthBeautiesShopper=true;break;
				    case'showHealthBeautiesVolume':$scope.HealthBeautiesVolume=true;break;
				    case'showProducerKey':$scope.ProducerKey=true;break;
				   
				    case'showRetailerConsolidate':$scope.RetailerConsolidate=true;break;
				    case'showRetailerRuralProfit':$scope.RetailerRuralProfit=true;break;
				    case'showRetailerUrbanProfit':$scope.RetailerUrbanProfit=true;break;
				    case'showRetailerProfitability':$scope.RetailerProfitability=true;break;
				    case'showRetailerNegotiations':$scope.RetailerNegotiations=true;break;
				    case'showRuralConsumer':$scope.RuralConsumer=true;break;
				    case'showRuralShopper':$scope.RuralShopper=true;break;
				    case'showRuralVolume':$scope.RuralVolume=true;break;
				    case'showUrbanConsumer':$scope.UrbanConsumer=true;break;
				    case'showUrbanShopper':$scope.UrbanShopper=true;break;
				    case'showUrbanVolume':$scope.UrbanVolume=true;break;
				    case'showRetailerKey':$scope.RetailerKey=true;break;
				    
		    	}
		    }

		    var showProducerConsolidate=function(){
		    	switching('showProducerConsolidate');
		    }

		    $scope.showProducerBMBusiness=function(){
		    	switching('showProducerBMBusiness');
		    }

		    $scope.showProducerOnlineBusiness=function(){
		    	switching('showProducerOnlineBusiness');
		    }

		    $scope.showProducerProfitability=function(){
		    	switching('showProducerProfitability');
		    }

		    $scope.showProducerNegotiations=function(){
		    	switching('showProducerNegotiations');
		    }

		    $scope.showElecssoriesConsumer=function(){
		    	switching('showElecssoriesConsumer');
		    }

		    $scope.showElecssoriesShopper=function(){
		    	switching('showElecssoriesShopper');
		    }

		    var showElecssoriesVolume = function(){
		    	switching('showElecssoriesVolume');
		    }
		    $scope.showElecssoriesVolume=showElecssoriesVolume;

		    $scope.showHealthBeautiesConsumer=function(){
		    	switching('showHealthBeautiesConsumer');
		    }

		    $scope.showHealthBeautiesShopper=function(){
		    	switching('showHealthBeautiesShopper');
		    }
		    
		    $scope.showHealthBeautiesVolume=function(){
		    	switching('showHealthBeautiesVolume');
		    }
		    
		    $scope.showProducerKey=function(){
		    	switching('showProducerKey');
		    }

		    var showRetailerConsolidate=function(){
		    	switching('showRetailerConsolidate');
		    }

		    $scope.showRetailerRuralProfit=function(){
		    	switching('showRetailerRuralProfit');
		    }
		    $scope.showRetailerUrbanProfit=function(){
		    	switching('showRetailerUrbanProfit');
		    }
		    $scope.showRetailerProfitability=function(){
		    	switching('showRetailerProfitability');
		    }

		    $scope.showRetailerNegotiations=function(){
		    	switching('showRetailerNegotiations');
		    }

		    $scope.showRuralConsumer=function(){
		    	switching('showRuralConsumer');
		    }
		    $scope.showRuralShopper=function(){
		    	switching('showRuralShopper');
		    }

		    var showRuralVolume = function(){
		    	switching('showRuralVolume');
		    }

		    $scope.showRuralVolume = showRuralVolume

		    $scope.showUrbanConsumer=function(){
		    	switching('showUrbanConsumer');
		    }
		    $scope.showUrbanShopper=function(){
		    	switching('showUrbanShopper');
		    }
		    $scope.showUrbanVolume=function(){
		    	switching('showUrbanVolume');

		    }
		    $scope.showRetailerKey=function(){
		    	switching('showRetailerKey');
		    }
		    $scope.switching=switching;	
		    $scope.showRetailerConsolidate=showRetailerConsolidate;
		    $scope.showProducerConsolidate=showProducerConsolidate;


		    if(RoleInfo.getRole()==2){
		    	$scope.producerShow=true;
		    	$scope.retailerShow=false;
		    	showElecssoriesVolume();
		    	//showProducerConsolidate();
		    }else if(RoleInfo.getRole()==4){
		    	$scope.retailerShow=true;
		    	$scope.producerShow=false;
		    	showRetailerConsolidate();
		    }
		}]);

});
