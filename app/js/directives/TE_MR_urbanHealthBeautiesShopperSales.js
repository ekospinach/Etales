define(['directives', 'services'], function(directives){

    directives.directive('marketUrbanHealthBeautiesShopperSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_urbanHealthBeautiesShopperSales.html',                        
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
                        var bmValue=Values.segmentInfo[4].shopperInfo[0].value;
                        var onlineValue=Values.segmentInfo[4].shopperInfo[1].value;
                        var mixedValue=Values.segmentInfo[4].shopperInfo[2].value;
                    }else{
                        var bmValue=0;
                        var onlineValue=0;
                        var mixedValue=0;
                    }
                    var ValueChanges=_.find(data.owner_valueChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(ValueChanges!=undefined){
                        var bmValueChange=(ValueChanges.segmentInfo[4].shopperInfo[0].value*100);
                        var onlineValueChange=(ValueChanges.segmentInfo[4].shopperInfo[1].value*100);
                        var mixedValueChange=(ValueChanges.segmentInfo[4].shopperInfo[2].value*100);
                    }else{
                        var bmValueChange=0;
                        var onlineValueChange=0;
                        var mixedValueChange=0;
                    }
                    var Volumes=_.find(data.owner_absoluteVolume,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(Volumes!=undefined){
                        var bmVolume=Volumes.segmentInfo[4].shopperInfo[0].value;
                        var onlineVolume=Volumes.segmentInfo[4].shopperInfo[1].value;
                        var mixedVolume=Volumes.segmentInfo[4].shopperInfo[2].value;
                    }else{
                        var bmVolume=0;
                        var onlineVolume=0;
                        var mixedVolume=0;
                    }
                    var VolumeChanges=_.find(data.owner_volumeChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(VolumeChanges!=undefined){
                        var bmVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[0].value*100);
                        var onlineVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[1].value*100);
                        var mixedVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[2].value*100);
                    }else{
                        var bmVolumeChange=0;
                        var onlineVolumeChange=0;
                        var mixedVolumeChange=0;
                    }
                    scope.playerTotals[ownerID-1].bmValue=bmValue;scope.playerTotals[ownerID-1].onlineValue=onlineValue;scope.playerTotals[ownerID-1].mixedValue=mixedValue;scope.playerTotals[ownerID-1].bmVolume=bmVolume;scope.playerTotals[ownerID-1].onlineVolume=onlineVolume;scope.playerTotals[ownerID-1].mixedVolume=mixedVolume;scope.playerTotals[ownerID-1].bmValueChange=bmValueChange;scope.playerTotals[ownerID-1].onlineValueChange=onlineValueChange;scope.playerTotals[ownerID-1].mixedValueChange=mixedValueChange;scope.playerTotals[ownerID-1].bmVolumeChange=bmVolumeChange;scope.playerTotals[ownerID-1].onlineVolumeChange=onlineVolumeChange;scope.playerTotals[ownerID-1].mixedVolumeChange=mixedVolumeChange;
                }

                var loadMarketShopper=function(data,category,market){
                    for(var i=0;i<data.absoluteValue.length;i++){
                        if(data.absoluteValue[i].parentCategoryID==category&&data.absoluteValue[i].marketID==market){
                            var variantName=data.absoluteValue[i].variantName;
                            var brandName=data.absoluteValue[i].parentBrandName;
                            // bmValue=absoluteValue[].segmentInfo[4].shopperInfo[0].value
                            // onlineValue=absoluteValue[].segmentInfo[4].shopperInfo[1].value
                            // mixedValue=absoluteValue[].segmentInfo[4].shopperInfo[2].value
                            // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[4].shopperInfo[]
                            // bmVolume=absoluteVolume[].segmentInfo[4].shopperInfo[0].value
                            // onlineVolume=absoluteVolume[].segmentInfo[4].shopperInfo[1].value
                            // mixedVolume=absoluteVolume[].segmentInfo[4].shopperInfo[2].value
                            // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[4].shopperInfo[]

                            var bmValue=data.absoluteValue[i].segmentInfo[4].shopperInfo[0].value;
                            var onlineValue=data.absoluteValue[i].segmentInfo[4].shopperInfo[1].value;
                            var mixedValue=data.absoluteValue[i].segmentInfo[4].shopperInfo[2].value;
                            var Changes=_.find(data.valueChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Changes!=undefined){
                                var bmValueChange=(Changes.segmentInfo[4].shopperInfo[0].value*100);
                                var onlineValueChange=(Changes.segmentInfo[4].shopperInfo[1].value*100);
                                var mixedValueChange=(Changes.segmentInfo[4].shopperInfo[2].value*100); 
                            }else{
                                var bmValueChange=0;
                                var onlineValueChange=0;
                                var mixedValueChange=0; 
                            }

                            var Volumes=_.find(data.absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            var VolumeChanges=_.find(data.volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Volumes!=undefined){
                                var bmVolume=Volumes.segmentInfo[4].shopperInfo[0].value;
                                var onlineVolume=Volumes.segmentInfo[4].shopperInfo[1].value;
                                var mixedVolume=Volumes.segmentInfo[4].shopperInfo[2].value;
                            }else{
                                var bmVolume=0;
                                var onlineVolume=0;
                                var mixedVolume=0;
                            }
                            if(VolumeChanges!=undefined){
                                var bmVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[0].value*100);
                                var onlineVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[1].value*100);
                                var mixedVolumeChange=(VolumeChanges.segmentInfo[4].shopperInfo[2].value*100);                                
                            }else{
                                var bmVolumeChange=0;
                                var onlineVolumeChange=0;
                                var mixedVolumeChange=0;
                            }
                            switch(data.absoluteValue[i].parentCompanyID){
                                case 1:scope.player1s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
                                case 2:scope.player2s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
                                case 3:scope.player3s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
                                case 5:scope.player5s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
                                case 6:scope.player6s.push({'fullName':brandName+variantName,'bmValue':bmValue,'bmValueChange':bmValueChange,'bmVolume':bmVolume,'bmVolumeChange':bmVolumeChange,'onlineValue':onlineValue,'onlineValueChange':onlineValueChange,'onlineVolume':onlineVolume,'onlineVolumeChange':onlineVolumeChange,'mixedValue':mixedValue,'mixedValueChange':mixedValueChange,'mixedVolume':mixedVolume,'mixedVolumeChange':mixedVolumeChange});break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    scope.quality1s=new Array();scope.quality2s=new Array();scope.quality3s=new Array();scope.quality5s=new Array();scope.quality6s=new Array();scope.price1s=new Array();scope.price2s=new Array();scope.price3s=new Array();scope.price5s=new Array();scope.price6s=new Array();
                    var url='/getMR-salesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
                    $http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
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
                    scope.shopperShare=false;
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
                    loadMarketShopper(data,2,1);
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
                scope.$watch('selectedPeriod', function(newValue, oldValue){
                    if(newValue!=oldValue&&scope.isPageShown) {
                        initializePage();
                    }
                })

            }
        }
    }])
})