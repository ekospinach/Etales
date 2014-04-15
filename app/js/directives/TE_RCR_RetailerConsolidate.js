define(['directives', 'services'], function(directives){

    directives.directive('retailerConsolidate', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerConsolidate.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
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