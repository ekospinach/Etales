define(['directives', 'services'], function(directives){

    directives.directive('retailerUrbanProfit', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo','$modal', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo,$modal){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerUrbanProfit.html',            
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
                        return (obj.brandName==name&&obj.marketID==num);
                    });
                    if(array!=undefined){
                        return array.value.toFixed(2);
                    }else{
                        return 0;
                    }
                }

                

                scope.openRetailerProductModal=function(brandName,type){
                    var loadVariantValue=function(data,brandName,variantName,num){
                        var array=_.find(data,function(obj){
                            return (obj.variantName==variantName&&obj.parentBrandName==brandName&&obj.marketID==num);
                        });
                        if(array!=undefined){
                            return array.value.toFixed(2);
                        }else{
                            return -1;
                        }
                    }
                    var marketID=0;
                    scope.variants=new Array();
                    scope.brandName=brandName;
                    if(type=="Rural"){
                        marketID=2;
                    }else{
                        marketID=1;
                    }
                    var url='/RCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        for(var i=0;i<data.data[0].rcrv_Sales.length;i++){
                            if(data.data[0].rcrv_Sales[i].parentBrandName==brandName&&data.data[0].rcrv_Sales[i].marketID==marketID){
                                var variantName=data.data[0].rcrv_Sales[i].variantName;
                                var Sales=data.data[0].rcrv_Sales[i].value.toFixed(2);
                                var PromotionsCost=loadVariantValue(data.data[0].rcrv_PromotionsCost,brandName,variantName,marketID);
                                var OtherCompensation=loadVariantValue(data.data[0].rcrv_OtherCompensation,brandName,variantName,marketID);
                                var NetSales=loadVariantValue(data.data[0].rcrv_NetSales,brandName,variantName,marketID);
                                var NetSalesChange=loadVariantValue(data.data[0].rcrv_NetSalesChange,brandName,variantName,marketID);
                                var NetSalesShareInCategory=loadVariantValue(data.data[0].rcrv_NetSalesShareInCategory,brandName,variantName,marketID);
                                var CostOfGoodsSold=loadVariantValue(data.data[0].rcrv_CostOfGoodsSold,brandName,variantName,marketID);
                                var ValueOfQuantityDiscounts=loadVariantValue(data.data[0].rcrv_ValueOfQuantityDiscounts,brandName,variantName,marketID);
                                var ValueOfPerformanceBonus=loadVariantValue(data.data[0].rcrv_ValueOfPerformanceBonus,brandName,variantName,marketID);
                                var DiscontinuedGoodsCost=loadVariantValue(data.data[0].rcrv_DiscontinuedGoodsCost,brandName,variantName,marketID);
                                var InventoryHoldingCost=loadVariantValue(data.data[0].rcrv_InventoryHoldingCost,brandName,variantName,marketID);
                                var GrossProfit=loadVariantValue(data.data[0].rcrv_GrossProfit,brandName,variantName,marketID);
                                var GrossProfitChange=loadVariantValue(data.data[0].rcrv_GrossProfitChange,brandName,variantName,marketID);
                                var GrossProfitMargin=loadVariantValue(data.data[0].rcrv_GrossProfitMargin,brandName,variantName,marketID);
                                var GrossProfitShareInCategory=loadVariantValue(data.data[0].rcrv_GrossProfitShareInCategory,brandName,variantName,marketID);
                                var GeneralExpenses=loadVariantValue(data.data[0].rcrv_GeneralExpenses,brandName,variantName,marketID);
                                var OperatingProfit=loadVariantValue(data.data[0].rcrv_OperatingProfit,brandName,variantName,marketID);
                                var OperatingProfitChange=loadVariantValue(data.data[0].rcrv_OperatingProfitChange,brandName,variantName,marketID);
                                var OperatingProfitMargin=loadVariantValue(data.data[0].rcrv_OperatingProfitMargin,brandName,variantName,marketID);
                                var OperatingProfitMarginShareInCategory=loadVariantValue(data.data[0].rcrv_OperatingProfitMarginShareInCategory,brandName,variantName,marketID);
                                var Interest=loadVariantValue(data.data[0].rcrv_Interest,brandName,variantName,marketID);
                                var Taxes=loadVariantValue(data.data[0].rcrv_Taxes,brandName,variantName,marketID);
                                var ExceptionalItems=loadVariantValue(data.data[0].rcrv_ExceptionalItems,brandName,variantName,marketID);
                                var NetProfit=loadVariantValue(data.data[0].rcrv_NetProfit,brandName,variantName,marketID);
                                var NetProfitChange=loadVariantValue(data.data[0].rcrv_NetProfitChange,brandName,variantName,marketID);
                                var NetProfitMargin=loadVariantValue(data.data[0].rcrv_NetProfitMargin,brandName,variantName,marketID);
                                var NetProfitShareInCategory=loadVariantValue(data.data[0].rcrv_NetProfitShareInCategory,brandName,variantName,marketID);
                                scope.variants.push({'variantName':variantName,'Sales':Sales,'PromotionsCost':PromotionsCost,'OtherCompensation':OtherCompensation,'NetSales':NetSales,'NetSalesChange':NetSalesChange,'NetSalesShareInCategory':NetSalesShareInCategory,
                                    'CostOfGoodsSold':CostOfGoodsSold,'ValueOfQuantityDiscounts':ValueOfQuantityDiscounts,'ValueOfPerformanceBonus':ValueOfPerformanceBonus,'DiscontinuedGoodsCost':DiscontinuedGoodsCost,'InventoryHoldingCost':InventoryHoldingCost,'GrossProfit':GrossProfit,
                                    'GrossProfitChange':GrossProfitChange,'GrossProfitMargin':GrossProfitMargin,'GrossProfitShareInCategory':GrossProfitShareInCategory,'GeneralExpenses':GeneralExpenses,'OperatingProfit':OperatingProfit,'OperatingProfitChange':OperatingProfitChange,'OperatingProfitMargin':OperatingProfitMargin,
                                    'Interest':Interest,'Taxes':Taxes,'ExceptionalItems':ExceptionalItems,'NetProfit':NetProfit,'NetProfitChange':NetProfitChange,'NetProfitMargin':NetProfitMargin,'NetProfitShareInCategory':NetProfitShareInCategory,'OperatingProfitMarginShareInCategory':OperatingProfitMarginShareInCategory});
                            }
                        }
                        var modalInstance=$modal.open({
                            templateUrl:'../../partials/modal/retailerProfitProduct.html',
                            controller:retailerProfitProductModalCtrl
                        });
                        modalInstance.result.then(function(){
                            console.log('show Product')
                        })
                    },function(){
                        console.log('fail');
                    })
                }

                var retailerProfitProductModalCtrl=function($scope,$modalInstance,Label){
                    $scope.Label=Label;
                    $scope.variants=scope.variants;
                    $scope.brandName=scope.brandName;
                    var cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                    $scope.cancel=cancel;
                }

                var loadTotalValue=function(data){
                    var array=new Array();
                    for(var i=0;i<3;i++){
                        array[i]=new Array();
                    }
                    for(var i=0;i<data.length;i++){
                        switch(data[i].categoryID){
                            case 1:
                                if(data[i].marketID==1)array[0][0]=data[i].value;
                                if(data[i].marketID==2)array[0][1]=data[i].value;
                                if(data[i].marketID==3)array[0][2]=data[i].value;
                            break;
                            case 2:
                                if(data[i].marketID==1)array[1][0]=data[i].value;
                                if(data[i].marketID==2)array[1][1]=data[i].value;
                                if(data[i].marketID==3)array[1][2]=data[i].value;
                            break;
                            case 3:
                                if(data[i].marketID==1)array[2][0]=data[i].value;
                                if(data[i].marketID==2)array[2][1]=data[i].value;
                                if(data[i].marketID==3)array[2][2]=data[i].value;
                            break;
                        }
                    }
                    return array;
                }

                var loadRetailerTotal=function(data){
                    scope.Sales=loadTotalValue(data.data[0].rcrpl_Sales);
                    scope.PromotionsCost=loadTotalValue(data.data[0].rcrpl_PromotionsCost);
                    scope.OtherCompensation=loadTotalValue(data.data[0].rcrpl_OtherCompensation);
                    scope.NetSales=loadTotalValue(data.data[0].rcrpl_NetSales);
                    scope.NetSalesChange=loadTotalValue(data.data[0].rcrpl_NetSalesChange);
                    scope.CostOfGoodsSold=loadTotalValue(data.data[0].rcrpl_CostOfGoodsSold);
                    scope.ValueOfQuantityDiscounts=loadTotalValue(data.data[0].rcrpl_ValueOfQuantityDiscounts);
                    scope.ValueOfPerformanceBonus=loadTotalValue(data.data[0].rcrpl_ValueOfPerformanceBonus);
                    scope.DiscontinuedGoodsCost=loadTotalValue(data.data[0].rcrpl_DiscontinuedGoodsCost);
                    scope.InventoryHoldingCost=loadTotalValue(data.data[0].rcrpl_InventoryHoldingCost);
                    scope.GrossProfit=loadTotalValue(data.data[0].rcrpl_GrossProfit);
                    scope.GrossProfitChange=loadTotalValue(data.data[0].rcrpl_GrossProfitChange);
                    scope.GrossProfitMargin=loadTotalValue(data.data[0].rcrpl_GrossProfitMargin);
                    scope.GeneralExpenses=loadTotalValue(data.data[0].rcrpl_GeneralExpenses);
                    scope.OperatingProfit=loadTotalValue(data.data[0].rcrpl_OperatingProfit);
                    scope.OperatingProfitChange=loadTotalValue(data.data[0].rcrpl_OperatingProfitChange);
                    scope.OperatingProfitMargin=loadTotalValue(data.data[0].rcrpl_OperatingProfitMargin);
                    scope.Interest=loadTotalValue(data.data[0].rcrpl_Interest);
                    scope.Taxes=loadTotalValue(data.data[0].rcrpl_Taxes);
                    scope.ExceptionalItems=loadTotalValue(data.data[0].rcrpl_ExceptionalItems);
                    scope.NetProfit=loadTotalValue(data.data[0].rcrpl_NetProfit);
                    scope.NetProfitChange=loadTotalValue(data.data[0].rcrpl_NetProfitChange);
                    scope.NetProfitMargin=loadTotalValue(data.data[0].rcrpl_NetProfitMargin);
                }

                var loadUR=function(data,category,num){
                    if(category==1){
                        scope.brand1s=new Array();
                    }else{
                        scope.brand2s=new Array();
                    }
                    for(var i=0;i<data.data[0].rcrb_Sales.length;i++){
                        if(data.data[0].rcrb_Sales[i].parentCategoryID==category&&data.data[0].rcrb_Sales[i].marketID==num){
                            var brandName=data.data[0].rcrb_Sales[i].brandName;
                            var Sales=data.data[0].rcrb_Sales[i].value.toFixed(2);
                            var marketID=data.data[0].rcrb_Sales[i].marketID;
                            var PromotionsCost=loadValue(data.data[0].rcrb_PromotionsCost,brandName,marketID);
                            var OtherCompensation=loadValue(data.data[0].rcrb_OtherCompensation,brandName,marketID);
                            var NetSales=loadValue(data.data[0].rcrb_NetSales,brandName,marketID);
                            var NetSalesChange=loadValue(data.data[0].rcrb_NetSalesChange,brandName,marketID);
                            var NetSalesShareInCategory=loadValue(data.data[0].rcrb_NetSalesShareInCategory,brandName,marketID);
                            var CostOfGoodsSold=loadValue(data.data[0].rcrb_CostOfGoodsSold,brandName,marketID);
                            var ValueOfQuantityDiscounts=loadValue(data.data[0].rcrb_ValueOfQuantityDiscounts,brandName,marketID);
                            var ValueOfPerformanceBonus=loadValue(data.data[0].rcrb_ValueOfPerformanceBonus,brandName,marketID);
                            var DiscontinuedGoodsCost=loadValue(data.data[0].rcrb_DiscontinuedGoodsCost,brandName,marketID);
                            var InventoryHoldingCost=loadValue(data.data[0].rcrb_InventoryHoldingCost,brandName,marketID);
                            var GrossProfit=loadValue(data.data[0].rcrb_GrossProfit,brandName,marketID);
                            var GrossProfitChange=loadValue(data.data[0].rcrb_GrossProfitChange,brandName,marketID);
                            var GrossProfitMargin=loadValue(data.data[0].rcrb_GrossProfitMargin,brandName,marketID);
                            var GrossProfitShareInCategory=loadValue(data.data[0].rcrb_GrossProfitShareInCategory,brandName,marketID);
                            var GeneralExpenses=loadValue(data.data[0].rcrb_GeneralExpenses,brandName,marketID);
                            var OperatingProfit=loadValue(data.data[0].rcrb_OperatingProfit,brandName,marketID);
                            var OperatingProfitChange=loadValue(data.data[0].rcrb_OperatingProfitChange,brandName,marketID);
                            var OperatingProfitMargin=loadValue(data.data[0].rcrb_OperatingProfitMargin,brandName,marketID);
                            var OperatingProfitMarginShareInCategory=loadValue(data.data[0].rcrb_OperatingProfitMarginShareInCategory,brandName,marketID);
                            var Interest=loadValue(data.data[0].rcrb_Interest,brandName,marketID);
                            var Taxes=loadValue(data.data[0].rcrb_Taxes,brandName,marketID);
                            var ExceptionalItems=loadValue(data.data[0].rcrb_ExceptionalItems,brandName,marketID);
                            var NetProfit=loadValue(data.data[0].rcrb_NetProfit,brandName,marketID);
                            var NetProfitChange=loadValue(data.data[0].rcrb_NetProfitChange,brandName,marketID);
                            var NetProfitMargin=loadValue(data.data[0].rcrb_NetProfitMargin,brandName,marketID);
                            var NetProfitShareInCategory=loadValue(data.data[0].rcrb_NetProfitShareInCategory,brandName,marketID);
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
                    var url='/RCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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