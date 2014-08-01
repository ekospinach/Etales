define(['directives', 'services'], function(directives) {

    directives.directive('supplierMarketResearchOrders', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPlayer: '=',
                    selectedPeriod: '=',
                    isPortfolioDecisionCommitted:'=',
                    isContractDeal:'=',
                    isContractFinalized:'=',
                    isDecisionCommitted:'='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SD_marketResearchOrders.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var reportStatus = {};
                        var prices = {};
                        var url = '/getSeminarReportPurchaseStatus/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            reportStatus = data.data;
                            url = '/getReportPrice/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                            //return organiseArray(data);
                        }).then(function(data) {
                            prices = data.data;
                            return organiseArray(reportStatus, prices)
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        });
                    }



                    var organiseArray = function(reportStatus, prices) {
                        var deferred = $q.defer();

                        var playDatas = new Array();
                        playDatas.push({
                            'name': 'Awareness',
                            'realName': 'awareness',
                            'reportPrice': prices[0],
                            'playerStatus': reportStatus.awareness
                        });
                        playDatas.push({
                            'name': 'Brand Perceptions',
                            'realName': 'brandPerceptions',
                            'reportPrice': prices[1],
                            'playerStatus': reportStatus.brandPerceptions
                        });
                        playDatas.push({
                            'name': 'Retailer Perceptions',
                            'realName': 'retailerPerceptions',
                            'reportPrice': prices[2],
                            'playerStatus': reportStatus.retailerPerceptions
                        });
                        playDatas.push({
                            'name': 'Market Share By Consumer Segment',
                            'realName': 'marketShareByConsumerSegment',
                            'reportPrice': prices[3],
                            'playerStatus': reportStatus.marketShareByConsumerSegment
                        });
                        playDatas.push({
                            'name': 'Sales By Consumer Segment',
                            'realName': 'salesByConsumerSegment',
                            'reportPrice': prices[4],
                            'playerStatus': reportStatus.salesByConsumerSegment
                        });
                        playDatas.push({
                            'name': 'Market Share ByShopper Segment',
                            'realName': 'marketShareByShopperSegment',
                            'reportPrice': prices[5],
                            'playerStatus': reportStatus.marketShareByShopperSegment
                        });
                        playDatas.push({
                            'name': 'Sales By Shopper Segment',
                            'realName': 'salesByShopperSegment',
                            'reportPrice': prices[6],
                            'playerStatus': reportStatus.salesByShopperSegment
                        });
                        playDatas.push({
                            'name': 'BM Retailer Prices',
                            'realName': 'BMRetailerPrices',
                            'reportPrice': prices[7],
                            'playerStatus': reportStatus.BMRetailerPrices
                        });
                        playDatas.push({
                            'name': 'Promotion Intensity',
                            'realName': 'promotionIntensity',
                            'reportPrice': prices[8],
                            'playerStatus': reportStatus.promotionIntensity
                        });
                        playDatas.push({
                            'name': 'Supplier Intelligence',
                            'realName': 'supplierIntelligence',
                            'reportPrice': prices[9],
                            'playerStatus': reportStatus.supplierIntelligence
                        });
                        playDatas.push({
                            'name': 'Retailer Intelligence',
                            'realName': 'retailerIntelligence',
                            'reportPrice': prices[10],
                            'playerStatus': reportStatus.retailerIntelligence
                        });
                        playDatas.push({
                            'name': 'Forecasts',
                            'realName': 'forecasts',
                            'reportPrice': prices[11],
                            'playerStatus': reportStatus.forecasts
                        });
                        playDatas.push({
                            'name': 'Sales By Channel',
                            'realName': 'salesByChannel',
                            'reportPrice': prices[12],
                            'playerStatus': reportStatus.salesByChannel
                        });

                        scope.playDatas = playDatas;

                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }


                    scope.submitOrder = function(name, value) {
                        var postData = {
                            player: 'Producer',
                            playerID: scope.selectedPlayer,
                            period: scope.selectedPeriod,
                            seminarCode: SeminarInfo.getSelectedSeminar().seminarCode,
                            name: name,
                            value: value
                        }
                        $http({
                            method: 'POST',
                            url: '/submitOrder',
                            data: postData
                        }).then(function(data) {
                            console.log('success');
                        }, function() {
                            console.log('fail');
                        })
                    }

                    scope.checkBudget = function(price, value) {
                        var d = $q.defer();
                        var categoryID = 0,
                            max = 0,
                            producerExpend = 0,
                            ContractExpend = 0,
                            availableBudgetLeft = 0,
                            reportExpend = 0;
                        if (value) {
                            var url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + parseInt(scope.selectedPlayer);
                            $http({
                                method: 'GET',
                                url: url
                            }).then(function(data) {
                                max = data.data.budgetAvailable + data.data.budgetSpentToDate;
                                url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(scope.selectedPlayer) + '/brandName/location/1';
                                return $http({
                                    method: 'GET',
                                    url: url,
                                });
                            }).then(function(data) {
                                producerExpend = data.data.result;
                                url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/brandName/varName';
                                return $http({
                                    method: 'GET',
                                    url: url
                                });
                            }).then(function(data) {
                                ContractExpend = data.data.result;
                                url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + scope.selectedPlayer;
                                return $http({
                                    method: 'GET',
                                    url: url
                                });
                            }).then(function(data) {
                                reportExpend = data.data.result;
                                availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                                
                                if (availableBudgetLeft < price) {
                                    d.resolve(Label.getContent('Not enough budget'));
                                } else {
                                    d.resolve();
                                }
                            }, function(data) {
                                console.log('fail');
                            })

                        } else {
                            d.resolve();
                        }
                        return d.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    })

                    scope.$on('producerMarketResearchOrdersChanged', function(event, data, newSeminarData) {
                        getResult();
                    });

                }
            }
        }
    ])
})