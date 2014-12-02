define(['directives', 'services'], function(directives) {

    directives.directive('retailerConsolidate', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    retailerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/RCR_retailerConsolidate.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
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

                    var loadValue = function(data) {
                        var array = [[],[],[]];
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

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        //loadValue return array: array[category-1][market-1]
                        scope.Sales                    = loadValue(data.rcrpl_Sales);
                        scope.PromotionsCost           = loadValue(data.rcrpl_PromotionsCost);
                        scope.OtherCompensation        = loadValue(data.rcrpl_OtherCompensation);
                        scope.NetSales                 = loadValue(data.rcrpl_NetSales);
                        scope.NetSalesChange           = loadValue(data.rcrpl_NetSalesChange);
                        scope.CostOfGoodsSold          = loadValue(data.rcrpl_CostOfGoodsSold);
                        scope.ValueOfQuantityDiscounts = loadValue(data.rcrpl_ValueOfQuantityDiscounts);
                        scope.ValueOfPerformanceBonus  = loadValue(data.rcrpl_ValueOfPerformanceBonus);
                        scope.DiscontinuedGoodsCost    = loadValue(data.rcrpl_DiscontinuedGoodsCost);
                        scope.InventoryHoldingCost     = loadValue(data.rcrpl_InventoryHoldingCost);
                        scope.GrossProfit              = loadValue(data.rcrpl_GrossProfit);
                        scope.GrossProfitChange        = loadValue(data.rcrpl_GrossProfitChange);
                        scope.GrossProfitMargin        = loadValue(data.rcrpl_GrossProfitMargin);
                        scope.GeneralExpenses          = loadValue(data.rcrpl_GeneralExpenses);
                        scope.OperatingProfit          = loadValue(data.rcrpl_OperatingProfit);
                        scope.OperatingProfitChange    = loadValue(data.rcrpl_OperatingProfitChange);
                        scope.OperatingProfitMargin    = loadValue(data.rcrpl_OperatingProfitMargin);
                        scope.Interest                 = loadValue(data.rcrpl_Interest);
                        scope.Taxes                    = loadValue(data.rcrpl_Taxes);
                        scope.ExceptionalItems         = loadValue(data.rcrpl_ExceptionalItems);
                        scope.NetProfit                = loadValue(data.rcrpl_NetProfit);
                        scope.NetProfitChange          = loadValue(data.rcrpl_NetProfitChange);
                        scope.NetProfitMargin          = loadValue(data.rcrpl_NetProfitMargin);
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