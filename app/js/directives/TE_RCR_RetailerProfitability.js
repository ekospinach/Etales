define(['directives', 'services'], function(directives) {

    directives.directive('retailerProfitability', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    retailerShow: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/RCR_retailerProfitability.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/RCR-profitabilityBySupplier/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        var factoriesInfo1 = [];
                        var factoriesInfo2 = [];
                        var factoriesInfo3 = [];
                        var factoriesInfo4 = [];
                        var factoriesInfo5 = [];
                        var factoriesInfo6 = [];
                        //factoriesInfo1 =category:1 market:1
                        //factoriesInfo2 =category:1 market:2
                        //factoriesInfo3 =category:1 market:3
                        //factoriesInfo4 =category:2 market:1
                        //factoriesInfo5 =category:2 market:2
                        //factoriesInfo6 =category:2 market:3

                        var marketInfo = [];
                        var array = [];
                        data.forEach(function(singleData){
                            if (singleData.categoryID == 1 && singleData.marketID == 1) {
                                factoriesInfo1[singleData.factoriesID - 1] = singleData.value;
                            }
                            if (singleData.categoryID == 1 && singleData.marketID == 2) {
                                factoriesInfo2[singleData.factoriesID - 1] = singleData.value;
                            }
                            if (singleData.categoryID == 1 && singleData.marketID == 3) {
                                factoriesInfo3[singleData.factoriesID - 1] = singleData.value;
                            }
                            if (singleData.categoryID == 2 && singleData.marketID == 1) {
                                factoriesInfo4[singleData.factoriesID - 1] = singleData.value;
                            }
                            if (singleData.categoryID == 2 && singleData.marketID == 2) {
                                factoriesInfo5[singleData.factoriesID - 1] = singleData.value;
                            }
                            if (singleData.categoryID == 2 && singleData.marketID == 3) {
                                factoriesInfo6[singleData.factoriesID - 1] = singleData.value;
                            }
                        })
                        marketInfo.push({
                            'factoriesInfo': factoriesInfo1,
                        },{
                            'factoriesInfo': factoriesInfo2,
                        },{
                            'factoriesInfo': factoriesInfo3,
                        });
                        array.push({
                            'marketInfo': marketInfo
                        });
                        marketInfo=[];
                        marketInfo.push({
                            'factoriesInfo': factoriesInfo4,
                        },{
                            'factoriesInfo': factoriesInfo5,
                        },{
                            'factoriesInfo': factoriesInfo6,
                        });
                        array.push({
                            'marketInfo': marketInfo
                        });
                        return array;
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        scope.ShelfSpaces = loadValue(data.rcrps_ShelfSpace);
                        scope.NetSales = loadValue(data.rcrps_NetSales);
                        scope.NetSalesPerShelfSpaces = loadValue(data.rcrps_NetSalesPerShelfSpace);
                        scope.NetSalesShares = loadValue(data.rcrps_NetSalesShare);
                        scope.GrossContributions = loadValue(data.rcrps_GrossContribution);
                        scope.GrossContributionPerShelfSpaces = loadValue(data.rcrps_GrossContributionPerShelfSpace);
                        scope.GrossContributionMargins = loadValue(data.rcrps_GrossContributionMargin);
                        scope.GrossContributionShares = loadValue(data.rcrps_GrossContributionShare);
                        scope.PaymentTerms = loadValue(data.rcrps_PaymentTerms);

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