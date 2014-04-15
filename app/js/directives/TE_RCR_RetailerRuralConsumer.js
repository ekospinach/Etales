define(['directives', 'services'], function(directives){

    directives.directive('retailerRuralConsumer', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerRuralConsumer.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadRetailerConsumer=function(data,category,market){
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            for(var j=0;j<data.data[0].absoluteValue[i].marketInfo.length;j++){
                                if(data.data[0].absoluteValue[i].marketInfo[j].marketID==market){
                                    var varName=data.data[0].absoluteValue[i].variantName;
                                    var brandName=data.data[0].absoluteValue[i].parentBrandName;
                                    var priceShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[0].shopperInfo[3].value;
                                    var moneyShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[1].shopperInfo[3].value;
                                    var fashionShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[2].shopperInfo[3].value;
                                    var freaksShare=data.data[0].absoluteValue[i].marketInfo[j].segmentInfo[3].shopperInfo[3].value;
                                    var Changes=_.find(data.data[0].valueChange,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    var priceChange=Changes.marketInfo[j].segmentInfo[0].shopperInfo[3].value;
                                    var moneyChange=Changes.marketInfo[j].segmentInfo[1].shopperInfo[3].value;
                                    var fashionChange=Changes.marketInfo[j].segmentInfo[2].shopperInfo[3].value;
                                    var freaksChange=Changes.marketInfo[j].segmentInfo[3].shopperInfo[3].value;
                                    switch(data.data[0].absoluteValue[i].parentCompanyID){
                                        case 1:if(category==1){
                                            scope.eleValue1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaValue1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 2:if(category==1){
                                            scope.eleValue2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaValue2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 3:if(category==1){
                                            scope.eleValue3s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaValue3s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 4:break;
                                        case 5:
                                        case 6:if(category==1){
                                            scope.eleValue4s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaValue4s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                    }
                                    var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    var Changes=_.find(data.data[0].volumeChange,function(obj){
                                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                                    });
                                    priceShare=Volumes.marketInfo[j].segmentInfo[0].shopperInfo[3].value;
                                    moneyShare=Volumes.marketInfo[j].segmentInfo[1].shopperInfo[3].value;
                                    fashionShare=Volumes.marketInfo[j].segmentInfo[2].shopperInfo[3].value;
                                    freaksShare=Volumes.marketInfo[j].segmentInfo[3].shopperInfo[3].value;
                                    priceChange=Changes.marketInfo[j].segmentInfo[0].shopperInfo[3].value;
                                    moneyChange=Changes.marketInfo[j].segmentInfo[1].shopperInfo[3].value;
                                    fashionChange=Changes.marketInfo[j].segmentInfo[2].shopperInfo[3].value;
                                    freaksChange=Changes.marketInfo[j].segmentInfo[3].shopperInfo[3].value;
                                    switch(data.data[0].absoluteValue[i].parentCompanyID){
                                        case 1:if(category==1){
                                            scope.eleVolume1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaVolume1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 2:if(category==1){
                                            scope.eleVolume2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaVolume2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 3:if(category==1){
                                            scope.eleVolume3s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaVolume3s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                        case 4:break;
                                        case 5:
                                        case 6:if(category==1){
                                            scope.eleVolume4s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }else{
                                            scope.heaVolume4s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                                        }break;
                                    }
                                }
                            }
                        }
                    }
                }

                var getResult =function(){
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
                    scope.eleValue1s=new Array();scope.heaValue1s=new Array();scope.eleValue2s=new Array();scope.heaValue2s=new Array();scope.eleValue3s=new Array();scope.heaValue3s=new Array();scope.eleValue4s=new Array();scope.heaValue4s=new Array();scope.eleVolume1s=new Array();scope.heaVolume1s=new Array();scope.eleVolume2s=new Array();scope.heaVolume2s=new Array();scope.eleVolume3s=new Array();scope.heaVolume3s=new Array();scope.eleVolume4s=new Array();scope.heaVolume4s=new Array();

                    loadRetailerConsumer(data,1,2);
                    loadRetailerConsumer(data,2,2);
                
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