define(['directives', 'services'], function(directives) {
    directives.directive('supplierHealthBeautiesVolume', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    producerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SCR_supplierHealthBeautiesVolume.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadVolume = function(data, category) {
                        scope.products = new Array();
                        var varName, brandName, initial, production, sales, discontinued, closing, unitProductionCost;
                        data.scrviv_Initial.forEach(function(singleData){
                            if (singleData.parentCategoryID == category) {
                                varName = singleData.variantName;
                                brandName = singleData.parentBrandName;
                                initial = singleData;

                                production = _.find(data.scrviv_Production, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName);
                                });
                                sales = _.find(data.scrviv_Sales, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName);
                                });
                                discontinued = _.find(data.scrviv_Discontinued, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName);
                                });
                                closing = _.find(data.scrviv_Closing, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName);
                                });
                                unitProductionCost = _.find(data.scrviv_UnitProductionCost, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName);
                                });
                                scope.products.push({
                                    'fullName': brandName + varName,
                                    'initial': initial,
                                    'production': production,
                                    'sales': sales,
                                    'discontinued': discontinued,
                                    'closing': closing,
                                    'unitProductionCost': unitProductionCost
                                });
                            } 
                        })
                    }

                    var loadMarketVolume = function(data, category, market) {
                        var varName, brandName, r1Order, r1Sales, r2Order, r2Sales, r3Order, r3Sales, onlineOrder, onlineSales;
                        data.scrviv_Orders.forEach(function(singleData){
                            if (singleData.marketID == market && singleData.parentCategoryID == category) {
                                varName = singleData.variantName;
                                brandName = singleData.parentBrandName;
                                switch (singleData.marketID) {
                                    case 1:
                                        var product = _.find(scope.urbanProductNames, function(obj) {
                                            return (obj.varName == varName && obj.brandName == brandName);
                                        });
                                        if (product == undefined) {
                                            scope.urbanProductNames.push({
                                                'varName': varName,
                                                'brandName': brandName
                                            });
                                        }
                                        break;
                                    case 2:
                                        var product = _.find(scope.ruralProductNames, function(obj) {
                                            return (obj.varName == varName && obj.brandName == brandName);
                                        });
                                        if (product == undefined) {
                                            scope.ruralProductNames.push({
                                                'varName': varName,
                                                'brandName': brandName
                                            });
                                        }
                                        break;
                                }
                            }
                        })
                        if (market == 1) {
                            scope.urbanProductNames.forEach(function(singleData){
                                varName = singleData.varName;
                                brandName = singleData.brandName;
                                var orders = _.filter(data.scrviv_Orders, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == 1);
                                })
                                orders.forEach(function(single){
                                    switch (single.accountID) {
                                        case 1:
                                            r1Order = single.value;
                                            break;
                                        case 2:
                                            r2Order = single.value;
                                            break;
                                        case 3:
                                            r3Order = single.value;
                                            break;
                                        case 4:
                                            onlineOrder = single.value;
                                            break;
                                        case 5:
                                            break;
                                    }
                                })
                                var sales = _.filter(data.scrviv_Shipments, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == 1);
                                });
                                sales.forEach(function(single){
                                    switch (single.accountID) {
                                        case 1:
                                            r1Sales = single.value;
                                            break;
                                        case 2:
                                            r2Sales = single.value;
                                            break;
                                        case 3:
                                            r3Sales = single.value;
                                            break;
                                        case 4:
                                            onlineSales = single.value;
                                            break;
                                        case 5:
                                            break;
                                    }
                                })
                                scope.urbanProducts.push({
                                    'varName': varName,
                                    'brandName': brandName,
                                    'r1Order': r1Order,
                                    'r2Order': r2Order,
                                    'r3Order': r3Order,
                                    'onlineOrder': onlineOrder,
                                    'r1Sales': r1Sales,
                                    'r2Sales': r2Sales,
                                    'r3Sales': r3Sales,
                                    'onlineSales': onlineSales
                                });
                            })
                        } else {
                            scope.ruralProductNames.forEach(function(singleData){
                                varName = singleData.varName;
                                brandName = singleData.brandName;
                                var orders = _.filter(data.scrviv_Orders, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == 2);
                                })
                                orders.forEach(function(single){
                                    switch (single.accountID) {
                                        case 1:
                                            r1Order = single.value;
                                            break;
                                        case 2:
                                            r2Order = single.value;
                                            break;
                                        case 3:
                                            r3Order = single.value;
                                            break;
                                        case 4:
                                            onlineOrder = single.value;
                                            break;
                                        case 5:
                                            break;
                                    }
                                })
                                var sales = _.filter(data.scrviv_Shipments, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == 2);
                                });
                                sales.forEach(function(single){
                                    switch (single.accountID) {
                                        case 1:
                                            r1Sales = single.value;
                                            break;
                                        case 2:
                                            r2Sales = single.value;
                                            break;
                                        case 3:
                                            r3Sales = single.value;
                                            break;
                                        case 4:
                                            onlineSales = single.value;
                                            break;
                                        case 5:
                                            break;
                                    }
                                })
                                scope.ruralProducts.push({
                                    'varName': varName,
                                    'brandName': brandName,
                                    'r1Order': r1Order,
                                    'r2Order': r2Order,
                                    'r3Order': r3Order,
                                    'onlineOrder': onlineOrder,
                                    'r1Sales': r1Sales,
                                    'r2Sales': r2Sales,
                                    'r3Sales': r3Sales,
                                    'onlineSales': onlineSales
                                });
                            })

                        }

                    }

                    var getResult = function() {
                        var url = '/SCR-inventoryVolumes/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url,
                            //tracker: scope.loadingTracker
                        }).then(function(data) {
                            return organiseArray(data.data[0]);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        loadVolume(data, StaticValues.categoryID.hea);
                        scope.urbanProducts = new Array();
                        scope.ruralProducts = new Array();
                        scope.urbanProductNames = new Array();
                        scope.ruralProductNames = new Array();
                        loadMarketVolume(data, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadMarketVolume(data, StaticValues.categoryID.hea, StaticValues.marketID.rural);

                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPeriod', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPlayer', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})