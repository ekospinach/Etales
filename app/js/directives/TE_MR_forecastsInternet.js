define(['directives', 'services'], function(directives){

    directives.directive('marketForecastsInternet', ['Label','SeminarInfo','$http','PeriodInfo','$q', 'PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
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
                    var url='/getMR-forecasts/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
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

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    //data:[1,min,max],[2,min.max]...
                    //urban value[0]
                    //rural value[1]

                    scope.forecastInternetSeries=[{
                        'name':Label.getContent('Rural'),'color':PlayerColor.getColors()[0],
                        'data':[[1,parseFloat((data.minInternetPenetrationRate[0].value[1]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[0].value[1]*100).toFixed(2))],[2,parseFloat((data.minInternetPenetrationRate[1].value[1]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[1].value[1]*100).toFixed(2))],[3,parseFloat((data.minInternetPenetrationRate[2].value[1]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[2].value[1]*100).toFixed(2))],[4,parseFloat((data.minInternetPenetrationRate[3].value[1]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[3].value[1]*100).toFixed(2))],[5,parseFloat((data.minInternetPenetrationRate[4].value[1]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[4].value[1]*100).toFixed(2))]]
                    },{
                        'name':Label.getContent('Urban'),'color':PlayerColor.getColors()[1],
                        'data':[[1,parseFloat((data.minInternetPenetrationRate[0].value[0]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[0].value[0]*100).toFixed(2))],[2,parseFloat((data.minInternetPenetrationRate[1].value[0]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[1].value[0]*100).toFixed(2))],[3,parseFloat((data.minInternetPenetrationRate[2].value[0]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[2].value[0]*100).toFixed(2))],[4,parseFloat((data.minInternetPenetrationRate[3].value[0]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[3].value[0]*100).toFixed(2))],[5,parseFloat((data.minInternetPenetrationRate[4].value[0]*100).toFixed(2)),parseFloat((data.maxInternetPenetrationRate[4].value[0]*100).toFixed(2))]]
                    }];
                    scope.segmentYTitle=Label.getContent('Penetration Level')+'(%)';
                    scope.segmentXTitle=Label.getContent('Period');
                    var curP = scope.selectedPeriod;
                    scope.categories = ['', curP-2, curP-1, curP, curP+1, curP+2];                    
                    scope.myModel='ForecastsInternet'+curP;
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