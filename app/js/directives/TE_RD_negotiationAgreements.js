define(['directives', 'services'], function(directives) {
    directives.directive('retailerNegotiationAgreements', ['RetailerDecisionBase', 'RetailerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo','notify',
        function(RetailerDecisionBase, RetailerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo, notify) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    isNegotiationChange: '=',
                    selectedPeriod : '=',
                    selectedPlayer : '=',
                    isContractDeal:'=',
                    isContractFinalized:'=',
                    isDecisionCommitted:'='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/RD_negotiationAgreements.html',
                link: function(scope, element, attrs) {
                    /* 

                        Input Validation 

                    */
                    scope.checkMinimumOrder = function(contractCode, brandName, varName, category, value, producerID) {
                        var d = $q.defer();
                        var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }

                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_MinimumOrder';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];

                            url = '/getAgreedProductionVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + producerID + '/' + brandName + '/' + varName;
                            
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {                            
                            agreedProductionVolume = data.data.result;                                                        
                            var availablePlannedProductionCapacity  = negotiationACmax - agreedProductionVolume;
                            
                            // Discount rate will be set into Zero, so it doesn't need validation here 
                            benchMark = availablePlannedProductionCapacity;

                            if(benchMark < 0){benchMark = 0;}
                            if(value < benchMark){
                                d.resolve();
                            } else {
                                d.resolve(Label.getContent('Input range') + ': 0 ~ ' + (Math.floor(benchMark * 100) / 100));
                            }

                        }, function(data) {
                            d.resolve(Label.getContent('Check Error'));
                        });                        

                        return d.promise;
                    }

                    scope.checkDiscountRate = function(contractCode, producerID, retailerID, brandName, varName, index, value, volume, bmPrices, category) {
                        var d = $q.defer();
                        var discountRate = expend = 0;
                        var filter = /^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }

                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_VolumeDiscountRate';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }

                            url = '/checkVolume/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            if (data.data == "unReady") {
                                d.resolve(Label.getContent('set Minimum Order first'))
                            }

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + producerID + '/' + brandName + '/' + varName + '/volumeDiscount/' + retailerID;
                            
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(producerID) + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            producerExpend = data.data.result;

                            url = "/getContractDetail/" + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            contractDetails = data.data;

                            var availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                            
                            if(value == 0){
                                d.resolve();
                            } else if (contractDetails.currentPriceBM == 0){
                                d.resolve(Label.getContent('BM list price is 0'))
                            } else {
                                benchMark = 1 - (availableBudgetLeft / (contractDetails.currentPriceBM * contractDetails.nc_MinimumOrder));
                            }

                            if((value < 100) && (value > (benchMark * 100))){
                                d.resolve();
                            } else if(benchMark > 1) {
                                d.resolve(Label.getContent('Supplier does not have enough budget.'));                                
                            } else {                                
                                d.resolve(Label.getContent('Input range') + ':' + (Math.floor(benchMark * 100 * 100) / 100) + '% ~ 100%');                                
                            }

                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        })

                        return d.promise;
                    }

                    scope.checkTargetVolume = function(contractCode, brandName, varName, category, value, producerID) {
                        var d = $q.defer();
                        var maxTargetVolumeVsTotalMarket, marketSize, salesVolume;
                        var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_SalesTargetVolume';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }
                            url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + category + '/1'+ '/' + scope.selectedPeriod;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            //maxTargetVolumesVsTotalMarket = 50%
                            maxTargetVolumeVsTotalMarket = data.data.MaxTargetVolumeVsTotalMarket;

                            url = '/getMarketSize/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/1/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            marketSize = data.data;
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/1/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            salesVolume = data.data;

                            //TODO: Need Finished Marksize service & Previous Category Sales Volume service, /getMarketSize and /getSalesVolume now is constant 2000
                            if (marketSize * maxTargetVolumeVsTotalMarket > salesVolume) {
                                if (value < salesVolume) {
                                    d.resolve();
                                } else {
                                    d.resolve(Label.getContent('Input range') + ':0~' + (Math.floor(salesVolume * 100) / 100));
                                }
                            } else {
                                if (value < (marketSize * maxTargetVolumeVsTotalMarket)) {
                                    d.resolve();
                                } else {
                                    d.resolve(Label.getContent('Input range') + ':0~' + (Math.floor(marketSize * maxTargetVolumeVsTotalMarket * 100) / 100));
                                }
                            }
                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        });

                        return d.promise;
                    }

                    scope.checkBonusRate = function(contractCode, producerID, retailerID, brandName, varName, index, value, volume, bmPrices, category) {
                        var d = $q.defer();
                        var discountRate = expend = max = productExpend = r1ContractExpend = r2ContractExpend = 0;
                        var filter = /^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }

                        if(value > 100){
                            d.resolve('Input range: 1% ~ 100%');
                        } else {
                            d.resolve();                            
                        }

                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_PerformanceBonusRate';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }
                            url = '/checkSalesTargetVolume/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            if (data.data == "unReady") {
                                d.resolve(Label.getContent('set Target Volume first'))
                            }


                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + producerID + '/' + brandName + '/' + varName + '/performanceBonus/' + retailerID;
                            
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(producerID) + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            producerExpend = data.data.result;

                            url = "/getContractDetail/" + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            contractDetails = data.data;

                            var availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                            
                            if(value == 0){
                                d.resolve();
                            } else if (contractDetails.currentPriceBM == 0){
                                d.resolve(Label.getContent('BM list price is 0'))
                            } else {
                                benchMark = availableBudgetLeft / (contractDetails.currentPriceBM * contractDetails.nc_SalesTargetVolume);
                            }

                            if((value < 100) && (value < (benchMark * 100))){
                                d.resolve();
                            } else if(benchMark < 0) {
                                d.resolve(Label.getContent('Supplier does not have enough budget.'));                                
                            } else {                                
                                d.resolve(Label.getContent('Input range') + ':0% ~ ' + (Math.floor(benchMark *100 * 100) / 100) + '%');                                
                            }

                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        });

                        return d.promise;
                    }

                    scope.checkPaymentTerms = function(contractCode, producerID, retailerID, brandName, varName, index, value) {
                        var d = $q.defer();
                        var filter = /^\d+$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }
                        if (value > 183 || value < 0) {
                            d.resolve(Label.getContent('Input range') + ':0~183');
                        }
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_PaymentDays';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            } else {
                                d.resolve();
                            }
                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        })
                        return d.promise;
                    }

                    scope.checkOtherCompensation = function(contractCode,producerID,retailerID, brandName, varName, category, value) {
                        var d = $q.defer();
                        var supplierOtherCompensation = retailerOtherCompensation = 0;
                        var filter = /^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }


                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_PerformanceBonusRate';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + producerID + '/' + brandName + '/' + varName + '/otherCompensation/' + retailerID;
                            
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(producerID) + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            producerExpend = data.data.result;

                            var availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                            
                            if(value < availableBudgetLeft){
                                d.resolve();
                            } else {
                                d.resolve(Label.getContent('Supplier does not have enough budget.'));                                                                    
                            }

                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        });

                        return d.promise;
                    }

                    /* 

                        Data Operation

                    */
                     scope.updateContractDetails = function(contractCode, brandName, varName, location, index, value, category, producerID) {
                        var postData = {
                            contractCode: contractCode,
                            brandName: brandName,
                            varName: varName,
                            userType: 'R',
                            location: location,
                            value: value,

                            producerID : producerID,
                            retailerID : scope.selectedPlayer,
                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
                            period : scope.selectedPeriod
                        };

                        $http({
                            method: 'POST',
                            url: '/updateContractDetails',
                            data: postData
                        }).then(function(data) {
                            //update local interface anyway
                            if(data.data.nc_VolumeDiscountRate<=1){
                                data.data.nc_VolumeDiscountRate=(data.data.nc_VolumeDiscountRate*100).toFixed(2);
                            }
                            if(data.data.nc_PerformanceBonusRate<=1){
                                data.data.nc_PerformanceBonusRate=(data.data.nc_PerformanceBonusRate*100).toFixed(2);
                            }
                            switch(producerID){
                                case 1:
                                    if (category == 1) {
                                        scope.product1es[index] = data.data; 
                                    } else {
                                        scope.product1hs[index] = data.data; 
                                    }                                
                                    break;
                                case 2:
                                    if (category == 1) {
                                        scope.product2es[index] = data.data; 
                                    } else {
                                        scope.product2hs[index] = data.data; 
                                    }
                                    break;                                
                                case 3:
                                    if (category == 1) {
                                        scope.product3es[index] = data.data; 
                                    } else {
                                        scope.product3hs[index] = data.data; 
                                    }                                
                                    break;
                            }
                        });
                    }

                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        scope.retailerID = scope.selectedPlayer;
                        if(scope.selectedPlayer&&scope.selectedPeriod){
                            getResult(1);
                            getResult(2);
                            getResult(3);
                        }
                    }

                    var getResult = function(producerID){
                        //check with server, make sure that isPortfolioDecisionCommitted = true = $scope.isPXReady to show Table
                        //Otherwise show a picture "Waiting for supplier to commit portfolio decision...."
                        var url = '/checkProducerDecisionStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(producerID);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.isPortfolioDecisionCommitted) {
                                switch(producerID){
                                    case 1: scope.isP1Ready = true; break;
                                    case 2: scope.isP2Ready = true; break;
                                    case 3: scope.isP3Ready = true; break;
                                }
                            } else {
                                switch(producerID){
                                    case 1: scope.isP1Ready = false; break;
                                    case 2: scope.isP2Ready = false; break;
                                    case 3: scope.isP3Ready = false; break;
                                }                                
                            }
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                            url = '/getContractDetails/P' + producerID + 'andR' + scope.selectedPlayer + '_' + SeminarInfo.getSelectedSeminar().seminarCode + '_' + scope.selectedPeriod;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data){
                            return organiseArray(data.data, producerID);
                        },function(data){
                            console.log('TE_RD_negotiationAgreement getResult() failed.');
                        });
                    }

                    var organiseArray = function(data, producerID) {
                        var deferred = $q.defer();
                        if (data.length != 0) {
                            loadProduct(data, 'E', producerID);
                            loadProduct(data, 'H', producerID);
                        }
                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }

                    var loadProduct = function(data, category, producerID) {
                        var products = new Array();
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].parentBrandName.substring(0, 1) == category) {
                                if(data[i].nc_VolumeDiscountRate<=1){
                                    data[i].nc_VolumeDiscountRate=(data[i].nc_VolumeDiscountRate*100).toFixed(2);
                                }
                                if(data[i].nc_PerformanceBonusRate<=1){
                                    data[i].nc_PerformanceBonusRate=(data[i].nc_PerformanceBonusRate*100).toFixed(2);
                                }
                                products.push(data[i]);
                            }
                        }
                        if (producerID == 1) {
                            if (category == "E") {
                                scope.product1es = products;
                            } else {
                                scope.product1hs = products;
                            }
                        } else if (producerID == 2) {
                            if (category == "E") {
                                scope.product2es = products;
                            } else {
                                scope.product2hs = products;
                            }
                        } else {
                            if (category == "E") {
                                scope.product3es = products;
                            } else {
                                scope.product3hs = products;
                            }
                        }
                    }

                    //Before user click DisAgree or Agree, check if contract details has been locked(both side choose agree)
                    //if data.result = true : Lock
                    //if data.result = false : Not Lock
                    scope.checkContractDetailsLockStatus = function(contractCode, brandName, varName, location, index, value, category, producerID) {
                        var d = $q.defer();
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/' + location;
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            //update this item details from server anyway 
                            if(data.data.doc.nc_VolumeDiscountRate<=1){
                                data.data.doc.nc_VolumeDiscountRate=(data.data.doc.nc_VolumeDiscountRate*100).toFixed(2);
                            }
                            if(data.data.doc.nc_PerformanceBonusRate<=1){
                                data.data.doc.nc_PerformanceBonusRate=(data.data.doc.nc_PerformanceBonusRate*100).toFixed(2);
                            }
                            if (category == 1) {
                                switch (producerID) {
                                    case 1:
                                        scope.product1es[index] = data.data.doc;
                                        break;
                                    case 2:
                                        scope.product2es[index] = data.data.doc;
                                        break;
                                    case 3:
                                        scope.product3es[index] = data.data.doc;
                                        break;
                                }
                            } else {
                                switch (producerID) {
                                    case 1:
                                        scope.product1hs[index] = data.data.doc;
                                        break;
                                    case 2:
                                        scope.product2hs[index] = data.data.doc;
                                        break;
                                    case 3:
                                        scope.product3hs[index] = data.data.doc;
                                        break;
                                }
                            }

                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked'));
                            } else {
                                d.resolve();
                            }                        
                        })
                        return d.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    });

                    scope.$on('NegotiationBaseChangedSaved', function(event, data) {  
                        getResult(data.producerID);
                        notify('Negotiation has been saved, Retailer ' + data.retailerID  + ' Period ' + data.period + '.');
                    });

                    scope.$on('NegotiationBaseChangedBySupplier', function(event, data) {  
                        getResult(data.producerID);                        
                        notify('Negotiation has been updated by Supplier ' + data.producerID  + ' Period ' + data.period + '.');
                    });
                    
                    scope.$on('dealContract',function(event,data){
                        //getResult(data.producerID);
                        for(var i=0;i<data.result.length;i++){
                            getResult(data.result[i].producerID);
                            notify('Time is up, Contract Deal,Period ' + data.period + '.');     
                        }
                        //notify('Time is up, Contract Deal,Period ' + data.period + '.');
                    })
                    scope.$on('producerContractDeal',function(event,data){
                        notify('Time is up, Contract Deal,Period ' + data.period + '.');
                        getResult(data.producerID);
                    })


                    scope.$on('committedPortfolio',function(event,data){
                        loadAllContract=function(){
                            getResult(1);
                            getResult(2);
                            getResult(3);
                        }
                        setTimeout(loadAllContract, 10000);
                        notify('Time is up, suppliers commit Portfolio,Period ' + data.period + '.');
                    })

                    // scope.$on('ContractFinalized',function(event,data){
                    //     getResult(data.producerID);
                    //     notify('Time is up, Contract Finalized,Period ' + data.period + '.');
                    // });

                }
            }
        }
    ])
})