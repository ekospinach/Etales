define(['directives', 'services'], function(directives){

    directives.directive('retailerNegotiations', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RCR_retailerNegotiations.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var loadValue=function(data,varName,brandName,producer){
                    var results=_.find(data,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.producerID==producer);
                    })
                    return results.value;
                }

                var loadRetailerNegotiations=function(data,category,producer,i){
                    var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;
                    brandName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentBrandName;
                    varName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].variantName;
                    discount_MinimumVolume=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].value;
                    discount_Rate=loadValue(data.data[0].vnd_QuantityDiscount.discount_Rate,varName,brandName,producer);
                    bonus_TargetVolume=loadValue(data.data[0].vnd_TargetBonus.bonus_TargetVolume,varName,brandName,producer);
                    bonus_Rate=loadValue(data.data[0].vnd_TargetBonus.bonus_Rate,varName,brandName,producer);
                    bonus_Value=loadValue(data.data[0].vnd_TargetBonus.bonus_Value,varName,brandName,producer);
                    vnd_PaymentTerm=loadValue(data.data[0].vnd_PaymentTerms,varName,brandName,producer);
                    vnd_OtherCompensation=loadValue(data.data[0].vnd_OtherCompensation,varName,brandName,producer);
                    vnd_ContractHonoured=loadValue(data.data[0].vnd_ContractHonoured,varName,brandName,producer);
                    if(vnd_ContractHonoured==1){
                        vnd_ContractHonoured="yes";
                    }else{
                        vnd_ContractHonoured="no";
                    }
                    if(category==1){
                        if(producer==1){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product1es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else if(producer==2){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product2es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else{
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product3es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }
                    }else{
                        if(producer==1){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product1hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else if(producer==2){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product2hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else{
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product3hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }
                    }
                }

                var getResult =function(){
                    var url='/RCR-negotiations/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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
                    scope.product1es=new Array();
                    scope.product1hs=new Array();
                    scope.product2es=new Array();
                    scope.product2hs=new Array();
                    scope.product3es=new Array();
                    scope.product3hs=new Array();
                    var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;

                    for(var i=0;i<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume.length;i++){
                        if(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentCategoryID==1){
                            switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].producerID){
                                case 1:loadRetailerNegotiations(data,1,1,i);break;
                                case 2:loadRetailerNegotiations(data,1,2,i);break;
                                case 3:loadRetailerNegotiations(data,1,3,i);break;
                            }
                        }else{
                            switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].producerID){
                                case 1:loadRetailerNegotiations(data,2,1,i);break;
                                case 2:loadRetailerNegotiations(data,2,2,i);break;
                                case 3:loadRetailerNegotiations(data,2,3,i);break;
                            }
                            // for(var j=0;j<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].producerInfo.length;j++){
                            //     switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].producerInfo[j].producerID){
                            //         case 1:loadRetailerNegotiations(data,2,1,i,j);break;
                            //         case 2:loadRetailerNegotiations(data,2,2,i,j);break;
                            //         case 3:loadRetailerNegotiations(data,2,3,i,j);break;
                            //     }
                            // }
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