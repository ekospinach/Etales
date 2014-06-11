define(['directives', 'services'], function(directives){

    directives.directive('marketRetailerIntelligence', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_retailerIntelligence.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    scope.data=new Array();scope.variants=new Array();scope.player1es=new Array();scope.player2es=new Array();scope.player3es=new Array();scope.player5es=new Array();scope.player6es=new Array();scope.player1hs=new Array();scope.player2hs=new Array();scope.player3hs=new Array();scope.player5hs=new Array();scope.player6hs=new Array();
                    var url='/getMR-retailersIntelligence/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    data.data[0].retailerInfo[0].storeServiceLevel[2]=data.data[0].retailerInfo[1].storeServiceLevel[0];
                    data.data[0].retailerInfo[0].storeServiceLevel[3]=data.data[0].retailerInfo[1].storeServiceLevel[1];
                    data.data[0].retailerInfo[0].onlineAdvertising[2]=data.data[0].retailerInfo[1].onlineAdvertising[0];
                    data.data[0].retailerInfo[0].onlineAdvertising[3]=data.data[0].retailerInfo[1].onlineAdvertising[1];
                    data.data[0].retailerInfo[0].offlineAdvertising[2]=data.data[0].retailerInfo[1].offlineAdvertising[0];
                    data.data[0].retailerInfo[0].offlineAdvertising[3]=data.data[0].retailerInfo[1].offlineAdvertising[1];
                    data.data[0].retailerInfo[0].localAdvertising[2]=data.data[0].retailerInfo[1].localAdvertising[0];
                    data.data[0].retailerInfo[0].localAdvertising[3]=data.data[0].retailerInfo[1].localAdvertising[1];
                    scope.data.push({'storeServiceLevel':data.data[0].retailerInfo[0].storeServiceLevel,'onlineAdvertising':data.data[0].retailerInfo[0].onlineAdvertising,'offlineAdvertising':data.data[0].retailerInfo[0].offlineAdvertising,'localAdvertising':data.data[0].retailerInfo[0].localAdvertising});
                    for(var i=0;i<data.data[0].retailerInfo[0].variantInfo.length;i++){
                        var variant=_.find(data.data[0].retailerInfo[1].variantInfo,function(obj){
                            return (obj.variantName==data.data[0].retailerInfo[0].variantInfo[i].variantName&&obj.parentBrandName==data.data[0].retailerInfo[0].variantInfo[i].parentBrandName);
                        })
                        if(variant!=undefined){
                            data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[2]=variant.shelfSpace[0];
                            data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[3]=variant.shelfSpace[1];
                        }else{
                            data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[2]=0;
                            data.data[0].retailerInfo[0].variantInfo[i].shelfSpace[3]=0;
                        }
                        scope.variants.push(data.data[0].retailerInfo[0].variantInfo[i]);
                    }
                    for(var i=0;i<data.data[0].retailerInfo[1].variantInfo.length;i++){
                        var variant=_.find(scope.variants,function(obj){
                            return (obj.variantName==data.data[0].retailerInfo[1].variantInfo[i].variantName&&obj.parentBrandName==data.data[0].retailerInfo[1].variantInfo[i].parentBrandName);
                        });
                        if(variant==undefined){
                            data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[2]=data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[0];
                            data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[3]=data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[1];
                            data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[0]=0;
                            data.data[0].retailerInfo[1].variantInfo[i].shelfSpace[1]=0;
                            scope.variants.push(data.data[0].retailerInfo[1].variantInfo[i]);
                        }
                    }
                    for(var i=0;i<scope.variants.length;i++){
                        switch(scope.variants[i].parentCompanyID){
                            case 1:if(scope.variants[i].parentCategoryID==1){
                                scope.player1es.push(scope.variants[i]);
                            }else{
                                scope.player1hs.push(scope.variants[i]);
                            }break;
                            case 2:if(scope.variants[i].parentCategoryID==1){
                                scope.player2es.push(scope.variants[i]);
                            }else{
                                scope.player2hs.push(scope.variants[i]);
                            }break;
                            case 3:if(scope.variants[i].parentCategoryID==1){
                                scope.player3es.push(scope.variants[i]);
                            }else{
                                scope.player3hs.push(scope.variants[i]);
                            }break;
                            case 5:if(scope.variants[i].parentCategoryID==1){
                                scope.player5es.push(scope.variants[i]);
                            }else{
                                scope.player5hs.push(scope.variants[i]);
                            }break;
                            case 6:if(scope.variants[i].parentCategoryID==1){
                                scope.player6es.push(scope.variants[i]);
                            }else{
                                scope.player6hs.push(scope.variants[i]);
                            }break;
                        }
                    }

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