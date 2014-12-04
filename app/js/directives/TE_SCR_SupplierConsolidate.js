define(['directives', 'services'], function(directives) {

    directives.directive('supplierConsolidate', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    producerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SCR_supplierConsolidate.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
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
                        scope.sales                  = data.scrpl_Sales;
                        scope.salesChanges           = data.scrpl_SalesChange;
                        scope.materialCosts          = data.scrpl_MaterialCosts;
                        scope.costGoodsSolds         = data.scrpl_CostOfGoodsSold;
                        scope.discontinuedGoodsCosts = data.scrpl_DiscontinuedGoodsCost;
                        scope.holdingCosts           = data.scrpl_InventoryHoldingCost;
                        scope.eMallCommissions       = data.scrpl_eMallCommission;
                        scope.ShippingCosts          = data.scrpl_ShippingCost;
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