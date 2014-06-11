define(['directives', 'services'], function(directives){

    directives.directive('supplierProfitability', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierProfitability.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/SCR-channelsProfitability/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    scope.volumeOrdereds=data.data[0].scrcp_VolumeOrdered;
                    scope.volumeSolds=data.data[0].scrcp_VolumeSold;
                    scope.volumeSoldShares=data.data[0].scrcp_VolumeSoldShare;
                    scope.salesValues=data.data[0].scrcp_SalesValue;
                    scope.salesValueShares=data.data[0].scrcp_SalesValueShare;
                    scope.costOfGoodsSolds=data.data[0].scrcp_CostOfGoodsSold;
                    scope.tradeSupports=data.data[0].scrcp_TradeSupport;
                    scope.tradeProfits=data.data[0].scrcp_TradeProfit;   
                    scope.tradeProfitShares=data.data[0].scrcp_TradeProfitShare;	

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