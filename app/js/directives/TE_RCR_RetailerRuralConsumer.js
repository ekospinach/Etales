define(['directives', 'services'], function(directives){

    directives.directive('retailerRuralConsumer', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '=',
                selectedUser : '=',
                retailerShow : '='
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
                            /*
                                priceValueShare=absoluteValue[].segmentInfo[0].shopperInfo[3]
                                moneyValueShare=absoluteValue[].segmentInfo[1].shopperInfo[3]
                                fashionValueShare=absoluteValue[].segmentInfo[2].shopperInfo[3]
                                freaksValueShare=absoluteValue[].segmentInfo[3].shopperInfo[3]
                                xxxValueChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[3]
                                priceVolumeShare=absoluteVolume[].segmentInfo[0].shopperInfo[3]
                                moneyVolumeShare=absoluteVolume[].segmentInfo[1].shopperInfo[3]
                                fashionVolumeShare=absoluteVolume[].segmentInfo[2].shopperInfo[3]
                                freaksVolumeShare=absoluteVolume[].segmentInfo[3].shopperInfo[3]
                                xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[3]
                            */
                            var priceValueShare=(data.data[0].absoluteValue[i].segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                            var moneyValueShare=(data.data[0].absoluteValue[i].segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                            var fashionValueShare=(data.data[0].absoluteValue[i].segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                            var freaksValueShare=(data.data[0].absoluteValue[i].segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                            var valueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var priceValueChange=(valueChanges.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                            var moneyValueChange=(valueChanges.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                            var fashionValueChange=(valueChanges.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                            var freaksValueChange=(valueChanges.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var volumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            priceVolumeShare=(Volumes.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                            moneyVolumeShare=(Volumes.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                            fashionVolumeShare=(Volumes.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                            freaksVolumeShare=(Volumes.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                            priceVolumeChange=(volumeChanges.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                            moneyVolumeChange=(volumeChanges.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                            fashionVolumeChange=(volumeChanges.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                            freaksVolumeChange=(volumeChanges.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);

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
                    var url='/RCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+parseInt(scope.selectedUser);
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
                scope.$watch('selectedPeriod', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })
                scope.$watch('selectedUser', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })

            }
        }
    }])
})