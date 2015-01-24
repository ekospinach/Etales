define(['directives', 'services'], function(directives) {

    directives.directive('retailerUrbanProfit', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', '$modal', 'StaticValues', '$window',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, $modal, StaticValues, $window) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    retailerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/RCR_retailerUrbanProfit.html',
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
                                templateUrl: '../../partials/modal/retailerProfitProduct.html',
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

                    scope.exportExcel = function(category,market) {
                        var data = [],
                            brands = {},
                            categoryID = 0,
                            marketID = 0;
                        if (market == "Urban") {
                            marketID = 1;
                        } else {
                            marketID = 2;
                        }
                        if (category == "Elecssories") {
                            brands = scope.brand1s;
                            categoryID = 1;
                        } else {
                            brands = scope.brand2s;
                            categoryID = 2;
                        }
                        for (var i = 0; i < 28; i++) {
                            data[i] = new Array();
                        }
                        data[0][0]  = '';
                        data[1][0]  = Label.getContent('Sales') + '(' + Label.getContent('$mln') + ')';
                        data[2][0]  = Label.getContent('Cost of Price Promotions') + '(' + Label.getContent('$mln') + ')';
                        data[3][0]  = Label.getContent('Other Compensation') + '(' + Label.getContent('$mln') + ')';
                        data[4][0]  = Label.getContent('Net Sales Value') + '(' + Label.getContent('$mln') + ')';
                        data[5][0]  = Label.getContent('Change from Previous Period') + '(%)';
                        data[6][0]  = Label.getContent('Value Share in Category') + '(%)';
                        data[7][0]  = Label.getContent('Cost of Goods Sold') + '(' + Label.getContent('$mln') + ')';
                        data[8][0]  = Label.getContent('Value of Quantity Discounts') + '(' + Label.getContent('$mln') + ')';
                        data[9][0]  = Label.getContent('Value of Performance Bonus') + '(' + Label.getContent('$mln') + ')';
                        data[10][0] = Label.getContent('Discontinued Goods Cost') + '(' + Label.getContent('$mln') + ')';
                        data[11][0] = Label.getContent('Inventory Holding Cost') + '(' + Label.getContent('$mln') + ')';
                        data[12][0] = Label.getContent('Gross Profit') + '(' + Label.getContent('$mln') + ')';
                        data[13][0] = Label.getContent('Change from Previous Period') + '(%)';
                        data[14][0] = Label.getContent('Gross Profit Margin') + '(%)';
                        data[15][0] = Label.getContent('Share of Gross Profit/Loss in Category') + '(%)';
                        data[16][0] = Label.getContent('General Expenses') + '(' + Label.getContent('$mln') + ')';
                        data[17][0] = Label.getContent('Operating Profit') + '(' + Label.getContent('$mln') + ')';
                        data[18][0] = Label.getContent('Change from Previous Period') + '(%)';
                        data[19][0] = Label.getContent('Operating Profit Margin') + '(%)';
                        data[20][0] = Label.getContent('Share of Operating Profit/Loss in Category') + '(%)';
                        data[21][0] = Label.getContent('Interest') + '(' + Label.getContent('$mln') + ')';
                        data[22][0] = Label.getContent('Taxes') + '(' + Label.getContent('$mln') + ')';
                        data[23][0] = Label.getContent('Exceptional Costs/Profits') + '(' + Label.getContent('$mln') + ')';
                        data[24][0] = Label.getContent('Net Profit') + '(' + Label.getContent('$mln') + ')';
                        data[25][0] = Label.getContent('Change from Previous Period') + '(%)';
                        data[26][0] = Label.getContent('Net Profit Margin') + '(%)';
                        data[27][0] = Label.getContent('Share of Net Profit/Loss in Category') + '(%)';


                        data[0][1]  = Label.getContent('TOTAL');
                        data[1][1]  = scope.Sales[categoryID - 1][marketID - 1].toFixed(1);
                        data[2][1]  = scope.PromotionsCost[categoryID - 1][marketID - 1].toFixed(1);
                        data[3][1]  = scope.OtherCompensation[categoryID - 1][marketID - 1].toFixed(1);
                        data[4][1]  = scope.NetSales[categoryID - 1][marketID - 1].toFixed(1);
                        data[5][1]  = (scope.NetSalesChange[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[6][1]  = 100;
                        data[7][1]  = scope.CostOfGoodsSold[categoryID - 1][marketID - 1].toFixed(1);
                        data[8][1]  = scope.ValueOfQuantityDiscounts[categoryID - 1][marketID - 1].toFixed(1);
                        data[9][1]  = scope.ValueOfPerformanceBonus[categoryID - 1][marketID - 1].toFixed(1);
                        data[10][1] = scope.DiscontinuedGoodsCost[categoryID - 1][marketID - 1].toFixed(1);
                        data[11][1] = scope.InventoryHoldingCost[categoryID - 1][marketID - 1].toFixed(1);
                        data[12][1] = scope.GrossProfit[categoryID - 1][marketID - 1].toFixed(1);
                        data[13][1] = (scope.GrossProfitChange[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[14][1] = (scope.GrossProfitMargin[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[15][1] = 100;
                        data[16][1] = scope.GeneralExpenses[categoryID - 1][marketID - 1].toFixed(1);
                        data[17][1] = scope.OperatingProfit[categoryID - 1][marketID - 1].toFixed(1);
                        data[18][1] = (scope.OperatingProfitChange[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[19][1] = (scope.OperatingProfitMargin[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[20][1] = 100;
                        data[21][1] = scope.Interest[categoryID - 1][marketID - 1].toFixed(1);
                        data[22][1] = scope.Taxes[categoryID - 1][marketID - 1].toFixed(1);
                        data[23][1] = scope.ExceptionalItems[categoryID - 1][marketID - 1].toFixed(1);
                        data[24][1] = scope.NetProfit[categoryID - 1][marketID - 1].toFixed(1);
                        data[25][1] = (scope.NetProfitChange[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[26][1] = (scope.NetProfitMargin[categoryID - 1][marketID - 1] * 100).toFixed(1);
                        data[27][1] = 100;

                        for (var i = 0; i < brands.length; i++) {
                            data[0][i + 2]  = brands[i].brandName;
                            data[1][i + 2]  = brands[i].Sales.toFixed(1);
                            data[2][i + 2]  = brands[i].PromotionsCost.toFixed(1);
                            data[3][i + 2]  = brands[i].OtherCompensation.toFixed(1);
                            data[4][i + 2]  = brands[i].NetSales.toFixed(1);
                            data[5][i + 2]  = brands[i].NetSalesChange.toFixed(1);
                            data[6][i + 2]  = brands[i].NetSalesShareInCategory.toFixed(1);
                            data[7][i + 2]  = brands[i].CostOfGoodsSold.toFixed(1);
                            data[8][i + 2]  = brands[i].ValueOfQuantityDiscounts.toFixed(1);
                            data[9][i + 2]  = brands[i].ValueOfPerformanceBonus.toFixed(1);
                            data[10][i + 2] = brands[i].DiscontinuedGoodsCost.toFixed(1);
                            data[11][i + 2] = brands[i].InventoryHoldingCost.toFixed(1);
                            data[12][i + 2] = brands[i].GrossProfit.toFixed(1);
                            data[13][i + 2] = brands[i].GrossProfitChange.toFixed(1);
                            data[14][i + 2] = brands[i].GrossProfitMargin.toFixed(1);
                            data[15][i + 2] = brands[i].GrossProfitShareInCategory.toFixed(1);
                            data[16][i + 2] = brands[i].GeneralExpenses.toFixed(1);
                            data[17][i + 2] = brands[i].OperatingProfit.toFixed(1);
                            data[18][i + 2] = brands[i].OperatingProfitChange.toFixed(1);
                            data[19][i + 2] = brands[i].OperatingProfitMargin.toFixed(1);
                            data[20][i + 2] = brands[i].OperatingProfitShareInCategory.toFixed(1);
                            data[21][i + 2] = brands[i].Interest.toFixed(1);
                            data[22][i + 2] = brands[i].Taxes.toFixed(1);
                            data[23][i + 2] = brands[i].ExceptionalItems.toFixed(1);
                            data[24][i + 2] = brands[i].NetProfit.toFixed(1);
                            data[25][i + 2] = brands[i].NetProfitChange.toFixed(1);
                            data[26][i + 2] = brands[i].NetProfitMargin.toFixed(1);
                            data[27][i + 2] = brands[i].NetProfitShareInCategory.toFixed(1);

                        }
                        var postData = {
                            name: SeminarInfo.getSelectedSeminar().seminarCode + '_Period' + scope.selectedPeriod + '_' + market + '_R' + scope.selectedPlayer + '_' + category,
                            data: data
                        };
                        console.log(postData);
                        $http({
                            method: 'POST',
                            url: '/excel',
                            data: postData
                        }).then(function(data) {

                            if (data.data.msg == "success") {
                                var path = data.data.path.substr(3);
                                $window.location = path;
                            }

                        }, function() {
                            console.log('fail');
                        });
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