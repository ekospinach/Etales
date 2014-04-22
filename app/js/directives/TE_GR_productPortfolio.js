define(['directives', 'services'], function(directives){

    directives.directive('generalProductPortfolio', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/GR_productPortfolio.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    //switching('showPerformance');
                    var url='/productPortfolio/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    
                    scope.producer1es=new Array();
                    scope.producer1hs=new Array();                 
                    scope.producer2es=new Array();
                    scope.producer2hs=new Array();
                    scope.producer3es=new Array();
                    scope.producer3hs=new Array();
                    scope.retailer1es=new Array();
                    scope.retailer1hs=new Array();
                    scope.retailer2es=new Array();
                    scope.retailer2hs=new Array();
                    for(var i=0;i<data.data[0].categoryInfo[0].variantInfo.length;i++){
                        switch(data.data[0].categoryInfo[0].variantInfo[i].parentBrandName.substring(data.data[0].categoryInfo[0].variantInfo[i].parentBrandName.length-1)){
                            case '1':scope.producer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
                            case '2':scope.producer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
                            case '3':scope.producer3es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
                            case '4':break;
                            case '5':scope.retailer1es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
                            case '6':scope.retailer2es.push(data.data[0].categoryInfo[0].variantInfo[i]);break;
                            case '7':break;
                        }
                    }
                    for(var i=0;i<data.data[0].categoryInfo[1].variantInfo.length;i++){
                        switch(data.data[0].categoryInfo[1].variantInfo[i].parentBrandName.substring(data.data[0].categoryInfo[1].variantInfo[i].parentBrandName.length-1)){
                            case '1':scope.producer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
                            case '2':scope.producer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
                            case '3':scope.producer3hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
                            case '4':break;
                            case '5':scope.retailer1hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
                            case '6':scope.retailer2hs.push(data.data[0].categoryInfo[1].variantInfo[i]);break;
                            case '7':break;
                        }
                    }
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