define(['directives', 'services'], function(directives){

    directives.directive('marketForecastsCategory', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_forecastsCategory.html',            
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
                    //data:[1,min,max],[2,min.max]...
                    scope.forecastCategorySeries=[{
						'name':Label.getContent('Elecssories')+'/'+Label.getContent('Rural'),'color':'#329444',
						'data':[[1,data.data[0].minTotalVolume[0].periodInfo[0].value[1],data.data[0].maxTotalVolume[0].periodInfo[0].value[1]],[2,data.data[0].minTotalVolume[0].periodInfo[1].value[1],data.data[0].maxTotalVolume[0].periodInfo[1].value[1]],[3,data.data[0].minTotalVolume[0].periodInfo[2].value[1],data.data[0].maxTotalVolume[0].periodInfo[2].value[1]],[4,data.data[0].minTotalVolume[0].periodInfo[3].value[1],data.data[0].maxTotalVolume[0].periodInfo[3].value[1]],[5,data.data[0].minTotalVolume[0].periodInfo[4].value[1],data.data[0].maxTotalVolume[0].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('Elecssories')+'/'+Label.getContent('Urban'),'color':'#F6B920',
						'data':[[1,data.data[0].minTotalVolume[0].periodInfo[0].value[0],data.data[0].maxTotalVolume[0].periodInfo[0].value[0]],[2,data.data[0].minTotalVolume[0].periodInfo[1].value[0],data.data[0].maxTotalVolume[0].periodInfo[1].value[0]],[3,data.data[0].minTotalVolume[0].periodInfo[2].value[0],data.data[0].maxTotalVolume[0].periodInfo[2].value[0]],[4,data.data[0].minTotalVolume[0].periodInfo[3].value[0],data.data[0].maxTotalVolume[0].periodInfo[3].value[0]],[5,data.data[0].minTotalVolume[0].periodInfo[4].value[0],data.data[0].maxTotalVolume[0].periodInfo[4].value[0]]]	
					},{
						'name':Label.getContent('HealthBeauties')+'/'+Label.getContent('Rural'),'color':'#B11E22',
						'data':[[1,data.data[0].minTotalVolume[1].periodInfo[0].value[1],data.data[0].maxTotalVolume[1].periodInfo[0].value[1]],[2,data.data[0].minTotalVolume[1].periodInfo[1].value[1],data.data[0].maxTotalVolume[1].periodInfo[1].value[1]],[3,data.data[0].minTotalVolume[1].periodInfo[2].value[1],data.data[0].maxTotalVolume[1].periodInfo[2].value[1]],[4,data.data[0].minTotalVolume[1].periodInfo[3].value[1],data.data[0].maxTotalVolume[1].periodInfo[3].value[1]],[5,data.data[0].minTotalVolume[1].periodInfo[4].value[1],data.data[0].maxTotalVolume[1].periodInfo[4].value[1]]]
					},{
						'name':Label.getContent('HealthBeauties')+'/'+Label.getContent('Urban'),'color':'#3257A7',
						'data':[[1,data.data[0].minTotalVolume[1].periodInfo[0].value[0],data.data[0].maxTotalVolume[1].periodInfo[0].value[0]],[2,data.data[0].minTotalVolume[1].periodInfo[1].value[0],data.data[0].maxTotalVolume[1].periodInfo[1].value[0]],[3,data.data[0].minTotalVolume[1].periodInfo[2].value[0],data.data[0].maxTotalVolume[1].periodInfo[2].value[0]],[4,data.data[0].minTotalVolume[1].periodInfo[3].value[0],data.data[0].maxTotalVolume[1].periodInfo[3].value[0]],[5,data.data[0].minTotalVolume[1].periodInfo[4].value[0],data.data[0].maxTotalVolume[1].periodInfo[4].value[0]]]
					}];
					scope.segmentYTitle=Label.getContent('Sales Volume')+'(units mln)';
					scope.segmentXTitle=Label.getContent('Period');
                    var curP = PeriodInfo.getCurrentPeriod();
                    scope.categories = ['', curP-3, curP-2, curP-1, curP, curP+1];                    
					scope.myModel='ForecastsCategory';
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