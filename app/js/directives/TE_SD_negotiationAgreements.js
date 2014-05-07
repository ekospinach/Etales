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

                var loadProduct=function(data,categroy,retailerID){
                    var products=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].parentBrandName.substring(0,1)==categroy){
                            products.push(data[i]);
                        }
                    }
                    if(retailerID==1){
                        if(categroy=="E"){
                            scope.product1es=products;
                        }else{
                            scope.product1hs=products;
                        }
                    }else{
                        if(categroy=="E"){
                            scope.product2es=products;
                        }else{
                            scope.product2hs=products;
                        }
                    }
                }

                var getResult =function(){
                    if(!scope.isReady){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;
                    }else{
                        var url='/getContractDetails/'+'P'+PlayerInfo.getPlayer()+'andR1_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        $http({
                            method:'GET',
                            url:url,
                        }).then(function(data){   
                            return organiseArray(data.data,1);
                        }).then(function(){
                            url='/getContractDetails/'+'P'+PlayerInfo.getPlayer()+'andR2_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                            return $http({
                                method:'GET',
                                url:url
                            });                                                                      
                        }).then(function(data){
                            return organiseArray(data.data,2);
                        }).then(function(data){
                            scope.isResultShown = true;
                            scope.isPageLoading = false; 
                        },function(){
                            console.log('fail');
                        })
                    }
                }

                var organiseArray = function(data,retailerID){
                    var deferred = $q.defer();
                    loadProduct(data,'E',retailerID);
                    loadProduct(data,'H',retailerID);
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