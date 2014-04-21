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

                var loadValue=function(data){
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

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.Sales=loadValue(data.data[0].rcrpl_Sales);
                    scope.PromotionsCost=loadValue(data.data[0].rcrpl_PromotionsCost);
                    scope.OtherCompensation=loadValue(data.data[0].rcrpl_OtherCompensation);
                    scope.NetSales=loadValue(data.data[0].rcrpl_NetSales);
                    scope.NetSalesChange=loadValue(data.data[0].rcrpl_NetSalesChange);
                    scope.CostOfGoodsSold=loadValue(data.data[0].rcrpl_CostOfGoodsSold);
                    scope.ValueOfQuantityDiscounts=loadValue(data.data[0].rcrpl_ValueOfQuantityDiscounts);
                    scope.ValueOfPerformanceBonus=loadValue(data.data[0].rcrpl_ValueOfPerformanceBonus);
                    scope.DiscontinuedGoodsCost=loadValue(data.data[0].rcrpl_DiscontinuedGoodsCost);
                    scope.InventoryHoldingCost=loadValue(data.data[0].rcrpl_InventoryHoldingCost);
                    scope.GrossProfit=loadValue(data.data[0].rcrpl_GrossProfit);
                    scope.GrossProfitChange=loadValue(data.data[0].rcrpl_GrossProfitChange);
                    scope.GrossProfitMargin=loadValue(data.data[0].rcrpl_GrossProfitMargin);
                    scope.GeneralExpenses=loadValue(data.data[0].rcrpl_GeneralExpenses);
                    scope.OperatingProfit=loadValue(data.data[0].rcrpl_OperatingProfit);
                    scope.OperatingProfitChange=loadValue(data.data[0].rcrpl_OperatingProfitChange);
                    scope.OperatingProfitMargin=loadValue(data.data[0].rcrpl_OperatingProfitMargin);
                    scope.Interest=loadValue(data.data[0].rcrpl_Interest);
                    scope.Taxes=loadValue(data.data[0].rcrpl_Taxes);
                    scope.ExceptionalItems=loadValue(data.data[0].rcrpl_ExceptionalItems);
                    scope.NetProfit=loadValue(data.data[0].rcrpl_NetProfit);
                    scope.NetProfitChange=loadValue(data.data[0].rcrpl_NetProfitChange);
                    scope.NetProfitMargin=loadValue(data.data[0].rcrpl_NetProfitMargin);
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