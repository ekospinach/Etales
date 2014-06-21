define(['directives', 'services'], function(directives){

    directives.directive('marketBMHealthBeauties', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_bMHealthBeauties.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadRetailerPrice=function(data,category){
                    for(var i=0;i<data.data[0].variantInfo.length;i++){
                        if(data.data[0].variantInfo[i].parentCategoryID==category){
                            var fullName=data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName;
                            var rural1Value=rural1ValueChange=urban1Value=urban1ValueChange=rural2Value=rural2ValueChange=urban2Value=urban2ValueChange=0;
                            if(data.data[0].variantInfo[i].accountInfo[0]!=undefined){
                                rural1Value=data.data[0].variantInfo[i].accountInfo[0].latestNetMarketPrice[1];
                                rural1ValueChange=data.data[0].variantInfo[i].accountInfo[0].netMarketPriceChange[1]*100;
                                urban1Value=data.data[0].variantInfo[i].accountInfo[0].latestNetMarketPrice[0];
                                urban1ValueChange=data.data[0].variantInfo[i].accountInfo[0].netMarketPriceChange[0]*100;
                            }
                            if(data.data[0].variantInfo[i].accountInfo[1]!=undefined){
                                rural2Value=data.data[0].variantInfo[i].accountInfo[1].latestNetMarketPrice[1];
                                rural2ValueChange=data.data[0].variantInfo[i].accountInfo[1].netMarketPriceChange[1]*100;
                                urban2Value=data.data[0].variantInfo[i].accountInfo[1].latestNetMarketPrice[0];
                                urban2ValueChange=data.data[0].variantInfo[i].accountInfo[1].netMarketPriceChange[0]*100;
                            }
                            switch(data.data[0].variantInfo[i].parentCompanyID){
                                case 1:scope.player1s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
                                case 2:scope.player2s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
                                case 3:scope.player3s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
                                case 5:scope.player5s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
                                case 6:scope.player6s.push({'fullName':fullName,'rural1Value':rural1Value,'rural1ValueChange':rural1ValueChange,'urban1Value':urban1Value,'urban1ValueChange':urban1ValueChange,'rural2Value':rural2Value,'rural2ValueChange':rural2ValueChange,'urban2Value':urban2Value,'urban2ValueChange':urban2ValueChange});break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/getMR-netMarketPrices/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.player1s=new Array();scope.player2s=new Array();scope.player3s=new Array();scope.player5s=new Array();scope.player6s=new Array();
                    scope.nameColor='#F2DEDE'//红
                    loadRetailerPrice(data,2);
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