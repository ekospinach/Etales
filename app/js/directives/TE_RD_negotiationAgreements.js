define(['directives', 'services'], function(directives) {
    directives.directive('retailerNegotiationAgreements', ['RetailerDecisionBase', 'RetailerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo','notify',
        function(RetailerDecisionBase, RetailerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo, notify) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    isNegotiationChange: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/RD_negotiationAgreements.html',
                link: function(scope, element, attrs) {
                    /* 

                        Input Validation 

                    */
                    scope.checkMinimumOrder = function(contractCode, brandName, varName, category, value, producerID) {
                        var d = $q.defer();
                        var filter = /^[0-9]*[1-9][0-9]*$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_MinimumOrder';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }
                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            negotiationACmax = data.data.productionCapacity[category - 1];
                            url = '/getNegotiationExpend/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            expend = data.data.result;
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            if (negotiationACmax - expend > data.data) {
                                if (value > data.data) {
                                    d.resolve(Label.getContent('Input range') + ':0~' + data.data);
                                } else {
                                    d.resolve();
                                }
                            } else {
                                if (value > negotiationACmax - expend) {
                                    d.resolve(Label.getContent('Input range') + ':0~' + negotiationACmax - expend);
                                } else {
                                    d.resolve();
                                }
                            }
                        }, function() {
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
                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            negotiationABmax = data.data.budgetAvailable;
                            url = '/getNegotiationExpend/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            expend = data.data.result;
                            if (value > 100) {
                                d.resolve(Label.getContent('Input range') + ':0~100');
                            } else if (volume * bmPrices * (1 - value / 100) > negotiationABmax - expend) {
                                discountRate = 1 - (negotiationABmax - expend) * 100 / (volume * bmPrices);
                                d.resolve(Label.getContent('Input range') + ':0~' + discountRate);
                            } else {
                                d.resolve();
                            }
                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        })
                        return d.promise;
                    }

                    scope.checkTargetVolume = function(contractCode, brandName, varName, category, value, producerID) {
                        var d = $q.defer();
                        var maxTargetVolumeVsTotalMarket, marketSize, salesVolume;
                        var filter = /^[0-9]*[1-9][0-9]*$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_SalesTargetVolume';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }
                            url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + category + '/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            maxTargetVolumeVsTotalMarket = data.data.MaxTargetVolumeVsTotalMarket;
                            url = '/getMarketSize/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            marketSize = data.data;
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            salesVolume = data.data;
                            if (marketSize * maxTargetVolumeVsTotalMarket > salesVolume) {
                                if (value > salesVolume) {
                                    d.resolve(Label.getContent('Input range') + ':0~' + salesVolume);
                                } else {
                                    d.resolve();
                                }
                            } else {
                                if (value > marketSize * maxTargetVolumeVsTotalMarket) {
                                    d.resolve(Label.getContent('Input range') + ':0~' + marketSize * maxTargetVolumeVsTotalMarket);
                                } else {
                                    d.resolve();
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

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + producerID;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            max = data.data.budgetAvailable + data.data.budgetSpentToDate;
                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + producerID + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url,
                            });
                        }).then(function(data) {
                            productExpend = data.data.result;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + producerID + '/1/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            r1ContractExpend = data.data.result;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + producerID + '/2/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            r2ContractExpend = data.data.result;
                            if (value > 100) {
                                d.resolve(Label.getContent('Input range') + ':0~100');
                            } else if (volume * bmPrices * value / 100 > max - productExpend - r1ContractExpend - r2ContractExpend) {
                                bonusRate = (max - productExpend - r1ContractExpend - r2ContractExpend) * 100 / (volume * bmPrices);
                                d.resolve(Label.getContent('Input range') + ':0~' + bonusRate);
                            } else {
                                d.resolve();
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

                    scope.checkOtherCompensation = function(contractCode, brandName, varName, category, value, producerID) {
                        var d = $q.defer();
                        var supplierOtherCompensation = retailerOtherCompensation = 0;
                        var filter = /^-?[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input Number'));
                        }
                        var url = '/checkContractDetailsLockStatus/' + contractCode + '/' + brandName + '/' + varName + '/nc_OtherCompensation';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result) {
                                d.resolve(Label.getContent('This item has been locked.'));
                            }
                            url = '/getScrplSales/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + producerID + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            supplierOtherCompensation = data.data[0].toFixed(2);
                            url = '/getRcrplSales/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category + '/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            retailerOtherCompensation = data.data.result.toFixed(2);
                            if (retailerOtherCompensation >= supplierOtherCompensation) {
                                if (value > supplierOtherCompensation || value < (0 - supplierOtherCompensation)) {
                                    d.resolve(Label.getContent('Input range') + ':' + (0 - supplierOtherCompensation) + '~' + supplierOtherCompensation);
                                } else {
                                    d.resolve();
                                }
                            } else {
                                if (value > retailerOtherCompensation || value < (0 - retailerOtherCompensation)) {
                                    d.resolve(Label.getContent('Input range') + ':' + (0 - retailerOtherCompensation) + '~' + retailerOtherCompensation);
                                } else {
                                    d.resolve();
                                }
                            }
                        }, function() {
                            d.resolve(Label.getContent('Check Error'));
                        })
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
                            retailerID : PlayerInfo.getPlayer(),
                            seminar : SeminarInfo.getSelectedSeminar(),
                            period : PeriodInfo.getCurrentPeriod()
                        };

                        $http({
                            method: 'POST',
                            url: '/updateContractDetails',
                            data: postData
                        }).then(function(data) {
                            //update local interface anyway
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
                        scope.retailerID = PlayerInfo.getPlayer();
                        getResult(1);
                        getResult(2);
                        getResult(3);
                    }

                    var getResult = function(producerID){
                        //check with server, make sure that isPortfolioDecisionCommitted = true = $scope.isPXReady to show Table
                        //Otherwise show a picture "Waiting for supplier to commit portfolio decision...."
                        var url = '/checkProducerDecision/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(producerID);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data == "isReady") {
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
                            url = '/getContractDetails/P' + producerID + 'andR' + PlayerInfo.getPlayer() + '_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data){
                            return organiseArray(data.data, producerID);
                        }).then(function(data){
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

                }
            }
        }
    ])
})