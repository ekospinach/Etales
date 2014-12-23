define(['directives', 'services'], function(directives) {

    directives.directive('retailerKey', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
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
                templateUrl: 'singleReportTemplate/RCR_retailerKey.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/RCR-keyPerformanceIndicators/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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

                    var loadValue = function(data, category, market) {
                        //return the value find from data where obj.categoryID=category and obj.marketID=market
                        var array = _.find(data, function(obj) {
                            return ((obj.categoryID == category) && (obj.marketID == market));
                        });
                        return array.value;
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        var VolumeRotationIndex = [[],[],[]];
                        var ValueRotationIndex  = [[],[],[]];
                        var ProfitabilityIndex  = [[],[],[]];
                        var StockCover          = [[],[],[]];
                        var bm                  = [[],[],[]];
                        var all                 = [[],[],[]];
                        
                        var ShoppersShare       = [];
                        var value               = [];

                        data.rcrkpi_VolumeRotationIndex.forEach(function(singleData){
                            if (singleData.categoryID == 1 && singleData.marketID == 1) {
                                //make sure that the following find function won't find this one
                                singleData.categoryID                                                     = -1;
                                singleData.marketID                                                       = -1;
                                
                                VolumeRotationIndex[StaticValues.category.ele][StaticValues.market.urban] = singleData.value;
                                VolumeRotationIndex[StaticValues.category.ele][StaticValues.market.rural] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                                VolumeRotationIndex[StaticValues.category.ele][StaticValues.market.total] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.ele, StaticValues.marketID.total);
                                
                                ValueRotationIndex[StaticValues.category.ele][StaticValues.market.urban]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.ele, StaticValues.marketID.urban);
                                ValueRotationIndex[StaticValues.category.ele][StaticValues.market.rural]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                                ValueRotationIndex[StaticValues.category.ele][StaticValues.market.total]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.ele, StaticValues.marketID.total);
                                
                                ProfitabilityIndex[StaticValues.category.ele][StaticValues.market.urban]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.ele, StaticValues.marketID.urban);
                                ProfitabilityIndex[StaticValues.category.ele][StaticValues.market.rural]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                                ProfitabilityIndex[StaticValues.category.ele][StaticValues.market.total]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.ele, StaticValues.marketID.total);
                                
                                StockCover[StaticValues.category.ele][StaticValues.market.urban]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.ele, StaticValues.marketID.urban);
                                StockCover[StaticValues.category.ele][StaticValues.market.rural]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                                StockCover[StaticValues.category.ele][StaticValues.market.total]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.ele, StaticValues.marketID.total);
                                
                                bm[StaticValues.category.ele][StaticValues.market.urban]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.urban) * 100;
                                bm[StaticValues.category.ele][StaticValues.market.rural]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.rural) * 100;
                                bm[StaticValues.category.ele][StaticValues.market.total]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.total) * 100;
                                
                                all[StaticValues.category.ele][StaticValues.market.urban]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.urban) * 100;
                                all[StaticValues.category.ele][StaticValues.market.rural]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.rural) * 100;
                                all[StaticValues.category.ele][StaticValues.market.total]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.ele, StaticValues.marketID.total) * 100;
                            }
                            if (singleData.categoryID == 2 && singleData.marketID == 1) {
                                singleData.categoryID                                                     = -1;
                                singleData.marketID                                                       = -1;
                                
                                VolumeRotationIndex[StaticValues.category.hea][StaticValues.market.urban] = singleData.value;
                                VolumeRotationIndex[StaticValues.category.hea][StaticValues.market.rural] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                                VolumeRotationIndex[StaticValues.category.hea][StaticValues.market.total] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.hea, StaticValues.marketID.total);
                                
                                ValueRotationIndex[StaticValues.category.hea][StaticValues.market.urban]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                                ValueRotationIndex[StaticValues.category.hea][StaticValues.market.rural]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                                ValueRotationIndex[StaticValues.category.hea][StaticValues.market.total]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.hea, StaticValues.marketID.total);
                                
                                ProfitabilityIndex[StaticValues.category.hea][StaticValues.market.urban]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                                ProfitabilityIndex[StaticValues.category.hea][StaticValues.market.rural]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                                ProfitabilityIndex[StaticValues.category.hea][StaticValues.market.total]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.hea, StaticValues.marketID.total);
                                
                                StockCover[StaticValues.category.hea][StaticValues.market.urban]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                                StockCover[StaticValues.category.hea][StaticValues.market.rural]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                                StockCover[StaticValues.category.hea][StaticValues.market.total]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.hea, StaticValues.marketID.total);
                                
                                bm[StaticValues.category.hea][StaticValues.market.urban]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.urban) * 100;
                                bm[StaticValues.category.hea][StaticValues.market.rural]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.rural) * 100;
                                bm[StaticValues.category.hea][StaticValues.market.total]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.total) * 100;
                                
                                all[StaticValues.category.hea][StaticValues.market.urban]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.urban) * 100;
                                all[StaticValues.category.hea][StaticValues.market.rural]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.rural) * 100;
                                all[StaticValues.category.hea][StaticValues.market.total]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.hea, StaticValues.marketID.total) * 100;

                            }
                            if (singleData.categoryID == 3 && singleData.marketID == 1) {
                                singleData.categoryID                                                       = -1;
                                singleData.marketID                                                         = -1;
                                
                                VolumeRotationIndex[StaticValues.category.total][StaticValues.market.urban] = singleData.value;
                                VolumeRotationIndex[StaticValues.category.total][StaticValues.market.rural] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.total, StaticValues.marketID.rural);
                                VolumeRotationIndex[StaticValues.category.total][StaticValues.market.total] = loadValue(data.rcrkpi_VolumeRotationIndex, StaticValues.categoryID.total, StaticValues.marketID.total);
                                
                                ValueRotationIndex[StaticValues.category.total][StaticValues.market.urban]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.total, StaticValues.marketID.urban);
                                ValueRotationIndex[StaticValues.category.total][StaticValues.market.rural]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.total, StaticValues.marketID.rural);
                                ValueRotationIndex[StaticValues.category.total][StaticValues.market.total]  = loadValue(data.rcrkpi_ValueRotationIndex, StaticValues.categoryID.total, StaticValues.marketID.total);
                                
                                ProfitabilityIndex[StaticValues.category.total][StaticValues.market.urban]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.total, StaticValues.marketID.urban);
                                ProfitabilityIndex[StaticValues.category.total][StaticValues.market.rural]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.total, StaticValues.marketID.rural);
                                ProfitabilityIndex[StaticValues.category.total][StaticValues.market.total]  = loadValue(data.rcrkpi_ProfitabilityIndex, StaticValues.categoryID.total, StaticValues.marketID.total);
                                
                                StockCover[StaticValues.category.total][StaticValues.market.urban]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.total, StaticValues.marketID.urban);
                                StockCover[StaticValues.category.total][StaticValues.market.rural]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.total, StaticValues.marketID.rural);
                                StockCover[StaticValues.category.total][StaticValues.market.total]          = loadValue(data.rcrkpi_StockCover, StaticValues.categoryID.total, StaticValues.marketID.total);
                                
                                bm[StaticValues.category.total][StaticValues.market.urban]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.urban) * 100;
                                bm[StaticValues.category.total][StaticValues.market.rural]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.rural) * 100;
                                bm[StaticValues.category.total][StaticValues.market.total]                  = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.bm].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.total) * 100;
                                
                                all[StaticValues.category.total][StaticValues.market.urban]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.urban) * 100;
                                all[StaticValues.category.total][StaticValues.market.rural]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.rural) * 100;
                                all[StaticValues.category.total][StaticValues.market.total]                 = loadValue(data.rcrkpi_ShoppersShare[StaticValues.shopper.all].categoryInfo, StaticValues.categoryID.total, StaticValues.marketID.total) * 100;
                            }
                        })

                        var newData = [];
                        newData.push({
                            'VolumeRotationIndex' : VolumeRotationIndex,
                            'ValueRotationIndex'  : ValueRotationIndex,
                            'ProfitabilityIndex'  : ProfitabilityIndex,
                            'StockCover'          : StockCover,
                            'BM'                  : bm,
                            'All'                 : all
                        });
                        scope.data = newData[0];

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