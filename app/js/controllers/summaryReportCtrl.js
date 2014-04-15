define(['app','socketIO','routingConfig'], function(app) {
	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    if(RoleInfo.getRole()==2){
		    	$scope.producerShow=true;
		    	$scope.retailerShow=false;
		    }else if(RoleInfo.getRole()==4){
		    	$scope.retailerShow=true;
		    	$scope.producerShow=false;
		    }

		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	console.log('isPageLoading fire, new value:' + newValue + ', oldValue:'+ oldValue);
		    	
		    	$scope.isPageLoading = newValue;	    	
		    })

		    var switching=function(type){
		    	$scope.Performance=$scope.MarketShare=$scope.MarketSales=$scope.Segment=$scope.Cross=$scope.Product=$scope.EMallPrices=$scope.ProducerConsolidate=$scope.ProducerBMBusiness=$scope.ProducerOnlineBusiness=$scope.ProducerProfitability=$scope.ProducerNegotiations=$scope.ElecssoriesConsumer=$scope.ElecssoriesShopper=$scope.ElecssoriesVolume=$scope.HealthBeautiesConsumer=$scope.HealthBeautiesShopper=$scope.HealthBeautiesVolume=$scope.ProducerKey=$scope.RuralConsumer=$scope.RuralShopper=$scope.RuralVolume=$scope.UrbanConsumer=$scope.UrbanShopper=$scope.UrbanVolume=$scope.RetailerKey=$scope.RetailerConsolidate=$scope.RetailerRuralProfit=$scope.RetailerUrbanProfit=$scope.RetailerProfitability=$scope.RetailerNegotiations=false;
		    	$scope.AwarenessElecssories=$scope.AwarenessHealthBeauties=$scope.RuralElecssoriesBrand=$scope.UrbanElecssoriesBrand=$scope.RuralHealthBeautiesBrand=$scope.UrbanHealthBeautiesBrand=$scope.RetailerPerceptions=$scope.RuralElecssoriesConsumerShare=$scope.UrbanElecssoriesConsumerShare=$scope.RuralHealthBeautiesConsumerShare=$scope.UrbanHealthBeautiesConsumerShare=$scope.RuralElecssoriesConsumerSales=$scope.UrbanElecssoriesConsumerSales=$scope.RuralHealthBeautiesConsumerSales=$scope.UrbanHealthBeautiesConsumerSales=$scope.RuralElecssoriesShopperShare=$scope.UrbanElecssoriesShopperShare=$scope.RuralHealthBeautiesShopperShare=$scope.UrbanHealthBeautiesShopperShare=$scope.RuralElecssoriesShopperSales=$scope.UrbanElecssoriesShopperSales=$scope.RuralHealthBeautiesShopperSales=$scope.UrbanHealthBeautiesShopperSales=$scope.BMElecssories=$scope.BMHealthBeauties=$scope.PromotionElecssories=$scope.PromotionHealthBeauties=$scope.SupplierIntelligence=$scope.RetailerIntelligence=$scope.ForecastsConsumer=$scope.ForecastsShopper=$scope.ForecastsCategory=$scope.ForecastsInternet=false;
		    	switch(type){
		    		case'showPerformance':$scope.Performance=true;break;
				    case'showMarketShare':$scope.MarketShare=true;break;
				    case'showMarketSales':$scope.MarketSales=true;break;
				    case'showSegment':$scope.Segment=true;break;
				    case'showCross':$scope.Cross=true;break;
				    case'showProduct':$scope.Product=true;break;
				    case'showEMallPrices':$scope.EMallPrices=true;break;
				    
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
				    case 'showAwarenessElecssories':$scope.AwarenessElecssories=true;break;
					case 'showAwarenessHealthBeauties':$scope.AwarenessHealthBeauties=true;break;
					case 'showRuralElecssoriesBrand':$scope.RuralElecssoriesBrand=true;break;
					case 'showUrbanElecssoriesBrand':$scope.UrbanElecssoriesBrand=true;break;
					case 'showRuralHealthBeautiesBrand':$scope.RuralHealthBeautiesBrand=true;break;
					case 'showUrbanHealthBeautiesBrand':$scope.UrbanHealthBeautiesBrand=true;break;
					case 'showRetailerPerceptions':$scope.RetailerPerceptions=true;break;
					case 'showRuralElecssoriesConsumerShare':$scope.RuralElecssoriesConsumerShare=true;break;
					case 'showUrbanElecssoriesConsumerShare':$scope.UrbanElecssoriesConsumerShare=true;break;
					case 'showRuralHealthBeautiesConsumerShare':$scope.RuralHealthBeautiesConsumerShare=true;break;
					case 'showUrbanHealthBeautiesConsumerShare':$scope.UrbanHealthBeautiesConsumerShare=true;break;
					case 'showRuralElecssoriesConsumerSales':$scope.RuralElecssoriesConsumerSales=true;break;
					case 'showUrbanElecssoriesConsumerSales':$scope.UrbanElecssoriesConsumerSales=true;break;
					case 'showRuralHealthBeautiesConsumerSales':$scope.RuralHealthBeautiesConsumerSales=true;break;
					case 'showUrbanHealthBeautiesConsumerSales':$scope.UrbanHealthBeautiesConsumerSales=true;break;
					case 'showRuralElecssoriesShopperShare':$scope.RuralElecssoriesShopperShare=true;break;
					case 'showUrbanElecssoriesShopperShare':$scope.UrbanElecssoriesShopperShare=true;break;
					case 'showRuralHealthBeautiesShopperShare':$scope.RuralHealthBeautiesShopperShare=true;break;
					case 'showUrbanHealthBeautiesShopperShare':$scope.UrbanHealthBeautiesShopperShare=true;break;
					case 'showRuralElecssoriesShopperSales':$scope.RuralElecssoriesShopperSales=true;break;
					case 'showUrbanElecssoriesShopperSales':$scope.UrbanElecssoriesShopperSales=true;break;
					case 'showRuralHealthBeautiesShopperSales':$scope.RuralHealthBeautiesShopperSales=true;break;
					case 'showUrbanHealthBeautiesShopperSales':$scope.UrbanHealthBeautiesShopperSales=true;break;
					case 'showBMElecssories':$scope.BMElecssories=true;break;
					case 'showBMHealthBeauties':$scope.BMHealthBeauties=true;break;
					case 'showPromotionElecssories':$scope.PromotionElecssories=true;break;
					case 'showPromotionHealthBeauties':$scope.PromotionHealthBeauties=true;break;
					case 'showSupplierIntelligence':$scope.SupplierIntelligence=true;break;
					case 'showRetailerIntelligence':$scope.RetailerIntelligence=true;break;
					case 'showForecastsConsumer':$scope.ForecastsConsumer=true;break;
					case 'showForecastsShopper':$scope.ForecastsShopper=true;break;
					case 'showForecastsCategory':$scope.ForecastsCategory=true;break;
					case 'showForecastsInternet':$scope.ForecastsInternet=true;break;
		    	}
		    }
		    var loadVariantValue=function(data,brandName,variantName,num){
		    	var array=_.find(data,function(obj){
		    		return (obj.variantName==variantName&&obj.parentBrandName==brandName);
		    	});
		    	return array.value[num];
		    }

		    var showPerformance=function(){
		    	switching('showPerformance');
		    }

		    $scope.showMarketShare=function(){
		    	switching('showMarketShare');    	
		    }

		    $scope.showMarketSales=function(){
		    	switching('showMarketSales');
		    }

		    $scope.showSegment=function(){
		    	switching('showSegment');
		    }

		    $scope.showCross=function(){
		    	switching('showCross');
		    }

		    $scope.showProduct=function(){
		    	switching('showProduct');
		    }

		    $scope.showEMallPrices=function(){
		    	switching('showEMallPrices');
		    }

		    $scope.showProducerConsolidate=function(){
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

		    $scope.showElecssoriesVolume=function(){
		    	switching('showElecssoriesVolume');
		    }

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

		    $scope.showRetailerConsolidate=function(){
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
		    $scope.showRuralVolume=function(){
		    	switching('showRuralVolume');
		    
		    }
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

			$scope.showAwarenessElecssories=function(){
				switching('showAwarenessElecssories');
			}

			$scope.showAwarenessHealthBeauties=function(){
				switching('showAwarenessHealthBeauties');
			}


			$scope.showRuralElecssoriesBrand=function(){
				switching('showRuralElecssoriesBrand');
			}
			$scope.showUrbanElecssoriesBrand=function(){
				switching('showUrbanElecssoriesBrand');
			}
			$scope.showRuralHealthBeautiesBrand=function(){
				switching('showRuralHealthBeautiesBrand');
			}
			$scope.showUrbanHealthBeautiesBrand=function(){
				switching('showUrbanHealthBeautiesBrand');
			}
			$scope.showRetailerPerceptions=function(){
				switching('showRetailerPerceptions');
			}

			$scope.showRuralElecssoriesConsumerShare=function(){
				switching('showRuralElecssoriesConsumerShare');
			}
			$scope.showUrbanElecssoriesConsumerShare=function(){
				switching('showUrbanElecssoriesConsumerShare');
			}
			$scope.showRuralHealthBeautiesConsumerShare=function(){
				switching('showRuralHealthBeautiesConsumerShare');
			}
			$scope.showUrbanHealthBeautiesConsumerShare=function(){
				switching('showUrbanHealthBeautiesConsumerShare');
			}


			$scope.showRuralElecssoriesConsumerSales=function(){
				switching('showRuralElecssoriesConsumerSales');
			}
			$scope.showUrbanElecssoriesConsumerSales=function(){
				switching('showUrbanElecssoriesConsumerSales');
			}
			$scope.showRuralHealthBeautiesConsumerSales=function(){
				switching('showRuralHealthBeautiesConsumerSales');
			}
			$scope.showUrbanHealthBeautiesConsumerSales=function(){
				switching('showUrbanHealthBeautiesConsumerSales');
			}
			$scope.showRuralElecssoriesShopperShare=function(){
				switching('showRuralElecssoriesShopperShare');
			}
			$scope.showUrbanElecssoriesShopperShare=function(){
				switching('showUrbanElecssoriesShopperShare');
			}
			$scope.showRuralHealthBeautiesShopperShare=function(){
				switching('showRuralHealthBeautiesShopperShare');
			}
			$scope.showUrbanHealthBeautiesShopperShare=function(){
				switching('showUrbanHealthBeautiesShopperShare');
			}

			$scope.showRuralElecssoriesShopperSales=function(){
				switching('showRuralElecssoriesShopperSales');
			}
			$scope.showUrbanElecssoriesShopperSales=function(){
				switching('showUrbanElecssoriesShopperSales');
			}
			$scope.showRuralHealthBeautiesShopperSales=function(){
				switching('showRuralHealthBeautiesShopperSales');
			}
			$scope.showUrbanHealthBeautiesShopperSales=function(){
				switching('showUrbanHealthBeautiesShopperSales');
			}

			$scope.showBMElecssories=function(){
				switching('showBMElecssories');
			}
			$scope.showBMHealthBeauties=function(){
				switching('showBMHealthBeauties');
			}

			$scope.showPromotionElecssories=function(){
				switching('showPromotionElecssories');
			}
			$scope.showPromotionHealthBeauties=function(){
				switching('showPromotionHealthBeauties');
			}

			$scope.showSupplierIntelligence=function(){
				switching('showSupplierIntelligence');
			}
			$scope.showRetailerIntelligence=function(){
				switching('showRetailerIntelligence');
			}
			$scope.showForecastsConsumer=function(){
				switching('showForecastsConsumer');
			}
			$scope.showForecastsShopper=function(){
				switching('showForecastsShopper');
			}
			$scope.showForecastsCategory=function(){
				switching('showForecastsCategory');
			}
			$scope.showForecastsInternet=function(){
				switching('showForecastsInternet');
			}

			//modal
			$scope.openProductModal=function(brandName,type){
				var num=0;
				$scope.variants=new Array();
				$scope.brandName=brandName;
				$scope.productModal=true;
				if(type="BM"){
					$scope.BMShow=true;
					$scope.OLShow=false;
					num=0;
				}else{
					$scope.BMShow=false;
					$scope.OLShow=true;
					num=1;
				}
				var url='/SCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		for(var i=0;i<data.data[0].scrv_Sales.length;i++){
		    			if(data.data[0].scrv_Sales[i].parentBrandName==brandName){
		    				var variantName=data.data[0].scrv_Sales[i].variantName;
			    			var Sales=data.data[0].scrv_Sales[i].value[num];
			    			var SalesChange=loadVariantValue(data.data[0].scrv_SalesChange,brandName,variantName,num);
				    		var SalesShareInCategory=loadVariantValue(data.data[0].scrv_SalesShareInCategory,brandName,variantName,num);
				    		var MaterialCosts=loadVariantValue(data.data[0].scrv_MaterialCosts,brandName,variantName,num);
				    		var CostOfGoodsSold=loadVariantValue(data.data[0].scrv_CostOfGoodsSold,brandName,variantName,num);
				    		var DiscontinuedGoodsCost=loadVariantValue(data.data[0].scrv_DiscontinuedGoodsCost,brandName,variantName,num);
				    		var InventoryHoldingCost=loadVariantValue(data.data[0].scrv_InventoryHoldingCost,brandName,variantName,num);
				    		var GrossProfit=loadVariantValue(data.data[0].scrv_GrossProfit,brandName,variantName,num);
				    		var GrossProfitChange=loadVariantValue(data.data[0].scrv_GrossProfitChange,brandName,variantName,num);
				    		var GrossProfitMargin=loadVariantValue(data.data[0].scrv_GrossProfitMargin,brandName,variantName,num);
				    		var GrossProfitMarginShare=loadVariantValue(data.data[0].scrv_GrossProfitMarginShare,brandName,variantName,num);
				    		var TradeAndMarketing=loadVariantValue(data.data[0].scrv_TradeAndMarketing,brandName,variantName,num);
				    		var AdvertisingOnLine=loadVariantValue(data.data[0].scrv_AdvertisingOnLine,brandName,variantName,num);
				    		var AdvertisingOffLine=loadVariantValue(data.data[0].scrv_AdvertisingOffLine,brandName,variantName,num);
				    		var TradeSupport=loadVariantValue(data.data[0].scrv_TradeSupport,brandName,variantName,num);
				    		var TradeAndMarketingAsPercentageOfSales=loadVariantValue(data.data[0].scrv_TradeAndMarketingAsPercentageOfSales,brandName,variantName,num);
				    		var TradeAndMarketingShareInCategory=loadVariantValue(data.data[0].scrv_TradeAndMarketingShareInCategory,brandName,variantName,num);
				    		var GeneralExpenses=loadVariantValue(data.data[0].scrv_GeneralExpenses,brandName,variantName,num);
				    		var Amortisation=loadVariantValue(data.data[0].scrv_Amortisation,brandName,variantName,num);
				    		var OperatingProfit=loadVariantValue(data.data[0].scrv_OperatingProfit,brandName,variantName,num);
				    		var OperatingProfitChange=loadVariantValue(data.data[0].scrv_OperatingProfitChange,brandName,variantName,num);
				    		var OperatingProfitMargin=loadVariantValue(data.data[0].scrv_OperatingProfitMargin,brandName,variantName,num);
				    		var OperatingProfitShareInCategory=loadVariantValue(data.data[0].scrv_OperatingProfitShareInCategory,brandName,variantName,num);
				    		var Interest=loadVariantValue(data.data[0].scrv_Interest,brandName,variantName,num);
				    		var Taxes=loadVariantValue(data.data[0].scrv_Taxes,brandName,variantName,num);
				    		var ExceptionalItems=loadVariantValue(data.data[0].scrv_ExceptionalItems,brandName,variantName,num);
				    		var NetProfit=loadVariantValue(data.data[0].scrv_NetProfit,brandName,variantName,num);
				    		var NetProfitChange=loadVariantValue(data.data[0].scrv_NetProfitChange,brandName,variantName,num);
				    		var NetProfitMargin=loadVariantValue(data.data[0].scrv_NetProfitMargin,brandName,variantName,num);
				    		var NetProfitShareInCategory=loadVariantValue(data.data[0].scrv_NetProfitShareInCategory,brandName,variantName,num);
				    		$scope.variants.push({'variantName':variantName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
				    		'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
				    		'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
				   			'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare,'TradeSupport':TradeSupport});
		    			}
		    		}
		    	},function(){
		    		console.log('fail');
		    	})
			}
			$scope.productOpts = {
				backdropFade: true,
				dialogFade:true
			};
			$scope.closeProductModal=function(){
				$scope.productModal=false;	
			}

		    $scope.openRetailerProductModal=function(brandName,type){
		    	$scope.retailerProductModal=true;
		    	var num=0;
		    	$scope.variants=new Array();
		    	$scope.brandName=brandName;
		    	if(type=="Rural"){
		    		num=1;
		    	}else{
		    		num=0;
		    	}
		    	var url='/RCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
		    	$http({
		    		method:'GET',
		    		url:url
		    	}).then(function(data){
		    		for(var i=0;i<data.data[0].rcrv_Sales.length;i++){
		    			if(data.data[0].rcrv_Sales[i].parentBrandName==brandName){
		    				var variantName=data.data[0].rcrv_Sales[i].variantName;
		    				var Sales=data.data[0].rcrv_Sales[i].value[num];
		    				var PromotionsCost=loadVariantValue(data.data[0].rcrv_PromotionsCost,brandName,variantName,num);
		    				var OtherCompensation=loadVariantValue(data.data[0].rcrv_OtherCompensation,brandName,variantName,num);
		    				var NetSales=loadVariantValue(data.data[0].rcrv_NetSales,brandName,variantName,num);
		    				var NetSalesChange=loadVariantValue(data.data[0].rcrv_NetSalesChange,brandName,variantName,num);
		    				var NetSalesShareInCategory=loadVariantValue(data.data[0].rcrv_NetSalesShareInCategory,brandName,variantName,num);
		    				var CostOfGoodsSold=loadVariantValue(data.data[0].rcrv_CostOfGoodsSold,brandName,variantName,num);
		    				var ValueOfQuantityDiscounts=loadVariantValue(data.data[0].rcrv_ValueOfQuantityDiscounts,brandName,variantName,num);
		    				var ValueOfPerformanceBonus=loadVariantValue(data.data[0].rcrv_ValueOfPerformanceBonus,brandName,variantName,num);
		    				var DiscontinuedGoodsCost=loadVariantValue(data.data[0].rcrv_DiscontinuedGoodsCost,brandName,variantName,num);
		    				var InventoryHoldingCost=loadVariantValue(data.data[0].rcrv_InventoryHoldingCost,brandName,variantName,num);
		    				var GrossProfit=loadVariantValue(data.data[0].rcrv_GrossProfit,brandName,variantName,num);
		    				var GrossProfitChange=loadVariantValue(data.data[0].rcrv_GrossProfitChange,brandName,variantName,num);
		    				var GrossProfitMargin=loadVariantValue(data.data[0].rcrv_GrossProfitMargin,brandName,variantName,num);
		    				var GrossProfitShareInCategory=loadVariantValue(data.data[0].rcrv_GrossProfitShareInCategory,brandName,variantName,num);
		    				var GeneralExpenses=loadVariantValue(data.data[0].rcrv_GeneralExpenses,brandName,variantName,num);
		    				var OperatingProfit=loadVariantValue(data.data[0].rcrv_OperatingProfit,brandName,variantName,num);
		    				var OperatingProfitChange=loadVariantValue(data.data[0].rcrv_OperatingProfitChange,brandName,variantName,num);
		    				var OperatingProfitMargin=loadVariantValue(data.data[0].rcrv_OperatingProfitMargin,brandName,variantName,num);
		    				var OperatingProfitMarginShareInCategory=loadVariantValue(data.data[0].rcrv_OperatingProfitMarginShareInCategory,brandName,variantName,num);
		    				var Interest=loadVariantValue(data.data[0].rcrv_Interest,brandName,variantName,num);
		    				var Taxes=loadVariantValue(data.data[0].rcrv_Taxes,brandName,variantName,num);
		    				var ExceptionalItems=loadVariantValue(data.data[0].rcrv_ExceptionalItems,brandName,variantName,num);
		    				var NetProfit=loadVariantValue(data.data[0].rcrv_NetProfit,brandName,variantName,num);
		    				var NetProfitChange=loadVariantValue(data.data[0].rcrv_NetProfitChange,brandName,variantName,num);
		    				var NetProfitMargin=loadVariantValue(data.data[0].rcrv_NetProfitMargin,brandName,variantName,num);
		    				var NetProfitShareInCategory=loadVariantValue(data.data[0].rcrv_NetProfitShareInCategory,brandName,variantName,num);
		    				$scope.variants.push({'variantName':variantName,'Sales':Sales,'PromotionsCost':PromotionsCost,'OtherCompensation':OtherCompensation,'NetSales':NetSales,'NetSalesChange':NetSalesChange,'NetSalesShareInCategory':NetSalesShareInCategory,
								'CostOfGoodsSold':CostOfGoodsSold,'ValueOfQuantityDiscounts':ValueOfQuantityDiscounts,'ValueOfPerformanceBonus':ValueOfPerformanceBonus,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
								'GrossProfitChange':GrossProfitChange,'GrossProfitMargin':GrossProfitMargin,'GrossProfitShareInCategory':GrossProfitShareInCategory,'GeneralExpenses':GeneralExpenses,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,
								'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'OperatingProfitMarginShareInCategory':OperatingProfitMarginShareInCategory});
		    			}
		    		}
		    	},function(){
		    		console.log('fail');
		    	})
			}
			$scope.retailerProductOpts = {
				backdropFade: true,
				dialogFade:true
			};
			$scope.closeRetailerProductModal=function(){
				$scope.retailerProductModal=false;	
			}

		    $scope.loadVariantValue=loadVariantValue;
		    $scope.switching=switching;
		    $scope.showPerformance=showPerformance;
		  	showPerformance();
	}]);

});
