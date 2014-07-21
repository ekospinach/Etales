define(['directives', 'services'], function(directives){
    directives.directive('supplierHealthBeautiesShopper', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '=',
                selectedUser : '=',
                producerShow : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierHealthBeautiesShopper.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadShooper=function(data,category){
                    scope.rural1s=new Array();
                    scope.urban1s=new Array();
                    scope.rural2s=new Array();
                    scope.urban2s=new Array();
                    var varName,brandName,marketID,bmShare,bmChange,onlineShare,onlineChange,mixedShare,mixedChange;
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            varName=data.data[0].absoluteValue[i].variantName;
                            brandName=data.data[0].absoluteValue[i].parentBrandName;
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
                            bmValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                            onlineValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                            mixedValueShare=(data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[2].value*100).toFixed(2);
                            marketID=data.data[0].absoluteValue[i].marketID;
                            var ValueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            if(ValueChanges!=undefined){
                                bmValueChange=(ValueChanges.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                                onlineValueChange=(ValueChanges.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                                mixedValueChange=(ValueChanges.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);                                
                            }else{
                                bmValueChange=0;
                                onlineValueChange=0;
                                mixedValueChange=0;
                            }

                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            if(Volumes!=undefined){
                                bmVolumeShare=(Volumes.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                                onlineVolumeShare=(Volumes.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                                mixedVolumeShare=(Volumes.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);                                
                            }else{
                                bmVolumeShare=0;
                                onlineVolumeShare=0;
                                mixedVolumeShare=0;
                            }
                            if(VolumeChanges!=undefined){
                                bmVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[0].value*100).toFixed(2);
                                onlineVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[1].value*100).toFixed(2);
                                mixedVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[2].value*100).toFixed(2);                                
                            }else{
                                bmVolumeChange=0;
                                onlineVolumeChange=0;
                                mixedVolumeChange=0;
                            }
                            switch(marketID){
                                case 1:
                                    scope.urban1s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                    scope.urban2s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                break;
                                case 2:
                                    scope.rural1s.push({'fullName':brandName+varName,'bmVolumeShare':bmVolumeShare,'bmVolumeChange':bmVolumeChange,'onlineVolumeShare':onlineVolumeShare,'onlineVolumeChange':onlineVolumeChange,'mixedVolumeShare':mixedVolumeShare,'mixedVolumeChange':mixedVolumeChange});
                                    scope.rural2s.push({'fullName':brandName+varName,'bmValueShare':bmValueShare,'bmValueChange':bmValueChange,'onlineValueShare':onlineValueShare,'onlineValueChange':onlineValueChange,'mixedValueShare':mixedValueShare,'mixedValueChange':mixedValueChange});
                                break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+parseInt(scope.selectedUser);
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
                    loadShooper(data,2);
                
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPeriod', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                        initializePage();
                    }
                })
                scope.$watch('selectedUser', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                        initializePage();
                    }
                })

            }
        }
    }])
})