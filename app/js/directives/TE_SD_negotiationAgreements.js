define(['directives', 'services'], function(directives) {

    directives.directive('supplierNegotiationAgreements', ['ProducerDecisionBase', 'ProducerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo','notify',
        function(ProducerDecisionBase, ProducerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo, notify) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    isPortfolioDecisionReady: '='
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

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + PlayerInfo.getPlayer();
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];

                            url = '/getAgreedProductionVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/' + brandName + '/' + varName;
                            console.log(url);
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {                            
                            agreedProductionVolume = data.data.result;                            

                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/' + brandName + '/' + varName;
                            console.log(url);
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {                            
                            allContractExpend = data.data.result;                            

                            //TODO: (2) need to be implemented 

                            var availablePlannedProductionCapacity  = negotiationACmax - agreedProductionVolume;
                            var benchMark = Math.min(availablePlannedProductionCapacity);
                            
                            if(benchMark < 0){benchMark = 0;}

                            if(value < benchMark){
                                d.resolve();
                            } else {
                                d.resolve(Label.getContent('Input range') + ': 0 ~ ' + benchMark);
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
                        if(value > 100){
                            d.resolve('Input range: 1% ~ 100%');
                        } else {
                            d.resolve();                            
                        }

                        // var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_VolumeDiscountRate';
                        // $http({
                        //     method: 'GET',
                        //     url: url
                        // }).then(function(data) {
                        //     if (data.data.result) {
                        //         d.resolve(Label.getContent('This item has been locked.'));
                        //     }

                        //     url = '/checkVolume/' + contractCode + '/' + brandName + '/' + varName;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     if (data.data == "unReady") {
                        //         d.resolve(Label.getContent('set Minimum Order first'))
                        //     }

                        //     url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + producerID;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     negotiationABmax = data.data.budgetAvailable;

                        //     url = '/getAgreedProductionVolume/' + contractCode + '/' + brandName + '/' + varName;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     })

                        // }).then(function(data) {
                        //     expend = data.data.result;


                        //     //TODO: Need to redo service getContractExpend, and use it here instead of /getAgreedProductionVolume 

                        //     if (value > 100) {
                        //         d.resolve(Label.getContent('Input range') + ':0~100');
                        //     } else if (volume * bmPrices * (1 - value / 100) > negotiationABmax - expend) {
                        //         discountRate = 1 - (negotiationABmax - expend) * 100 / (volume * bmPrices);
                        //         d.resolve(Label.getContent('Input range') + ':0~' + discountRate);
                        //     } else {
                        //         d.resolve();
                        //     }
                        // }, function() {
                        //     d.resolve(Label.getContent('Check Error'));
                        // })
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
                        d.resolve();

                        // var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_SalesTargetVolume';
                        // $http({
                        //     method: 'GET',
                        //     url: url
                        // }).then(function(data) {
                        //     if (data.data.result) {
                        //         d.resolve(Label.getContent('This item has been locked.'));
                        //     }
                        //     url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + category + '/1'+ '/' + PeriodInfo.getCurrentPeriod();
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     //maxTargetVolumesVsTotalMarket = 50%
                        //     maxTargetVolumeVsTotalMarket = data.data.MaxTargetVolumeVsTotalMarket;

                        //     url = '/getMarketSize/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     })
                        // }).then(function(data) {
                        //     marketSize = data.data;
                        //     url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     })
                        // }).then(function(data) {
                        //     salesVolume = data.data;

                        //     //TODO: Need to Add budget constraints 
                        //     //TODO: Need Finished Marksize service & Previous Category Sales Volume service
                        //     if (marketSize * maxTargetVolumeVsTotalMarket > salesVolume) {
                        //         if (value > salesVolume) {
                        //             d.resolve(Label.getContent('Input range') + ':0~' + salesVolume);
                        //         } else {
                        //             d.resolve();
                        //         }
                        //     } else {
                        //         if (value > marketSize * maxTargetVolumeVsTotalMarket) {
                        //             d.resolve(Label.getContent('Input range') + ':0~' + marketSize * maxTargetVolumeVsTotalMarket);
                        //         } else {
                        //             d.resolve();
                        //         }
                        //     }
                        // }, function() {
                        //     d.resolve(Label.getContent('Check Error'));
                        // });
                        return d.promise;
                    }


                    /*
                         Bonous Rate
                         0 ~ Min((1)the value of bonus = volume * bonus rate * BM Price has to be smaller than remaining budget,
                                 (2)100%)
                        //TODO: need debug and organize 
                    */                    
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

                        // var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_PerformanceBonusRate';
                        // $http({
                        //     method: 'GET',
                        //     url: url
                        // }).then(function(data) {
                        //     if (data.data.result) {
                        //         d.resolve(Label.getContent('This item has been locked.'));
                        //     }
                        //     url = '/checkSalesTargetVolume/' + contractCode + '/' + brandName + '/' + varName;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     if (data.data == "unReady") {
                        //         d.resolve(Label.getContent('set Target Volume first'))
                        //     }

                        //     url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + producerID;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     max = data.data.budgetAvailable + data.data.budgetSpentToDate;
                        //     url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
                        //     return $http({
                        //         method: 'GET',
                        //         url: url,
                        //     });
                        // }).then(function(data) {
                        //     productExpend = data.data.result;
                        //     url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/1/' + brandName + '/' + varName;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     r1ContractExpend = data.data.result;
                        //     url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/2/' + brandName + '/' + varName;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     r2ContractExpend = data.data.result;
                        //     if (value > 100) {
                        //         d.resolve(Label.getContent('Input range') + ':0~100');
                        //     } else if (volume * bmPrices * value / 100 > max - productExpend - r1ContractExpend - r2ContractExpend) {
                        //         bonusRate = (max - productExpend - r1ContractExpend - r2ContractExpend) * 100 / (volume * bmPrices);
                        //         d.resolve(Label.getContent('Input range') + ':0~' + bonusRate);
                        //     } else {
                        //         d.resolve();
                        //     }
                        // }, function() {
                        //     d.resolve(Label.getContent('Check Error'));
                        // });
                        return d.promise;
                    }

                    /*
                         Bonous Rate
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
                         Max(-Previous Supplier category sales, -Previous Retailer category sales)
                         ~
                         Min(Previous Supplier category sales, Previous Retailer category sales)

                         //TODO: Suggest not to put any constraints here for the time being, by Hao
                    */ 
                    scope.checkOtherCompensation = function(contractCode, brandName, varName, category, value, retailerID) {
                        var d = $q.defer();
                        var supplierOtherCompensation = retailerOtherCompensation = 0;
                        var filter = /^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }

                        d.resolve();
                        
                        // var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_OtherCompensation';
                        // $http({
                        //     method: 'GET',
                        //     url: url
                        // }).then(function(data) {
                        //     if (data.data.result) {
                        //         d.resolve(Label.getContent('This item has been locked.'));
                        //     }
                        //     url = '/getScrplSales/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category;
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     supplierOtherCompensation = data.data[0].toFixed(2);
                        //     url = '/getRcrplSales/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category + '/1';
                        //     return $http({
                        //         method: 'GET',
                        //         url: url
                        //     });
                        // }).then(function(data) {
                        //     retailerOtherCompensation = data.data.result.toFixed(2);
                        //     if (retailerOtherCompensation >= supplierOtherCompensation) {
                        //         if (value > supplierOtherCompensation || value < (0 - supplierOtherCompensation)) {
                        //             d.resolve(Label.getContent('Input range') + ':' + (0 - supplierOtherCompensation) + '~' + supplierOtherCompensation);
                        //         } else {
                        //             d.resolve();
                        //         }
                        //     } else {
                        //         if (value > retailerOtherCompensation || value < (0 - retailerOtherCompensation)) {
                        //             d.resolve(Label.getContent('Input range') + ':' + (0 - retailerOtherCompensation) + '~' + retailerOtherCompensation);
                        //         } else {
                        //             d.resolve();
                        //         }
                        //     }
                        // }, function() {
                        //     d.resolve(Label.getContent('Check Error'));
                        // })
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

                            producerID : PlayerInfo.getPlayer(),
                            retailerID : retailerID,
                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
                            period : PeriodInfo.getCurrentPeriod()
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
                        if(scope.isPortfolioDecisionReady){
                            scope.isPageLoading = true;
                            scope.isResultShown = false;
                            scope.Label = Label;                    
                            scope.producerID = PlayerInfo.getPlayer();
                            getResult(1);
                            getResult(2);
                        }
                    }                    

                    var getResult = function(retailerID) {
                        var url = '/getContractDetails/' + 'P' + PlayerInfo.getPlayer() + 'andR' + retailerID + '_' + SeminarInfo.getSelectedSeminar().seminarCode + '_' + PeriodInfo.getCurrentPeriod();
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

                }
            }
        }
    ])
})