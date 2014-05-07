define(['directives', 'services'], function(directives){

    directives.directive('supplierNegotiationAgreements', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isReady : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SD_negotiationAgreements.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();
                }

                var getResult =function(){
                    if(!scope.isReady){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;
                    }else{
                        var url='/SCR-consolidatedProfitAndLoss/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                });
            }
        }
    }])
})