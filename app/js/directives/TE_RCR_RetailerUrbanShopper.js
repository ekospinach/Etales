define(['directives', 'services'], function(directives){

    directives.directive('retailerUrbanShopper', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerUrbanShopper.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadRetailerShooper=function(data,category,market){
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            for(var j=0;j<data.data[0].absoluteValue[i].marketInfo.length;j++){
                                if(data.data[0].absoluteValue[i].marketInfo[j].marketID==market){
                                    var varName=data.data[0].absoluteValue[i].variantName;
                                    var brandName=data.data[0].absoluteValue[i].parentBrandName;
                                    var bmShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[4].shopperInfo[0].value;
                                    var onlineShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[4].shopperInfo[1].value;
                                    var mixedShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[4].shopperInfo[2].value;
                                    var Changes=_.find(data.data[0].valueChange,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    var bmChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[0].value;
                                    var onlineChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[1].value;
                                    var mixedChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[2].value;
                                    switch(data.data[0].absoluteValue[i].parentCompanyID){
                                        case 1:if(category==1){
                                            scope.eleValue1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaValue1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 2:if(category==1){
                                            scope.eleValue2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaValue2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 3:if(category==1){
                                            scope.eleValue3s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaValue3s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 4:break;
                                        case 5:
                                        case 6:if(category==1){
                                            scope.eleValue4s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaValue4s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                    }
                                    var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    var Changes=_.find(data.data[0].volumeChange,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    var bmShare=Volumes.marketInfo[j].segmentInfo[4].shopperInfo[0].value;
                                    var onlineShare=Volumes.marketInfo[j].segmentInfo[4].shopperInfo[1].value;
                                    var mixedShare=Volumes.marketInfo[j].segmentInfo[4].shopperInfo[2].value;
                                    var bmChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[0].value;
                                    var onlineChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[1].value;
                                    var mixedChange=Changes.marketInfo[j].segmentInfo[4].shopperInfo[2].value;
                                    switch(data.data[0].absoluteValue[i].parentCompanyID){
                                        case 1:if(category==1){
                                            scope.eleVolume1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaVolume1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 2:if(category==1){
                                            scope.eleVolume2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaVolume2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 3:if(category==1){
                                            scope.eleVolume3s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaVolume3s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                        case 4:break;
                                        case 5:
                                        case 6:if(category==1){
                                            scope.eleVolume4s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }else{
                                            scope.heaVolume4s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                                        }break;
                                    }
                                }
                            }
                        }
                    }
                }

                var getResult =function(){
                    scope.eleValue1s=new Array();scope.heaValue1s=new Array();scope.eleValue2s=new Array();scope.heaValue2s=new Array();scope.eleValue3s=new Array();scope.heaValue3s=new Array();scope.eleValue4s=new Array();scope.heaValue4s=new Array();scope.eleVolume1s=new Array();scope.heaVolume1s=new Array();scope.eleVolume2s=new Array();scope.heaVolume2s=new Array();scope.eleVolume3s=new Array();scope.heaVolume3s=new Array();scope.eleVolume4s=new Array();scope.heaVolume4s=new Array();
                    var url='/RCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    loadRetailerShooper(data,1,1);
                    loadRetailerShooper(data,2,1);
                
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