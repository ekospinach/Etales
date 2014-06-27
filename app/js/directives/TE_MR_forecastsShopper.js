define(['directives', 'services'], function(directives){

    directives.directive('marketForecastsShopper', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_forecastsShopper.html',            
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
                    scope.forecastsShopperSeries1=[{
                        //data:[1,min,max],[2,min.max]...
                        //B&M Only shopperInfo[0]
                        //Online Only shopperInfo[1]
                        //Mixed shopperInfo[2]

                        //urban value[0]
                        //rural value[1]

                        //E ShopperSegmentsImportance[0]
                        //H ShopperSegmentsImportance[1]
                        'name':Label.getContent('B&M Only'),'color':'#3257A7',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Online Only'),'color':'#B11E22',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Mixed'),'color':'#F6B920',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[1]]]
                    }];
                    scope.forecastsShopperSeries2=[{
                        'name':Label.getContent('B&M Only'),'color':'#3257A7',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[0].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Online Only'),'color':'#B11E22',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[1].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Mixed'),'color':'#F6B920',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[0].shopperInfo[2].periodInfo[4].value[0]]]
                    }];
                    scope.forecastsShopperSeries3=[{
                        'name':Label.getContent('B&M Only'),'color':'#3257A7',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Online Only'),'color':'#B11E22',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[1]]]
                    },{
                        'name':Label.getContent('Mixed'),'color':'#F6B920',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[1]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[1]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[1]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[1]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[1],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[1]]]
                    }];
                    scope.forecastsShopperSeries4=[{
                        'name':Label.getContent('B&M Only'),'color':'#3257A7',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[0].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Online Only'),'color':'#B11E22',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[1].periodInfo[4].value[0]]]
                    },{
                        'name':Label.getContent('Mixed'),'color':'#F6B920',
                        'data':[[1,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[0].value[0]],[2,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[1].value[0]],[3,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[2].value[0]],[4,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[3].value[0]],[5,data.data[0].minShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[0],data.data[0].maxShopperSegmentsImportance[1].shopperInfo[2].periodInfo[4].value[0]]]
                    }];
                    scope.segmentYTitle=Label.getContent('Segment Size')+'(%)';
                    scope.segmentXTitle=Label.getContent('Period');
                    var curP = PeriodInfo.getCurrentPeriod();
                    scope.categories = ['', curP-3, curP-2, curP-1, curP, curP+1];
                                        
                    scope.title1=Label.getContent('Elecssories')+'-'+Label.getContent('Rural');
                    scope.title2=Label.getContent('Elecssories')+'-'+Label.getContent('Urban');
                    scope.title3=Label.getContent('HealthBeauties')+'-'+Label.getContent('Rural');
                    scope.title4=Label.getContent('HealthBeauties')+'-'+Label.getContent('Urban');
                    scope.myModel='Shopper Segment Size';
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