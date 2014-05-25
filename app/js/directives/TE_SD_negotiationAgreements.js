define(['directives', 'services'], function(directives){

    directives.directive('supplierNegotiationAgreements', ['ProducerDecisionBase','ProducerDecision','Label','SeminarInfo','$http','$location','$filter','PeriodInfo','$q','PlayerInfo', function(ProducerDecisionBase,ProducerDecision,Label, SeminarInfo, $http,$location,$filter, PeriodInfo, $q,PlayerInfo){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                isNegotiationChange: '=',
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
                    startListenChangeFromServer();
                    scope.producerID=PlayerInfo.getPlayer();
                    getResult();
                }

                var startListenChangeFromServer=function(){
                    var socket = io.connect();
                    socket.on('retailerEditNegotiation', function(data){
                        scope.isNegotiationChange=true;
                        getResult();
                    });             
                }

                var loadProduct=function(data,category,retailerID){
                    var products=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].parentBrandName.substring(0,1)==category){
                            products.push(data[i]);
                        }
                    }
                    if(retailerID==1){
                        if(category=="E"){
                            scope.product1es=products;
                        }else{
                            scope.product1hs=products;
                        }
                    }else{
                        if(category=="E"){
                            scope.product2es=products;
                        }else{
                            scope.product2hs=products;
                        }
                    }
                }

                scope.checkContractDetails=function(contractCode,brandName,varName,location,index,value,category,retailerID){
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
                            switch(retailerID){
                                case 1:
                                scope.product1es[index]=data.data.doc;
                                break;
                                case 2:
                                scope.product2es[index]=data.data.doc;
                                break;
                            }
                        }else{
                            switch(retailerID){
                                case 1:
                                scope.product1hs[index]=data.data.doc;
                                break;
                                case 2:
                                scope.product2hs[index]=data.data.doc;
                                break;
                            }
                        }
                    })
                    return d.promise;
                }

                scope.checkMinimumOrder=function(contractCode,brandName,varName,category,value,retailerID){
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
                        url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+PlayerInfo.getPlayer();
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
                        url='/getSalesVolume/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+retailerID+'/'+category;
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
                }

                scope.checkDiscountRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,category){
                    var d=$q.defer();
                    var discountRate=expend=0;
                    var filter=/^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
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
                            discountRate=100-(negotiationABmax-expend)*100/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+discountRate);
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
                    return d.promise;
                }

                scope.checkTargetVolume =function(contractCode,brandName,varName,category,value,retailerID){
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
                        url='/getOneQuarterExogenousData/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+category+'/1';
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        maxTargetVolumeVsTotalMarket=data.data.MaxTargetVolumeVsTotalMarket;
                        url='/getMarketSize/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+retailerID+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        })
                    }).then(function(data){
                        marketSize=data.data;
                        url='/getSalesVolume/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+retailerID+'/'+category;
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
                }

                scope.checkBonusRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,category){
                    var d=$q.defer();
                    var discountRate=expend=0;
                    var filter=/^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input Number'));
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
                        }else if(volume*bmPrices*value/100>negotiationABmax-expend){
                            bonusRate=(negotiationABmax-expend)*100/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+bonusRate);
                        }else{
                            d.resolve();
                        }

                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
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

                scope.checkOtherCompensation=function(contractCode,brandName,varName,category,value,retailerID){
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
                        url='/getScrplSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+PlayerInfo.getPlayer()+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        supplierOtherCompensation=data.data[0].toFixed(2);
                        url='/getRcrplSales/'+SeminarInfo.getSelectedSeminar()+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+retailerID+'/'+category;
                        return $http({
                            method:'GET',
                            url:url
                        });
                    }).then(function(data){
                        retailerOtherCompensation=data.data[0].toFixed(2);
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

                scope.updateContractDetails=function(contractCode,brandName,varName,location,index,value,category,retailerID){
                    var postData={
                        contractCode:contractCode,
                        brandName:brandName,
                        varName:varName,
                        userType:'P',
                        location:location,
                        value:value
                    };
                    $http({
                        method:'POST',
                        url:'/updateContractDetails',
                        data:postData
                    }).then(function(data){
                        if(category==1){
                            switch(retailerID){
                                case 1:
                                scope.product1es[index]=data.data;
                                break;
                                case 2:
                                scope.product2es[index]=data.data;
                                break;
                            }
                        }else{
                            switch(retailerID){
                                case 1:
                                scope.product1hs[index]=data.data;
                                break;
                                case 2:
                                scope.product2hs[index]=data.data;
                                break;
                            }
                        }
                    });
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
                            scope.isNegotiationChange = false;
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