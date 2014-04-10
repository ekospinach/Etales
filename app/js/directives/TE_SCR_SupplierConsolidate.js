define(['directives', 'services'], function(directives){

    directives.directive('supplierConsolidate', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierConsolidate.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
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
                
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    console.log('watch in the TE_GR_performance fire, new value: ' + newValue + ', oldValue: '+ oldValue);
                    if(newValue==true) {
                        initializePage();
                    }
                })

            }
        }
    }])
})