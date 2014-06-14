define(['directives', 'services'], function(directives){
    directives.directive('supplierNegotiations', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerInfo', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/SCR_supplierNegotiations.html',            
            link : function(scope, element, attrs){                   
                                             
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/SCR-negotiations/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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

                var loadValue=function(data,varName,brandName,retailer){
                    var results=_.find(data,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName&&obj.modernRetailerID==retailer);
                    })
                    if(results.value!=false){
                        return results.value.toFixed(2);
                    }else{
                        return results.value;
                    }
                }

                var loadNegotiations=function(data,category,retailer,i){
                    var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;
                    brandName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentBrandName;
                    varName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].variantName;
                    discount_MinimumVolume=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].value.toFixed(2);
                    discount_Rate=loadValue(data.data[0].vnd_QuantityDiscount.discount_Rate,varName,brandName,retailer);
                    bonus_TargetVolume=loadValue(data.data[0].vnd_TargetBonus.bonus_TargetVolume,varName,brandName,retailer);
                    bonus_Rate=loadValue(data.data[0].vnd_TargetBonus.bonus_Rate,varName,brandName,retailer);
                    bonus_Value=loadValue(data.data[0].vnd_TargetBonus.bonus_Value,varName,brandName,retailer);
                    vnd_PaymentTerm=loadValue(data.data[0].vnd_PaymentTerms,varName,brandName,retailer);
                    vnd_OtherCompensation=loadValue(data.data[0].vnd_OtherCompensation,varName,brandName,retailer);
                    vnd_ContractHonoured=loadValue(data.data[0].vnd_ContractHonoured,varName,brandName,retailer);
                    if(vnd_ContractHonoured==1){
                        vnd_ContractHonoured="yes";
                    }else{
                        vnd_ContractHonoured="no";
                    }
                    if(category==1){
                        if(retailer==1){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product1es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else{
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product2es.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }
                    }else{
                        if(retailer==1){
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product1hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }else{
                            if(discount_MinimumVolume!=undefined&&discount_Rate!=undefined&&bonus_TargetVolume!=undefined&&bonus_Rate!=undefined&&bonus_Value!=undefined&&vnd_PaymentTerm!=undefined&vnd_OtherCompensation!=undefined&&vnd_ContractHonoured!=undefined)
                            {
                                scope.product2hs.push({'fullName':brandName+varName,'discount_MinimumVolume':discount_MinimumVolume,'discount_Rate':discount_Rate,'bonus_TargetVolume':bonus_TargetVolume,'bonus_Rate':bonus_Rate,'bonus_Value':bonus_Value,'vnd_PaymentTerm':vnd_PaymentTerm,'vnd_OtherCompensation':vnd_OtherCompensation,'vnd_ContractHonoured':vnd_ContractHonoured});
                            }
                        }
                    }
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    scope.product1es=new Array();
                    scope.product1hs=new Array();
                    scope.product2es=new Array();
                    scope.product2hs=new Array();
                    var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;

                    for(var i=0;i<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume.length;i++){
                        if(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentCategoryID==1){
                            switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerID){
                                case 1:loadNegotiations(data,1,1,i);break;
                                case 2:loadNegotiations(data,1,2,i);break;
                            }
                        }else{
                            switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerID){
                                case 1:loadNegotiations(data,2,1,i);break;
                                case 2:loadNegotiations(data,2,2,i);break;
                            }
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