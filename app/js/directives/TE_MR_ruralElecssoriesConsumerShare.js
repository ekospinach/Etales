define(['directives', 'services'], function(directives){

    directives.directive('marketRuralElecssoriesConsumerShare', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_ruralElecssoriesConsumerShare.html',            
            //templateUrl : '../../partials/singleReportTemplate/MR_brand.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadMarketConsumer=function(data,category,market){
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category&&data.data[0].absoluteValue[i].marketID==market){
                            var variantName=data.data[0].absoluteValue[i].variantName;
                            var brandName=data.data[0].absoluteValue[i].parentBrandName;
                            
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

                            var priceValue=(data.data[0].absoluteValue[i].segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                            var moneyValue=(data.data[0].absoluteValue[i].segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                            var fashionValue=(data.data[0].absoluteValue[i].segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                            var freaksValue=(data.data[0].absoluteValue[i].segmentInfo[3].shopperInfo[3].value*100).toFixed(2);
                            var Changes=_.find(data.data[0].valueChange,function(obj){
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
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName&&obj.marketID==market);
                            });
                            if(Volumes!=undefined){
                                var priceVolume=(Volumes.segmentInfo[0].shopperInfo[3].value*100).toFixed(2);
                                var moneyVolume=(Volumes.segmentInfo[1].shopperInfo[3].value*100).toFixed(2);
                                var fashionVolume=(Volumes.segmentInfo[2].shopperInfo[3].value*100).toFixed(2);
                                var freaksVolume=(Volumes.segmentInfo[3].shopperInfo[3].value*100).toFixed(2);                                
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
                            switch(data.data[0].absoluteValue[i].parentCompanyID){
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
                    var url='/getMR-sharesCrossSegment/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.consumerShare=true;
                    scope.player1s=new Array();scope.player2s=new Array();scope.player3s=new Array();scope.player5s=new Array();scope.player6s=new Array();
                    loadMarketConsumer(data,1,2);
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