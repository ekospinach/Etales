define(['directives', 'services'], function(directives){

    directives.directive('marketForecastsInternet', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_forecastsInternet.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1);
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
                    scope.forecastInternetSeries=[{
                        'name':Label.getContent('Rural'),'color':'#3257A7',
                        'data':[[1,data.data[0].minInternetPenetrationRate[0].value[1],data.data[0].maxInternetPenetrationRate[0].value[1]],[2,data.data[0].minInternetPenetrationRate[1].value[1],data.data[0].maxInternetPenetrationRate[1].value[1]],[3,data.data[0].minInternetPenetrationRate[2].value[1],data.data[0].maxInternetPenetrationRate[2].value[1]],[4,data.data[0].minInternetPenetrationRate[3].value[1],data.data[0].maxInternetPenetrationRate[3].value[1]],[5,data.data[0].minInternetPenetrationRate[4].value[1],data.data[0].maxInternetPenetrationRate[4].value[1]]]
                    },{
                        'name':Label.getContent('Urban'),'color':'#B11E22',
                        'data':[[1,data.data[0].minInternetPenetrationRate[0].value[0],data.data[0].maxInternetPenetrationRate[0].value[0]],[2,data.data[0].minInternetPenetrationRate[1].value[0],data.data[0].maxInternetPenetrationRate[1].value[0]],[3,data.data[0].minInternetPenetrationRate[2].value[0],data.data[0].maxInternetPenetrationRate[2].value[0]],[4,data.data[0].minInternetPenetrationRate[3].value[0],data.data[0].maxInternetPenetrationRate[3].value[0]],[5,data.data[0].minInternetPenetrationRate[4].value[0],data.data[0].maxInternetPenetrationRate[4].value[0]]]
                    }];
                    scope.segmentYTitle=Label.getContent('Penetration Level')+'(%)';
                    scope.segmentXTitle=Label.getContent('Period');
                    scope.myModel='ForecastsInternet';
                    scope.myModel='Consumer Segment Size';
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