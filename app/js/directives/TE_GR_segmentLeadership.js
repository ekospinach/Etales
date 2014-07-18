define(['directives', 'services'], function(directives){

    directives.directive('generalSegmentLeadership', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/GR_segmentLeadership.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    //switching('showPerformance');
                    var url='/segmentLeadership/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
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
                    
                    scope.priceSensitives=new Array();scope.valueForMoneies=new Array();scope.fashions=new Array();scope.freakses=new Array();
                    scope.bms=new Array();scope.onlines=new Array();scope.mixeds=new Array();            
                    //data.data[0].categoryInfo[2].marketInfo[2].segmentInfo[0].shopperInfo[3].grsl_ValueLeaders
                    scope.priceSensitives.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[0].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[0].shopperInfo[3]);
                    scope.valueForMoneies.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[1].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[1].shopperInfo[3]);
                    scope.fashions.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[2].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[2].shopperInfo[3]);
                    scope.freakses.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[3].shopperInfo[3],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[3].shopperInfo[3]);                    
                    scope.bms.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[0],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[0]);
                    scope.onlines.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[1],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[1]);
                    scope.mixeds.push(data.data[0].categoryInfo[0].marketInfo[2].segmentInfo[4].shopperInfo[2],data.data[0].categoryInfo[1].marketInfo[2].segmentInfo[4].shopperInfo[2]);  

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