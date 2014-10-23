define(['directives', 'services'], function(directives){

    directives.directive('retailerUrbanShopper', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '=',
                selectedPlayer : '=',
                retailerShow : '='
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
                        if(data.data[0].absoluteValue[i].parentCategoryID==category&&data.data[0].absoluteValue[i].marketID==market){
                            var varName=data.data[0].absoluteValue[i].variantName;
                            var brandName=data.data[0].absoluteValue[i].parentBrandName;
                            /*
                                bmValueShare=absoluteValue[].segmentInfo[4].shopperInfo[0]
                                onlineValueShare=absoluteValue[].segmentInfo[4].shopperInfo[1]
                                mixedValueShare=absoluteValue[].segmentInfo[4].shopperInfo[2]
                                xxxValueChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[4].shopperInfo[]
                                bmVolumeShare=absoluteVolume[].segmentInfo[4].shopperInfo[0]
                                onlineVolumeShare=absoluteVolume[].segmentInfo[4].shopperInfo[1]
                                mixedVolumeShare=absoluteVolume[].segmentInfo[4].shopperInfo[2]
                                xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[4].shopperInfo[]
                            */
                            var bmValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                            var onlineValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                            var mixedValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[2].value*100).toFixed(2);
                            var valueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var bmValueChange=(valueChanges.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                            var onlineValueChange=(valueChanges.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                            var mixedValueChange=(valueChanges.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var volumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==market);
                            });
                            var bmVolumeShare=(Volumes.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                            var onlineVolumeShare=(Volumes.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                            var mixedVolumeShare=(Volumes.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);
                            var bmVolumeChange=(volumeChanges.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                            var onlineVolumeChange=(volumeChanges.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                            var mixedVolumeChange=(volumeChanges.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);
                            switch(data.data[0].absoluteValue[i].parentCompanyID){
                                case 1:if(category==1){
                                    scope.eleValue1s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.eleVolume1s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }else{
                                    scope.heaValue1s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.heaVolume1s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }break;
                                case 2:if(category==1){
                                    scope.eleValue2s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.eleVolume2s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }else{
                                    scope.heaValue2s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.heaVolume2s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }break;
                                case 3:if(category==1){
                                    scope.eleValue3s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.eleVolume3s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }else{
                                    scope.heaValue3s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.heaVolume3s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }break;
                                case 4:break;
                                case 5:
                                case 6:if(category==1){
                                    scope.eleValue4s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.eleVolume4s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }else{
                                    scope.heaValue4s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                    scope.heaVolume4s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                }break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    scope.eleValue1s=new Array();scope.heaValue1s=new Array();scope.eleValue2s=new Array();scope.heaValue2s=new Array();scope.eleValue3s=new Array();scope.heaValue3s=new Array();scope.eleValue4s=new Array();scope.heaValue4s=new Array();scope.eleVolume1s=new Array();scope.heaVolume1s=new Array();scope.eleVolume2s=new Array();scope.heaVolume2s=new Array();scope.eleVolume3s=new Array();scope.heaVolume3s=new Array();scope.eleVolume4s=new Array();scope.heaVolume4s=new Array();
                    var url='/RCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+parseInt(scope.selectedPlayer);
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
                scope.$watch('selectedPeriod', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPlayer', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })

            }
        }
    }])
})