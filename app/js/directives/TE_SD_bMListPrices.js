define(['directives', 'services'], function(directives) {

    directives.directive('supplierBMListPrices', ['ProducerDecisionBase', 'ProducerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo',
        function(ProducerDecisionBase, ProducerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    isReady: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SD_bMListPrices.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;

                        scope.currentPeriod = PeriodInfo.getCurrentPeriod();
                        scope.packs = [{
                            value: 1,
                            text: Label.getContent('ECONOMY')
                        }, {
                            value: 2,
                            text: Label.getContent('STANDARD')
                        }, {
                            value: 3,
                            text: Label.getContent('PREMIUM')
                        }];
                        //ProducerDecisionBase.startListenChangeFromServer(); 
                        ProducerDecisionBase.reload({
                            producerID: parseInt(PlayerInfo.getPlayer()),
                            period: PeriodInfo.getCurrentPeriod(),
                            seminar: SeminarInfo.getSelectedSeminar()
                        }).then(function(base) {
                            scope.pageBase = base;
                        }).then(function() {
                            return showView();
                        }),
                        function(reason) {
                            console.log('from ctr: ' + reason);
                        },
                        function(update) {
                            console.log('from ctr: ' + update);
                        };
                    }

                    scope.checkCurrentBM = function(category, brandName, varName, location, additionalIdx, index, value) {
                        var d = $q.defer();

                        var categoryID = 0,
                            max = 0,
                            currentUnitCost = 0;

                        //Validation 1: Mark sure that user input a number here instead of string
                        var filter = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a number'));
                        }

                        if (category == "Elecssories") {
                            categoryID = 1;
                        } else {
                            categoryID = 2;
                        }

                        //Validation 2: Check if supplier has submitted portfolio decision 
                        var url = '/checkProducerDecision/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            if (data.data == "isReady") {
                                d.resolve(Label.getContent('Supplier has submit portfolio decision, input LOCK.'));
                            }
                            var postData = {
                                period    : PeriodInfo.getCurrentPeriod(),
                                seminar   : SeminarInfo.getSelectedSeminar(),
                                brandName : brandName,
                                varName   : varName,
                                catID     : categoryID,
                                userRole  : 2,
                                userID    : PlayerInfo.getPlayer(),
                            }
                            return $http({
                                method: 'POST',
                                url: '/getCurrentUnitCost',
                                data: postData
                            });
                        }).then(function(data) {
                            scope.currentUnitCost = data.data.result;
                            url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar() + '/' + PeriodInfo.getCurrentPeriod() + '/' + categoryID + '/1';
                            return $http({
                                method : 'GET',
                                url    : url
                            })
                        }).then(function(data) {
                        //Validation 3: input range : MaxBMPriceVsCost*unitCost ~ MinBMPriceVsCost*unitCost 
                            if (value > data.data.MaxBMPriceVsCost * scope.currentUnitCost || value < data.data.MinBMPriceVsCost * scope.currentUnitCost) {
                                d.resolve(Label.getContent('Input range') + ':' + data.data.MinBMPriceVsCost * scope.currentUnitCost + '~' + data.data.MaxBMPriceVsCost * scope.currentUnitCost);
                            } else {
                                //Validation 4: if input value < unitCost, show label "Less than current cost"
                                // if (scope.currentUnitCost > value) {
                                //     if (category == "Elecssories") {
                                //         scope.productes[index].showInfo = true;
                                //     } else {
                                //         scope.producths[index].showInfo = true;
                                //     }
                                // } else {
                                //     if (category == "Elecssories") {
                                //         scope.productes[index].showInfo = false;
                                //     } else {
                                //         scope.producths[index].showInfo = false;
                                //     }
                                // }
                                d.resolve();
                            }
                        }, function() {
                            d.resolve(Label.getContent('fail'));
                        })
                        return d.promise;
                    }

                    var loadSelectCategory = function(category) {
                        var count = 0;
                        var products = new Array();
                        var allProCatDecisions = _.filter(scope.pageBase.proCatDecision, function(obj) {
                            if (category == "HealthBeauty") {
                                return (obj.categoryID == 2);
                            } else {
                                return (obj.categoryID == 1);
                            }
                        });
                        for (var i = 0; i < allProCatDecisions.length; i++) {
                            for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                                if (allProCatDecisions[i].proBrandsDecision[j].brandID != undefined && allProCatDecisions[i].proBrandsDecision[j].brandID != 0) {
                                    for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                        if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID != undefined) {
                                            products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
                                            products[count].category = category;
                                            products[count].parentBrandName = allProCatDecisions[i].proBrandsDecision[j].brandName;
                                            if (products[count].packFormat == "ECONOMY") {
                                                products[count].packFormat = 1;
                                            } else if (products[count].packFormat == "STANDARD") {
                                                products[count].packFormat = 2;
                                            } else if (products[count].packFormat == "PREMIUM") {
                                                products[count].packFormat = 3;
                                            }
                                            products[count].currentPriceBM = parseFloat(products[count].currentPriceBM).toFixed(2);
                                            //products[count].nextPriceBM=parseFloat(products[count].nextPriceBM).toFixed(2);
                                            products[count].showInfo = false;
                                            count++;
                                        }
                                    }
                                }
                            }
                        }
                        if (category == "Elecssories") {
                            scope.productes = products;
                        } else {
                            scope.producths = products;
                        }
                    }

                    var selectPacks = function(category, parentBrandName, varName) {
                        var selected, postion = -1;
                        if (scope.productes.length > 1 && scope.producths.length > 1) {
                            if (category == "Elecssories") {
                                for (var i = 0; i < scope.productes.length; i++) {
                                    if (scope.productes[i].parentBrandName == parentBrandName && scope.productes[i].varName == varName) {
                                        selected = $filter('filter')(scope.packs, {
                                            value: scope.productes[i].packFormat
                                        });
                                        postion = i;
                                        break;
                                    }
                                }
                                if (postion != -1 && selected != undefined) {
                                    return (scope.productes[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set');
                                } else {
                                    return Label.getContent('Not set');
                                }
                            } else {
                                for (var i = 0; i < scope.producths.length; i++) {
                                    if (scope.producths[i].parentBrandName == parentBrandName && scope.producths[i].varName == varName) {
                                        selected = $filter('filter')(scope.packs, {
                                            value: scope.producths[i].packFormat
                                        });
                                        postion = i;
                                        break;
                                    }
                                }
                                if (postion != -1 && selected != undefined) {
                                    return (scope.producths[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set');
                                } else {
                                    return Label.getContent('Not set');
                                }
                            }
                        } else {
                            return Label.getContent('Not sets');
                        }
                    }

                    var loadByCategory = function(category) {
                        return _.filter(scope.pageBase.proCatDecision, function(obj) {
                            if (category == "HealthBeauty") {
                                return (obj.categoryID == 2);
                            } else {
                                return (obj.categoryID == 1);
                            }
                        });
                    }

                    scope.updateProducerDecision = function(category, brandName, varName, location, additionalIdx, index) {
                        var categoryID;
                        if (location == "composition") {
                            if (category == "Elecssories") {
                                categoryID = 1;
                                ProducerDecisionBase.setProducerDecisionValue(categoryID, brandName, varName, location, additionalIdx, scope.productes[index][location][additionalIdx]);
                            } else {
                                categoryID = 2;
                                ProducerDecisionBase.setProducerDecisionValue(categoryID, brandName, varName, location, additionalIdx, scope.producths[index][location][additionalIdx]);
                            }
                        } else {
                            if (category == "Elecssories") {
                                categoryID = 1;
                                ProducerDecisionBase.setProducerDecisionValue(categoryID, brandName, varName, location, additionalIdx, scope.productes[index][location]);
                            } else {
                                categoryID = 2;
                                ProducerDecisionBase.setProducerDecisionValue(categoryID, brandName, varName, location, additionalIdx, scope.producths[index][location]);
                            }
                        }
                    }

                    var showView = function() {
                        var d = $q.defer();
                        loadSelectCategory('Elecssories');
                        loadSelectCategory('HealthBeauty');
                        scope.selectPacks = selectPacks;
                        scope.isResultShown = true;
                        scope.isPageLoading = false;
                        return d.promise;
                    }

                    scope.submitDecision = function() {
                        var postData;

                        //step 0: Delete all the related contract schema and contractDetails schema 
                        var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR1_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                        $http({
                            method: 'POST',
                            url: '/removeContract',
                            data: {
                                contractCode: contractCode
                            }
                        }).then(function(data) {
                            console.log(data.data);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR2_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return $http({
                                method: 'POST',
                                url: '/removeContract',
                                data: {
                                    contractCode: contractCode
                                }
                            });

                        }).then(function(data) {
                            console.log(data.data);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR1_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return $http({
                                method: 'POST',
                                url: '/removeContractDetailsByContractCode',
                                data: {
                                    contractCode: contractCode
                                }
                            });

                        }).then(function(data) {
                            console.log(data.data);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR2_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return $http({
                                method: 'POST',
                                url: '/removeContractDetailsByContractCode',
                                data: {
                                    contractCode: contractCode
                                }
                            });
                        }).then(function(data) {
                            console.log(data.data);

                        //step 1: Add contract schema between current supplier and retailer 1 
                            postData = {
                                period: PeriodInfo.getCurrentPeriod(),
                                seminar: SeminarInfo.getSelectedSeminar(),
                                draftedByCompanyID: PlayerInfo.getPlayer(),
                                producerID: PlayerInfo.getPlayer(),
                                retailerID: 1
                            }
                            return $http({
                                method: 'POST',
                                url: '/addContract',
                                data: postData
                            });

                        }).then(function(data) {

                            console.log('created contract schema between supplier ' + postData.producerID + ' and retailer ' + postData.retailerID);

                        //step 2: Add contract schema between current supplier and retailer 2
                            postData.retailerID = 2;
                            return $http({
                                method: 'POST',
                                url: '/addContract',
                                data: postData
                            });
                        }).then(function(data) {
                            console.log('created contract schema between supplier ' + postData.producerID + ' and retailer ' + postData.retailerID);

                        //step 3: Add related contract details for two contact schema
                        //TODO: need to update field "isNewProduct" and "isCompositionModifed" in smart way                    
                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR1_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return contractDetailsCreateShooter(contractCode, scope.productes);

                        }).then(function(data) {
                            console.log(data.msg);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR1_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return contractDetailsCreateShooter(contractCode, scope.producths);
                        }).then(function(data) {
                            console.log(data.msg);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR2_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return contractDetailsCreateShooter(contractCode, scope.productes);
                        }).then(function(data) {
                            console.log(data.msg);

                            var contractCode = 'P' + PlayerInfo.getPlayer() + 'andR2_' + SeminarInfo.getSelectedSeminar() + '_' + PeriodInfo.getCurrentPeriod();
                            return contractDetailsCreateShooter(contractCode, scope.producths);
                        }).then(function(data) {
                            console.log(data.msg);

                        //step 4: after everything related have been inserted into DB, send request to /submitDecision to block input interface
                            var queryCondition = {
                                producerID: parseInt(PlayerInfo.getPlayer()),
                                seminar: SeminarInfo.getSelectedSeminar(),
                                period: PeriodInfo.getCurrentPeriod(),
                                value: true
                            }
                            return $http({
                                method: 'POST',
                                url: '/submitPortfolioDecision',
                                data: queryCondition
                            });
                        }).then(function(data) {
                            console.log('Submitted decision complete, lock input.');
                        }, function(data) {
                            if (data.msg != undefined) {
                                console.log('Error: ' + data.msg);
                            } else console.log('Error: ' + data.data);
                        });
                    }

                    function contractDetailsCreateShooter(contractCode, productList) {
                        var deferred = $q.defer();

                        (function multipleRequestShooter(products, idx) {
                            var shooterData = {
                                contractCode: contractCode,
                                brandName: products[idx].parentBrandName,
                                brandID: products[idx].parentBrandID,
                                varName: products[idx].varName,
                                varID: products[idx].varID,
                                composition: products[idx].composition,
                                currentPriceBM: products[idx].currentPriceBM
                            }
                            $http({
                                method: 'POST',
                                url: '/addContractDetails',
                                data: shooterData
                            }).then(function(data) {
                                if (idx < products.length - 1) {
                                    idx++;
                                    multipleRequestShooter(products, idx);
                                } else {
                                    deferred.resolve({
                                        msg: 'contract details shooter done, contractCode : ' + contractCode
                                    });
                                }
                            }, function(data) {
                                deferred.reject({
                                    msg: 'Error from contract details shooter, contractCode : ' + contractCode
                                });
                            });

                        })(productList, 0);

                        return deferred.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    });

                    scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase) {
                        ProducerDecisionBase.reload({
                            producerID: parseInt(PlayerInfo.getPlayer()),
                            period: PeriodInfo.getCurrentPeriod(),
                            seminar: SeminarInfo.getSelectedSeminar()
                        }).then(function(base) {
                            scope.pageBase = base;
                        }).then(function() {
                            return showView();
                        }),
                        function(reason) {
                            console.log('from ctr: ' + reason);
                        },
                        function(update) {
                            console.log('from ctr: ' + update);
                        };
                    });

                }
            }
        }
    ])
})