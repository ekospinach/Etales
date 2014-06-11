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
                    var url='/RCR-profitabilityBySupplier/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    var factoriesInfo=new Array();
                    var marketInfo=new Array();
                    var array=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==1){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    for(var i=0;i<data[i].length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==2){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    for(var i=0;i<data[i].length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==3){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    array.push({'marketInfo':marketInfo});
                    marketInfo=new Array();
                    for(var i=0;i<data[i].length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==1){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    for(var i=0;i<data[i].length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==2){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    for(var i=0;i<data[i].length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==3){
                            factoriesInfo[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo});
                    array.push({'marketInfo':marketInfo});
                    console.log(array);
                    return array;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.ShelfSpaces=loadValue(data.data[0].rcrps_ShelfSpace);
                    scope.NetSales=loadValue(data.data[0].rcrps_NetSales);
                    scope.NetSalesPerShelfSpaces=loadValue(data.data[0].rcrps_NetSalesPerShelfSpace);
                    scope.NetSalesShares=loadValue(data.data[0].rcrps_NetSalesShare);
                    scope.GrossContributions=loadValue(data.data[0].rcrps_GrossContribution );
                    scope.GrossContributionPerShelfSpaces=loadValue(data.data[0].rcrps_GrossContributionPerShelfSpace);
                    scope.GrossContributionMargins=loadValue(data.data[0].rcrps_GrossContributionMargin);
                    scope.GrossContributionShares=loadValue(data.data[0].rcrps_GrossContributionShare);
                    scope.PaymentTerms=loadValue(data.data[0].rcrps_PaymentTerms);
                
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