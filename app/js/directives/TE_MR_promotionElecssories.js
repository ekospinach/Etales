define(['directives', 'services'], function(directives){

    directives.directive('marketPromotionElecssories', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_promotionElecssories.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadPromotion=function(data,category){
                    for(var i=0;i<data.data[0].variantInfo.length;i++){
                        if(data.data[0].variantInfo[i].parentCategoryID==category){
                            var fullName=data.data[0].variantInfo[i].parentBrandName+data.data[0].variantInfo[i].variantName;
                            var rural1Length=rural1Depth=urban1Length=urban1Depth=rural2Length=rural2Depth=urban2Length=urban2Depth=0;
                            if(data.data[0].variantInfo[i].accountInfo[0]!=undefined){
                                rural1Depth=(data.data[0].variantInfo[i].accountInfo[0].promoRate[1]*100).toFixed(2);
                                rural1Length=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[1].toFixed(2);
                                urban1Depth=(data.data[0].variantInfo[i].accountInfo[0].promoRate[0]*100).toFixed(2);
                                urban1Length=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[0].toFixed(2);
                            }
                            if(data.data[0].variantInfo[i].accountInfo[1]!=undefined){
                                rural2Depth=(data.data[0].variantInfo[i].accountInfo[1].promoRate[1]*100).toFixed(2);
                                rural2Length=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[1].toFixed(2);
                                urban2Depth=(data.data[0].variantInfo[i].accountInfo[1].promoRate[0]*100).toFixed(2);
                                urban2Length=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[0].toFixed(2);
                            }
                            switch(data.data[0].variantInfo[i].parentCompanyID){
                                case 1:scope.player1s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
                                case 2:scope.player2s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
                                case 3:scope.player3s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
                                case 5:scope.player5s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
                                case 6:scope.player6s.push({'fullName':fullName,'rural1Length':rural1Length,'rural1Depth':rural1Depth,'urban1Length':urban1Length,'urban1Depth':urban1Depth,'rural2Length':rural2Length,'rural2Depth':rural2Depth,'urban2Length':urban2Length,'urban2Depth':urban2Depth});break;
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/getMR-pricePromotions/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.nameColor='#DFF0D8';//绿
                    loadPromotion(data,1);
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