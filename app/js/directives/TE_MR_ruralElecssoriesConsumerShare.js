define(['directives', 'services'], function(directives){

    directives.directive('marketRuralElecssoriesConsumerSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_ruralElecssoriesConsumerSales.html',            
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
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            var variantName=data.data[0].absoluteValue[i].variantName;
                            var brandName=data.data[0].absoluteValue[i].parentBrandName;
                            var priceValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
                            var moneyValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
                            var fashionValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
                            var freaksValue=data.data[0].absoluteValue[i].marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
                            var Changes=_.find(data.data[0].valueChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var priceValueChange=Changes.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
                            var moneyValueChange=Changes.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
                            var fashionValueChange=Changes.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
                            var freaksValueChange=Changes.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var VolumeChanges=_.find(data.data[0].volumeChange,function(obj){
                                return (obj.parentBrandName==brandName&&obj.variantName==variantName);
                            });
                            var priceVolume=Volumes.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
                            var moneyVolume=Volumes.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
                            var fashionVolume=Volumes.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
                            var freaksVolume=Volumes.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
                            var priceVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[0].shopperInfo[3].value;
                            var moneyVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[1].shopperInfo[3].value;
                            var fashionVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[2].shopperInfo[3].value;
                            var freaksVolumeChange=VolumeChanges.marketInfo[market-1].segmentInfo[3].shopperInfo[3].value;
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