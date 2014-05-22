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

                scope.checkContractDetails=function(contractCode,brandName,varName,location,index,value,categroy,retailerID){
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
                        if(categroy==1){
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

                scope.checkDiscountRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,categroy){
                    var d=$q.defer();
                    var discountRate=0;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_VolumeDiscountRate';
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
                        negotiationABmax=data.data.budgetAvailable;
                        if(volume*bmPrices*(1-value/100)>negotiationABmax){
                            discountRate=100-negotiationABmax/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+discountRate);
                        }else if(value>100){
                            d.resolve(Label.getContent('Input range')+':0~100');
                        }else{
                            d.resolve();
                        }
                    },function(){
                        d.resolve(Label.getContent('Check Error'));
                    })
                    return d.promise;
                }

                scope.checkBonusRate=function(contractCode,producerID,retailerID,brandName,varName,index,value,volume,bmPrices,categroy){
                    var d=$q.defer();
                    var bonusRate=0;
                    var filter=/^[0-9]*[1-9][0-9]*$/;
                    if(!filter.test(value)){
                        d.resolve(Label.getContent('Input a Integer'));
                    }
                    var url='/checkContractDetails/'+contractCode+'/'+brandName+'/'+varName+'/nc_PerformanceBonusRate';
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
                        negotiationABmax=data.data.budgetAvailable;
                        if(volume*bmPrices*value>negotiationABmax){
                            bonusRate=negotiationABmax/(volume*bmPrices);
                            d.resolve(Label.getContent('Input range')+':0~'+bonusRate);
                        }else if(value>100){
                            d.resolve(Label.getContent('Input range')+':0~100');
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

                scope.updateContractDetails=function(contractCode,brandName,varName,location,index,value,categroy,retailerID){
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
                        if(categroy==1){
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