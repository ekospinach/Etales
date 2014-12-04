define(['directives', 'services'], function(directives) {

    directives.directive('marketBMHealthBeauties', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_bMHealthBeauties.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadRetailerPrice = function(data, category) {
                        data.variantInfo.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category) {
                                var fullName = singleData.parentBrandName + singleData.variantName;
                                var rural1Value = rural1ValueChange = urban1Value = urban1ValueChange = rural2Value = rural2ValueChange = urban2Value = urban2ValueChange = 0;
                                /*
                                urban=latestNetMarketPrice[0]
                                rural=latestNetMarketPrice[1]
                                urbanChange=netMarketPriceChange[0]
                                ruralChange=netMarketPriceChange[1]
                                */
                                if (singleData.accountInfo[StaticValues.player.r1] != undefined) {
                                    rural1Value = singleData.accountInfo[StaticValues.player.r1].latestNetMarketPrice[StaticValues.market.rural];
                                    rural1ValueChange = singleData.accountInfo[StaticValues.player.r1].netMarketPriceChange[StaticValues.market.rural] * 100;
                                    urban1Value = singleData.accountInfo[StaticValues.player.r1].latestNetMarketPrice[StaticValues.market.urban];
                                    urban1ValueChange = singleData.accountInfo[StaticValues.player.r1].netMarketPriceChange[StaticValues.market.urban] * 100;
                                }
                                if (singleData.accountInfo[StaticValues.player.r2] != undefined) {
                                    rural2Value = singleData.accountInfo[StaticValues.player.r2].latestNetMarketPrice[StaticValues.market.rural];
                                    rural2ValueChange = singleData.accountInfo[StaticValues.player.r2].netMarketPriceChange[StaticValues.market.rural] * 100;
                                    urban2Value = singleData.accountInfo[StaticValues.player.r2].latestNetMarketPrice[StaticValues.market.urban];
                                    urban2ValueChange = singleData.accountInfo[StaticValues.player.r2].netMarketPriceChange[StaticValues.market.urban] * 100;
                                }
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.player1s.push({
                                            'fullName': fullName,
                                            'rural1Value': rural1Value,
                                            'rural1ValueChange': rural1ValueChange,
                                            'urban1Value': urban1Value,
                                            'urban1ValueChange': urban1ValueChange,
                                            'rural2Value': rural2Value,
                                            'rural2ValueChange': rural2ValueChange,
                                            'urban2Value': urban2Value,
                                            'urban2ValueChange': urban2ValueChange
                                        });
                                        break;
                                    case 2:
                                        scope.player2s.push({
                                            'fullName': fullName,
                                            'rural1Value': rural1Value,
                                            'rural1ValueChange': rural1ValueChange,
                                            'urban1Value': urban1Value,
                                            'urban1ValueChange': urban1ValueChange,
                                            'rural2Value': rural2Value,
                                            'rural2ValueChange': rural2ValueChange,
                                            'urban2Value': urban2Value,
                                            'urban2ValueChange': urban2ValueChange
                                        });
                                        break;
                                    case 3:
                                        scope.player3s.push({
                                            'fullName': fullName,
                                            'rural1Value': rural1Value,
                                            'rural1ValueChange': rural1ValueChange,
                                            'urban1Value': urban1Value,
                                            'urban1ValueChange': urban1ValueChange,
                                            'rural2Value': rural2Value,
                                            'rural2ValueChange': rural2ValueChange,
                                            'urban2Value': urban2Value,
                                            'urban2ValueChange': urban2ValueChange
                                        });
                                        break;
                                    case 5:
                                        scope.player5s.push({
                                            'fullName': fullName,
                                            'rural1Value': rural1Value,
                                            'rural1ValueChange': rural1ValueChange,
                                            'urban1Value': urban1Value,
                                            'urban1ValueChange': urban1ValueChange,
                                            'rural2Value': rural2Value,
                                            'rural2ValueChange': rural2ValueChange,
                                            'urban2Value': urban2Value,
                                            'urban2ValueChange': urban2ValueChange
                                        });
                                        break;
                                    case 6:
                                        scope.player6s.push({
                                            'fullName': fullName,
                                            'rural1Value': rural1Value,
                                            'rural1ValueChange': rural1ValueChange,
                                            'urban1Value': urban1Value,
                                            'urban1ValueChange': urban1ValueChange,
                                            'rural2Value': rural2Value,
                                            'rural2ValueChange': rural2ValueChange,
                                            'urban2Value': urban2Value,
                                            'urban2ValueChange': urban2ValueChange
                                        });
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/getMR-netMarketPrices/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        scope.player1s = [];
                        scope.player2s = [];
                        scope.player3s = [];
                        scope.player5s = [];
                        scope.player6s = [];
                        scope.nameColor = '#F2DEDE' //红
                        loadRetailerPrice(data, StaticValues.categoryID.hea);
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
                        if (newValue != oldValue && scope.isPageShown) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})