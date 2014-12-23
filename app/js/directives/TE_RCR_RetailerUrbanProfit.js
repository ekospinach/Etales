define(['directives', 'services'], function(directives) {

    directives.directive('retailerUrbanProfit', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', '$modal', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, $modal, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    retailerShow: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/RCR_retailerUrbanProfit.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }
                    var loadValue = function(data, name, num) {
                        var array = _.find(data, function(obj) {
                            return (obj.brandName == name && obj.marketID == num);
                        });
                        return array.value;
                    }


                    scope.openRetailerProductModal = function(brandName, type) {
                        var loadVariantValue = function(data, brandName, variantName, num) {
                            var array = _.find(data, function(obj) {
                                return (obj.variantName == variantName && obj.parentBrandName == brandName && obj.marketID == num);
                            });
                            return array.value;
                        }

                        var marketID = 0;
                        scope.variants = new Array();
                        scope.brandName = brandName;
                        if (type == "Rural") {
                            marketID = 2;
                        } else {
                            marketID = 1;
                        }
                        var url = '/RCR-consolidatedProfitAndLoss/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            data.data[0].rcrv_Sales.forEach(function(singleData){
                                if (singleData.parentBrandName == brandName && singleData.marketID == marketID) {
                                    var variantName                    = singleData.variantName;
                                    var Sales                          = singleData.value;
                                    var PromotionsCost                 = loadVariantValue(data.data[0].rcrv_PromotionsCost, brandName, variantName, marketID);
                                    var OtherCompensation              = loadVariantValue(data.data[0].rcrv_OtherCompensation, brandName, variantName, marketID);
                                    var NetSales                       = loadVariantValue(data.data[0].rcrv_NetSales, brandName, variantName, marketID);
                                    var NetSalesChange                 = loadVariantValue(data.data[0].rcrv_NetSalesChange, brandName, variantName, marketID) * 100;
                                    var NetSalesShareInCategory        = loadVariantValue(data.data[0].rcrv_NetSalesShareInCategory, brandName, variantName, marketID) * 100;
                                    var CostOfGoodsSold                = loadVariantValue(data.data[0].rcrv_CostOfGoodsSold, brandName, variantName, marketID);
                                    var ValueOfQuantityDiscounts       = loadVariantValue(data.data[0].rcrv_ValueOfQuantityDiscounts, brandName, variantName, marketID);
                                    var ValueOfPerformanceBonus        = loadVariantValue(data.data[0].rcrv_ValueOfPerformanceBonus, brandName, variantName, marketID);
                                    var DiscontinuedGoodsCost          = loadVariantValue(data.data[0].rcrv_DiscontinuedGoodsCost, brandName, variantName, marketID);
                                    var InventoryHoldingCost           = loadVariantValue(data.data[0].rcrv_InventoryHoldingCost, brandName, variantName, marketID);
                                    var GrossProfit                    = loadVariantValue(data.data[0].rcrv_GrossProfit, brandName, variantName, marketID);
                                    var GrossProfitChange              = loadVariantValue(data.data[0].rcrv_GrossProfitChange, brandName, variantName, marketID) * 100;
                                    var GrossProfitMargin              = loadVariantValue(data.data[0].rcrv_GrossProfitMargin, brandName, variantName, marketID) * 100;
                                    var GrossProfitShareInCategory     = loadVariantValue(data.data[0].rcrv_GrossProfitShareInCategory, brandName, variantName, marketID) * 100;
                                    var GeneralExpenses                = loadVariantValue(data.data[0].rcrv_GeneralExpenses, brandName, variantName, marketID);
                                    var OperatingProfit                = loadVariantValue(data.data[0].rcrv_OperatingProfit, brandName, variantName, marketID);
                                    var OperatingProfitChange          = loadVariantValue(data.data[0].rcrv_OperatingProfitChange, brandName, variantName, marketID) * 100;
                                    var OperatingProfitMargin          = loadVariantValue(data.data[0].rcrv_OperatingProfitMargin, brandName, variantName, marketID) * 100;
                                    var OperatingProfitShareInCategory = loadVariantValue(data.data[0].rcrv_OperatingProfitShareInCategory, brandName, variantName, marketID) * 100;
                                    var Interest                       = loadVariantValue(data.data[0].rcrv_Interest, brandName, variantName, marketID);
                                    var Taxes                          = loadVariantValue(data.data[0].rcrv_Taxes, brandName, variantName, marketID);
                                    var ExceptionalItems               = loadVariantValue(data.data[0].rcrv_ExceptionalItems, brandName, variantName, marketID);
                                    var NetProfit                      = loadVariantValue(data.data[0].rcrv_NetProfit, brandName, variantName, marketID);
                                    var NetProfitChange                = loadVariantValue(data.data[0].rcrv_NetProfitChange, brandName, variantName, marketID) * 100; 
                                    var NetProfitMargin                = loadVariantValue(data.data[0].rcrv_NetProfitMargin, brandName, variantName, marketID) * 100; 
                                    var NetProfitShareInCategory       = loadVariantValue(data.data[0].rcrv_NetProfitShareInCategory, brandName, variantName, marketID) * 100; 
                                    scope.variants.push({
                                        'variantName'                    : variantName,
                                        'Sales'                          : Sales,
                                        'PromotionsCost'                 : PromotionsCost,
                                        'OtherCompensation'              : OtherCompensation,
                                        'NetSales'                       : NetSales,
                                        'NetSalesChange'                 : NetSalesChange,
                                        'NetSalesShareInCategory'        : NetSalesShareInCategory,
                                        'CostOfGoodsSold'                : CostOfGoodsSold,
                                        'ValueOfQuantityDiscounts'       : ValueOfQuantityDiscounts,
                                        'ValueOfPerformanceBonus'        : ValueOfPerformanceBonus,
                                        'DiscontinuedGoodsCost'          : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'           : InventoryHoldingCost,
                                        'GrossProfit'                    : GrossProfit,
                                        'GrossProfitChange'              : GrossProfitChange,
                                        'GrossProfitMargin'              : GrossProfitMargin,
                                        'GrossProfitShareInCategory'     : GrossProfitShareInCategory,
                                        'GeneralExpenses'                : GeneralExpenses,
                                        'OperatingProfit'                : OperatingProfit,
                                        'OperatingProfitChange'          : OperatingProfitChange,
                                        'OperatingProfitMargin'          : OperatingProfitMargin,
                                        'Interest'                       : Interest,
                                        'Taxes'                          : Taxes,
                                        'ExceptionalItems'               : ExceptionalItems,
                                        'NetProfit'                      : NetProfit,
                                        'NetProfitChange'                : NetProfitChange,
                                        'NetProfitMargin'                : NetProfitMargin,
                                        'NetProfitShareInCategory'       : NetProfitShareInCategory,
                                        'OperatingProfitShareInCategory' : OperatingProfitShareInCategory
                                    });
                                }
                            })
                            var modalInstance = $modal.open({
                                templateUrl: 'modal/retailerProfitProduct.html',
                                controller: retailerProfitProductModalCtrl
                            });
                            modalInstance.result.then(function() {
                                console.log('show Product')
                            })
                        }, function() {
                            console.log('fail');
                        })
                    }

                    var retailerProfitProductModalCtrl = function($scope, $modalInstance, Label) {
                        $scope.Label = Label;
                        $scope.variants = scope.variants;
                        $scope.brandName = scope.brandName;
                        var cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.cancel = cancel;
                    }

                    var loadTotalValue = function(data) {
                        var array = new Array();
                        for (var i = 0; i < 3; i++) {
                            array[i] = new Array();
                        }
                        //array[category-1][market-1]=data[].value
                        data.forEach(function(singleData){
                            switch (singleData.categoryID) {
                                case 1:
                                    if (singleData.marketID == 1) array[StaticValues.category.ele][StaticValues.market.urban] = singleData.value;
                                    if (singleData.marketID == 2) array[StaticValues.category.ele][StaticValues.market.rural] = singleData.value;
                                    if (singleData.marketID == 3) array[StaticValues.category.ele][StaticValues.market.total] = singleData.value;
                                    break;
                                case 2:
                                    if (singleData.marketID == 1) array[StaticValues.category.hea][StaticValues.market.urban] = singleData.value;
                                    if (singleData.marketID == 2) array[StaticValues.category.hea][StaticValues.market.rural] = singleData.value;
                                    if (singleData.marketID == 3) array[StaticValues.category.hea][StaticValues.market.total] = singleData.value;
                                    break;
                                case 3:
                                    if (singleData.marketID == 1) array[StaticValues.category.total][StaticValues.market.urban] = singleData.value;
                                    if (singleData.marketID == 2) array[StaticValues.category.total][StaticValues.market.rural] = singleData.value;
                                    if (singleData.marketID == 3) array[StaticValues.category.total][StaticValues.market.total] = singleData.value;
                                    break;
                            }
                        })
                        return array;
                    }

                    var loadRetailerTotal = function(data) {
                        scope.Sales                    = loadTotalValue(data.rcrpl_Sales);
                        scope.PromotionsCost           = loadTotalValue(data.rcrpl_PromotionsCost);
                        scope.OtherCompensation        = loadTotalValue(data.rcrpl_OtherCompensation);
                        scope.NetSales                 = loadTotalValue(data.rcrpl_NetSales);
                        scope.NetSalesChange           = loadTotalValue(data.rcrpl_NetSalesChange);
                        scope.CostOfGoodsSold          = loadTotalValue(data.rcrpl_CostOfGoodsSold);
                        scope.ValueOfQuantityDiscounts = loadTotalValue(data.rcrpl_ValueOfQuantityDiscounts);
                        scope.ValueOfPerformanceBonus  = loadTotalValue(data.rcrpl_ValueOfPerformanceBonus);
                        scope.DiscontinuedGoodsCost    = loadTotalValue(data.rcrpl_DiscontinuedGoodsCost);
                        scope.InventoryHoldingCost     = loadTotalValue(data.rcrpl_InventoryHoldingCost);
                        scope.GrossProfit              = loadTotalValue(data.rcrpl_GrossProfit);
                        scope.GrossProfitChange        = loadTotalValue(data.rcrpl_GrossProfitChange);
                        scope.GrossProfitMargin        = loadTotalValue(data.rcrpl_GrossProfitMargin);
                        scope.GeneralExpenses          = loadTotalValue(data.rcrpl_GeneralExpenses);
                        scope.OperatingProfit          = loadTotalValue(data.rcrpl_OperatingProfit);
                        scope.OperatingProfitChange    = loadTotalValue(data.rcrpl_OperatingProfitChange);
                        scope.OperatingProfitMargin    = loadTotalValue(data.rcrpl_OperatingProfitMargin);
                        scope.Interest                 = loadTotalValue(data.rcrpl_Interest);
                        scope.Taxes                    = loadTotalValue(data.rcrpl_Taxes);
                        scope.ExceptionalItems         = loadTotalValue(data.rcrpl_ExceptionalItems);
                        scope.NetProfit                = loadTotalValue(data.rcrpl_NetProfit);
                        scope.NetProfitChange          = loadTotalValue(data.rcrpl_NetProfitChange);
                        scope.NetProfitMargin          = loadTotalValue(data.rcrpl_NetProfitMargin);
                    }

                    var loadUR = function(data, category, num) {
                        if (category == 1) {
                            scope.brand1s = [];
                        } else {
                            scope.brand2s = [];
                        }
                        data.rcrb_Sales.forEach(function(singleData){
                            if (singleData.parentCategoryID == category && singleData.marketID == num) {
                                var brandName                      = singleData.brandName;
                                var Sales                          = singleData.value;
                                var marketID                       = singleData.marketID;
                                var PromotionsCost                 = loadValue(data.rcrb_PromotionsCost, brandName, marketID);
                                var OtherCompensation              = loadValue(data.rcrb_OtherCompensation, brandName, marketID);
                                var NetSales                       = loadValue(data.rcrb_NetSales, brandName, marketID);
                                var NetSalesChange                 = loadValue(data.rcrb_NetSalesChange, brandName, marketID) * 100;
                                var NetSalesShareInCategory        = loadValue(data.rcrb_NetSalesShareInCategory, brandName, marketID) * 100;
                                var CostOfGoodsSold                = loadValue(data.rcrb_CostOfGoodsSold, brandName, marketID);
                                var ValueOfQuantityDiscounts       = loadValue(data.rcrb_ValueOfQuantityDiscounts, brandName, marketID);
                                var ValueOfPerformanceBonus        = loadValue(data.rcrb_ValueOfPerformanceBonus, brandName, marketID);
                                var DiscontinuedGoodsCost          = loadValue(data.rcrb_DiscontinuedGoodsCost, brandName, marketID);
                                var InventoryHoldingCost           = loadValue(data.rcrb_InventoryHoldingCost, brandName, marketID);
                                var GrossProfit                    = loadValue(data.rcrb_GrossProfit, brandName, marketID);
                                var GrossProfitChange              = loadValue(data.rcrb_GrossProfitChange, brandName, marketID) * 100;
                                var GrossProfitMargin              = loadValue(data.rcrb_GrossProfitMargin, brandName, marketID) * 100;
                                var GrossProfitShareInCategory     = loadValue(data.rcrb_GrossProfitShareInCategory, brandName, marketID) * 100;
                                var GeneralExpenses                = loadValue(data.rcrb_GeneralExpenses, brandName, marketID);
                                var OperatingProfit                = loadValue(data.rcrb_OperatingProfit, brandName, marketID);
                                var OperatingProfitChange          = loadValue(data.rcrb_OperatingProfitChange, brandName, marketID) * 100;
                                var OperatingProfitMargin          = loadValue(data.rcrb_OperatingProfitMargin, brandName, marketID) * 100;
                                var OperatingProfitShareInCategory = loadValue(data.rcrb_OperatingProfitShareInCategory, brandName, marketID) * 100;
                                var Interest                       = loadValue(data.rcrb_Interest, brandName, marketID);
                                var Taxes                          = loadValue(data.rcrb_Taxes, brandName, marketID);
                                var ExceptionalItems               = loadValue(data.rcrb_ExceptionalItems, brandName, marketID);
                                var NetProfit                      = loadValue(data.rcrb_NetProfit, brandName, marketID);
                                var NetProfitChange                = loadValue(data.rcrb_NetProfitChange, brandName, marketID) * 100;
                                var NetProfitMargin                = loadValue(data.rcrb_NetProfitMargin, brandName, marketID) * 100;
                                var NetProfitShareInCategory       = loadValue(data.rcrb_NetProfitShareInCategory, brandName, marketID) * 100;
                                if (category == 1) {
                                    scope.brand1s.push({
                                        'brandName'                      : brandName,
                                        'Sales'                          : Sales,
                                        'PromotionsCost'                 : PromotionsCost,
                                        'OtherCompensation'              : OtherCompensation,
                                        'NetSales'                       : NetSales,
                                        'NetSalesChange'                 : NetSalesChange,
                                        'NetSalesShareInCategory'        : NetSalesShareInCategory,
                                        'CostOfGoodsSold'                : CostOfGoodsSold,
                                        'ValueOfQuantityDiscounts'       : ValueOfQuantityDiscounts,
                                        'ValueOfPerformanceBonus'        : ValueOfPerformanceBonus,
                                        'DiscontinuedGoodsCost'          : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'           : InventoryHoldingCost,
                                        'GrossProfit'                    : GrossProfit,
                                        'GrossProfitChange'              : GrossProfitChange,
                                        'GrossProfitMargin'              : GrossProfitMargin,
                                        'GrossProfitShareInCategory'     : GrossProfitShareInCategory,
                                        'GeneralExpenses'                : GeneralExpenses,
                                        'OperatingProfit'                : OperatingProfit,
                                        'OperatingProfitChange'          : OperatingProfitChange,
                                        'OperatingProfitMargin'          : OperatingProfitMargin,
                                        'Interest'                       : Interest,
                                        'Taxes'                          : Taxes,
                                        'ExceptionalItems'               : ExceptionalItems,
                                        'NetProfit'                      : NetProfit,
                                        'NetProfitChange'                : NetProfitChange,
                                        'NetProfitMargin'                : NetProfitMargin,
                                        'NetProfitShareInCategory'       : NetProfitShareInCategory,
                                        'OperatingProfitShareInCategory' : OperatingProfitShareInCategory
                                    });
                                } else {
                                    scope.brand2s.push({
                                        'brandName'                      : brandName,
                                        'Sales'                          : Sales,
                                        'PromotionsCost'                 : PromotionsCost,
                                        'OtherCompensation'              : OtherCompensation,
                                        'NetSales'                       : NetSales,
                                        'NetSalesChange'                 : NetSalesChange,
                                        'NetSalesShareInCategory'        : NetSalesShareInCategory,
                                        'CostOfGoodsSold'                : CostOfGoodsSold,
                                        'ValueOfQuantityDiscounts'       : ValueOfQuantityDiscounts,
                                        'ValueOfPerformanceBonus'        : ValueOfPerformanceBonus,
                                        'DiscontinuedGoodsCost'          : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'           : InventoryHoldingCost,
                                        'GrossProfit'                    : GrossProfit,
                                        'GrossProfitChange'              : GrossProfitChange,
                                        'GrossProfitMargin'              : GrossProfitMargin,
                                        'GrossProfitShareInCategory'     : GrossProfitShareInCategory,
                                        'GeneralExpenses'                : GeneralExpenses,
                                        'OperatingProfit'                : OperatingProfit,
                                        'OperatingProfitChange'          : OperatingProfitChange,
                                        'OperatingProfitMargin'          : OperatingProfitMargin,
                                        'Interest'                       : Interest,
                                        'Taxes'                          : Taxes,
                                        'ExceptionalItems'               : ExceptionalItems,
                                        'NetProfit'                      : NetProfit,
                                        'NetProfitChange'                : NetProfitChange,
                                        'NetProfitMargin'                : NetProfitMargin,
                                        'NetProfitShareInCategory'       : NetProfitShareInCategory,
                                        'OperatingProfitShareInCategory' : OperatingProfitShareInCategory
                                    });
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/RCR-consolidatedProfitAndLoss/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        loadRetailerTotal(data);
                        loadUR(data, StaticValues.categoryID.ele, StaticValues.marketID.urban);
                        loadUR(data, StaticValues.categoryID.hea, StaticValues.marketID.urban);

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
                        if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPlayer', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})