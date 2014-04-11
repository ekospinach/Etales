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

		    $scope.switching = switching;

		    var showPerformance=function(){
		    	switching('showPerformance');
		    }

		    var showMarketShare=function(){
		    	switching('showMarketShare');    	
		    }

		    var showMarketSales=function(){
		    	switching('showMarketSales');
		    }

		    var showSegment=function(){
		    	switching('showSegment');
		    }

		    var showCross=function(){
		    	switching('showCross');
		    }

		    var showProduct=function(){
		    	switching('showProduct');
		    }

		    var showEMallPrices=function(){
		    	switching('showEMallPrices');
		    }

		    var showProducerConsolidate=function(){
		    	switching('showProducerConsolidate');
		    }

		    var loadValue=function(data,name,num){
		    	var array=_.find(data,function(obj){
		    		return (obj.brandName==name);
		    	});
		    	return array.value[num];
		    }

		    var loadVariantValue=function(data,brandName,variantName,num){
		    	var array=_.find(data,function(obj){
		    		return (obj.variantName==variantName&&obj.parentBrandName==brandName);
		    	});
		    	return array.value[num];
		    }


		    var showProducerBMBusiness=function(){
		    	switching('showProducerBMBusiness');
		    }

		    var showProducerOnlineBusiness=function(){
		    	switching('showProducerOnlineBusiness');
		    }

		    var showProducerProfitability=function(){
		    	switching('showProducerProfitability');
		    }

		    var showProducerNegotiations=function(){
		    	switching('showProducerNegotiations');
		    }

		    var showElecssoriesConsumer=function(){
		    	switching('showElecssoriesConsumer');
		    }

		    var showElecssoriesShopper=function(){
		    	switching('showElecssoriesShopper');
		    }

		    var showElecssoriesVolume=function(){
		    	switching('showElecssoriesVolume');
		    }

		    var showHealthBeautiesConsumer=function(){
		    	switching('showHealthBeautiesConsumer');
		    }

		    var showHealthBeautiesShopper=function(){
		    	switching('showHealthBeautiesShopper');
		    }
		    
		    var showHealthBeautiesVolume=function(){
		    	switching('showHealthBeautiesVolume');
		    }
		    
		    var showProducerKey=function(){
		    	switching('showProducerKey');
		    }

		    var showRetailerConsolidate=function(){
		    	switching('showRetailerConsolidate');
		    }

		    var showRetailerRuralProfit=function(){
		    	switching('showRetailerRuralProfit');
		    }
		    var showRetailerUrbanProfit=function(){
		    	switching('showRetailerUrbanProfit');
		    }
		    var showRetailerProfitability=function(){
		    	switching('showRetailerProfitability');
		    }

		    var showRetailerNegotiations=function(){
		    	switching('showRetailerNegotiations');
		    }

		    var showRuralConsumer=function(){
		    	switching('showRuralConsumer');
		    }
		    var showRuralShopper=function(){
		    	switching('showRuralShopper');
		    }
		    var showRuralVolume=function(){
		    	switching('showRuralVolume');
		    
		    }
		    var showUrbanConsumer=function(){
		    	switching('showUrbanConsumer');
		    }
		    var showUrbanShopper=function(){
		    	switching('showUrbanShopper');
		    }
		    var showUrbanVolume=function(){
		    	switching('showUrbanVolume');

		    }
		    var showRetailerKey=function(){
		    	switching('showRetailerKey');
		    }

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

			var loadAwareness=function(category){
				$scope.brandNames=new Array();
				var url='/getMR-awarenessEvolution/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					var count=0;
					for(var i=0;i<data.data[0].brandInfo.length;i++){
						if(data.data[0].brandInfo[i].parentCategoryID==category){
							$scope.brandNames[count]=data.data[0].brandInfo[i].brandName;
							if(data.data[0].brandInfo[i].latestAwareness[1]>=data.data[0].brandInfo[i].previousAwareness[1]){
								$scope.valueRural[count]=data.data[0].brandInfo[i].previousAwareness[1];
								$scope.increaseRural[count]=data.data[0].brandInfo[i].latestAwareness[1]-data.data[0].brandInfo[i].previousAwareness[1];
								$scope.dropRural[count]=0;
							}else{
								$scope.valueRural[count]=data.data[0].brandInfo[i].latestAwareness[1];
								$scope.dropRural[count]=data.data[0].brandInfo[i].previousAwareness[1]-data.data[0].brandInfo[i].latestAwareness[1];
								$scope.increaseRural[count]=0;
							}
							if(data.data[0].brandInfo[i].latestAwareness[0]>=data.data[0].brandInfo[i].previousAwareness[0]){
								$scope.valueUrban[count]=data.data[0].brandInfo[i].previousAwareness[0];
								$scope.increaseUrban[count]=data.data[0].brandInfo[i].latestAwareness[0]-data.data[0].brandInfo[i].previousAwareness[0];
								$scope.dropUrban[count]=0;
							}else{
								$scope.valueUrban[count]=data.data[0].brandInfo[i].latestAwareness[0];
								$scope.dropUrban[count]=data.data[0].brandInfo[i].previousAwareness[0]-data.data[0].brandInfo[i].latestAwareness[0];
								$scope.increaseUrban[count]=0;
							}
							count++;
						}
					}
					$scope.chart1Series=[{
						name:'Drop',data:$scope.dropRural,color:'#D9534F'
					},{
						name:'Increase',data:$scope.increaseRural,color:'#5CB85C'
					},{
						name:'Value',data:$scope.valueRural,color:'#DDDDDD'
					}];
					$scope.chart1Config={
						options:{
							chart:{type:'bar'},
							plotOptions:{series:{stacking:'normal'}},
							xAxis:{categories:$scope.brandNames},
							yAxis:{title:{text:''}
						}
					},
						series:$scope.chart1Series,
						title:{text:Label.getContent('Rural')}
					}
					$scope.chart2Series=[{
						name:'Drop',data:$scope.dropUrban,color:'#D9534F'
					},{
						name:'Increase',data:$scope.increaseUrban,color:'#5CB85C'
					},{
						name:'Value',data:$scope.valueUrban,color:'#DDDDDD'
					}];
					$scope.chart2Config={
						options:{
							chart:{type:'bar'},
							plotOptions:{series:{stacking:'normal'}},
							xAxis:{categories:$scope.brandNames},
							yAxis:{title:{text:''}
						}
					},
						series:$scope.chart2Series,
						title:{text:Label.getContent('Urban')}
					}
				})
			}

			var showAwarenessElecssories=function(){
				switching('showAwarenessElecssories');
				$scope.valueRural=new Array();$scope.valueUrban=new Array();$scope.dropRural=new Array();$scope.dropUrban=new Array();$scope.increaseRural=new Array();$scope.increaseUrban=new Array();
				loadAwareness(1);
			}

			var showAwarenessHealthBeauties=function(){
				switching('showAwarenessHealthBeauties');
				$scope.valueRural=new Array();$scope.valueUrban=new Array();$scope.dropRural=new Array();$scope.dropUrban=new Array();$scope.increaseRural=new Array();$scope.increaseUrban=new Array();
				loadAwareness(2);
			}

			var loadBrandPerceptions=function(category,market){
				$scope.quality1s=new Array();$scope.quality2s=new Array();$scope.quality3s=new Array();$scope.quality5s=new Array();$scope.quality6s=new Array();$scope.price1s=new Array();$scope.price2s=new Array();$scope.price3s=new Array();$scope.price5s=new Array();$scope.price6s=new Array();
				var url='/getMR-variantPerceptionEvolution/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].variantInfo.length;i++){
						if(category==data.data[0].variantInfo[i].parentCategoryID){
							switch(data.data[0].variantInfo[i].parentCompanyID){
								case 1:$scope.quality1s.push([data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[0],data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);$scope.price1s.push([1,data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
								case 2:$scope.quality2s.push([data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[0],data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);$scope.price2s.push([1,data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
								case 3:$scope.quality3s.push([data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[0],data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);$scope.price3s.push([1,data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
								case 5:$scope.quality5s.push([data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[0],data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);$scope.price5s.push([1,data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
								case 6:$scope.quality6s.push([data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[0],data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[1],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);$scope.price6s.push([1,data.data[0].variantInfo[i].marketInfo[market-1].latestPerception[2],data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName]);break;
							}
						}
					}
					$scope.mySeries1=[{
						name:Label.getContent('Supplier')+' 1',data:$scope.quality1s,color:'#3257A7'
					},{
						name:Label.getContent('Supplier')+' 2',data:$scope.quality2s,color:'#B11E22'
					},{
						name:Label.getContent('Supplier')+' 3',data:$scope.quality3s,color:'#F6B920'
					},{
						name:Label.getContent('Retailer')+' 1',data:$scope.quality5s,color:'#8B288B'
					},{
						name:Label.getContent('Retailer')+' 2',data:$scope.quality6s,color:'#F05422'
					}];
					$scope.mySeries2=[{
						name:Label.getContent('Supplier')+' 1',data:$scope.price1s,color:'#3257A7'
					},{
						name:Label.getContent('Supplier')+' 2',data:$scope.price2s,color:'#B11E22'
					},{
						name:Label.getContent('Supplier')+' 3',data:$scope.price3s,color:'#F6B920'
					},{
						name:Label.getContent('Retailer')+' 1',data:$scope.price5s,color:'#8B288B'
					},{
						name:Label.getContent('Retailer')+' 2',data:$scope.price6s,color:'#F05422'
					}];
					$scope.myModel=category+" "+market;
				},function(){
					console.log('fail');
				})
			}

			var showRuralElecssoriesBrand=function(){
				switching('showRuralElecssoriesBrand');
				$scope.xTitle1="Easy of Use";
				$scope.yTitle1="Quality";
				$scope.yTitle2="Price Appeal";
				loadBrandPerceptions(1,2);
			}
			var showUrbanElecssoriesBrand=function(){
				switching('showUrbanElecssoriesBrand');
				$scope.xTitle1="Easy of Use";
				$scope.yTitle1="Quality";
				$scope.yTitle2="Price Appeal";
				loadBrandPerceptions(1,1);
			}
			var showRuralHealthBeautiesBrand=function(){
				switching('showRuralHealthBeautiesBrand');
				$scope.xTitle1="Performance";
				$scope.yTitle1="Gentleness";
				$scope.yTitle2="Price Appeal";
				loadBrandPerceptions(2,2);
			}
			var showUrbanHealthBeautiesBrand=function(){
				switching('showUrbanHealthBeautiesBrand');
				$scope.xTitle1="Performance";
				$scope.yTitle1="Gentleness";
				$scope.yTitle2="Price Appeal";
				loadBrandPerceptions(2,1);
			}
			var showRetailerPerceptions=function(){
				switching('showRetailerPerceptions');
				$scope.player1es=new Array();$scope.player2es=new Array();$scope.player3es=new Array();$scope.player4es=new Array();$scope.player5es=new Array();$scope.player6es=new Array();$scope.player1hs=new Array();$scope.player2hs=new Array();$scope.player3hs=new Array();$scope.player4hs=new Array();$scope.player5hs=new Array();$scope.player6hs=new Array();
				var url='/getMR-retailerPerceptionEvolution/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].storeInfo.length;i++){
						switch(data.data[0].storeInfo[i].storeID){
							case 1:$scope.player1es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player1hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 2:$scope.player2es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player2hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 3:$scope.player3es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player3hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 4:$scope.player4es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player4hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 5:$scope.player5es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player5hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 6:$scope.player6es.push([data.data[0].storeInfo[i].marketInfo[0].latestPerception[1],data.data[0].storeInfo[i].marketInfo[0].latestPerception[0],10]);$scope.player6hs.push([data.data[0].storeInfo[i].marketInfo[1].latestPerception[1],data.data[0].storeInfo[i].marketInfo[1].latestPerception[0],10]);break;
							case 7:break;
						}
					}
					$scope.mySeries1=[{
						name:Label.getContent('Retailer')+' 1',data:$scope.player1es,color:'#3257A7'
					},{
						name:Label.getContent('Retailer')+' 2',data:$scope.player2es,color:'#B11E22'
					},{
						name:Label.getContent('Traditional Trade'),data:$scope.player3es,color:'#F6B920'
					},{
						name:Label.getContent('Supplier 1 Online'),data:$scope.player4es,color:'#8B288B'
					},{
						name:Label.getContent('Supplier 2 Online'),data:$scope.player5es,color:'#F05422'
					},{
						name:Label.getContent('Supplier 3 Online'),data:$scope.player6es,color:'#329444'
					}];
					$scope.mySeries2=[{
						name:Label.getContent('Retailer')+' 1',data:$scope.player1hs,color:'#3257A7'
					},{
						name:Label.getContent('Retailer')+' 2',data:$scope.player2hs,color:'#B11E22'
					},{
						name:Label.getContent('Traditional Trade'),data:$scope.player3hs,color:'#F6B920'
					},{
						name:Label.getContent('Supplier 1 Online'),data:$scope.player4hs,color:'#8B288B'
					},{
						name:Label.getContent('Supplier 2 Online'),data:$scope.player5hs,color:'#F05422'
					},{
						name:Label.getContent('Supplier 3 Online'),data:$scope.player6hs,color:'#329444'
					}];
					$scope.myModel="RetailerPerceptions";

				},function(){
					console.log('fail');
				})
			}

			var loadMarketConsumer=function(url,category,market){
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].absoluteValue.length;i++){
						if(data.data[0].absoluteValue[i].parentCategoryID==category){
							var variantName=data.data[0].absoluteValue[i].variantName;
							var brandName=data.data[0].absoluteValue[i].parentBrandName;
							var priceValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
							var moneyValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
							var fashionValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
							var freaksValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
							var Changes=_.find(data.data[0].valueChange,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var priceValueChange=Changes.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
							var moneyValueChange=Changes.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
							var fashionValueChange=Changes.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
							var freaksValueChange=Changes.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
							var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var priceVolume=Volumes.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
							var moneyVolume=Volumes.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
							var fashionVolume=Volumes.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
							var freaksVolume=Volumes.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
							var priceVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
							var moneyVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
							var fashionVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
							var freaksVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
							switch(data.data[0].absoluteValue[i].parentCompanyID){
								case 1:$scope.player1s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
								case 2:$scope.player2s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
								case 3:$scope.player3s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
								case 5:$scope.player5s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
								case 6:$scope.player6s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
							}
						}
					}
				},function(){
					console.log('fail');
				})
			}

			var showRuralElecssoriesConsumerShare=function(){
				switching('showRuralElecssoriesConsumerShare');
				$scope.consumerShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,1,2);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanElecssoriesConsumerShare=function(){
				switching('showUrbanElecssoriesConsumerShare');
				$scope.consumerShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,1,1);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#FCF8E3';//黄
			}
			var showRuralHealthBeautiesConsumerShare=function(){
				switching('showRuralHealthBeautiesConsumerShare');
				$scope.consumerShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,2,2);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanHealthBeautiesConsumerShare=function(){
				switching('showUrbanHealthBeautiesConsumerShare');
				$scope.consumerShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,2,1);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#FCF8E3';//黄
			}


			var showRuralElecssoriesConsumerSales=function(){
				switching('showRuralElecssoriesConsumerSales');
				$scope.consumerShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,1,2);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanElecssoriesConsumerSales=function(){
				switching('showUrbanElecssoriesConsumerSales');
				$scope.consumerShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,1,1);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#FCF8E3';//黄
			}
			var showRuralHealthBeautiesConsumerSales=function(){
				switching('showRuralHealthBeautiesConsumerSales');
				$scope.consumerShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,2,2);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanHealthBeautiesConsumerSales=function(){
				switching('showUrbanHealthBeautiesConsumerSales');
				$scope.consumerShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketConsumer(url,2,1);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#FCF8E3';//黄
			}

			var loadMarketShopper=function(url,category,market){
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].absoluteValue.length;i++){
						if(data.data[0].absoluteValue[i].parentCategoryID==category){
							var variantName=data.data[0].absoluteValue[i].variantName;
							var brandName=data.data[0].absoluteValue[i].parentBrandName;
							var bmValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
							var onlineValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
							var mixedValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
							var Changes=_.find(data.data[0].valueChange,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var bmValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
							var onlineValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
							var mixedValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
							var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
								return (obj.parentBrandName==brandName&&obj.variantName==variantName);
							});
							var bmVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
							var onlineVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
							var mixedVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
							var bmVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
							var onlineVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
							var mixedVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
							switch(data.data[0].absoluteValue[i].parentCompanyID){
								case 1:$scope.player1s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
								case 2:$scope.player2s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
								case 3:$scope.player3s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
								case 5:$scope.player5s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
								case 6:$scope.player6s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
							}
						}
					}
				},function(){
					console.log('fail');
				})
			}

			var showRuralElecssoriesShopperShare=function(){
				switching('showRuralElecssoriesShopperShare');
				$scope.shopperShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,1,2);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanElecssoriesShopperShare=function(){
				switching('showUrbanElecssoriesShopperShare');
				$scope.shopperShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,1,1);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#FCF8E3';//黄
			}
			var showRuralHealthBeautiesShopperShare=function(){
				switching('showRuralHealthBeautiesShopperShare');
				$scope.shopperShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,2,2);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanHealthBeautiesShopperShare=function(){
				switching('showUrbanHealthBeautiesShopperShare');
				$scope.shopperShare=true;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,2,1);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#FCF8E3';//黄
			}

			var showRuralElecssoriesShopperSales=function(){
				switching('showRuralElecssoriesShopperSales');
				$scope.shopperShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,1,2);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanElecssoriesShopperSales=function(){
				switching('showUrbanElecssoriesShopperSales');
				$scope.shopperShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,1,1);
				$scope.nameColor='#DFF0D8';//绿
				$scope.valueColor='#FCF8E3';//黄
			}
			var showRuralHealthBeautiesShopperSales=function(){
				switching('showRuralHealthBeautiesShopperSales');
				$scope.shopperShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,2,2);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#D9EDF7';//蓝
			}
			var showUrbanHealthBeautiesShopperSales=function(){
				switching('showUrbanHealthBeautiesShopperSales');
				$scope.shopperShare=false;
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				loadMarketShopper(url,2,1);
				$scope.nameColor='#F2DEDE'//红
				$scope.valueColor='#FCF8E3';//黄
			}

			var loadRetailerPrice=function(category){
				var url='/getMR-netMarketPrices/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].variantInfo.length;i++){
						if(data.data[0].variantInfo[i].parentCategoryID==category){
							var fullName=data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName;
							var rural1Value=rural1ValueChange=urban1Value=urban1ValueChange=rural2Value=rural2ValueChange=urban2Value=urban2ValueChange=0;
							if(data.data[0].variantInfo[i].accountInfo[0]!=undefined){
								rural1Value=data.data[0].variantInfo[i].accountInfo[0].latestNetMarketPrice[1];
								rural1ValueChange=data.data[0].variantInfo[i].accountInfo[0].netMarketPriceChange[1];
								urban1Value=data.data[0].variantInfo[i].accountInfo[0].latestNetMarketPrice[0];
								urban1ValueChange=data.data[0].variantInfo[i].accountInfo[0].netMarketPriceChange[0];
							}
							if(data.data[0].variantInfo[i].accountInfo[1]!=undefined){
								rural2Value=data.data[0].variantInfo[i].accountInfo[1].latestNetMarketPrice[1];
								rural2ValueChange=data.data[0].variantInfo[i].accountInfo[1].netMarketPriceChange[1];
								urban2Value=data.data[0].variantInfo[i].accountInfo[1].latestNetMarketPrice[0];
								urban2ValueChange=data.data[0].variantInfo[i].accountInfo[1].netMarketPriceChange[0];
							}
							switch(data.data[0].variantInfo[i].parentCompanyID){
								case 1:$scope.player1s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
								case 2:$scope.player2s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
								case 3:$scope.player3s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
								case 5:$scope.player5s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
								case 6:$scope.player6s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
							}
						}
					}
				},function(){
					console.log('fail');
				})
			}

			var showBMElecssories=function(){
				switching('showBMElecssories');
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				$scope.nameColor='#DFF0D8';//绿
				loadRetailerPrice(1);
			}
			var showBMHealthBeauties=function(){
				switching('showBMHealthBeauties');
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				$scope.nameColor='#F2DEDE'//红
				loadRetailerPrice(2);
			}

			var loadPromotion=function(category){
				var url='/getMR-pricePromotions/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					for(var i=0;i<data.data[0].variantInfo.length;i++){
						if(data.data[0].variantInfo[i].parentCategoryID==category){
							var fullName=data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName;
							var rural1Length=rural1Depth=urban1Length=urban1Depth=rural2Length=rural2Depth=urban2Length=urban2Depth=0;
							if(data.data[0].variantInfo[i].accountInfo[0]!=undefined){
								rural1Length=data.data[0].variantInfo[i].accountInfo[0].promoRate[1];
								rural1Depth=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[1];
								urban1Length=data.data[0].variantInfo[i].accountInfo[0].promoRate[0];
								urban1Depth=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[0];
							}
							if(data.data[0].variantInfo[i].accountInfo[1]!=undefined){
								rural2Length=data.data[0].variantInfo[i].accountInfo[1].promoRate[1];
								rural2Depth=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[1];
								urban2Length=data.data[0].variantInfo[i].accountInfo[1].promoRate[0];
								urban2Depth=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[0];
							}
							switch(data.data[0].variantInfo[i].parentCompanyID){
								case 1:$scope.player1s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
								case 2:$scope.player2s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
								case 3:$scope.player3s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
								case 5:$scope.player5s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
								case 6:$scope.player6s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
							}
						}
					}
				})
			}

			var showPromotionElecssories=function(){
				switching('showPromotionElecssories');
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				$scope.nameColor='#DFF0D8';//绿
				loadPromotion(1);
			}
			var showPromotionHealthBeauties=function(){
				switching('showPromotionHealthBeauties');
				$scope.player1s=new Array();$scope.player2s=new Array();$scope.player3s=new Array();$scope.player5s=new Array();$scope.player6s=new Array();
				$scope.nameColor='#F2DEDE'//红
				loadPromotion(2);
			}

			var showSupplierIntelligence=function(category){
				switching('showSupplierIntelligence');
				var myData=new Array();
				var url='/getMR-suppliersIntelligence/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					myData.push({
						'AdvertisingOnline_1e':data.data[0].supplierInfo[0].categoryInfo[0].advertisingOnLine,
						'AdvertisingOnline_2e':data.data[0].supplierInfo[1].categoryInfo[0].advertisingOnLine,
						'AdvertisingOnline_3e':data.data[0].supplierInfo[2].categoryInfo[0].advertisingOnLine,
						'AdvertisingOnline_1h':data.data[0].supplierInfo[0].categoryInfo[1].advertisingOnLine,
						'AdvertisingOnline_2h':data.data[0].supplierInfo[1].categoryInfo[1].advertisingOnLine,
						'AdvertisingOnline_3h':data.data[0].supplierInfo[2].categoryInfo[1].advertisingOnLine,
						'AdvertisingOffline_1e':data.data[0].supplierInfo[0].categoryInfo[0].advertisingOffLine,
						'AdvertisingOffline_2e':data.data[0].supplierInfo[1].categoryInfo[0].advertisingOffLine,
						'AdvertisingOffline_3e':data.data[0].supplierInfo[2].categoryInfo[0].advertisingOffLine,
						'AdvertisingOffline_1h':data.data[0].supplierInfo[0].categoryInfo[1].advertisingOffLine,
						'AdvertisingOffline_2h':data.data[0].supplierInfo[1].categoryInfo[1].advertisingOffLine,
						'AdvertisingOffline_3h':data.data[0].supplierInfo[2].categoryInfo[1].advertisingOffLine,
						'OnLineVisibility_1e':data.data[0].supplierInfo[0].categoryInfo[0].onLineVisibility,
						'OnLineVisibility_2e':data.data[0].supplierInfo[1].categoryInfo[0].onLineVisibility,
						'OnLineVisibility_3e':data.data[0].supplierInfo[2].categoryInfo[0].onLineVisibility,
						'OnLineVisibility_1h':data.data[0].supplierInfo[0].categoryInfo[1].onLineVisibility,
						'OnLineVisibility_2h':data.data[0].supplierInfo[1].categoryInfo[1].onLineVisibility,
						'OnLineVisibility_3h':data.data[0].supplierInfo[2].categoryInfo[1].onLineVisibility,
						'OnLineOther_1e':data.data[0].supplierInfo[0].categoryInfo[0].onLineOther,
						'OnLineOther_2e':data.data[0].supplierInfo[1].categoryInfo[0].onLineOther,
						'OnLineOther_3e':data.data[0].supplierInfo[2].categoryInfo[0].onLineOther,
						'OnLineOther_1h':data.data[0].supplierInfo[0].categoryInfo[1].onLineOther,
						'OnLineOther_2h':data.data[0].supplierInfo[1].categoryInfo[1].onLineOther,
						'OnLineOther_3h':data.data[0].supplierInfo[2].categoryInfo[1].onLineOther,
						'TechnologyLevel_1e':data.data[0].supplierInfo[0].categoryInfo[0].acquiredTechnologyLevel,
						'TechnologyLevel_2e':data.data[0].supplierInfo[1].categoryInfo[0].acquiredTechnologyLevel,
						'TechnologyLevel_3e':data.data[0].supplierInfo[2].categoryInfo[0].acquiredTechnologyLevel,
						'TechnologyLevel_1h':data.data[0].supplierInfo[0].categoryInfo[1].acquiredTechnologyLevel,
						'TechnologyLevel_2h':data.data[0].supplierInfo[1].categoryInfo[1].acquiredTechnologyLevel,
						'TechnologyLevel_3h':data.data[0].supplierInfo[2].categoryInfo[1].acquiredTechnologyLevel,
						'DesignLevel_1e':data.data[0].supplierInfo[0].categoryInfo[0].acquiredDesignLevel,
						'DesignLevel_2e':data.data[0].supplierInfo[1].categoryInfo[0].acquiredDesignLevel,
						'DesignLevel_3e':data.data[0].supplierInfo[2].categoryInfo[0].acquiredDesignLevel,
						'DesignLevel_1h':data.data[0].supplierInfo[0].categoryInfo[1].acquiredDesignLevel,
						'DesignLevel_2h':data.data[0].supplierInfo[1].categoryInfo[1].acquiredDesignLevel,
						'DesignLevel_3h':data.data[0].supplierInfo[2].categoryInfo[1].acquiredDesignLevel,
						'Capacity_1e':data.data[0].supplierInfo[0].categoryInfo[0].productionCapacityAvailable,
						'Capacity_2e':data.data[0].supplierInfo[1].categoryInfo[0].productionCapacityAvailable,
						'Capacity_3e':data.data[0].supplierInfo[2].categoryInfo[0].productionCapacityAvailable,
						'Capacity_1h':data.data[0].supplierInfo[0].categoryInfo[1].productionCapacityAvailable,
						'Capacity_2h':data.data[0].supplierInfo[1].categoryInfo[1].productionCapacityAvailable,
						'Capacity_3h':data.data[0].supplierInfo[2].categoryInfo[1].productionCapacityAvailable,
						'UtilizationRate_1e':data.data[0].supplierInfo[0].categoryInfo[0].capacityUtilisationRate,
						'UtilizationRate_2e':data.data[0].supplierInfo[1].categoryInfo[0].capacityUtilisationRate,
						'UtilizationRate_3e':data.data[0].supplierInfo[2].categoryInfo[0].capacityUtilisationRate,
						'UtilizationRate_1h':data.data[0].supplierInfo[0].categoryInfo[1].capacityUtilisationRate,
						'UtilizationRate_2h':data.data[0].supplierInfo[1].categoryInfo[1].capacityUtilisationRate,
						'UtilizationRate_3h':data.data[0].supplierInfo[2].categoryInfo[1].capacityUtilisationRate,
						'FlexibilityMax_1e':data.data[0].supplierInfo[0].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMax_2e':data.data[0].supplierInfo[1].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMax_3e':data.data[0].supplierInfo[2].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMax_1h':data.data[0].supplierInfo[0].categoryInfo[1].productionplanningFlexibility,
						'FlexibilityMax_2h':data.data[0].supplierInfo[1].categoryInfo[1].productionplanningFlexibility,
						'FlexibilityMax_3h':data.data[0].supplierInfo[2].categoryInfo[1].productionplanningFlexibility,
						'FlexibilityMin_1e':data.data[0].supplierInfo[0].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMin_2e':data.data[0].supplierInfo[1].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMin_3e':data.data[0].supplierInfo[2].categoryInfo[0].productionplanningFlexibility,
						'FlexibilityMin_1h':data.data[0].supplierInfo[0].categoryInfo[1].productionplanningFlexibility,
						'FlexibilityMin_2h':data.data[0].supplierInfo[1].categoryInfo[1].productionplanningFlexibility,
						'FlexibilityMin_3h':data.data[0].supplierInfo[2].categoryInfo[1].productionplanningFlexibility,
						'TradeSupport_1e':data.data[0].supplierInfo[0].categoryInfo[0].actualTradeSupport,
						'TradeSupport_2e':data.data[0].supplierInfo[1].categoryInfo[0].actualTradeSupport,
						'TradeSupport_3e':data.data[0].supplierInfo[2].categoryInfo[0].actualTradeSupport,
						'TradeSupport_1h':data.data[0].supplierInfo[0].categoryInfo[1].actualTradeSupport,
						'TradeSupport_2h':data.data[0].supplierInfo[1].categoryInfo[1].actualTradeSupport,
						'TradeSupport_3h':data.data[0].supplierInfo[2].categoryInfo[1].actualTradeSupport,
						'Negotiated_1e':data.data[0].supplierInfo[0].categoryInfo[0].negotiatedTradeSupport,
						'Negotiated_2e':data.data[0].supplierInfo[1].categoryInfo[0].negotiatedTradeSupport,
						'Negotiated_3e':data.data[0].supplierInfo[2].categoryInfo[0].negotiatedTradeSupport,
						'Negotiated_1h':data.data[0].supplierInfo[0].categoryInfo[1].negotiatedTradeSupport,
						'Negotiated_2h':data.data[0].supplierInfo[1].categoryInfo[1].negotiatedTradeSupport,
						'Negotiated_3h':data.data[0].supplierInfo[2].categoryInfo[1].negotiatedTradeSupport,
					});
					$scope.data=myData[0];
					console.log($scope.data);
				},function(){
					console.log('fail');
				})
			}
			var showRetailerIntelligence=function(){
				switching('showRetailerIntelligence');
				$scope.data=new Array();$scope.variants=new Array();$scope.player1es=new Array();$scope.player2es=new Array();$scope.player3es=new Array();$scope.player5es=new Array();$scope.player6es=new Array();$scope.player1hs=new Array();$scope.player2hs=new Array();$scope.player3hs=new Array();$scope.player5hs=new Array();$scope.player6hs=new Array();
				var url='/getMR-retailersIntelligence/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					data.data[0].retailerInfo[0].storeServiceLevel[2]=data.data[0].retailerInfo[1].storeServiceLevel[0];
					data.data[0].retailerInfo[0].storeServiceLevel[3]=data.data[0].retailerInfo[1].storeServiceLevel[1];
					data.data[0].retailerInfo[0].onlineAdvertising[2]=data.data[0].retailerInfo[1].onlineAdvertising[0];
					data.data[0].retailerInfo[0].onlineAdvertising[3]=data.data[0].retailerInfo[1].onlineAdvertising[1];
					data.data[0].retailerInfo[0].offlineAdvertising[2]=data.data[0].retailerInfo[1].offlineAdvertising[0];
					data.data[0].retailerInfo[0].offlineAdvertising[3]=data.data[0].retailerInfo[1].offlineAdvertising[1];
					data.data[0].retailerInfo[0].localAdvertising[2]=data.data[0].retailerInfo[1].localAdvertising[0];
					data.data[0].retailerInfo[0].localAdvertising[3]=data.data[0].retailerInfo[1].localAdvertising[1];
					$scope.data.push({'storeServiceLevel':data.data[0].retailerInfo[0].storeServiceLevel,'onlineAdvertising':data.data[0].retailerInfo[0].onlineAdvertising,'offlineAdvertising':data.data[0].retailerInfo[0].offlineAdvertising,'localAdvertising':data.data[0].retailerInfo[0].localAdvertising});
					for(var i=0;i<data.data[0].retailerInfo[0].variantInfo.length;i++){
						var variant=_.find(data.data[0].retailerInfo[1].variantInfo,function(obj){
							return (obj.variantName==data.data[0].retailerInfo[0].variantInfo[i].variantName&&obj.parentBrandName==data.data[0].retailerInfo[0].variantInfo[i].parentBrandName);
						})
						if(variant!=undefined){
							data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[2]=variant.shelfSpace[0];
							data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[3]=variant.shelfSpace[1];
						}else{
							data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[2]=0;
							data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[3]=0;
						}
						$scope.variants.push(data.data[0].retailerInfo[0].variantInfo[i]);
					}
					for(var i=0;i<data.data[0].retailerInfo[1].variantInfo.length;i++){
						var variant=_.find($scope.variants,function(obj){
							return (obj.variantName==data.data[0].retailerInfo[1].variantInfo[i].variantName&&obj.parentBrandName==data.data[0].retailerInfo[1].variantInfo[i].parentBrandName);
						});
						if(variant==undefined){
							data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[2]=data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[0];
							data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[3]=data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[1];
							data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[0]=0;
							data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[1]=0;
							$scope.variants.push(data.data[0].retailerInfo[1].variantInfo[i]);
						}
					}
					for(var i=0;i<$scope.variants.length;i++){
						switch($scope.variants[i].parentCompanyID){
							case 1:if($scope.variants[i].parentCategoryID==1){
								$scope.player1es.push($scope.variants[i]);
							}else{
								$scope.player1hs.push($scope.variants[i]);
							}break;
							case 2:if($scope.variants[i].parentCategoryID==1){
								$scope.player2es.push($scope.variants[i]);
							}else{
								$scope.player2hs.push($scope.variants[i]);
							}break;
							case 3:if($scope.variants[i].parentCategoryID==1){
								$scope.player3es.push($scope.variants[i]);
							}else{
								$scope.player3hs.push($scope.variants[i]);
							}break;
							case 5:if($scope.variants[i].parentCategoryID==1){
								$scope.player5es.push($scope.variants[i]);
							}else{
								$scope.player5hs.push($scope.variants[i]);
							}break;
							case 6:if($scope.variants[i].parentCategoryID==1){
								$scope.player6es.push($scope.variants[i]);
							}else{
								$scope.player6hs.push($scope.variants[i]);
							}break;
						}
					}
				},function(){
					console.log('fail');
				})
			}
			var showForecastsConsumer=function(){
				switching('showForecastsConsumer');
				var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					$scope.mySeries1=[{
						'name':Label.getContent('Price Sensitive'),'color':'#329444',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Value For Money'),'color':'#F6B920',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Fashion'),'color':'#B11E22',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Freaks'),'color':'#3257A7',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[1]]]
					}];
					$scope.mySeries2=[{
						'name':Label.getContent('Price Sensitive'),'color':'#329444',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Value For Money'),'color':'#F6B920',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Fashion'),'color':'#B11E22',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Freaks'),'color':'#3257A7',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[0]]]
					}];
					$scope.mySeries3=[{
						'name':Label.getContent('Price Sensitive'),'color':'#329444',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Value For Money'),'color':'#F6B920',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Health Conscious'),'color':'#B11E22',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Impatient'),'color':'#3257A7',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[1]]]
					}];
					$scope.mySeries4=[{
						'name':Label.getContent('Price Sensitive'),'color':'#329444',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Value For Money'),'color':'#F6B920',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Health Conscious'),'color':'#B11E22',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Impatient'),'color':'#3257A7',
						'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[0]]]
					}];
					$scope.segmentYTitle=Label.getContent('Segment Size')+'(%)';
					$scope.segmentXTitle=Label.getContent('Period');
					$scope.title1=Label.getContent('Elecssories')+'-'+Label.getContent('Rural');
					$scope.title2=Label.getContent('Elecssories')+'-'+Label.getContent('Urban');
					$scope.title3=Label.getContent('HealthBeauties')+'-'+Label.getContent('Rural');
					$scope.title4=Label.getContent('HealthBeauties')+'-'+Label.getContent('Urban');
					$scope.myModel='Consumer Segment Size';
				},function(){
					console.log('fail');
				})
			}
			var showForecastsShopper=function(){
				switching('showForecastsShopper');
				var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					$scope.mySeries1=[{
						'name':Label.getContent('B&M Only'),'color':'#3257A7',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Online Only'),'color':'#B11E22',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Mixed'),'color':'#F6B920',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[1]]]
					}];
					$scope.mySeries2=[{
						'name':Label.getContent('B&M Only'),'color':'#3257A7',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Online Only'),'color':'#B11E22',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Mixed'),'color':'#F6B920',
						'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[0]]]
					}];
					$scope.mySeries3=[{
						'name':Label.getContent('B&M Only'),'color':'#3257A7',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Online Only'),'color':'#B11E22',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Mixed'),'color':'#F6B920',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[1]]]
					}];
					$scope.mySeries4=[{
						'name':Label.getContent('B&M Only'),'color':'#3257A7',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Online Only'),'color':'#B11E22',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[0]]]
					},{
						'name':Label.getContent('Mixed'),'color':'#F6B920',
						'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[0]]]
					}];
					$scope.segmentYTitle=Label.getContent('Segment Size')+'(%)';
					$scope.segmentXTitle=Label.getContent('Period');
					$scope.title1=Label.getContent('Elecssories')+'-'+Label.getContent('Rural');
					$scope.title2=Label.getContent('Elecssories')+'-'+Label.getContent('Urban');
					$scope.title3=Label.getContent('HealthBeauties')+'-'+Label.getContent('Rural');
					$scope.title4=Label.getContent('HealthBeauties')+'-'+Label.getContent('Urban');
					$scope.myModel='Shopper Segment Size';
				},function(){
					console.log('fail');
				})
			}
			var showForecastsCategory=function(){
				switching('showForecastsCategory');
				var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					$scope.forecastSeries=[{
						'name':Label.getContent('Elecssories')+'/'+Label.getContent('Rural'),'color':'#329444',
						'data':[[1,data.data[0].minTotalVolume[0].periodInfo[0].value[1],data.data[0].maxTotalVolume[0].periodInfo[0].value[1]],[2,data.data[0].minTotalVolume[0].periodInfo[1].value[1],data.data[0].maxTotalVolume[0].periodInfo[1].value[1]],[3,data.data[0].minTotalVolume[0].periodInfo[2].value[1],data.data[0].maxTotalVolume[0].periodInfo[2].value[1]],[4,data.data[0].minTotalVolume[0].periodInfo[3].value[1],data.data[0].maxTotalVolume[0].periodInfo[3].value[1]],[5,data.data[0].minTotalVolume[0].periodInfo[4].value[1],data.data[0].maxTotalVolume[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Elecssories')+'/'+Label.getContent('Urban'),'color':'#F6B920',
						'data':[[1,data.data[0].minTotalVolume[0].periodInfo[0].value[0],data.data[0].maxTotalVolume[0].periodInfo[0].value[0]],[2,data.data[0].minTotalVolume[0].periodInfo[1].value[0],data.data[0].maxTotalVolume[0].periodInfo[1].value[0]],[3,data.data[0].minTotalVolume[0].periodInfo[2].value[0],data.data[0].maxTotalVolume[0].periodInfo[2].value[0]],[4,data.data[0].minTotalVolume[0].periodInfo[3].value[0],data.data[0].maxTotalVolume[0].periodInfo[3].value[0]],[5,data.data[0].minTotalVolume[0].periodInfo[4].value[0],data.data[0].maxTotalVolume[0].periodInfo[4].value[0]]]	
					},{
						'name':Label.getContent('HealthBeauties')+'/'+Label.getContent('Rural'),'color':'#B11E22',
						'data':[[1,data.data[0].minTotalVolume[1].periodInfo[0].value[1],data.data[0].maxTotalVolume[1].periodInfo[0].value[1]],[2,data.data[0].minTotalVolume[1].periodInfo[1].value[1],data.data[0].maxTotalVolume[1].periodInfo[1].value[1]],[3,data.data[0].minTotalVolume[1].periodInfo[2].value[1],data.data[0].maxTotalVolume[1].periodInfo[2].value[1]],[4,data.data[0].minTotalVolume[1].periodInfo[3].value[1],data.data[0].maxTotalVolume[1].periodInfo[3].value[1]],[5,data.data[0].minTotalVolume[1].periodInfo[4].value[1],data.data[0].maxTotalVolume[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('HealthBeauties')+'/'+Label.getContent('Urban'),'color':'#3257A7',
						'data':[[1,data.data[0].minTotalVolume[1].periodInfo[0].value[0],data.data[0].maxTotalVolume[1].periodInfo[0].value[0]],[2,data.data[0].minTotalVolume[1].periodInfo[1].value[0],data.data[0].maxTotalVolume[1].periodInfo[1].value[0]],[3,data.data[0].minTotalVolume[1].periodInfo[2].value[0],data.data[0].maxTotalVolume[1].periodInfo[2].value[0]],[4,data.data[0].minTotalVolume[1].periodInfo[3].value[0],data.data[0].maxTotalVolume[1].periodInfo[3].value[0]],[5,data.data[0].minTotalVolume[1].periodInfo[4].value[0],data.data[0].maxTotalVolume[1].periodInfo[4].value[0]]]
					}];
					$scope.segmentYTitle=Label.getContent('Sales Volume')+'(units mln)';
					$scope.segmentXTitle=Label.getContent('Period');
					$scope.myModel='ForecastsCategory';
				},function(){
					console.log('fail');
				})
			}
			var showForecastsInternet=function(){
				switching('showForecastsInternet');
				var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					$scope.forecastSeries=[{
						'name':Label.getContent('Rural'),'color':'#3257A7',
						'data':[[1,data.data[0].minInternetPenetrationRate[0].value[1],data.data[0].maxInternetPenetrationRate[0].value[1]],[2,data.data[0].minInternetPenetrationRate[1].value[1],data.data[0].maxInternetPenetrationRate[1].value[1]],[3,data.data[0].minInternetPenetrationRate[2].value[1],data.data[0].maxInternetPenetrationRate[2].value[1]],[4,data.data[0].minInternetPenetrationRate[3].value[1],data.data[0].maxInternetPenetrationRate[3].value[1]],[5,data.data[0].minInternetPenetrationRate[4].value[1],data.data[0].maxInternetPenetrationRate[4].value[1]]]
					},{
						'name':Label.getContent('Urban'),'color':'#B11E22',
						'data':[[1,data.data[0].minInternetPenetrationRate[0].value[0],data.data[0].maxInternetPenetrationRate[0].value[0]],[2,data.data[0].minInternetPenetrationRate[1].value[0],data.data[0].maxInternetPenetrationRate[1].value[0]],[3,data.data[0].minInternetPenetrationRate[2].value[0],data.data[0].maxInternetPenetrationRate[2].value[0]],[4,data.data[0].minInternetPenetrationRate[3].value[0],data.data[0].maxInternetPenetrationRate[3].value[0]],[5,data.data[0].minInternetPenetrationRate[4].value[0],data.data[0].maxInternetPenetrationRate[4].value[0]]]
					}];
					$scope.segmentYTitle=Label.getContent('Penetration Level')+'(%)';
					$scope.segmentXTitle=Label.getContent('Period');
					$scope.myModel='ForecastsInternet';
					
				},function(){
					console.log('fail');
				})
			}
		    //load Function
		    $scope.switching=switching;
		    $scope.loadValue=loadValue;
		    $scope.loadVariantValue=loadVariantValue;
		    //general report
		    $scope.showPerformance=showPerformance;
		    $scope.showMarketShare=showMarketShare;
		    $scope.showMarketSales=showMarketSales;
		    $scope.showSegment=showSegment;
		    $scope.showCross=showCross;
		    $scope.showProduct=showProduct;
		  	$scope.showEMallPrices=showEMallPrices;
		  	//producer report	
			$scope.showProducerConsolidate=showProducerConsolidate;
			$scope.showProducerBMBusiness=showProducerBMBusiness;
			$scope.showProducerOnlineBusiness=showProducerOnlineBusiness;
			$scope.showProducerProfitability=showProducerProfitability;
			$scope.showProducerNegotiations=showProducerNegotiations;
			$scope.showElecssoriesConsumer=showElecssoriesConsumer;
			$scope.showElecssoriesShopper=showElecssoriesShopper;
			$scope.showElecssoriesVolume=showElecssoriesVolume;
			$scope.showHealthBeautiesConsumer=showHealthBeautiesConsumer;
			$scope.showHealthBeautiesShopper=showHealthBeautiesShopper;
			$scope.showHealthBeautiesVolume=showHealthBeautiesVolume;
			$scope.showProducerKey=showProducerKey;
			//retailer report
			$scope.showRetailerConsolidate=showRetailerConsolidate;
			$scope.showRetailerRuralProfit=showRetailerRuralProfit;
			$scope.showRetailerUrbanProfit=showRetailerUrbanProfit;
			$scope.showRetailerProfitability=showRetailerProfitability;
			$scope.showRetailerNegotiations=showRetailerNegotiations;
			$scope.showRuralConsumer=showRuralConsumer;
			$scope.showRuralShopper=showRuralShopper;
			$scope.showRuralVolume=showRuralVolume;
			$scope.showUrbanConsumer=showUrbanConsumer;
			$scope.showUrbanShopper=showUrbanShopper;
			$scope.showUrbanVolume=showUrbanVolume;
			$scope.showRetailerKey=showRetailerKey;
			//market report			
			$scope.showAwarenessElecssories=showAwarenessElecssories;
			$scope.showAwarenessHealthBeauties=showAwarenessHealthBeauties;
			$scope.showRuralElecssoriesBrand=showRuralElecssoriesBrand;
			$scope.showUrbanElecssoriesBrand=showUrbanElecssoriesBrand;
			$scope.showRuralHealthBeautiesBrand=showRuralHealthBeautiesBrand;
			$scope.showUrbanHealthBeautiesBrand=showUrbanHealthBeautiesBrand;
			$scope.showRetailerPerceptions=showRetailerPerceptions;
			$scope.showRuralElecssoriesConsumerShare=showRuralElecssoriesConsumerShare;
			$scope.showUrbanElecssoriesConsumerShare=showUrbanElecssoriesConsumerShare;
			$scope.showRuralHealthBeautiesConsumerShare=showRuralHealthBeautiesConsumerShare;
			$scope.showUrbanHealthBeautiesConsumerShare=showUrbanHealthBeautiesConsumerShare;
			$scope.showRuralElecssoriesConsumerSales=showRuralElecssoriesConsumerSales;
			$scope.showUrbanElecssoriesConsumerSales=showUrbanElecssoriesConsumerSales;
			$scope.showRuralHealthBeautiesConsumerSales=showRuralHealthBeautiesConsumerSales;
			$scope.showUrbanHealthBeautiesConsumerSales=showUrbanHealthBeautiesConsumerSales;
			$scope.showRuralElecssoriesShopperShare=showRuralElecssoriesShopperShare;
			$scope.showUrbanElecssoriesShopperShare=showUrbanElecssoriesShopperShare;
			$scope.showRuralHealthBeautiesShopperShare=showRuralHealthBeautiesShopperShare;
			$scope.showUrbanHealthBeautiesShopperShare=showUrbanHealthBeautiesShopperShare;
			$scope.showRuralElecssoriesShopperSales=showRuralElecssoriesShopperSales;
			$scope.showUrbanElecssoriesShopperSales=showUrbanElecssoriesShopperSales;
			$scope.showRuralHealthBeautiesShopperSales=showRuralHealthBeautiesShopperSales;
			$scope.showUrbanHealthBeautiesShopperSales=showUrbanHealthBeautiesShopperSales;
		    $scope.showBMElecssories=showBMElecssories;
		    $scope.showBMHealthBeauties=showBMHealthBeauties;
		    $scope.showPromotionElecssories=showPromotionElecssories;
		    $scope.showPromotionHealthBeauties=showPromotionHealthBeauties;
		    $scope.showSupplierIntelligence=showSupplierIntelligence;
		    $scope.showRetailerIntelligence=showRetailerIntelligence;
		    $scope.showForecastsConsumer=showForecastsConsumer;
		    $scope.showForecastsShopper=showForecastsShopper;
		    $scope.showForecastsCategory=showForecastsCategory;
		    $scope.showForecastsInternet=showForecastsInternet;
		  	showPerformance();
	}]);

});
