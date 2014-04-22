define(['directives', 'services'], function(directives){

    directives.directive('supplierBMBusiness', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierBMBusiness.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }
                var loadValue=function(data,name,num){
			    	var array=_.find(data,function(obj){
			    		return (obj.brandName==name);
			    	});
			    	return array.value[num];
			    }

			    var loadTotal=function(data){
			    	scope.sales=data.data[0].scrpl_Sales;
			    	scope.salesChanges=data.data[0].scrpl_SalesChange;
			    	scope.materialCosts=data.data[0].scrpl_MaterialCosts;
			    	scope.costGoodsSolds=data.data[0].scrpl_CostOfGoodsSold;
			    	scope.discontinuedGoodsCosts=data.data[0].scrpl_DiscontinuedGoodsCost;
			    	scope.holdingCosts=data.data[0].scrpl_InventoryHoldingCost;
			    	scope.grossProfits=data.data[0].scrpl_GrossProfit;
			    	scope.grossProfitChanges=data.data[0].scrpl_GrossProfitChange;
			    	scope.grossProfitMargins=data.data[0].scrpl_GrossProfitMargin;
			    	scope.expenseValues=data.data[0].scrpl_TradeAndMarketing;
			    	//some need to add
			    	scope.advertisingOnLines=data.data[0].scrpl_AdvertisingOnLine;
			    	scope.advertisingOffLines=data.data[0].scrpl_AdvertisingOffLine;
			    	scope.tradeSupports=data.data[0].scrpl_TradeSupport;
			    	scope.expenseShares=data.data[0].scrpl_TradeAndMarketingAsPercentageOfSales;
			    	scope.generalExpenses=data.data[0].scrpl_GeneralExpenses;
			    	scope.amortisations=data.data[0].scrpl_Amortisation;
			    	scope.operatingProfits=data.data[0].scrpl_OperatingProfit;
			    	scope.operatingProfitChanges=data.data[0].scrpl_OperatingProfitChange;
			    	scope.operatingProfitMargins=data.data[0].scrpl_OperatingProfitMargin;
			    	scope.interests=data.data[0].scrpl_Interest;
			    	scope.taxes=data.data[0].scrpl_Taxes;
			    	scope.costsProfits=data.data[0].scrpl_ExceptionalItems;
			    	scope.netProfits=data.data[0].scrpl_NetProfit;
			    	scope.netProfitChanges=data.data[0].scrpl_NetProfitChange;
			    	scope.netProfitMargins=data.data[0].scrpl_NetProfitMargin;		    	
			    }

			    var loadVariantValue=function(data,brandName,variantName,num){
			    	var array=_.find(data,function(obj){
			    		return (obj.variantName==variantName&&obj.parentBrandName==brandName);
			    	});
			    	return array.value[num];
			    }

			    var loadBusiness=function(data,category,num){
			    	if(category==1){
			    		scope.brand1s=new Array();
			    	}else{
			    		scope.brand2s=new Array();
			    	}
			    	for(var i=0;i<data.data[0].scrb_Sales.length;i++){
			    		if(data.data[0].scrb_Sales[i].parentCategoryID==category){
			    			var brandName=data.data[0].scrb_Sales[i].brandName;
			    			var Sales=data.data[0].scrb_Sales[i].value[num];
			    			var SalesChange=loadValue(data.data[0].scrb_SalesChange,brandName,num);
				    		var SalesShareInCategory=loadValue(data.data[0].scrb_SalesShareInCategory,brandName,num);
				    		var MaterialCosts=loadValue(data.data[0].scrb_MaterialCosts,brandName,num);
				    		var CostOfGoodsSold=loadValue(data.data[0].scrb_CostOfGoodsSold,brandName,num);
				    		var DiscontinuedGoodsCost=loadValue(data.data[0].scrb_DiscontinuedGoodsCost,brandName,num);
				    		var InventoryHoldingCost=loadValue(data.data[0].scrb_InventoryHoldingCost,brandName,num);
				    		var GrossProfit=loadValue(data.data[0].scrb_GrossProfit,brandName,num);
				    		var GrossProfitChange=loadValue(data.data[0].scrb_GrossProfitChange,brandName,num);
				    		var GrossProfitMargin=loadValue(data.data[0].scrb_GrossProfitMargin,brandName,num);
				    		var GrossProfitMarginShare=loadValue(data.data[0].scrb_GrossProfitShareInCategory,brandName,num);
				    		var TradeAndMarketing=loadValue(data.data[0].scrb_TradeAndMarketing,brandName,num);
				    		var AdvertisingOnLine=loadValue(data.data[0].scrb_AdvertisingOnLine,brandName,num);
				    		var AdvertisingOffLine=loadValue(data.data[0].scrb_AdvertisingOffLine,brandName,num);
				    		var TradeSupport=loadValue(data.data[0].scrb_TradeSupport,brandName,num);
				    		var TradeAndMarketingAsPercentageOfSales=loadValue(data.data[0].scrb_TradeAndMarketingAsPercentageOfSales,brandName,num);
				    		var TradeAndMarketingShareInCategory=loadValue(data.data[0].scrb_TradeAndMarketingShareInCategory,brandName,num);
				    		var GeneralExpenses=loadValue(data.data[0].scrb_GeneralExpenses,brandName,num);
				    		var Amortisation=loadValue(data.data[0].scrb_Amortisation,brandName,num);
				    		var OperatingProfit=loadValue(data.data[0].scrb_OperatingProfit,brandName,num);
				    		var OperatingProfitChange=loadValue(data.data[0].scrb_OperatingProfitChange,brandName,num);
				    		var OperatingProfitMargin=loadValue(data.data[0].scrb_OperatingProfitMargin,brandName,num);
				    		var OperatingProfitShareInCategory=loadValue(data.data[0].scrb_OperatingProfitShareInCategory,brandName,num);
				    		var Interest=loadValue(data.data[0].scrb_Interest,brandName,num);
				    		var Taxes=loadValue(data.data[0].scrb_Taxes,brandName,num);
				    		var ExceptionalItems=loadValue(data.data[0].scrb_ExceptionalItems,brandName,num);
				    		var NetProfit=loadValue(data.data[0].scrb_NetProfit,brandName,num);
				    		var NetProfitChange=loadValue(data.data[0].scrb_NetProfitChange,brandName,num);
				    		var NetProfitMargin=loadValue(data.data[0].scrb_NetProfitMargin,brandName,num);
				    		var NetProfitShareInCategory=loadValue(data.data[0].scrb_NetProfitShareInCategory,brandName,num);
				    		if(category==1){
								scope.brand1s.push({'brandName':brandName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
					    		'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
					    		'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
					   			'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare,'TradeSupport':TradeSupport});
				    		}else{
				   				scope.brand2s.push({'brandName':brandName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
				    			'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
				    			'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
				    			'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare,'TradeSupport':TradeSupport});
				    		}
			   			}
			    	}
			    }

			    scope.openProductModal=function(brandName,type){
                    var num=0;
                    scope.variants=new Array();
                    scope.brandName=brandName;
                    scope.productModal=true;
                    if(type="BM"){
                        scope.BMShow=true;
                        scope.OLShow=false;
                        num=0;
                    }else{
                        scope.BMShow=false;
                        scope.OLShow=true;
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
                                var GrossProfitMarginShare=loadVariantValue(data.data[0].scrv_GrossProfitShareInCategory,brandName,variantName,num);
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
                                scope.variants.push({'variantName':variantName,'Sales':Sales,'SalesChange':SalesChange,'SalesShareInCategory':SalesShareInCategory,'MaterialCosts':MaterialCosts,'CostOfGoodsSold':CostOfGoodsSold,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
                                'GrossProfitChange':GrossProfitChange,'TradeAndMarketing':TradeAndMarketing,'AdvertisingOnLine':AdvertisingOnLine,'AdvertisingOffLine':AdvertisingOffLine,'TradeAndMarketingAsPercentageOfSales':TradeAndMarketingAsPercentageOfSales,'TradeAndMarketingShareInCategory':TradeAndMarketingShareInCategory,
                                'GeneralExpenses':GeneralExpenses,'Amortisation':Amortisation,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitMargin':OperatingProfitMargin,'OperatingProfitShareInCategory':OperatingProfitShareInCategory,
                                'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'GrossProfitMargin':GrossProfitMargin,'GrossProfitMarginShare':GrossProfitMarginShare,'TradeSupport':TradeSupport});
                            }
                        }
                    },function(){
                        console.log('fail');
                    })
                }
                scope.productOpts = {
                    backdropFade: true,
                    dialogFade:true
                };
                scope.closeProductModal=function(){
                    scope.productModal=false;  
                }

                var getResult =function(){
                    var url='/SCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
			    	$http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
                    }).then(function(data){   
                        return organiseArray(data);
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    loadTotal(data);
		    		loadBusiness(data,1,0);
		    		loadBusiness(data,2,0);	
                
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })

            }
        }
    }])
})