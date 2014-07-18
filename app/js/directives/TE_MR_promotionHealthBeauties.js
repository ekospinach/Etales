define(['directives', 'services'], function(directives){

    directives.directive('marketPromotionHealthBeauties', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_promotionHealthBeauties.html',            
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
                            //depth=variantInfo[].accountInfo[retailerID-1].promoRate[catrgoryID-1]
                            //length=variantInfo[].accountInfo[retailerID-1].promoFrequency[categoryID-1]
                            //variantInfo[].parentCompanyID decide player num
                            //player 1 2 3 -->supplier
                            //player 5 6 -->retailer
                            if(data.data[0].variantInfo[i].accountInfo[0]!=undefined){
                                if(data.data[0].variantInfo[i].accountInfo[0].promoRate[1]!=0){
                                    rural1Depth=(data.data[0].variantInfo[i].accountInfo[0].promoRate[1]*100).toFixed(2)+'%';
                                }else{
                                    rural1Depth=data.data[0].variantInfo[i].accountInfo[0].promoRate[1];
                                }
                                rural1Length=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[1];
                                if(data.data[0].variantInfo[i].accountInfo[0].promoRate[0]!=0){
                                    urban1Depth=(data.data[0].variantInfo[i].accountInfo[0].promoRate[0]*100).toFixed(2)+'%';
                                }else{
                                    urban1Depth=data.data[0].variantInfo[i].accountInfo[0].promoRate[0];
                                }
                                urban1Length=data.data[0].variantInfo[i].accountInfo[0].promoFrequency[0];
                            }
                            if(data.data[0].variantInfo[i].accountInfo[1]!=undefined){
                                if(data.data[0].variantInfo[i].accountInfo[1].promoRate[1]!=0){
                                    rural2Depth=(data.data[0].variantInfo[i].accountInfo[1].promoRate[1]*100).toFixed(2)+'%';
                                }else{
                                    rural1Depth=data.data[0].variantInfo[i].accountInfo[1].promoRate[1];
                                }
                                rural2Length=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[1];
                                if(data.data[0].variantInfo[i].accountInfo[1].promoRate[0]!=0){
                                    urban2Depth=(data.data[0].variantInfo[i].accountInfo[1].promoRate[0]*100).toFixed(2)+'%';
                                }else{
                                    urban2Depth=data.data[0].variantInfo[i].accountInfo[1].promoRate[0];

                                }
                                urban2Length=data.data[0].variantInfo[i].accountInfo[1].promoFrequency[0];
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
                    var url='/getMR-pricePromotions/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
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
                    loadPromotion(data,2);
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