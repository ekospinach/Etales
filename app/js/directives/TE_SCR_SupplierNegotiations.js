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
                    var url='/SCR-negotiations/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+parseInt(PlayerInfo.getPlayer());
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

                var loadNegotiations=function(data,category,retailer,i,j){
                    var varName,brandName,discount_MinimumVolume,discount_Rate,bonus_TargetVolume,bonus_Rate,bonus_Value,vnd_PaymentTerm,vnd_OtherCompensation,vnd_ContractHonoured;
                    brandName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].parentBrandName;
                    varName=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].variantName;
                    discount_MinimumVolume=data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].value;
                    var discount_Rates=_.find(data.data[0].vnd_QuantityDiscount.discount_Rate,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<discount_Rates.modernRetailerInfo.length;k++){
                        if(discount_Rates.modernRetailerInfo[k].modernRetailerID==retailer){
                            discount_Rate=discount_Rates.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var bonus_TargetVolumes=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<bonus_TargetVolumes.modernRetailerInfo.length;k++){
                        if(bonus_TargetVolumes.modernRetailerInfo[k].modernRetailerID==retailer){
                            bonus_TargetVolume=bonus_TargetVolumes.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var bonus_Rates=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<bonus_Rates.modernRetailerInfo.length;k++){
                        if(bonus_Rates.modernRetailerInfo[k].modernRetailerID==retailer){
                            bonus_Rate=bonus_Rates.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var bonus_Values=_.find(data.data[0].vnd_TargetBonus.bonus_TargetVolume,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<bonus_Values.modernRetailerInfo.length;k++){
                        if(bonus_Values.modernRetailerInfo[k].modernRetailerID==retailer){
                            bonus_Value=bonus_Values.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var vnd_PaymentTerms=_.find(data.data[0].vnd_PaymentTerms,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<vnd_PaymentTerms.modernRetailerInfo.length;k++){
                        if(vnd_PaymentTerms.modernRetailerInfo[k].modernRetailerID==retailer){
                            vnd_PaymentTerm=vnd_PaymentTerms.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var vnd_OtherCompensations=_.find(data.data[0].vnd_OtherCompensation,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<vnd_OtherCompensations.modernRetailerInfo.length;k++){
                        if(vnd_OtherCompensations.modernRetailerInfo[k].modernRetailerID==retailer){
                            vnd_OtherCompensation=vnd_OtherCompensations.modernRetailerInfo[k].value;
                            break;
                        }
                    }
                    var vnd_ContractHonoureds=_.find(data.data[0].vnd_ContractHonoured,function(obj){
                        return(obj.variantName==varName&&obj.parentBrandName==brandName);
                    });
                    for(var k=0;k<vnd_ContractHonoureds.modernRetailerInfo.length;k++){
                        if(vnd_ContractHonoureds.modernRetailerInfo[k].modernRetailerID==retailer){
                            vnd_ContractHonoured=vnd_ContractHonoureds.modernRetailerInfo[k].value;
                            break;
                        }
                    }
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
                            for(var j=0;j<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo.length;j++){
                                switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].modernRetailerID){
                                    case 1:loadNegotiations(data,1,1,i,j);break;
                                    case 2:loadNegotiations(data,1,2,i,j);break;
                                }
                            }
                        }else{
                            for(var j=0;j<data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo.length;j++){
                                switch(data.data[0].vnd_QuantityDiscount.discount_MinimumVolume[i].modernRetailerInfo[j].modernRetailerID){
                                    case 1:loadNegotiations(data,2,1,i,j);break;
                                    case 2:loadNegotiations(data,2,2,i,j);break;
                                }
                            }
                        }
                    }
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }

                scope.$watch('isPageShown', function(newValue, oldValue){
                    console.log('watch in the TE_GR_performance fire, new value: ' + newValue + ', oldValue: '+ oldValue);
                    if(newValue==true) {
                        initializePage();
                    }
                })

            }
        }
    }])
})