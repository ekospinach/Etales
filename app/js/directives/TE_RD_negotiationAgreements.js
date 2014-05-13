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

                var loadProduct=function(data,categroy,producerID){
                    var products=new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].parentBrandName.substring(0,1)==categroy){
                            products.push(data[i]);
                        }
                    }
                    if(producerID==1){
                        if(categroy=="E"){
                            scope.product1es=products;
                        }else{
                            scope.product1hs=products;
                        }
                    }else if(producerID==2){
                        if(categroy=="E"){
                            scope.product2es=products;
                        }else{
                            scope.product2hs=products;
                        }
                    }else{
                        if(categroy=="E"){
                            scope.product3es=products;
                        }else{
                            scope.product3hs=products;
                        }
                    }
                }

                scope.checkContractDetails=function(contractCode,brandName,varName,location,index,value,categroy,producerID){
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

                scope.updateContractDetails=function(contractCode,brandName,varName,location,index,value,categroy,producerID){
                    var postData={
                        contractCode:contractCode,
                        brandName:brandName,
                        varName:varName,
                        userType:'R',
                        location:location,
                        value:value
                    };
                    $http({
                        method:'POST',
                        url:'/updateContractDetails',
                        data:postData
                    }).then(function(data){
                        if(categroy==1){
                            switch(producerID){
                                case 1:
                                scope.product1es[index]=data.data;
                                break;
                                case 2:
                                scope.product2es[index]=data.data;
                                break;
                                case 3:
                                scope.product3es[index]=data.data;
                                break;
                            }
                        }else{
                            switch(producerID){
                                case 1:
                                scope.product1hs[index]=data.data;
                                break;
                                case 2:
                                scope.product2hs[index]=data.data;
                                break;
                                case 3:
                                scope.product3hs[index]=data.data;
                                break;
                            }
                        }
                    })
                }

                var getResult =function(){
                	console.log('hello');
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
