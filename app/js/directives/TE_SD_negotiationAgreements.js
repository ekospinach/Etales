define(['directives', 'services'], function(directives) {

    directives.directive('supplierNegotiationAgreements', ['ProducerDecisionBase', 'ProducerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo',
        function(ProducerDecisionBase, ProducerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    isNegotiationChange: '=',
                    isReady: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SD_negotiationAgreements.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        startListenChangeFromServer();
                        scope.producerID = PlayerInfo.getPlayer();
                        getResult();
                    }

                    var startListenChangeFromServer = function() {
                        var socket = io.connect();
                        socket.on('retailerEditNegotiation', function(data) {
                            scope.isNegotiationChange = true;
                            getResult();
                        });
                    }

                    var loadProduct = function(data, category, retailerID) {
                        var products = new Array();
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].parentBrandName.substring(0, 1) == category) {
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

                    scope.checkContractDetails = function(contractCode, brandName, varName, location, index, value, category, retailerID) {
                        var d = $q.defer();
                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/' + location;
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
                            } else {
                                d.resolve();
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
                        })
                        return d.promise;
                    }

                    /*
                         Minimum Order range
                         0 ~ Min((1)Supplier's total production capacity minus ( the sum of what has been already approved in this and other deals),
                                 (2)the value of the discount = volume * BM Price * ( 1 -discount rate ) cannot exceed remaining available budget,
                                 (3)Retailer's Previous CATEGORY sales volume)
                    */
                    scope.checkMinimumOrder = function(contractCode, brandName, varName, category, value, retailerID) {
                        var d = $q.defer();
                        var filter = /^[0-9]*[1-9][0-9]*$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }

                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_MinimumOrder';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
                            }

                            url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/P/' + PlayerInfo.getPlayer();
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            //negotiationACmac = MAX planned production capacity 
                            negotiationACmax = data.data.productionCapacity[category - 1];

                            url = '/getNegotiationExpend/' + contractCode + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {                            
                            expend = data.data.result;                            
                            //TODO: bench mark(3), Retailer's Previous CATEGORY sales volume
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {

                            //TODO: every time they rest Minimum order successfully, set Discount rate into 0% automatically.
                            //TODO: (2) need to be implemented 
                            var availablePlannedProductionCapacity  = negotiationACmax - expend;
                            var retailerPreviousCategorySalesvolume = data.data;
                            var benchMark = Math.min(availablePlannedProductionCapacity, retailerPreviousCategorySalesvolume);
                            if(benchMark < 0){benchMark = 0;}

                            if(value < benchMark){
                                d.resolve();
                            } else {
                                d.resolve(Label.getContent('Input range') + ': 0 ~ ' + benchMark);
                            }

                        }, function() {
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

                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_VolumeDiscountRate';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
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


                            //TODO: Need to redo service getContractExpend, and use it here instead of /getNegotiationExpend

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

                    /*
                         Sales Target
                         0 ~ Min((1)50% of market size),
                                 (2)the value of bonus = volume * bonus rate * BM Price has to be smaller than remaining budget,
                                 (3)Retailer's Previous CATEGORY sales volume)
                    */
                    scope.checkTargetVolume = function(contractCode, brandName, varName, category, value, retailerID) {
                        var d = $q.defer();
                        var maxTargetVolumeVsTotalMarket, marketSize, salesVolume;
                        var filter = /^[0-9]*[1-9][0-9]*$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }

                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_SalesTargetVolume';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
                            }
                            url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + category + '/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            //maxTargetVolumesVsTotalMarket = 50%
                            maxTargetVolumeVsTotalMarket = data.data.MaxTargetVolumeVsTotalMarket;

                            url = '/getMarketSize/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            marketSize = data.data;
                            url = '/getSalesVolume/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            salesVolume = data.data;

                            //TODO: Need to Add budget constraints 
                            //TODO: Need Finished Marksize service & Previous Category Sales Volume service
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

                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_PerformanceBonusRate';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
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
                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod()) + '/' + parseInt(PlayerInfo.getPlayer()) + '/brandName/location/1';
                            return $http({
                                method: 'GET',
                                url: url,
                            });
                        }).then(function(data) {
                            productExpend = data.data.result;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/1/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            r1ContractExpend = data.data.result;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + PlayerInfo.getPlayer() + '/2/' + brandName + '/' + varName;
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
                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_PaymentDays';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
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
                        var url = '/checkContractDetails/' + contractCode + '/' + brandName + '/' + varName + '/nc_OtherCompensation';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data.result == "no") {
                                d.resolve(Label.getContent('This product is locked'));
                            }
                            url = '/getScrplSales/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + PlayerInfo.getPlayer() + '/' + category;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            supplierOtherCompensation = data.data[0].toFixed(2);
                            url = '/getRcrplSales/' + SeminarInfo.getSelectedSeminar() + '/' + (PeriodInfo.getCurrentPeriod() - 1) + '/' + retailerID + '/' + category + '/1';
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
                            seminar : SeminarInfo.getSelectedSeminar()
                        };

                        $http({
                            method: 'POST',
                            url: '/updateContractDetails',
                            data: postData
                        }).then(function(data) {
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

                    var getResult = function() {
                        if (!scope.isReady) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        } else {
                            var url = '/getContractDetails/' + 'P' + PlayerInfo.getPlayer() + 'andR1_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            $http({
                                method: 'GET',
                                url: url,
                            }).then(function(data) {
                                return organiseArray(data.data, 1);
                            }).then(function() {
                                url = '/getContractDetails/' + 'P' + PlayerInfo.getPlayer() + 'andR2_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                                return $http({
                                    method: 'GET',
                                    url: url
                                });
                            }).then(function(data) {
                                return organiseArray(data.data, 2);
                            }).then(function(data) {
                                scope.isNegotiationChange = false;
                                scope.isResultShown = true;
                                scope.isPageLoading = false;
                            }, function() {
                                console.log('fail');
                            })
                        }
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


                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    });
                }
            }
        }
    ])
})