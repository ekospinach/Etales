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
                    var factoriesInfo1=new Array();
                    var factoriesInfo2=new Array();
                    var factoriesInfo3=new Array();
                    var factoriesInfo4=new Array();
                    var factoriesInfo5=new Array();
                    var factoriesInfo6=new Array();
                    //factoriesInfo1 =category:1 market:1
                    //factoriesInfo2 =category:1 market:2
                    //factoriesInfo3 =category:1 market:3
                    //factoriesInfo4 =category:2 market:1
                    //factoriesInfo5 =category:2 market:2
                    //factoriesInfo6 =category:2 market:3

                    var marketInfo=new Array();
                    var array=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==1){
                            factoriesInfo1[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo1});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==2){
                            factoriesInfo2[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo2});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==3){
                            factoriesInfo3[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo3});
                    array.push({'marketInfo':marketInfo});
                    marketInfo=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==1){
                            factoriesInfo4[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo4});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==2){
                            factoriesInfo5[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo5});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==3){
                            factoriesInfo6[data[i].factoriesID-1]=data[i].value.toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo6});
                    array.push({'marketInfo':marketInfo});
                    console.log(array);
                    return array;
                }

                var loadPercentageValue=function(data){
                    var factoriesInfo1=new Array();
                    var factoriesInfo2=new Array();
                    var factoriesInfo3=new Array();
                    var factoriesInfo4=new Array();
                    var factoriesInfo5=new Array();
                    var factoriesInfo6=new Array();
                    var marketInfo=new Array();
                    var array=new Array();
                    //factoriesInfo1 =category:1 market:1
                    //factoriesInfo2 =category:1 market:2
                    //factoriesInfo3 =category:1 market:3
                    //factoriesInfo4 =category:2 market:1
                    //factoriesInfo5 =category:2 market:2
                    //factoriesInfo6 =category:2 market:3
                    //this function is for the value which need to *100
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==1){
                            factoriesInfo1[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo1});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==2){
                            factoriesInfo2[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo2});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==1&&data[i].marketID==3){
                            factoriesInfo3[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo3});
                    array.push({'marketInfo':marketInfo});
                    marketInfo=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==1){
                            factoriesInfo4[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo4});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==2){
                            factoriesInfo5[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo5});
                    for(var i=0;i<data.length;i++){
                        if(data[i].categoryID==2&&data[i].marketID==3){
                            factoriesInfo6[data[i].factoriesID-1]=(data[i].value*100).toFixed(2);
                        }
                    }
                    marketInfo.push({'factoriesInfo':factoriesInfo6});
                    array.push({'marketInfo':marketInfo});
                    console.log(array);
                    return array;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.ShelfSpaces=loadPercentageValue(data.data[0].rcrps_ShelfSpace);
                    console.log(data.data[0].rcrps_NetSales);
                    scope.NetSales=loadValue(data.data[0].rcrps_NetSales);
                    scope.NetSalesPerShelfSpaces=loadValue(data.data[0].rcrps_NetSalesPerShelfSpace);
                    scope.NetSalesShares=loadPercentageValue(data.data[0].rcrps_NetSalesShare);
                    scope.GrossContributions=loadValue(data.data[0].rcrps_GrossContribution );
                    scope.GrossContributionPerShelfSpaces=loadValue(data.data[0].rcrps_GrossContributionPerShelfSpace);
                    scope.GrossContributionMargins=loadPercentageValue(data.data[0].rcrps_GrossContributionMargin);
                    scope.GrossContributionShares=loadPercentageValue(data.data[0].rcrps_GrossContributionShare);
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