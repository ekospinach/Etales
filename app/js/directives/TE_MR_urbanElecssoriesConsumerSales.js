define(['directives', 'services'], function(directives){

    directives.directive('marketUrbanElecssoriesConsumerSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_urbanElecssoriesConsumerSales.html',                        
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
                        var priceValue=Values.segmentInfo[0].shopperInfo[3].value.toFixed(2);
                        var moneyValue=Values.segmentInfo[1].shopperInfo[3].value.toFixed(2);
                        var fashionValue=Values.segmentInfo[2].shopperInfo[3].value.toFixed(2);
                        var freaksValue=Values.segmentInfo[3].shopperInfo[3].value.toFixed(2);
                    }else{
                        var priceValue=0;
                        var moneyValue=0;
                        var fashionValue=0;
                        var freaksValue=0; 
                    }
                    var ValueChanges=_.find(data.owner_valueChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(ValueChanges!=undefined){
                        var priceValueChange=(ValueChanges.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                        var moneyValueChange=(ValueChanges.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                        var fashionValueChange=(ValueChanges.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                        var freaksValueChange=(ValueChanges.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                    }else{
                        var priceValueChange=0;
                        var moneyValueChange=0;
                        var fashionValueChange=0;
                        var freaksValueChange=0; 
                    }
                    var Volumes=_.find(data.owner_absoluteVolume,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(Volumes!=undefined){
                        var priceVolume=Volumes.segmentInfo[0].shopperInfo[3].value.toFixed(2);
                        var moneyVolume=Volumes.segmentInfo[1].shopperInfo[3].value.toFixed(2);
                        var fashionVolume=Volumes.segmentInfo[2].shopperInfo[3].value.toFixed(2);
                        var freaksVolume=Volumes.segmentInfo[3].shopperInfo[3].value.toFixed(2);
                    }else{
                        var priceVolume=0;
                        var moneyVolume=0;
                        var fashionVolume=0;
                        var freaksVolume=0; 
                    }
                    var VolumeChanges=_.find(data.owner_volumeChange,function(obj){
                        return (obj.ownerID==ownerID&&obj.categoryID==category&&obj.marketID==market);
                    });
                    if(VolumeChanges!=undefined){
                        var priceVolumeChange=(VolumeChanges.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                        var moneyVolumeChange=(VolumeChanges.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                        var fashionVolumeChange=(VolumeChanges.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                        var freaksVolumeChange=(VolumeChanges.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                    }else{
                        var priceVolumeChange=0;
                        var moneyVolumeChange=0;
                        var fashionVolumeChange=0;
                        var freaksVolumeChange=0; 
                    }
                    scope.playerTotals[ownerID-1].priceValue=priceValue;scope.playerTotals[ownerID-1].moneyValue=moneyValue;scope.playerTotals[ownerID-1].fashionValue=fashionValue;scope.playerTotals[ownerID-1].freaksValue=freaksValue;scope.playerTotals[ownerID-1].priceVolume=priceVolume;scope.playerTotals[ownerID-1].moneyVolume=moneyVolume;scope.playerTotals[ownerID-1].fashionVolume=fashionVolume;scope.playerTotals[ownerID-1].freaksVolume=freaksVolume;scope.playerTotals[ownerID-1].priceValueChange=priceValueChange;scope.playerTotals[ownerID-1].moneyValueChange=moneyValueChange;scope.playerTotals[ownerID-1].fashionValueChange=fashionValueChange;scope.playerTotals[ownerID-1].freaksValueChange=freaksValueChange;scope.playerTotals[ownerID-1].priceVolumeChange=priceVolumeChange;scope.playerTotals[ownerID-1].moneyVolumeChange=moneyVolumeChange;scope.playerTotals[ownerID-1].fashionVolumeChange=fashionVolumeChange;scope.playerTotals[ownerID-1].freaksVolumeChange=freaksVolumeChange;
                }

                var loadMarketConsumer=function(data,category,market){
                    for(var i=0;i<data.absoluteValue.length;i++){
                        if(data.absoluteValue[i].parentCategoryID==category&&data.absoluteValue[i].marketID==market){
                            var variantName=data.absoluteValue[i].variantName;
                            var brandName=data.absoluteValue[i].parentBrandName;
                            // priceValue=absoluteValue[].segmentInfo[0].shopperInfo[3].value
                            // moneyValue=absoluteValue[].segmentInfo[1].shopperInfo[3].value
                            // fashionValue=absoluteValue[].segmentInfo[2].shopperInfo[3].value
                            // freaksValue=absoluteValue[].segmentInfo[3].shopperInfo[3].value
                            // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[3]
                            // priceVolume=absoluteVolume[].segmentInfo[0].shopperInfo[3].value
                            // moneyVolume=absoluteVolume[].segmentInfo[1].shopperInfo[3].value
                            // fashionVolume=absoluteVolume[].segmentInfo[2].shopperInfo[3].value
                            // freaksVolume=absoluteVolume[].segmentInfo[3].shopperInfo[3].value
                            // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[3]

                            var priceValue=data.absoluteValue[i].segmentInfo[0].shopperInfo[3].value.toFixed(2);
                            var moneyValue=data.absoluteValue[i].segmentInfo[1].shopperInfo[3].value.toFixed(2);
                            var fashionValue=data.absoluteValue[i].segmentInfo[2].shopperInfo[3].value.toFixed(2);
                            var freaksValue=data.absoluteValue[i].segmentInfo[3].shopperInfo[3].value.toFixed(2);
                            var Changes=_.find(data.valueChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Changes!=undefined){
                                var priceValueChange=(Changes.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                                var moneyValueChange=(Changes.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                                var fashionValueChange=(Changes.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                                var freaksValueChange=(Changes.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                            }else{
                                var priceValueChange=0;
                                var moneyValueChange=0;
                                var fashionValueChange=0;
                                var freaksValueChange=0; 
                            }
                            var Volumes=_.find(data.absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            var VolumeChanges=_.find(data.volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Volumes!=undefined){
                                var priceVolume=Volumes.segmentInfo[0].shopperInfo[3].value.toFixed(2);
                                var moneyVolume=Volumes.segmentInfo[1].shopperInfo[3].value.toFixed(2);
                                var fashionVolume=Volumes.segmentInfo[2].shopperInfo[3].value.toFixed(2);
                                var freaksVolume=Volumes.segmentInfo[3].shopperInfo[3].value.toFixed(2);                                
                            }else{
                                var priceVolume=0;
                                var moneyVolume=0;
                                var fashionVolume=0;
                                var freaksVolume=0;
                            }
                            if(VolumeChanges!=undefined){
                                var priceVolumeChange=(VolumeChanges.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                                var moneyVolumeChange=(VolumeChanges.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                                var fashionVolumeChange=(VolumeChanges.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                                var freaksVolumeChange=(VolumeChanges.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);                                
                            }else{
                                var priceVolumeChange=0;
                                var moneyVolumeChange=0;
                                var fashionVolumeChange=0;
                                var freaksVolumeChange=0;
                            }
                            switch(data.absoluteValue[i].parentCompanyID){
                                case 1:scope.player1s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
                                case 2:scope.player2s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
                                case 3:scope.player3s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
                                case 5:scope.player5s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
                                case 6:scope.player6s.push({'fullName':brandName+variantName,'priceValue':priceValue,'priceValueChange':priceValueChange,'priceVolume':priceVolume,'priceVolumeChange':priceVolumeChange,'moneyValue':moneyValue,'moneyValueChange':moneyValueChange,'moneyVolume':moneyVolume,'moneyVolumeChange':moneyVolumeChange,'fashionValue':fashionValue,'fashionValueChange':fashionValueChange,'fashionVolume':fashionVolume,'fashionVolumeChange':fashionVolumeChange,'freaksValue':freaksValue,'freaksValueChange':freaksValueChange,'freaksVolume':freaksVolume,'freaksVolumeChange':freaksVolumeChange});break;
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
                    scope.consumerShare=false;
                    scope.playerTotals=new Array();
                    for(var i=0;i<6;i++){
                        scope.playerTotals[i]=new Array();
                    }
                    scope.player1s=new Array();scope.player2s=new Array();scope.player3s=new Array();scope.player5s=new Array();scope.player6s=new Array();
                    loadTotal(data,1,1,1);
                    loadTotal(data,2,1,1);
                    loadTotal(data,3,1,1);
                    loadTotal(data,4,1,1);
                    loadTotal(data,5,1,1);
                    loadTotal(data,6,1,1);
                    loadMarketConsumer(data,1,1);
                    scope.nameColor='#DFF0D8';//绿
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