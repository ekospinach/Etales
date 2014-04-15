define(['directives', 'services'], function(directives){

    directives.directive('retailerRuralProfit', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerRuralProfit.html',            
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

                var loadVariantValue=function(data,brandName,variantName,num){
                    var array=_.find(data,function(obj){
                        return (obj.variantName==variantName&&obj.parentBrandName==brandName);
                    });
                    return array.value[num];
                }

                scope.openRetailerProductModal=function(brandName,type){
                    scope.retailerProductModal=true;
                    var num=0;
                    scope.variants=new Array();
                    scope.brandName=brandName;
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
                                scope.variants.push({'variantName':variantName,'Sales':Sales,'PromotionsCost':PromotionsCost,'OtherCompensation':OtherCompensation,'NetSales':NetSales,'NetSalesChange':NetSalesChange,'NetSalesShareInCategory':NetSalesShareInCategory,
                                    'CostOfGoodsSold':CostOfGoodsSold,'ValueOfQuantityDiscounts':ValueOfQuantityDiscounts,'ValueOfPerformanceBonus':ValueOfPerformanceBonus,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
                                    'GrossProfitChange':GrossProfitChange,'GrossProfitMargin':GrossProfitMargin,'GrossProfitShareInCategory':GrossProfitShareInCategory,'GeneralExpenses':GeneralExpenses,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,
                                    'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'OperatingProfitMarginShareInCategory':OperatingProfitMarginShareInCategory});
                            }
                        }
                    },function(){
                        console.log('fail');
                    })
                }
                scope.retailerProductOpts = {
                    backdropFade: true,
                    dialogFade:true
                };
                scope.closeRetailerProductModal=function(){
                    scope.retailerProductModal=false;  
                }

                var loadRetailerTotal=function(data){
                    scope.Sales=data.data[0].rcrpl_Sales;
                    scope.PromotionsCost=data.data[0].rcrpl_PromotionsCost;
                    scope.OtherCompensation=data.data[0].rcrpl_OtherCompensation;
                    scope.NetSales=data.data[0].rcrpl_NetSales;
                    scope.NetSalesChange=data.data[0].rcrpl_NetSalesChange;
                    scope.CostOfGoodsSold=data.data[0].rcrpl_CostOfGoodsSold;
                    scope.ValueOfQuantityDiscounts=data.data[0].rcrpl_ValueOfQuantityDiscounts;
                    scope.ValueOfPerformanceBonus=data.data[0].rcrpl_ValueOfPerformanceBonus;
                    scope.DiscontinuedGoodsCost=data.data[0].rcrpl_DiscontinuedGoodsCost;
                    scope.InventoryHoldingCost=data.data[0].rcrpl_InventoryHoldingCost;
                    scope.GrossProfit=data.data[0].rcrpl_GrossProfit;
                    scope.GrossProfitChange=data.data[0].rcrpl_GrossProfitChange;
                    scope.GrossProfitMargin=data.data[0].rcrpl_GrossProfitMargin;
                    scope.GeneralExpenses=data.data[0].rcrpl_GeneralExpenses;
                    scope.OperatingProfit=data.data[0].rcrpl_OperatingProfit;
                    scope.OperatingProfitChange=data.data[0].rcrpl_OperatingProfitChange;
                    scope.OperatingProfitMargin=data.data[0].rcrpl_OperatingProfitMargin;
                    scope.Interest=data.data[0].rcrpl_Interest;
                    scope.Taxes=data.data[0].rcrpl_Taxes;
                    scope.ExceptionalItems=data.data[0].rcrpl_ExceptionalItems;
                    scope.NetProfit=data.data[0].rcrpl_NetProfit;
                    scope.NetProfitChange=data.data[0].rcrpl_NetProfitChange;
                    scope.NetProfitMargin=data.data[0].rcrpl_NetProfitMargin;
                }

                var loadUR=function(data,category,num){
                    if(category==1){
                        scope.brand1s=new Array();
                    }else{
                        scope.brand2s=new Array();
                    }
                    for(var i=0;i<data.data[0].rcrb_Sales.length;i++){
                        if(data.data[0].rcrb_Sales[i].parentCategoryID==category){
                            var brandName=data.data[0].rcrb_Sales[i].brandName;
                            var Sales=data.data[0].rcrb_Sales[i].value[num];
                            var PromotionsCost=loadValue(data.data[0].rcrb_PromotionsCost,brandName,num);
                            var OtherCompensation=loadValue(data.data[0].rcrb_OtherCompensation,brandName,num);
                            var NetSales=loadValue(data.data[0].rcrb_NetSales,brandName,num);
                            var NetSalesChange=loadValue(data.data[0].rcrb_NetSalesChange,brandName,num);
                            var NetSalesShareInCategory=loadValue(data.data[0].rcrb_NetSalesShareInCategory,brandName,num);
                            var CostOfGoodsSold=loadValue(data.data[0].rcrb_CostOfGoodsSold,brandName,num);
                            var ValueOfQuantityDiscounts=loadValue(data.data[0].rcrb_ValueOfQuantityDiscounts,brandName,num);
                            var ValueOfPerformanceBonus=loadValue(data.data[0].rcrb_ValueOfPerformanceBonus,brandName,num);
                            var DiscontinuedGoodsCost=loadValue(data.data[0].rcrb_DiscontinuedGoodsCost,brandName,num);
                            var InventoryHoldingCost=loadValue(data.data[0].rcrb_InventoryHoldingCost,brandName,num);
                            var GrossProfit=loadValue(data.data[0].rcrb_GrossProfit,brandName,num);
                            var GrossProfitChange=loadValue(data.data[0].rcrb_GrossProfitChange,brandName,num);
                            var GrossProfitMargin=loadValue(data.data[0].rcrb_GrossProfitMargin,brandName,num);
                            var GrossProfitShareInCategory=loadValue(data.data[0].rcrb_GrossProfitShareInCategory,brandName,num);
                            var GeneralExpenses=loadValue(data.data[0].rcrb_GeneralExpenses,brandName,num);
                            var OperatingProfit=loadValue(data.data[0].rcrb_OperatingProfit,brandName,num);
                            var OperatingProfitChange=loadValue(data.data[0].rcrb_OperatingProfitChange,brandName,num);
                            var OperatingProfitMargin=loadValue(data.data[0].rcrb_OperatingProfitMargin,brandName,num);
                            var OperatingProfitMarginShareInCategory=loadValue(data.data[0].rcrb_OperatingProfitMarginShareInCategory,brandName,num);
                            var Interest=loadValue(data.data[0].rcrb_Interest,brandName,num);
                            var Taxes=loadValue(data.data[0].rcrb_Taxes,brandName,num);
                            var ExceptionalItems=loadValue(data.data[0].rcrb_ExceptionalItems,brandName,num);
                            var NetProfit=loadValue(data.data[0].rcrb_NetProfit,brandName,num);
                            var NetProfitChange=loadValue(data.data[0].rcrb_NetProfitChange,brandName,num);
                            var NetProfitMargin=loadValue(data.data[0].rcrb_NetProfitMargin,brandName,num);
                            var NetProfitShareInCategory=loadValue(data.data[0].rcrb_NetProfitShareInCategory,brandName,num);
                            if(category==1){
                                scope.brand1s.push({'brandName':brandName,'Sales':Sales,'PromotionsCost':PromotionsCost,'OtherCompensation':OtherCompensation,'NetSales':NetSales,'NetSalesChange':NetSalesChange,'NetSalesShareInCategory':NetSalesShareInCategory,
                                    'CostOfGoodsSold':CostOfGoodsSold,'ValueOfQuantityDiscounts':ValueOfQuantityDiscounts,'ValueOfPerformanceBonus':ValueOfPerformanceBonus,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
                                    'GrossProfitChange':GrossProfitChange,'GrossProfitMargin':GrossProfitMargin,'GrossProfitShareInCategory':GrossProfitShareInCategory,'GeneralExpenses':GeneralExpenses,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,
                                    'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'OperatingProfitMarginShareInCategory':OperatingProfitMarginShareInCategory});
                            }else{
                                scope.brand2s.push({'brandName':brandName,'Sales':Sales,'PromotionsCost':PromotionsCost,'OtherCompensation':OtherCompensation,'NetSales':NetSales,'NetSalesChange':NetSalesChange,'NetSalesShareInCategory':NetSalesShareInCategory,
                                    'CostOfGoodsSold':CostOfGoodsSold,'ValueOfQuantityDiscounts':ValueOfQuantityDiscounts,'ValueOfPerformanceBonus':ValueOfPerformanceBonus,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
                                    'GrossProfitChange':GrossProfitChange,'GrossProfitMargin':GrossProfitMargin,'GrossProfitShareInCategory':GrossProfitShareInCategory,'GeneralExpenses':GeneralExpenses,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,
                                    'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'OperatingProfitMarginShareInCategory':OperatingProfitMarginShareInCategory});                      
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/RCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    loadRetailerTotal(data);
                    loadUR(data,1,1);
                    loadUR(data,2,1);
                
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