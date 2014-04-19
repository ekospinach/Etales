define(['directives', 'services'], function(directives){

    directives.directive('retailerRuralVolume', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerRuralVolume.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadVariantValue=function(data,brandName,variantName,market){
                    var array=_.find(data,function(obj){
                        return (obj.variantName==variantName&&obj.parentBrandName==brandName&&obj.marketID==market);
                    });
                    return array.value;
                }

                var loadretailerVolume=function(data,category,market){
                    for(var i=0;i<data.data[0].rcrviv_Initial.length;i++){
                        if(data.data[0].rcrviv_Initial[i].parentCategoryID==category&&data.data[0].rcrviv_Initial[i].marketID==market){
                            var varName=data.data[0].rcrviv_Initial[i].variantName;
                            var brandName=data.data[0].rcrviv_Initial[i].parentBrandName;
                            var initial=data.data[0].rcrviv_Initial[i].value;
                            var production=loadVariantValue(data.data[0].rcrviv_Purchase,brandName,varName,market);
                            var sales=loadVariantValue(data.data[0].rcrviv_Sales,brandName,varName,market);
                            var discontinued=loadVariantValue(data.data[0].rcrviv_Discontinued,brandName,varName,market);
                            var closing=loadVariantValue(data.data[0].rcrviv_Closing,brandName,varName,market);
                            switch(data.data[0].rcrviv_Initial[i].parentCompany){
                                case 1:if(category==1){
                                    scope.product1es.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }else{
                                    scope.product1hs.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }break;
                                case 2:if(category==1){
                                    scope.product2es.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }else{
                                    scope.product2hs.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }break;
                                case 3:if(category==1){
                                    scope.product3es.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }else{
                                    scope.product3hs.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }break;
                                case 4:break;
                                case 5:
                                case 6:if(category==1){
                                    scope.product4es.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }else{
                                    scope.product4hs.push({'fullName':brandName+varName,'initial':initial,'production':production,'sales':sales,'discontinued':discontinued,'closing':closing});
                                }break;
                            }
                        }
                    }
                    console.log(scope.product3es);
                }

                var getResult =function(){
                    scope.product1es=new Array();scope.product1hs=new Array();scope.product2es=new Array();scope.product2hs=new Array();scope.product3es=new Array();scope.product3hs=new Array();scope.product4es=new Array();scope.product4hs=new Array();
                    var url='/RCR-inventoryVolumes/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    loadretailerVolume(data,1,2);
                    loadretailerVolume(data,2,2);
                
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