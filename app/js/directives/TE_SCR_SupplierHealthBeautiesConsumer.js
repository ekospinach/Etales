define(['directives', 'services'], function(directives){
    directives.directive('supplierHealthBeautiesConsumer', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierHealthBeautiesConsumer.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadConsumer=function(data,category){
                    scope.rural1s=new Array();
                    scope.urban1s=new Array();
                    scope.rural2s=new Array();
                    scope.urban2s=new Array();
                    var varName,brandName,marketID,priceShare,priceChange,moneyShare,moneyChange,fashionShare,fashionChange,freaksShare,freaksChange;
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            varName=data.data[0].absoluteValue[i].variantName;
                            brandName=data.data[0].absoluteValue[i].parentBrandName;
                            priceValueShare=data.data[0].absoluteValue[i].segmentInfo[0].shopperInfo[3].value;
                            moneyValueShare=data.data[0].absoluteValue[i].segmentInfo[1].shopperInfo[3].value;
                            fashionValueShare=data.data[0].absoluteValue[i].segmentInfo[2].shopperInfo[3].value;
                            freaksValueShare=data.data[0].absoluteValue[i].segmentInfo[3].shopperInfo[3].value;
                            marketID=data.data[0].absoluteValue[i].marketID;
                            var ValueChanges=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            if(ValueChanges!=undefined){
                                priceValueChange=ValueChanges.segmentInfo[0].shopperInfo[3].value;
                                moneyValueChange=ValueChanges.segmentInfo[1].shopperInfo[3].value;
                                fashionValueChange=ValueChanges.segmentInfo[2].shopperInfo[3].value;
                                freaksValueChange=ValueChanges.segmentInfo[3].shopperInfo[3].value;                               
                            }else{
                                priceValueChange=0;
                                moneyValueChange=0;
                                fashionValueChange=0;
                                freaksValueChange=0;
                            }
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            var VolumesChanges=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.marketID==marketID);
                            });
                            if(Volumes!=undefined){
                                priceVolumeShare=Volumes.segmentInfo[0].shopperInfo[3].value;
                                moneyVolumeShare=Volumes.segmentInfo[1].shopperInfo[3].value;
                                fashionVolumeShare=Volumes.segmentInfo[2].shopperInfo[3].value;
                                freaksVolumeShare=Volumes.segmentInfo[3].shopperInfo[3].value;                                
                            }else{
                                priceVolumeShare=0;
                                moneyVolumeShare=0;
                                fashionVolumeShare=0;
                                freaksVolumeShare=0;
                            }
                            if(volumeChange!=undefined){
                                priceVolumeChange=VolumesChanges.segmentInfo[0].shopperInfo[3].value;
                                moneyVolumeChange=VolumesChanges.segmentInfo[1].shopperInfo[3].value;
                                fashionVolumeChange=VolumesChanges.segmentInfo[2].shopperInfo[3].value;
                                freaksVolumeChange=VolumesChanges.segmentInfo[3].shopperInfo[3].value;
                            }else{
                                priceVolumeChange=0;
                                moneyVolumeChange=0;
                                fashionVolumeChange=0;
                                freaksVolumeChange=0;                                
                            }
                            switch(marketID){
                                case 1:
                                    scope.urban1s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                    scope.urban2s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
                                break;
                                case 2:
                                    scope.rural1s.push({'fullName':brandName+varName,'priceVolumeShare':priceVolumeShare,'priceVolumeChange':priceVolumeChange,'moneyVolumeShare':moneyVolumeShare,'moneyVolumeChange':moneyVolumeChange,'fashionVolumeShare':fashionVolumeShare,'fashionVolumeChange':fashionVolumeChange,'freaksVolumeShare':freaksVolumeShare,'freaksVolumeChange':freaksVolumeChange});
                                    scope.rural2s.push({'fullName':brandName+varName,'priceValueShare':priceValueShare,'priceValueChange':priceValueChange,'moneyValueShare':moneyValueShare,'moneyValueChange':moneyValueChange,'fashionValueShare':fashionValueShare,'fashionValueChange':fashionValueChange,'freaksValueShare':freaksValueShare,'freaksValueChange':freaksValueChange});
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
                    loadConsumer(data,2);
                
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