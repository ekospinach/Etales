define(['directives', 'services'], function(directives){

    directives.directive('retailerKey', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerKey.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/RCR-keyPerformanceIndicators/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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

                var loadValue=function(data,category,market){
                    var array=_.find(data,function(obj){
                        return (obj.categoryID==category&&obj.marketID==market);
                    });
                    return array.value;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    var rcrkpi_VolumeRotationIndex=new Array();
                    var rcrkpi_ValueRotationIndex=new Array();
                    var rcrkpi_ProfitabilityIndex=new Array();
                    var rcrkpi_StockCover=new Array();
                    var rcrkpi_ShoppersShare=new Array();
                    var value=new Array();
                    for(var i=0;i<3;i++){
                        rcrkpi_VolumeRotationIndex[i]=new Array();
                        rcrkpi_ValueRotationIndex[i]=new Array();
                        rcrkpi_ProfitabilityIndex[i]=new Array();
                        rcrkpi_StockCover[i]=new Array();
                    }
                    for(var i=0;i<data.data[0].rcrkpi_VolumeRotationIndex.length;i++){
                        value=new Array();
                        if(data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID==1&&data.data[0].rcrkpi_VolumeRotationIndex[i].marketID==1){
                            data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            data.data[0].rcrkpi_VolumeRotationIndex[i].marketID=-1;
                            var market1=data.data[0].rcrkpi_VolumeRotationIndex[i].value;
                            var market2=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,1,2);
                            var market3=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,1,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_VolumeRotationIndex[0].push({'value':value});
                            
                            market1=loadValue(data.data[0].rcrkpi_ValueRotationIndex,1,1);
                            market2=loadValue(data.data[0].rcrkpi_ValueRotationIndex,1,2);
                            market3=loadValue(data.data[0].rcrkpi_ValueRotationIndex,1,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ValueRotationIndex[0].push({'value':value});
                            
                            market1=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,1,1);
                            market2=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,1,2);
                            market3=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,1,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ProfitabilityIndex[0].push({'value':value});

                            market1=loadValue(data.data[0].rcrkpi_StockCover,1,1);
                            market2=loadValue(data.data[0].rcrkpi_StockCover,1,2);
                            market3=loadValue(data.data[0].rcrkpi_StockCover,1,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_StockCover[0].push({'value':value});
                            break;
                        }
                    }
                    for(var i=0;i<data.data[0].rcrkpi_VolumeRotationIndex.length;i++){
                        value=new Array();
                        if(data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID==2&&data.data[0].rcrkpi_VolumeRotationIndex[i].marketID==1){
                            data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            data.data[0].rcrkpi_VolumeRotationIndex[i].marketID=-1;
                            var market1=data.data[0].rcrkpi_VolumeRotationIndex[i].value;
                            var market2=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,2,2);
                            var market3=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,2,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_VolumeRotationIndex[1].push({'value':value});

                            market1=loadValue(data.data[0].rcrkpi_ValueRotationIndex,2,1);
                            market2=loadValue(data.data[0].rcrkpi_ValueRotationIndex,2,2);
                            market3=loadValue(data.data[0].rcrkpi_ValueRotationIndex,2,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ValueRotationIndex[1].push({'value':value});
                            
                            market1=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,2,1);
                            market2=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,2,2);
                            market3=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,2,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ProfitabilityIndex[1].push({'value':value});

                            market1=loadValue(data.data[0].rcrkpi_StockCover,2,1);
                            market2=loadValue(data.data[0].rcrkpi_StockCover,2,2);
                            market3=loadValue(data.data[0].rcrkpi_StockCover,2,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_StockCover[1].push({'value':value});
                            break;
                        }
                    }
                    for(var i=0;i<data.data[0].rcrkpi_VolumeRotationIndex.length;i++){
                        value=new Array();
                        if(data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID==3&&data.data[0].rcrkpi_VolumeRotationIndex[i].marketID==1){
                            data.data[0].rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            var market1=data.data[0].rcrkpi_VolumeRotationIndex[i].value;
                            var market2=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,3,2);
                            var market3=loadValue(data.data[0].rcrkpi_VolumeRotationIndex,3,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_VolumeRotationIndex[2].push({'value':value});

                            market1=loadValue(data.data[0].rcrkpi_ValueRotationIndex,3,1);
                            market2=loadValue(data.data[0].rcrkpi_ValueRotationIndex,3,2);
                            market3=loadValue(data.data[0].rcrkpi_ValueRotationIndex,3,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ValueRotationIndex[2].push({'value':value});
                            
                            market1=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,3,1);
                            market2=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,3,2);
                            market3=loadValue(data.data[0].rcrkpi_ProfitabilityIndex,3,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_ProfitabilityIndex[2].push({'value':value});

                            market1=loadValue(data.data[0].rcrkpi_StockCover,3,1);
                            market2=loadValue(data.data[0].rcrkpi_StockCover,3,2);
                            market3=loadValue(data.data[0].rcrkpi_StockCover,3,3);
                            value[0]=market1;value[1]=market2;value[2]=market3;
                            rcrkpi_StockCover[2].push({'value':value});
                            break;
                        }
                    }
                    for(var i=0;i<data.data[0].rcrkpi_ShoppersShare[0].categoryInfo.length;i++){
                        if(data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==1){
                            scope.BMShoppers1=data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                        if(data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==2){
                            scope.BMShoppers2=data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                    }
                    for(var i=0;i<data.data[0].rcrkpi_ShoppersShare[3].categoryInfo.length;i++){
                        if(data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==1){
                            scope.AllShoppers1=data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                        if(data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==2){
                            scope.AllShoppers2=data.data[0].rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                    }

                    var myData=new Array();
                    myData.push({'rcrkpi_VolumeRotationIndex':rcrkpi_VolumeRotationIndex,'rcrkpi_ValueRotationIndex':rcrkpi_ValueRotationIndex,'rcrkpi_ProfitabilityIndex':rcrkpi_ProfitabilityIndex,'rcrkpi_StockCover':rcrkpi_StockCover});
                    scope.data=myData[0];
                    console.log(scope.data);
                
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