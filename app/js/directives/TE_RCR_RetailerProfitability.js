define(['directives', 'services'], function(directives){

    directives.directive('retailerProfitability', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerProfitability.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/RCR-profitabilityBySupplier/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    scope.ShelfSpaces=data.data[0].rcrps_ShelfSpace;
                    scope.NetSales=data.data[0].rcrps_NetSales;
                    scope.NetSalesPerShelfSpaces=data.data[0].rcrps_NetSalesPerShelfSpace;
                    scope.NetSalesShares=data.data[0].rcrps_NetSalesShare;
                    scope.GrossContributions=data.data[0].rcrps_GrossContribution ;
                    scope.GrossContributionPerShelfSpaces=data.data[0].rcrps_GrossContributionPerShelfSpace;
                    scope.GrossContributionMargins=data.data[0].rcrps_GrossContributionMargin;
                    scope.GrossContributionShares=data.data[0].rcrps_GrossContributionShare;
                    scope.PaymentTerms=data.data[0].rcrps_PaymentTerms;
                
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