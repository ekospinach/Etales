define(['directives', 'services'], function(directives){

    directives.directive('retailerNegotiationAgreements', ['RetailerDecisionBase','RetailerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(RetailerDecisionBase,RetailerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isNegotiationChange : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/RD_negotiationAgreements.html',            
            link : function(scope, element, attrs){                   

                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    scope.retailerID=PlayerInfo.getPlayer();
                    startListenChangeFromServer();
                    getResult();               
                }

                var startListenChangeFromServer=function(){
                    var socket = io.connect();
                    socket.on('supplierEditNegotiation', function(data){
                        scope.isNegotiationChange=true;
                        getResult();
                    });             
                }

                var loadProduct=function(data,category,producerID){
                    var products=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].parentBrandName.substring(0,1)==category){
                            products.push(data[i]);
                        }
                    }
                    if(producerID==1){
                        if(category=="E"){
                            scope.product1es=products;
                        }else{
                            scope.product1hs=products;
                        }
                    }else if(producerID==2){
                        if(category=="E"){
                            scope.product2es=products;
                        }else{
                            scope.product2hs=products;
                        }
                    }else{
                        if(category=="E"){
                            scope.product3es=products;
                        }else{
                            scope.product3hs=products;
                        }
                    }
                }

                scope.checkContractDetails=function(contractCode,brandName,varName,location,index,value,category,producerID){
                    var d=$q.defer();
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/'+location;
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }else{
                            d.resolve();
                        }
                        if(category==1){
                            switch(producerID){
                                case 1:
                                scope.product1es[index]=data.data.doc;
                                break;
                                case 2:
                                scope.product2es[index]=data.data.doc;
                                break;
                                case 3:
                                scope.product3es[index]=data.data.doc;
                                break;
                            }
                        }else{
                            switch(producerID){
                                case 1:
                                scope.product1hs[index]=data.data.doc;
                                break;
                                case 2:
                                scope.product2hs[index]=data.data.doc;
                                break;
                                case 3:
                                scope.product3hs[index]=data.data.doc;
                                break;
                            }
                        }
                    })
                    return d.promise;
                }

                scope.checkMinimumOrder=function(contractCode,brandName,varName,category,value,producerID){
                    var d=$q.defer();
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_MinimumOrder';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }
                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+producerID;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        negotiationACmax=data.data.productionCapacity[category-1];
                        url='/getNegotiationExpend/'+contractCode+'/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        expend=data.data.result;
                        url='/getSalesVolume/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+PlayerInfo.getPlayer()+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        if(negotiationACmax-expend>data.data){
                            if(value>data.data){
                                d.resolve(Label.getContent('Input range')+':0~'+data.data);
                            }else{
                                d.resolve();
                            }
                        }else{
                            if(value>negotiationACmax-expend){
                                d.resolve(Label.getContent('Input range')+':0~'+negotiationACmax-expend);
                            }else{
                                d.resolve();
                            }
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    });
                    return d.promise;
                }

                scope.checkDiscountRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,category){
                    var d=$q.defer();
                    var discountRate=expend=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input Number'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_VolumeDiscountRate';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }
                        url='/checkVolume/'+contractCode+'/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(data.data=="unReady"){
                            d.resolve(Label.getContent('set Minimum Order first'))
                        }
                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+producerID;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        negotiationABmax=data.data.budgetAvailable;
                        url='/getNegotiationExpend/'+contractCode+'/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        expend=data.data.result;
                        if(value>100){                       
                            d.resolve(Label.getContent('Input range')+':0~100');             
                        }else if(volume*bmPrices*(1-value/100)>negotiationABmax-expend){
                            discountRate=1-(negotiationABmax-expend)*100/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+discountRate);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
                    return d.promise;
                }

                scope.checkTargetVolume =function(contractCode,brandName,varName,category,value,producerID){
                    var d=$q.defer();
                    var maxTargetVolumeVsTotalMarket,marketSize,salesVolume;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_SalesTargetVolume';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }
                        url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+category+'/1';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        maxTargetVolumeVsTotalMarket=data.data.MaxTargetVolumeVsTotalMarket;
                        url='/getMarketSize/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+PlayerInfo.getPlayer()+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        marketSize=data.data;
                        url='/getSalesVolume/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+PlayerInfo.getPlayer()+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        salesVolume=data.data;
                        if(marketSize*maxTargetVolumeVsTotalMarket>salesVolume){
                            if(value>salesVolume){
                                d.resolve(Label.getContent('Input range')+':0~'+salesVolume);
                            }else{
                                d.resolve();
                            }
                        }else{
                            if(value>marketSize*maxTargetVolumeVsTotalMarket){
                                d.resolve(Label.getContent('Input range')+':0~'+marketSize*maxTargetVolumeVsTotalMarket);
                            }else{
                                d.resolve();
                            }
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    });
                    return d.promise;
                }

                scope.checkBonusRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,category){
                    var d=$q.defer();
                    var discountRate=expend=max=productExpend=r1ContractExpend=r2ContractExpend=0;
                    var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input  Number'));
                    }

                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_PerformanceBonusRate';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }
                        url='/checkSalesTargetVolume/'+contractCode+'/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        if(data.data=="unReady"){
                            d.resolve(Label.getContent('set Target Volume first'))
                        }

                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+producerID;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        max=data.data.budgetAvailable + data.data.budgetSpentToDate;
                        url = "/producerExpend/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + producerID + '/brandName/location/1';
                        return $http({
                            method: 'GET',
                            url: url,
                        });
                    }).then(function(data){
                        productExpend=data.data.result;
                        url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+producerID+'/1/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        r1ContractExpend=data.data.result;
                        url='/getContractExpend/'+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod()+'/'+producerID+'/2/'+brandName+'/'+varName;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        r2ContractExpend=data.data.result;
                        if(value>100){                       
                            d.resolve(Label.getContent('Input range')+':0~100');             
                        }else if(volume*bmPrices*value/100>max-productExpend-r1ContractExpend-r2ContractExpend){
                            bonusRate=(max-productExpend-r1ContractExpend-r2ContractExpend)*100/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+bonusRate);
                        }else{
                            d.resolve();
                        }

                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    });
                    return d.promise;
                }

                scope.checkPaymentTerms=function(contractCode,producerID,retailerID,brandName,varName,index,value){
                    var d=$q.defer();
                    var filter=/^\d+$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    if(value>183||value<0){
                        d.resolve(Label.getContent('Input range')+':0~183');
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_PaymentDays';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
                    return d.promise;
                }

                scope.checkOtherCompensation=function(contractCode,brandName,varName,category,value,producerID){
                    var d=$q.defer();
                    var supplierOtherCompensation=retailerOtherCompensation=0;
                    var filter=/^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input Number'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_OtherCompensation';
                    $http({
                        method:'GET',
                        url:url
                    }).then(function(data){
                        if(data.data.result=="no"){
                            d.resolve(Label.getContent('This product is locked'));
                        }
                        url='/getScrplSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+producerID+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        supplierOtherCompensation=data.data[0].toFixed(2);
                        url='/getRcrplSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+PlayerInfo.getPlayer()+'/'+category+'/1';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        retailerOtherCompensation=data.data.result.toFixed(2);
                        if(retailerOtherCompensation>=supplierOtherCompensation){
                            if(value>supplierOtherCompensation||value<(0-supplierOtherCompensation)){
                                d.resolve(Label.getContent('Input range')+':'+(0-supplierOtherCompensation)+'~'+supplierOtherCompensation);
                            }else{
                                d.resolve();
                            }
                        }else{
                            if(value>retailerOtherCompensation||value<(0-retailerOtherCompensation)){
                                d.resolve(Label.getContent('Input range')+':'+(0-retailerOtherCompensation)+'~'+retailerOtherCompensation);
                            }else{
                                d.resolve();
                            }
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
                    return d.promise;
                }



                var getResult =function(){
                    scope.product1es=new Array();scope.product1hs=new Array();scope.product2es=new Array();scope.product2hs=new Array();scope.product3es=new Array();scope.product3hs=new Array();

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
                        url='/getContractDetails/P1andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        return $http({
                            method:'GET',
                            url:url
                        });
                	}).then(function(data){
                        return organiseArray(data.data,1); 
                    }).then(function(data){
                        url='/getContractDetails/P2andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        return organiseArray(data.data,2);
                    }).then(function(data){
                        url='/getContractDetails/P3andR'+PlayerInfo.getPlayer()+'_'+SeminarInfo.getSelectedSeminar()+'_'+PeriodInfo.getCurrentPeriod();
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        return organiseArray(data.data,3);
                    }).then(function(){
                        scope.isNegotiationChange = false;
                        scope.isResultShown = true;
                        scope.isPageLoading = false; 
                    },function(){
                        console.log('fail');
                    })
                }


                var organiseArray = function(data,producerID){
                    var deferred = $q.defer();
                    if(data.length!=0){
                        loadProduct(data,'E',producerID);
                        loadProduct(data,'H',producerID);
                    }
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
