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
                    var varName,brandName,bmShare,bmChange,onlineShare,onlineChange,mixedShare,mixedChange;
                    for(var i=0;i<data.data[0].absoluteValue.length;i++){
                        if(data.data[0].absoluteValue[i].parentCategoryID==category){
                            varName=data.data[0].absoluteValue[i].variantName;
                            brandName=data.data[0].absoluteValue[i].parentBrandName;
                            bmShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[0].value;
                            onlineShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[1].value;
                            mixedShare=data.data[0].absoluteValue[i].marketInfo[0].segmentInfo[4].shopperInfo[2].value;
                            var Changes=_.find(data.data[0].valueChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            bmChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
                            onlineChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
                            mixedChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
                            scope.urban1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});

                            bmShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[0].value;
                            onlineShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[1].value;
                            mixedShare=data.data[0].absoluteValue[i].marketInfo[1].segmentInfo[4].shopperInfo[2].value;
                            bmChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
                            onlineChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
                            mixedChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
                            scope.rural1s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                            var Volumes=_.find(data.data[0].absoluteVolume,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            var Changes=_.find(data.data[0].volumeChange,function(obj){
                                return(obj.variantName==varName&&obj.parentBrandName==brandName);
                            });
                            bmShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
                            onlineShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
                            mixedShare=Volumes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
                            bmChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[0].value;
                            onlineChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[1].value;
                            mixedChange=Changes.marketInfo[0].segmentInfo[4].shopperInfo[2].value;
                            scope.urban2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});
                            bmShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
                            onlineShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
                            mixedShare=Volumes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
                            bmChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[0].value;
                            onlineChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[1].value;
                            mixedChange=Changes.marketInfo[1].segmentInfo[4].shopperInfo[2].value;
                            scope.rural2s.push({'fullName':brandName+varName,'bmShare':bmShare,'bmChange':bmChange,'onlineShare':onlineShare,'onlineChange':onlineChange,'mixedShare':mixedShare,'mixedChange':mixedChange});

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
                    console.log('watch in the TE_GR_performance fire, new value: ' + newValue + ', oldValue: '+ oldValue);
                    if(newValue==true) {
                        initializePage();
                    }
                })

            }
        }
    }])
})