define(['app','socketIO','routingConfig'], function(app) {
	app.controller('confidentialReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo','$filter', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo,$filter) {

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

		    $scope.showRuralVolume = showRuralVolume;

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
		    var setPlayer=function(userRole){
		    	var role=2;
		    	$scope.showUser=userRole;
		    	if(userRole>4){
		    		userRole-=4;
		    		role=4;
		    	}
		    	if(role==4&&$scope.producerShow){
		    		$scope.producerShow=false;
	    			$scope.retailerShow=true;
		    		showRetailerConsolidate();
		    	}
		    	if(role==2&&$scope.retailerShow){
		    		$scope.producerShow=true;
			    	$scope.retailerShow=false;
			    	showProducerConsolidate();
		    	}
		    	$scope.selectedUser=userRole;
		    }

		    $scope.switching=switching;	
		    $scope.setPlayer=setPlayer;
		    $scope.showRetailerConsolidate=showRetailerConsolidate;
		    $scope.showProducerConsolidate=showProducerConsolidate;

		    $scope.selectedPeriod = PeriodInfo.getCurrentPeriod() - 1;
			$scope.nextBtn = false;
			$scope.previousBtn = true;

			var userRoles = routingConfig.userRoles;
			$scope.facilitatorShow=false;
		    if(RoleInfo.getRole() == userRoles.facilitator){
			    
			    $scope.selectedUser=1;
			    $scope.showUser=1;
			    $scope.producerShow=true;
			    $scope.retailerShow=false;
			    $scope.facilitatorShow=true;
			    showProducerConsolidate();
		    }

		    if(RoleInfo.getRole()==2){
		    	$scope.selectedUser=PlayerInfo.getPlayer();
		    	$scope.showUser=PlayerInfo.getPlayer();
		    	$scope.producerShow=true;
		    	$scope.retailerShow=false;
		    	showProducerConsolidate();
		    }else if(RoleInfo.getRole()==4){
		    	$scope.selectedUser=PlayerInfo.getPlayer();
		    	$scope.showUser=(parseInt(PlayerInfo.getPlayer())+4);
		    	$scope.retailerShow=true;
		    	$scope.producerShow=false;
		    	showRetailerConsolidate();
		    }

			$scope.users = [{
				value: 1,
				text: Label.getContent('Supplier')+' 1'
			}, {
				value: 2,
				text: Label.getContent('Supplier')+' 2'
			}, {
				value: 3,
				text: Label.getContent('Supplier')+' 3'
			}, {
				value: 4,
				text: Label.getContent('Supplier')+' 4'
			}, {
				value: 5,
				text: Label.getContent('Retailer')+' 1'
			}, {
				value: 6,
				text: Label.getContent('Retailer')+' 2'
			}, {
				value: 7,
				text: Label.getContent('Traditional Trade')
			}, {
				value: 8,
				text: Label.getContent('eMall')
			}];

			$scope.showSelectedUser = function() {
				var selected = $filter('filter')($scope.users, {
					value: $scope.showUser
				});
				return ($scope.showUser && selected.length) ? selected[0].text : 'Not set';
			};
			
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
	    
		}]);

});
