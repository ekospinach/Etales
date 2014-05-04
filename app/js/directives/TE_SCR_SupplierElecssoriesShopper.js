define(['directives', 'services'], function(directives){
    directives.directive('supplierElecssoriesShopper', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierElecssoriesShopper.html',            
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
                            bmValueShare=data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[0].value;
                            onlineValueShare=data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[1].value;
                            mixedValueShare=data.data[0].absoluteValue[i].segmentInfo[4].shopperInfo[2].value;
                            marketID=data.data[0].absoluteValue[i].marketID;
                            var ValueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            if(ValueChanges!=undefined){
                                bmValueChange=ValueChanges.segmentInfo[4].shopperInfo[0].value;
                                onlineValueChange=ValueChanges.segmentInfo[4].shopperInfo[1].value;
                                mixedValueChange=ValueChanges.segmentInfo[4].shopperInfo[2].value;                                
                            }else{
                                bmValueChange=0;
                                onlineValueChange=0;
                                mixedValueChange=0;
                            }

                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            if(Volumes!=undefined){
                                bmVolumeShare=Volumes.segmentInfo[4].shopperInfo[0].value;
                                onlineVolumeShare=Volumes.segmentInfo[4].shopperInfo[1].value;
                                mixedVolumeShare=Volumes.segmentInfo[4].shopperInfo[2].value;                                
                            }else{
                                bmVolumeShare=0;
                                onlineVolumeShare=0;
                                mixedVolumeShare=0;
                            }
                            if(VolumeChanges!=undefined){
                                bmVolumeChange=VolumeChanges.segmentInfo[4].shopperInfo[0].value;
                                onlineVolumeChange=VolumeChanges.segmentInfo[4].shopperInfo[1].value;
                                mixedVolumeChange=VolumeChanges.segmentInfo[4].shopperInfo[2].value;                                
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
                    var url='/SCR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    loadShooper(data,1);
                
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