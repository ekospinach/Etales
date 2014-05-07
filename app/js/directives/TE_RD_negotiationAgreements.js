define(['directives', 'services'], function(directives){

    directives.directive('retailerNegotiationAgreements', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_negotiationAgreements.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();               
                }

                var getResult =function(){
                	console.log('hello');
                	var contractCode='P1andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                	var url='/checkContract/'+contractCode;
                	$http({
                		method:'GET',
                		url:url
                	}).then(function(data){
                		if(data.data!='isReady'){
                			scope.isP1Ready=false;
                		}else{
                			scope.isP1Ready=true;
                		}
                		contractCode='P2andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                		url='/checkContract/'+contractCode;
                		return $http({
	                		method:'GET',
	                		url:url
	                	});
                	}).then(function(data){
                		if(data.data!='isReady'){
                			scope.isP2Ready=false;
                		}else{
                			scope.isP2Ready=true;
                		}
                		contractCode='P3andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                		url='/checkContract/'+contractCode;
                		return $http({
	                		method:'GET',
	                		url:url
	                	});
                	}).then(function(data){
                		if(data.data!='isReady'){
                			scope.isP3Ready=false;
                		}else{
                			scope.isP3Ready=true;
                		}
                		scope.isResultShown = true;
                        scope.isPageLoading = false; 
                	},function(){
                		console.log('fail')
                	})
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
