define(['directives', 'services'], function(directives){

    directives.directive('retailerKey', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '=',
                selectedPlayer : '=',
                retailerShow : '='
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
                    var url='/RCR-keyPerformanceIndicators/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod+'/'+parseInt(scope.selectedPlayer);
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

                var loadValue=function(data,category,market){
                    //return the value find from data where obj.categoryID=category and obj.marketID=market
                    var array=_.find(data,function(obj){
                        return ((obj.categoryID==category)&&(obj.marketID==market));
                    });
                    return array.value;
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    var VolumeRotationIndex=new Array();
                    var ValueRotationIndex=new Array();
                    var ProfitabilityIndex=new Array();
                    var StockCover=new Array();
                    var ShoppersShare=new Array();
                    var value=new Array();
                    for(var i=0;i<3;i++){
                        VolumeRotationIndex[i]=new Array();
                        ValueRotationIndex[i]=new Array();
                        ProfitabilityIndex[i]=new Array();
                        StockCover[i]=new Array();
                    }
                    for(var i=0;i<data.rcrkpi_VolumeRotationIndex.length;i++){
                        if(data.rcrkpi_VolumeRotationIndex[i].categoryID==1&&data.rcrkpi_VolumeRotationIndex[i].marketID==1){
                            //make sure that the following find function won't find this one
                            data.rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            data.rcrkpi_VolumeRotationIndex[i].marketID=-1;
                            
                            VolumeRotationIndex[0][0]=data.rcrkpi_VolumeRotationIndex[i].value;
                            VolumeRotationIndex[0][1]=loadValue(data.rcrkpi_VolumeRotationIndex,1,2);
                            VolumeRotationIndex[0][2]=loadValue(data.rcrkpi_VolumeRotationIndex,1,3);
                            
                            ValueRotationIndex[0][0]=loadValue(data.rcrkpi_ValueRotationIndex,1,1);
                            ValueRotationIndex[0][1]=loadValue(data.rcrkpi_ValueRotationIndex,1,2);
                            ValueRotationIndex[0][2]=loadValue(data.rcrkpi_ValueRotationIndex,1,3);
                            
                            ProfitabilityIndex[0][0]=loadValue(data.rcrkpi_ProfitabilityIndex,1,1);
                            ProfitabilityIndex[0][1]=loadValue(data.rcrkpi_ProfitabilityIndex,1,2);
                            ProfitabilityIndex[0][2]=loadValue(data.rcrkpi_ProfitabilityIndex,1,3);
                            
                            StockCover[0][0]=loadValue(data.rcrkpi_StockCover,1,1);
                            StockCover[0][1]=loadValue(data.rcrkpi_StockCover,1,2);
                            StockCover[0][2]=loadValue(data.rcrkpi_StockCover,1,3);
                            break;
                        }
                    }
                    for(var i=0;i<data.rcrkpi_VolumeRotationIndex.length;i++){
                        if(data.rcrkpi_VolumeRotationIndex[i].categoryID==2&&data.rcrkpi_VolumeRotationIndex[i].marketID==1){
                            data.rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            data.rcrkpi_VolumeRotationIndex[i].marketID=-1;

                            VolumeRotationIndex[1][0]=data.rcrkpi_VolumeRotationIndex[i].value;
                            VolumeRotationIndex[1][1]=loadValue(data.rcrkpi_VolumeRotationIndex,2,2);
                            VolumeRotationIndex[1][2]=loadValue(data.rcrkpi_VolumeRotationIndex,2,3);
                            
                            ValueRotationIndex[1][0]=loadValue(data.rcrkpi_ValueRotationIndex,2,1);
                            ValueRotationIndex[1][1]=loadValue(data.rcrkpi_ValueRotationIndex,2,2);
                            ValueRotationIndex[1][2]=loadValue(data.rcrkpi_ValueRotationIndex,2,3);
                            
                            ProfitabilityIndex[1][0]=loadValue(data.rcrkpi_ProfitabilityIndex,2,1);
                            ProfitabilityIndex[1][1]=loadValue(data.rcrkpi_ProfitabilityIndex,2,2);
                            ProfitabilityIndex[1][2]=loadValue(data.rcrkpi_ProfitabilityIndex,2,3);
                            
                            StockCover[1][0]=loadValue(data.rcrkpi_StockCover,2,1);
                            StockCover[1][1]=loadValue(data.rcrkpi_StockCover,2,2);
                            StockCover[1][2]=loadValue(data.rcrkpi_StockCover,2,3);
                            break;
                        }
                    }
                    for(var i=0;i<data.rcrkpi_VolumeRotationIndex.length;i++){
                        if(data.rcrkpi_VolumeRotationIndex[i].categoryID==3&&data.rcrkpi_VolumeRotationIndex[i].marketID==1){
                            data.rcrkpi_VolumeRotationIndex[i].categoryID=-1;
                            data.rcrkpi_VolumeRotationIndex[i].marketID=-1;
                            VolumeRotationIndex[2][0]=data.rcrkpi_VolumeRotationIndex[i].value;
                            VolumeRotationIndex[2][1]=loadValue(data.rcrkpi_VolumeRotationIndex,3,2);
                            VolumeRotationIndex[2][2]=loadValue(data.rcrkpi_VolumeRotationIndex,3,3);
                            
                            ValueRotationIndex[2][0]=loadValue(data.rcrkpi_ValueRotationIndex,3,1);
                            ValueRotationIndex[2][1]=loadValue(data.rcrkpi_ValueRotationIndex,3,2);
                            ValueRotationIndex[2][2]=loadValue(data.rcrkpi_ValueRotationIndex,3,3);
                            
                            ProfitabilityIndex[2][0]=loadValue(data.rcrkpi_ProfitabilityIndex,3,1);
                            ProfitabilityIndex[2][1]=loadValue(data.rcrkpi_ProfitabilityIndex,3,2);
                            ProfitabilityIndex[2][2]=loadValue(data.rcrkpi_ProfitabilityIndex,3,3);
                            
                            StockCover[2][0]=loadValue(data.rcrkpi_StockCover,3,1);
                            StockCover[2][1]=loadValue(data.rcrkpi_StockCover,3,2);
                            StockCover[2][2]=loadValue(data.rcrkpi_StockCover,3,3);
                            break;
                        }
                    }
                    for(var i=0;i<data.rcrkpi_ShoppersShare[0].categoryInfo.length;i++){
                        if(data.rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==1){
                            scope.BMShoppers1=data.rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                        if(data.rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==2){
                            scope.BMShoppers2=data.rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                    }
                    for(var i=0;i<data.rcrkpi_ShoppersShare[3].categoryInfo.length;i++){
                        if(data.rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==1){
                            scope.AllShoppers1=data.rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                        if(data.rcrkpi_ShoppersShare[0].categoryInfo[i].categoryID==3&&data.rcrkpi_ShoppersShare[0].categoryInfo[i].marketID==2){
                            scope.AllShoppers2=data.rcrkpi_ShoppersShare[0].categoryInfo[i].value;
                        }
                    }

                    var newData=new Array();
                    newData.push({'VolumeRotationIndex':VolumeRotationIndex,'ValueRotationIndex':ValueRotationIndex,'ProfitabilityIndex':ProfitabilityIndex,'StockCover':StockCover});
                    scope.data=newData[0];
                
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPeriod', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPlayer', function(newValue, oldValue) {
                    if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                        initializePage();
                    }
                })

            }
        }
    }])
})