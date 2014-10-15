te_sd_nedefine(['directives', 'services'], function(directives) {

    directives.directive('supplierNegotiationAgreements', ['ProducerDecisionBase', 'ProducerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo','notify',
        function(ProducerDecisionBase, ProducerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo, notify) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPlayer: '=',
                    selectedPeriod: '=',
                    isPortfolioDecisionCommitted:'=',
                    isContractDeal:'=',
                    isContractFinalized:'=',
                    isDecisionCommitted:'='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SD_negotiationAgreements.html',
                link: function(scope, element, attrs) {
                    /* 

                         Input Validation  
 
                         Minimum Order range
                         0 ~ Min((1)Supplier's total production capacity minus ( the sum of what has been already approved in this and other deals),
                                 (2)the value of the discount = volume * BM Price * ( 1 -discount rate ) cannot exceed remaining available budget,
                                 //(3)Retailer's Previous CATEGORY sales volume)
                                 (3)cash must be transferred into Retailer's account in current period if retailer order volume > agreed minimum order 
                    */
                    scope.checkMinimumOrder = function(contractCode, brandName, varName, category, value, retailerID) {
                        var d = $q.defer();
                        var negotiationACmax, agreedProductionVolume, max, ContractExpend, reportExpend, producerExpend;
                        var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }
                        //d.resolve();

                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_MinimumOrder';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];

                            url = '/getAgreedProductionVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/' + brandName + '/' + varName;
                            console.log(url);
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

                    /*
                         Discount rate
                         0 ~ Min((1)the value of the discount = volume * BM Price * ( 1 -discount rate ) cannot exceed remaining available budget,
                                 (2)100%)
                    */                    
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

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/' + brandName + '/' + varName + '/volumeDiscount/' + retailerID;
                            console.log(url);
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(scope.selectedPlayer) + '/brandName/location/1';
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

                    /*
                         Sales Target
                         0 ~ Min((1)50% of market size),
                                 (2)the value of bonus = volume * bonus rate * BM Price has to be smaller than remaining budget,
                                 (3)Retailer's Previous CATEGORY sales volume)
                    */

                    scope.checkTargetVolume = function(contractCode, brandName, varName, category, value, retailerID) {
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

                            url = '/getMarketSize/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/' + retailerID + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            marketSize = data.data;
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/' + retailerID + '/' + category;
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


                    /*
                         Bonous Rate
                         0 ~ Min((1)the value of bonus = volume * bonus rate * BM Price has to be smaller than remaining budget,
                                 (2)100%)
                    */                    
                    scope.checkBonusRate = function(contractCode, producerID, retailerID, brandName, varName, index, value, volume, bmPrices, category) {
                        var d = $q.defer();
                        var discountRate = expend = max = productExpend = r1ContractExpend = r2ContractExpend = 0;
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
                            url = '/checkSalesTargetVolume/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            if (data.data == "unReady") {
                                d.resolve(Label.getContent('set Target Volume first'))
                            }
                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/' + brandName + '/' + varName + '/performanceBonus/' + retailerID;
                            console.log(url);
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(scope.selectedPlayer) + '/brandName/location/1';
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
                                d.resolve(Label.getContent('Input range') + ':0% ~ ' + (Math.floor((benchMark * 100 * 100) / 100) + '%'));                                
                            }

                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        });

                        return d.promise;
                    }

                    /*
                         PaymentTerms
                         0 ~ 183 days
                    */                      
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

                    /*
                         Compensation Rage
                    */ 
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

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + PlayerInfo.getPlayer();
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            max = data.data.budgetAvailable;  

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + PlayerInfo.getPlayer() + '/' + brandName + '/' + varName + '/otherCompensation/' + retailerID;
                            console.log(url);
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + PlayerInfo.getPlayer();
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;

                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
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
                    scope.updateContractDetails = function(contractCode, brandName, varName, location, index, value, category, retailerID) {
                        var postData = {
                            contractCode: contractCode,
                            brandName: brandName,
                            varName: varName,
                            userType: 'P',
                            location: location,
                            value: value,

                            producerID : scope.selectedPlayer,
                            retailerID : retailerID,
                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
                            period : scope.selectedPeriod
                        };

                        $http({
                            method: 'POST',
                            url: '/updateContractDetails',
                            data: postData
                        }).then(function(data) {
                            if(data.data.nc_VolumeDiscountRate<=1){
                                data.data.nc_VolumeDiscountRate=(data.data.nc_VolumeDiscountRate*100).toFixed(2);
                            }
                            if(data.data.nc_PerformanceBonusRate<=1){
                                data.data.nc_PerformanceBonusRate=(data.data.nc_PerformanceBonusRate*100).toFixed(2);
                            }
                            if (category == 1) {
                                switch (retailerID) {
                                    case 1:
                                        scope.product1es[index] = data.data;
                                        break;
                                    case 2:
                                        scope.product2es[index] = data.data;
                                        break;
                                }
                            } else {
                                switch (retailerID) {
                                    case 1:
                                        scope.product1hs[index] = data.data;
                                        break;
                                    case 2:
                                        scope.product2hs[index] = data.data;
                                        break;
                                }
                            }
                        });
                    }

                    var initializePage = function() {
                        //if Portfolio deicison isReady                            
                        if(scope.isPortfolioDecisionCommitted){
                            scope.isPageLoading = true;
                            scope.isResultShown = false;
                            scope.Label = Label;                    
                            scope.producerID = scope.selectedPlayer;
                            getResult(1);
                            getResult(2);
                        }
                    }                    

                    var getResult = function(retailerID) {
                        var d=$q.defer();
                        var url = '/getContractDetails/' + 'P' + scope.selectedPlayer + 'andR' + retailerID + '_' + SeminarInfo.getSelectedSeminar().seminarCode + '_' + scope.selectedPeriod;
                        console.log(url);
                        $http({
                            method: 'GET',
                            url: url,
                        }).then(function(data) {
                            return organiseArray(data.data, retailerID);
                        }).then(function() {
                            scope.isNegotiationChange = false;
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        })
                        return d.promise;
                    }

                    var organiseArray = function(data, retailerID) {
                        var deferred = $q.defer();
                        loadProduct(data, 'E', retailerID);
                        loadProduct(data, 'H', retailerID);
                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }

                    var loadProduct = function(data, category, retailerID) {
                        var deferred = $q.defer();
                        
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
                        if (retailerID == 1) {
                            if (category == "E") {
                                scope.product1es = products;
                            } else {
                                scope.product1hs = products;
                            }
                        } else {
                            if (category == "E") {
                                scope.product2es = products;
                            } else {
                                scope.product2hs = products;
                            }
                        }
                        return deferred.promise;
                    }

                    //Before user click DisAgree or Agree, check if contract details has been locked(both side choose agree)
                    //if data.result = true : Lock
                    //if data.result = false : Not Lock
                    scope.checkContractDetailsLockStatus = function(contractCode, brandName, varName, location, index, value, category, retailerID) {
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
                                switch (retailerID) {
                                    case 1:
                                        scope.product1es[index] = data.data.doc;
                                        break;
                                    case 2:
                                        scope.product2es[index] = data.data.doc;
                                        break;
                                }
                            } else {
                                switch (retailerID) {
                                    case 1:
                                        scope.product1hs[index] = data.data.doc;
                                        break;
                                    case 2:
                                        scope.product2hs[index] = data.data.doc;
                                        break;
                                }
                            }

                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            } else {
                                d.resolve();
                            }
                        })
                        return d.promise;
                    }

                    scope.dealConteact=function(){
                        var postData={
                            producerID:1,
                            retailerID:1,
                            seminar:'EJT2',
                            period:1
                        }
                        $http({
                            method:'POST',
                            url:'/dealContractDetails',
                            data:postData
                        }).then(function(data){
                            console.log(data.data);
                        })
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    });

                    scope.$on('NegotiationBaseChangedSaved', function(event, data) {  
                        getResult(data.retailerID);
                        notify('Negotiation has been saved, Supplier ' + data.producerID  + ' Period ' + data.period + '.');
                    });

                    scope.$on('NegotiationBaseChangedByRetailer', function(event, data) {  
                        getResult(data.retailerID);                        
                        notify('Negotiation has been updated by Retailer' + data.retailerID  + ' Period ' + data.period + '.');
                    });

                    scope.$on('ContractDeal',function(event,data){
                        getResult(1);
                        getResult(2);
                        notify('Time is up, Contract Deal,Period ' + data.period + '.');
                    });

                    scope.$on('committedPortfolio',function(event,data){
                        for(var i=0;i<data.result.length;i++){
                            console.log(data.result[i].producerID);
                            if(data.result[i].producerID==scope.selectedPlayer){
                                // loadAllContract=function(){
                                //     scope.Label = Label; 
                                //     getResult(1);
                                //     getResult(2);
                                // }
                                setTimeout(initializePage, 10000);
                                notify('Time is up, Contract Deal,Period ' + data.period + '.');
                                break;
                            }
                        }
                    })

                    // scope.$on('ContractFinalized',function(event,data){
                    //     getResult(1);
                    //     getResult(2);
                    //     notify('Time is up, Contract Finalized,Period ' + data.period + '.');
                    // });

                }
            }
        }
    ])
})