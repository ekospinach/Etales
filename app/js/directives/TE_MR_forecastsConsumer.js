define(['directives', 'services'], function(directives){

    directives.directive('marketForecastsConsumer', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_forecastsConsumer.html',            
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
                    scope.forecastsConsumerSeries1=[{
                        'name':Label.getContent('Price Sensitive'),'color':'#329444',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Value For Money'),'color':'#F6B920',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Fashion'),'color':'#B11E22',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Freaks'),'color':'#3257A7',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[1]]]
                    }];
                    scope.forecastsConsumerSeries2=[{
                        'name':Label.getContent('Price Sensitive'),'color':'#329444',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[0].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Value For Money'),'color':'#F6B920',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[1].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Fashion'),'color':'#B11E22',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[2].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Freaks'),'color':'#3257A7',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[0].segmentInfo[3].periodInfo[4].value[0]]]
                    }];
                    scope.forecastsConsumerSeries3=[{
                        'name':Label.getContent('Price Sensitive'),'color':'#329444',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Value For Money'),'color':'#F6B920',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Health Conscious'),'color':'#B11E22',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Impatient'),'color':'#3257A7',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[1]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[1]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[1]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[1]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[1],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[1]]]
                    }];
                    scope.forecastsConsumerSeries4=[{
                        'name':Label.getContent('Price Sensitive'),'color':'#329444',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[0].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Value For Money'),'color':'#F6B920',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[1].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Health Conscious'),'color':'#B11E22',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[2].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Impatient'),'color':'#3257A7',
                        'data':[[1,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[0].value[0]],[2,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[1].value[0]],[3,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[2].value[0]],[4,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[3].value[0]],[5,data.data[0].minConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[0],data.data[0].maxConsumerSegmentsImportance[1].segmentInfo[3].periodInfo[4].value[0]]]
                    }];
                    scope.segmentYTitle=Label.getContent('Segment Size')+'(%)';
                    scope.segmentXTitle=Label.getContent('Period');
                    scope.title1=Label.getContent('Elecssories')+'-'+Label.getContent('Rural');
                    scope.title2=Label.getContent('Elecssories')+'-'+Label.getContent('Urban');
                    scope.title3=Label.getContent('HealthBeauties')+'-'+Label.getContent('Rural');
                    scope.title4=Label.getContent('HealthBeauties')+'-'+Label.getContent('Urban');
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