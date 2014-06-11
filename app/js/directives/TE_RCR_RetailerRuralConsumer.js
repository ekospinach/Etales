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
                        if(data.data[0].absoluteValue[i].parentCategoryID==category&&data.data[0].absoluteValue[i].marketID==market){
                            var varName=data.data[0].absoluteValue[i].variantName;
                            var brandName=data.data[0].absoluteValue[i].parentBrandName;
                            var priceValueShare=data.data[0].absoluteValue[i].segmentInfo[0].shopperInfo[3].value;
                            var moneyValueShare=data.data[0].absoluteValue[i].segmentInfo[1].shopperInfo[3].value;
                            var fashionValueShare=data.data[0].absoluteValue[i].segmentInfo[2].shopperInfo[3].value;
                            var freaksValueShare=data.data[0].absoluteValue[i].segmentInfo[3].shopperInfo[3].value;
                            var valueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var priceValueChange=valueChanges.segmentInfo[0].shopperInfo[3].value;
                            var moneyValueChange=valueChanges.segmentInfo[1].shopperInfo[3].value;
                            var fashionValueChange=valueChanges.segmentInfo[2].shopperInfo[3].value;
                            var freaksValueChange=valueChanges.segmentInfo[3].shopperInfo[3].value;
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var volumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            priceVolumeShare=Volumes.segmentInfo[0].shopperInfo[3].value;
                            moneyVolumeShare=Volumes.segmentInfo[1].shopperInfo[3].value;
                            fashionVolumeShare=Volumes.segmentInfo[2].shopperInfo[3].value;
                            freaksVolumeShare=Volumes.segmentInfo[3].shopperInfo[3].value;
                            priceVolumeChange=volumeChanges.segmentInfo[0].shopperInfo[3].value;
                            moneyVolumeChange=volumeChanges.segmentInfo[1].shopperInfo[3].value;
                            fashionVolumeChange=volumeChanges.segmentInfo[2].shopperInfo[3].value;
                            freaksVolumeChange=volumeChanges.segmentInfo[3].shopperInfo[3].value;

                            switch(data.data[0].absoluteValue[i].parentCompanyID){
                                case 1:if(category==1){
                                    scope.eleValue1s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.eleVolume1s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }else{
                                    scope.heaValue1s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.heaVolume1s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }break;
                                case 2:if(category==1){
                                    scope.eleValue2s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.eleVolume2s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }else{
                                    scope.heaValue2s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.heaVolume2s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }break;
                                case 3:if(category==1){
                                    scope.eleValue3s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.eleVolume3s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }else{
                                    scope.heaValue3s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.heaVolume3s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }break;
                                case 4:break;
                                case 5:
                                case 6:if(category==1){
                                    scope.eleValue4s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.eleVolume4s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }else{
                                    scope.heaValue4s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                    scope.heaVolume4s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                }break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/RCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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