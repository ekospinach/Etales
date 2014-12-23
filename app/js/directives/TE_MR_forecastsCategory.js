define(['directives', 'services'], function(directives) {

    directives.directive('marketForecastsCategory', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_forecastsCategory.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/getMR-forecasts/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        //data:[1,min,max],[2,min.max]...
                        scope.forecastCategorySeries = [{
                            'name': Label.getContent('Elecssories') + '/' + Label.getContent('Rural'),
                            'color': PlayerColor.price,
                            'data': [
                                [1, data.minTotalVolume[StaticValues.category.ele].periodInfo[0].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.ele].periodInfo[0].value[StaticValues.market.rural]],
                                [2, data.minTotalVolume[StaticValues.category.ele].periodInfo[1].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.ele].periodInfo[1].value[StaticValues.market.rural]],
                                [3, data.minTotalVolume[StaticValues.category.ele].periodInfo[2].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.ele].periodInfo[2].value[StaticValues.market.rural]],
                                [4, data.minTotalVolume[StaticValues.category.ele].periodInfo[3].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.ele].periodInfo[3].value[StaticValues.market.rural]],
                                [5, data.minTotalVolume[StaticValues.category.ele].periodInfo[4].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.ele].periodInfo[4].value[StaticValues.market.rural]]
                            ]
                        }, {
                            'name': Label.getContent('Elecssories') + '/' + Label.getContent('Urban'),
                            'color': PlayerColor.value,
                            'data': [
                                [1, data.minTotalVolume[StaticValues.category.ele].periodInfo[0].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.ele].periodInfo[0].value[StaticValues.market.urban]],
                                [2, data.minTotalVolume[StaticValues.category.ele].periodInfo[1].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.ele].periodInfo[1].value[StaticValues.market.urban]],
                                [3, data.minTotalVolume[StaticValues.category.ele].periodInfo[2].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.ele].periodInfo[2].value[StaticValues.market.urban]],
                                [4, data.minTotalVolume[StaticValues.category.ele].periodInfo[3].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.ele].periodInfo[3].value[StaticValues.market.urban]],
                                [5, data.minTotalVolume[StaticValues.category.ele].periodInfo[4].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.ele].periodInfo[4].value[StaticValues.market.urban]]
                            ]
                        }, {
                            'name': Label.getContent('HealthBeauties') + '/' + Label.getContent('Rural'),
                            'color': PlayerColor.fashion,
                            'data': [
                                [1, data.minTotalVolume[StaticValues.category.hea].periodInfo[0].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.hea].periodInfo[0].value[StaticValues.market.rural]],
                                [2, data.minTotalVolume[StaticValues.category.hea].periodInfo[1].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.hea].periodInfo[1].value[StaticValues.market.rural]],
                                [3, data.minTotalVolume[StaticValues.category.hea].periodInfo[2].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.hea].periodInfo[2].value[StaticValues.market.rural]],
                                [4, data.minTotalVolume[StaticValues.category.hea].periodInfo[3].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.hea].periodInfo[3].value[StaticValues.market.rural]],
                                [5, data.minTotalVolume[StaticValues.category.hea].periodInfo[4].value[StaticValues.market.rural], data.maxTotalVolume[StaticValues.category.hea].periodInfo[4].value[StaticValues.market.rural]]
                            ]
                        }, {
                            'name': Label.getContent('HealthBeauties') + '/' + Label.getContent('Urban'),
                            'color': PlayerColor.freaks,
                            'data': [
                                [1, data.minTotalVolume[StaticValues.category.hea].periodInfo[0].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.hea].periodInfo[0].value[StaticValues.market.urban]],
                                [2, data.minTotalVolume[StaticValues.category.hea].periodInfo[1].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.hea].periodInfo[1].value[StaticValues.market.urban]],
                                [3, data.minTotalVolume[StaticValues.category.hea].periodInfo[2].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.hea].periodInfo[2].value[StaticValues.market.urban]],
                                [4, data.minTotalVolume[StaticValues.category.hea].periodInfo[3].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.hea].periodInfo[3].value[StaticValues.market.urban]],
                                [5, data.minTotalVolume[StaticValues.category.hea].periodInfo[4].value[StaticValues.market.urban], data.maxTotalVolume[StaticValues.category.hea].periodInfo[4].value[StaticValues.market.urban]]
                            ]
                        }];
                        scope.segmentYTitle = Label.getContent('Sales Volume') + '(' + Label.getContent("units mln") + ')';
                        scope.segmentXTitle = Label.getContent('Period');
                        var curP = scope.selectedPeriod;
                        scope.categories = ['', curP - 2, curP - 1, curP, curP + 1, curP + 2];
                        scope.myModel = 'ForecastsCategory' + curP;
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