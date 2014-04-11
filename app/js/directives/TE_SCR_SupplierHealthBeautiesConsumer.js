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
                    var varName,brandName,priceShare,priceChange,moneyShare,moneyChange,fashionShare,fashionChange,freaksShare,freaksChange;
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            varName=data.data[0].absoluteValue[i].variantName;
                            brandName=data.data[0].absoluteValue[i].parentBrandName;
                            priceShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[0].shopperInfo[3].value;
                            moneyShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[1].shopperInfo[3].value;
                            fashionShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[2].shopperInfo[3].value;
                            freaksShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[3].shopperInfo[3].value;
                            var Changes=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            priceChange=Changes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
                            moneyChange=Changes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
                            fashionChange=Changes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
                            freaksChange=Changes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
                            scope.urban1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                            priceShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[0].shopperInfo[3].value;
                            moneyShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[1].shopperInfo[3].value;
                            fashionShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[2].shopperInfo[3].value;
                            freaksShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[3].shopperInfo[3].value;
                            priceChange=Changes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
                            moneyChange=Changes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
                            fashionChange=Changes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
                            freaksChange=Changes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
                            scope.rural1s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            var Changes=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            priceShare=Volumes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
                            moneyShare=Volumes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
                            fashionShare=Volumes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
                            freaksShare=Volumes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
                            priceChange=Changes.marketInfo[0].segmentInfo[0].shopperInfo[3].value;
                            moneyChange=Changes.marketInfo[0].segmentInfo[1].shopperInfo[3].value;
                            fashionChange=Changes.marketInfo[0].segmentInfo[2].shopperInfo[3].value;
                            freaksChange=Changes.marketInfo[0].segmentInfo[3].shopperInfo[3].value;
                            scope.urban2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
                            priceShare=Volumes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
                            moneyShare=Volumes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
                            fashionShare=Volumes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
                            freaksShare=Volumes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
                            priceChange=Changes.marketInfo[1].segmentInfo[0].shopperInfo[3].value;
                            moneyChange=Changes.marketInfo[1].segmentInfo[1].shopperInfo[3].value;
                            fashionChange=Changes.marketInfo[1].segmentInfo[2].shopperInfo[3].value;
                            freaksChange=Changes.marketInfo[1].segmentInfo[3].shopperInfo[3].value;
                            scope.rural2s.push({'fullName':brandName+varName,'priceShare':priceShare,'priceChange':priceChange,'moneyShare':moneyShare,'moneyChange':moneyChange,'fashionShare':fashionShare,'fashionChange':fashionChange,'freaksShare':freaksShare,'freaksChange':freaksChange});
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
                    console.log('watch in the TE_GR_performance fire, new value: ' + newValue + ', oldValue: '+ oldValue);
                    if(newValue==true) {
                        initializePage();
                    }
                })

            }
        }
    }])
})