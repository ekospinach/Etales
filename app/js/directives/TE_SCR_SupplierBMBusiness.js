define(['directives', 'services'], function(directives) {

    directives.directive('supplierBMBusiness', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', '$modal', '$timeout', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, $modal, $timeout, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    producerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SCR_supplierBMBusiness.html',
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
                            return (obj.brandName == name);
                        });
                        return array.value[num];
                    }

                    var loadTotal = function(data) {
                        scope.sales                  = data.scrpl_Sales;
                        scope.salesChanges           = data.scrpl_SalesChange;
                        scope.materialCosts          = data.scrpl_MaterialCosts;
                        scope.costGoodsSolds         = data.scrpl_CostOfGoodsSold;
                        scope.discontinuedGoodsCosts = data.scrpl_DiscontinuedGoodsCost;
                        scope.holdingCosts           = data.scrpl_InventoryHoldingCost;
                        scope.transfersCosts         = data.scrpl_InternalTransfersCost;
                        
                        scope.grossProfits           = data.scrpl_GrossProfit;
                        scope.grossProfitChanges     = data.scrpl_GrossProfitChange;
                        scope.grossProfitMargins     = data.scrpl_GrossProfitMargin;
                        scope.expenseValues          = data.scrpl_TradeAndMarketing;
                        //some need to add
                        scope.advertisingOnLines     = data.scrpl_AdvertisingOnLine;
                        scope.advertisingOffLines    = data.scrpl_AdvertisingOffLine;
                        scope.tradeSupports          = data.scrpl_TradeSupport;
                        scope.expenseShares          = data.scrpl_TradeAndMarketingAsPercentageOfSales;
                        scope.generalExpenses        = data.scrpl_GeneralExpenses;
                        scope.amortisations          = data.scrpl_Amortisation;
                        scope.operatingProfits       = data.scrpl_OperatingProfit;
                        scope.operatingProfitChanges = data.scrpl_OperatingProfitChange;
                        scope.operatingProfitMargins = data.scrpl_OperatingProfitMargin;
                        scope.interests              = data.scrpl_Interest;
                        scope.taxes                  = data.scrpl_Taxes;
                        scope.costsProfits           = data.scrpl_ExceptionalItems;
                        scope.netProfits             = data.scrpl_NetProfit;
                        scope.netProfitChanges       = data.scrpl_NetProfitChange;
                        scope.netProfitMargins       = data.scrpl_NetProfitMargin;
                    }

                    var loadBusiness = function(data, category, num) {
                        if (category == 1) {
                            scope.brand1s = [];
                        } else {
                            scope.brand2s = [];
                        }
                        data.scrb_Sales.forEach(function(singleData){
                            if (singleData.parentCategoryID == category) {
                                var brandName                            = singleData.brandName;
                                var Sales                                = singleData.value[num];
                                var SalesChange                          = loadValue(data.scrb_SalesChange, brandName, num) * 100;
                                var SalesShareInCategory                 = loadValue(data.scrb_SalesShareInCategory, brandName, num) * 100;
                                var MaterialCosts                        = loadValue(data.scrb_MaterialCosts, brandName, num);
                                var CostOfGoodsSold                      = loadValue(data.scrb_CostOfGoodsSold, brandName, num);
                                var DiscontinuedGoodsCost                = loadValue(data.scrb_DiscontinuedGoodsCost, brandName, num);
                                var InventoryHoldingCost                 = loadValue(data.scrb_InventoryHoldingCost, brandName, num);
                                var InternalTransfersCost                = loadValue(data.scrb_InternalTransfersCost, brandName, num);
                                var GrossProfit                          = loadValue(data.scrb_GrossProfit, brandName, num);
                                var GrossProfitChange                    = loadValue(data.scrb_GrossProfitChange, brandName, num) * 100;
                                var GrossProfitMargin                    = loadValue(data.scrb_GrossProfitMargin, brandName, num) * 100;
                                var GrossProfitMarginShare               = loadValue(data.scrb_GrossProfitShareInCategory, brandName, num) * 100;
                                var TradeAndMarketing                    = loadValue(data.scrb_TradeAndMarketing, brandName, num);
                                var AdvertisingOnLine                    = loadValue(data.scrb_AdvertisingOnLine, brandName, num);
                                var AdvertisingOffLine                   = loadValue(data.scrb_AdvertisingOffLine, brandName, num);
                                var TradeSupport                         = loadValue(data.scrb_TradeSupport, brandName, num);
                                var TradeAndMarketingAsPercentageOfSales = loadValue(data.scrb_TradeAndMarketingAsPercentageOfSales, brandName, num) * 100;
                                var TradeAndMarketingShareInCategory     = loadValue(data.scrb_TradeAndMarketingShareInCategory, brandName, num) * 100;
                                var GeneralExpenses                      = loadValue(data.scrb_GeneralExpenses, brandName, num);
                                var Amortisation                         = loadValue(data.scrb_Amortisation, brandName, num);
                                var OperatingProfit                      = loadValue(data.scrb_OperatingProfit, brandName, num);
                                var OperatingProfitChange                = loadValue(data.scrb_OperatingProfitChange, brandName, num) * 100;
                                var OperatingProfitMargin                = loadValue(data.scrb_OperatingProfitMargin, brandName, num) * 100;
                                var OperatingProfitShareInCategory       = loadValue(data.scrb_OperatingProfitShareInCategory, brandName, num) * 100;
                                var Interest                             = loadValue(data.scrb_Interest, brandName, num);
                                var Taxes                                = loadValue(data.scrb_Taxes, brandName, num);
                                var ExceptionalItems                     = loadValue(data.scrb_ExceptionalItems, brandName, num);
                                var NetProfit                            = loadValue(data.scrb_NetProfit, brandName, num);
                                var NetProfitChange                      = loadValue(data.scrb_NetProfitChange, brandName, num) * 100;
                                var NetProfitMargin                      = loadValue(data.scrb_NetProfitMargin, brandName, num) * 100;
                                var NetProfitShareInCategory             = loadValue(data.scrb_NetProfitShareInCategory, brandName, num) * 100;
                                if (category == 1) {
                                    scope.brand1s.push({
                                        'brandName'                            : brandName,
                                        'Sales'                                : Sales,
                                        'SalesChange'                          : SalesChange,
                                        'SalesShareInCategory'                 : SalesShareInCategory,
                                        'MaterialCosts'                        : MaterialCosts,
                                        'CostOfGoodsSold'                      : CostOfGoodsSold,
                                        'DiscontinuedGoodsCost'                : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'                 : InventoryHoldingCost,
                                        'InternalTransfersCost'                : InternalTransfersCost,
                                        'GrossProfit'                          : GrossProfit,
                                        'GrossProfitChange'                    : GrossProfitChange,
                                        'TradeAndMarketing'                    : TradeAndMarketing,
                                        'AdvertisingOnLine'                    : AdvertisingOnLine,
                                        'AdvertisingOffLine'                   : AdvertisingOffLine,
                                        'TradeAndMarketingAsPercentageOfSales' : TradeAndMarketingAsPercentageOfSales,
                                        'TradeAndMarketingShareInCategory'     : TradeAndMarketingShareInCategory,
                                        'GeneralExpenses'                      : GeneralExpenses,
                                        'Amortisation'                         : Amortisation,
                                        'OperatingProfit'                      : OperatingProfit,
                                        'OperatingProfitChange'                : OperatingProfitChange,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitShareInCategory'       : OperatingProfitShareInCategory,
                                        'Interest'                             : Interest,
                                        'Taxes'                                : Taxes,
                                        'ExceptionalItems'                     : ExceptionalItems,
                                        'NetProfit'                            : NetProfit,
                                        'NetProfitChange'                      : NetProfitChange,
                                        'NetProfitMargin'                      : NetProfitMargin,
                                        'NetProfitShareInCategory'             : NetProfitShareInCategory,
                                        'GrossProfitMargin'                    : GrossProfitMargin,
                                        'GrossProfitMarginShare'               : GrossProfitMarginShare,
                                        'TradeSupport'                         : TradeSupport
                                    });
                                } else {
                                    scope.brand2s.push({
                                        'brandName'                            : brandName,
                                        'Sales'                                : Sales,
                                        'SalesChange'                          : SalesChange,
                                        'SalesShareInCategory'                 : SalesShareInCategory,
                                        'MaterialCosts'                        : MaterialCosts,
                                        'CostOfGoodsSold'                      : CostOfGoodsSold,
                                        'DiscontinuedGoodsCost'                : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'                 : InventoryHoldingCost,
                                        'InternalTransfersCost'                : InternalTransfersCost,
                                        'GrossProfit'                          : GrossProfit,
                                        'GrossProfitChange'                    : GrossProfitChange,
                                        'TradeAndMarketing'                    : TradeAndMarketing,
                                        'AdvertisingOnLine'                    : AdvertisingOnLine,
                                        'AdvertisingOffLine'                   : AdvertisingOffLine,
                                        'TradeAndMarketingAsPercentageOfSales' : TradeAndMarketingAsPercentageOfSales,
                                        'TradeAndMarketingShareInCategory'     : TradeAndMarketingShareInCategory,
                                        'GeneralExpenses'                      : GeneralExpenses,
                                        'Amortisation'                         : Amortisation,
                                        'OperatingProfit'                      : OperatingProfit,
                                        'OperatingProfitChange'                : OperatingProfitChange,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitShareInCategory'       : OperatingProfitShareInCategory,
                                        'Interest'                             : Interest,
                                        'Taxes'                                : Taxes,
                                        'ExceptionalItems'                     : ExceptionalItems,
                                        'NetProfit'                            : NetProfit,
                                        'NetProfitChange'                      : NetProfitChange,
                                        'NetProfitMargin'                      : NetProfitMargin,
                                        'NetProfitShareInCategory'             : NetProfitShareInCategory,
                                        'GrossProfitMargin'                    : GrossProfitMargin,
                                        'GrossProfitMarginShare'               : GrossProfitMarginShare,
                                        'TradeSupport'                         : TradeSupport
                                    });
                                }
                            }
                        })
                    }

                    scope.openProductModal = function(brandName, type, size) {
                        var loadVariantValue = function(data, brandName, variantName, num) {
                            var array = _.find(data, function(obj) {
                                return (obj.variantName == variantName && obj.parentBrandName == brandName);
                            });
                            return array.value[num];
                        }
                        var num = 0;
                        scope.variants = [];
                        scope.brandName = brandName;
                        if (type == "BM") {
                            scope.BMShow = true;
                            scope.OLShow = false;
                            num = 0;
                        } else {
                            scope.BMShow = false;
                            scope.OLShow = true;
                            num = 1;
                        }
                        var url = '/SCR-consolidatedProfitAndLoss/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {

                            data.data[0].scrv_Sales.forEach(function(singleData){
                                if (singleData.parentBrandName == brandName) {
                                    var variantName                          = singleData.variantName;
                                    var Sales                                = singleData.value[num];
                                    var SalesChange                          = loadVariantValue(data.data[0].scrv_SalesChange, brandName, variantName, num) * 100;
                                    var SalesShareInCategory                 = loadVariantValue(data.data[0].scrv_SalesShareInCategory, brandName, variantName, num) * 100;
                                    var MaterialCosts                        = loadVariantValue(data.data[0].scrv_MaterialCosts, brandName, variantName, num);
                                    var CostOfGoodsSold                      = loadVariantValue(data.data[0].scrv_CostOfGoodsSold, brandName, variantName, num);
                                    var DiscontinuedGoodsCost                = loadVariantValue(data.data[0].scrv_DiscontinuedGoodsCost, brandName, variantName, num);
                                    var InventoryHoldingCost                 = loadVariantValue(data.data[0].scrv_InventoryHoldingCost, brandName, variantName, num);
                                    var InternalTransfersCost                = loadVariantValue(data.data[0].scrv_InternalTransfersCost, brandName, variantName, num);
                                    var GrossProfit                          = loadVariantValue(data.data[0].scrv_GrossProfit, brandName, variantName, num);
                                    var GrossProfitChange                    = loadVariantValue(data.data[0].scrv_GrossProfitChange, brandName, variantName, num) * 100;
                                    var GrossProfitMargin                    = loadVariantValue(data.data[0].scrv_GrossProfitMargin, brandName, variantName, num) * 100;
                                    var GrossProfitMarginShare               = loadVariantValue(data.data[0].scrv_GrossProfitShareInCategory, brandName, variantName, num) * 100;
                                    var TradeAndMarketing                    = loadVariantValue(data.data[0].scrv_TradeAndMarketing, brandName, variantName, num);
                                    var AdvertisingOnLine                    = loadVariantValue(data.data[0].scrv_AdvertisingOnLine, brandName, variantName, num);
                                    var AdvertisingOffLine                   = loadVariantValue(data.data[0].scrv_AdvertisingOffLine, brandName, variantName, num);
                                    var TradeSupport                         = loadVariantValue(data.data[0].scrv_TradeSupport, brandName, variantName, num);
                                    var TradeAndMarketingAsPercentageOfSales = loadVariantValue(data.data[0].scrv_TradeAndMarketingAsPercentageOfSales, brandName, variantName, num) * 100;
                                    var TradeAndMarketingShareInCategory     = loadVariantValue(data.data[0].scrv_TradeAndMarketingShareInCategory, brandName, variantName, num) * 100;
                                    var GeneralExpenses                      = loadVariantValue(data.data[0].scrv_GeneralExpenses, brandName, variantName, num);
                                    var Amortisation                         = loadVariantValue(data.data[0].scrv_Amortisation, brandName, variantName, num);
                                    var OperatingProfit                      = loadVariantValue(data.data[0].scrv_OperatingProfit, brandName, variantName, num);
                                    var OperatingProfitChange                = loadVariantValue(data.data[0].scrv_OperatingProfitChange, brandName, variantName, num) * 100;
                                    var OperatingProfitMargin                = loadVariantValue(data.data[0].scrv_OperatingProfitMargin, brandName, variantName, num) * 100;
                                    var OperatingProfitShareInCategory       = loadVariantValue(data.data[0].scrv_OperatingProfitShareInCategory, brandName, variantName, num) * 100;
                                    var Interest                             = loadVariantValue(data.data[0].scrv_Interest, brandName, variantName, num);
                                    var Taxes                                = loadVariantValue(data.data[0].scrv_Taxes, brandName, variantName, num);
                                    var ExceptionalItems                     = loadVariantValue(data.data[0].scrv_ExceptionalItems, brandName, variantName, num);
                                    var NetProfit                            = loadVariantValue(data.data[0].scrv_NetProfit, brandName, variantName, num);
                                    var NetProfitChange                      = loadVariantValue(data.data[0].scrv_NetProfitChange, brandName, variantName, num) * 100;
                                    var NetProfitMargin                      = loadVariantValue(data.data[0].scrv_NetProfitMargin, brandName, variantName, num) * 100;
                                    var NetProfitShareInCategory             = loadVariantValue(data.data[0].scrv_NetProfitShareInCategory, brandName, variantName, num) * 100;
                                    scope.variants.push({
                                        'variantName'                          : variantName,
                                        'Sales'                                : Sales,
                                        'SalesChange'                          : SalesChange,
                                        'SalesShareInCategory'                 : SalesShareInCategory,
                                        'MaterialCosts'                        : MaterialCosts,
                                        'CostOfGoodsSold'                      : CostOfGoodsSold,
                                        'DiscontinuedGoodsCost'                : DiscontinuedGoodsCost,
                                        'InventoryHoldingCost'                 : InventoryHoldingCost,
                                        'InternalTransfersCost'                : InternalTransfersCost,
                                        'GrossProfit'                          : GrossProfit,
                                        'GrossProfitChange'                    : GrossProfitChange,
                                        'TradeAndMarketing'                    : TradeAndMarketing,
                                        'AdvertisingOnLine'                    : AdvertisingOnLine,
                                        'AdvertisingOffLine'                   : AdvertisingOffLine,
                                        'TradeAndMarketingAsPercentageOfSales' : TradeAndMarketingAsPercentageOfSales,
                                        'TradeAndMarketingShareInCategory'     : TradeAndMarketingShareInCategory,
                                        'GeneralExpenses'                      : GeneralExpenses,
                                        'Amortisation'                         : Amortisation,
                                        'OperatingProfit'                      : OperatingProfit,
                                        'OperatingProfitChange'                : OperatingProfitChange,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitMargin'                : OperatingProfitMargin,
                                        'OperatingProfitShareInCategory'       : OperatingProfitShareInCategory,
                                        'Interest'                             : Interest,
                                        'Taxes'                                : Taxes,
                                        'ExceptionalItems'                     : ExceptionalItems,
                                        'NetProfit'                            : NetProfit,
                                        'NetProfitChange'                      : NetProfitChange,
                                        'NetProfitMargin'                      : NetProfitMargin,
                                        'NetProfitShareInCategory'             : NetProfitShareInCategory,
                                        'GrossProfitMargin'                    : GrossProfitMargin,
                                        'GrossProfitMarginShare'               : GrossProfitMarginShare,
                                        'TradeSupport'                         : TradeSupport
                                    });
                                }
                            })

                            var modalInstance = $modal.open({
                                templateUrl: '../../partials/modal/supplierBMProduct.html',
                                controller: supplierBMProductModalCtrl,
                                size: size
                            });

                            modalInstance.result.then(function() {
                                console.log('show Product')
                            })
                        }, function() {
                            console.log('fail');
                        });

                    }

                    var supplierBMProductModalCtrl = function($scope, $modalInstance, Label) {
                        $scope.Label     = Label;
                        $scope.variants  = scope.variants;
                        $scope.brandName = scope.brandName;
                        $scope.BMShow    = scope.BMShow;
                        $scope.OLShow    = scope.OLShow;
                        var cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.cancel = cancel;
                    }


                    var getResult = function() {
                        var url = '/SCR-consolidatedProfitAndLoss/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        loadTotal(data);
                        loadBusiness(data, StaticValues.categoryID.ele, 0);
                        loadBusiness(data, StaticValues.categoryID.hea, 0);

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