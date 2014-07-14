define(['directives', 'services'], function(directives){

    directives.directive('marketUrbanHealthBeautiesSalesByChannel', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectPeriod : '=',
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_urbanHealthBeautiesSalesByChannel.html',                        
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }
                
                var loadTotal=function(data,ownerID,category,market){
                    var Values=_.find(data.owner_absoluteValue,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(Values!=undefined){
                        var retailer1Value=Values.value[0].toFixed(2);
                        var retailer2Value=Values.value[1].toFixed(2);
                        var retailer3Value=Values.value[2].toFixed(2);
                        var retailer4Value=Values.value[3].toFixed(2);
                    }else{
                        var retailer1Value=0;
                        var retailer2Value=0;
                        var retailer3Value=0;
                        var retailer4Value=0;
                    }
                    var Changes=_.find(data.owner_valueChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(Changes!=undefined){
                        var retailer1ValueChange=(Changes.value[0]*100).toFixed(2);
                        var retailer2ValueChange=(Changes.value[1]*100).toFixed(2);
                        var retailer3ValueChange=(Changes.value[2]*100).toFixed(2); 
                        var retailer4ValueChange=(Changes.value[3]*100).toFixed(2); 
                    }else{
                        var retailer1ValueChange=0;
                        var retailer2ValueChange=0;
                        var retailer3ValueChange=0; 
                        var retailer4ValueChange=0;  
                    }
                    var Volumes=_.find(data.owner_absoluteVolume,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(Volumes!=undefined){
                        var retailer1Volume=Volumes.value[0].toFixed(2);
                        var retailer2Volume=Volumes.value[1].toFixed(2);
                        var retailer3Volume=Volumes.value[2].toFixed(2);
                        var retailer4Volume=Volumes.value[3].toFixed(2);
                    }else{
                        var retailer1Volume=0;
                        var retailer2Volume=0;
                        var retailer3Volume=0;
                        var retailer4Volume=0;
                    }
                    var VolumeChanges=_.find(data.owner_volumeChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(VolumeChanges!=undefined){
                        var retailer1VolumeChange=(VolumeChanges.value[0]*100).toFixed(2);
                        var retailer2VolumeChange=(VolumeChanges.value[1]*100).toFixed(2);
                        var retailer3VolumeChange=(VolumeChanges.value[2]*100).toFixed(2); 
                        var retailer4VolumeChange=(VolumeChanges.value[3]*100).toFixed(2); 
                    }else{
                        var retailer1VolumeChange=0;
                        var retailer2VolumeChange=0;
                        var retailer3VolumeChange=0; 
                        var retailer4VolumeChange=0;  
                    }
                    scope.playerTotals[ownerID-1].retailer1Value=retailer1Value;scope.playerTotals[ownerID-1].retailer1ValueChange=retailer1ValueChange;scope.playerTotals[ownerID-1].retailer1Volume=retailer1Volume;scope.playerTotals[ownerID-1].retailer1VolumeChange=retailer1VolumeChange;scope.playerTotals[ownerID-1].retailer2Value=retailer2Value;scope.playerTotals[ownerID-1].retailer2ValueChange=retailer2ValueChange;scope.playerTotals[ownerID-1].retailer2Volume=retailer2Volume;scope.playerTotals[ownerID-1].retailer2VolumeChange=retailer2VolumeChange;scope.playerTotals[ownerID-1].retailer3Value=retailer3Value;scope.playerTotals[ownerID-1].retailer3ValueChange=retailer3ValueChange;scope.playerTotals[ownerID-1].retailer3Volume=retailer3Volume;scope.playerTotals[ownerID-1].retailer3VolumeChange=retailer3VolumeChange;scope.playerTotals[ownerID-1].retailer4Value=retailer4Value;scope.playerTotals[ownerID-1].retailer4ValueChange=retailer4ValueChange;scope.playerTotals[ownerID-1].retailer4Volume=retailer4Volume;scope.playerTotals[ownerID-1].retailer4VolumeChange=retailer4VolumeChange;
                }
                var loadChannelSales=function(data,category,market){
                    for(var i=0;i<data.absoluteValue.length;i++){
                        if(data.absoluteValue[i].parentCategoryID==category&&data.absoluteValue[i].marketID==market){
                            var variantName=data.absoluteValue[i].variantName;
                            var brandName=data.absoluteValue[i].parentBrandName;
                            // retailer1Value=absoluteValue[].value[0]
                            // retailer2Value=absoluteValue[].value[1]
                            // retailer3Value=absoluteValue[].value[2]
                            // retailer4Value=absoluteValue[].value[3]
                            // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).value[]
                            // retailer1Volume=absoluteVolume[].value[0]
                            // retailer2Volume=absoluteVolume[].value[1]
                            // retailer3Volume=absoluteVolume[].value[2]
                            // retailer4Volume=absoluteVolume[].value[3]
                            // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).value[]
                            var retailer1Value=data.absoluteValue[i].value[0].toFixed(2);
                            var retailer2Value=data.absoluteValue[i].value[1].toFixed(2);
                            var retailer3Value=data.absoluteValue[i].value[2].toFixed(2);
                            var retailer4Value=data.absoluteValue[i].value[3].toFixed(2);
                            var Changes=_.find(data.valueChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Changes!=undefined){
                                var retailer1ValueChange=(Changes.value[0]*100).toFixed(2);
                                var retailer2ValueChange=(Changes.value[1]*100).toFixed(2);
                                var retailer3ValueChange=(Changes.value[2]*100).toFixed(2); 
                                var retailer4ValueChange=(Changes.value[3]*100).toFixed(2); 
                            }else{
                                var retailer1ValueChange=0;
                                var retailer2ValueChange=0;
                                var retailer3ValueChange=0; 
                                var retailer4ValueChange=0;  
                            }

                            var Volumes=_.find(data.absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            var VolumeChanges=_.find(data.volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Volumes!=undefined){
                                var retailer1Volume=Volumes.value[0].toFixed(2);
                                var retailer2Volume=Volumes.value[1].toFixed(2);
                                var retailer3Volume=Volumes.value[2].toFixed(2);
                                var retailer4Volume=Volumes.value[3].toFixed(2);
                            }else{
                                var retailer1Volume=0;
                                var retailer2Volume=0;
                                var retailer3Volume=0;
                                var retailer4Volume=0;
                            }
                            if(VolumeChanges!=undefined){
                                var retailer1VolumeChange=(VolumeChanges.value[0]*100).toFixed(2);
                                var retailer2VolumeChange=(VolumeChanges.value[1]*100).toFixed(2);
                                var retailer3VolumeChange=(VolumeChanges.value[2]*100).toFixed(2); 
                                var retailer4VolumeChange=(VolumeChanges.value[3]*100).toFixed(2); 
                            }else{
                                var retailer1VolumeChange=0;
                                var retailer2VolumeChange=0;
                                var retailer3VolumeChange=0; 
                                var retailer4VolumeChange=0;  
                            }
                            switch(data.absoluteValue[i].parentCompanyID){
                                case 1:scope.player1s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                                case 2:scope.player2s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                                case 3:scope.player3s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                                case 4:scope.player4s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                                case 5:scope.player5s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                                case 6:scope.player6s.push({'fullName':brandName+variantName,'retailer1Value':retailer1Value,'retailer1ValueChange':retailer1ValueChange,'retailer1Volume':retailer1Volume,'retailer1VolumeChange':retailer1VolumeChange,'retailer2Value':retailer2Value,'retailer2ValueChange':retailer2ValueChange,'retailer2Volume':retailer2Volume,'retailer2VolumeChange':retailer2VolumeChange,'retailer3Value':retailer3Value,'retailer3ValueChange':retailer3ValueChange,'retailer3Volume':retailer3Volume,'retailer3VolumeChange':retailer3VolumeChange,'retailer4Value':retailer4Value,'retailer4ValueChange':retailer4ValueChange,'retailer4Volume':retailer4Volume,'retailer4VolumeChange':retailer4VolumeChange});break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/getMR-salesByChannel/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){   
                        return organiseArray(data.data[0]);
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.playerTotals=new Array();
                    for(var i=0;i<6;i++){
                        scope.playerTotals[i]=new Array();
                    }
                    scope.player1s=new Array();scope.player2s=new Array();scope.player3s=new Array();scope.player5s=new Array();scope.player6s=new Array();
                    loadTotal(data,1,2,1);
                    loadTotal(data,2,2,1);
                    loadTotal(data,3,2,1);
                    loadTotal(data,4,2,1);
                    loadTotal(data,5,2,1);
                    loadTotal(data,6,2,1);
                    loadChannelSales(data,2,1);
                    scope.nameColor='#F2DEDE'//红
                    scope.valueColor='#FCF8E3';//黄
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