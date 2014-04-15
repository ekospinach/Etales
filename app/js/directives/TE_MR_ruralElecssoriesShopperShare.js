define(['directives', 'services'], function(directives){

    directives.directive('marketRuralElecssoriesShopperShare', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_ruralElecssoriesShopperShare.html',                        
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadMarketShopper=function(data,category,market){
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            var variantName=data.data[0].absoluteValue[i].variantName;
                            var brandName=data.data[0].absoluteValue[i].parentBrandName;
                            var bmValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
                            var onlineValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
                            var mixedValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
                            var Changes=_.find(data.data[0].valueChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var bmValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
                            var onlineValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
                            var mixedValueChange=Changes.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var bmVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
                            var onlineVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
                            var mixedVolume=Volumes.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
                            var bmVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[0].value;
                            var onlineVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[1].value;
                            var mixedVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[4].shopperInfo[2].value;
                            switch(data.data[0].absoluteValue[i].parentCompanyID){
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
                    var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.shopperShare=true;
                    scope.player1s=new Array();scope.player2s=new Array();scope.player3s=new Array();scope.player5s=new Array();scope.player6s=new Array();
                    loadMarketShopper(data,1,2);
                    scope.nameColor='#DFF0D8';//绿
                    scope.valueColor='#D9EDF7';//蓝
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