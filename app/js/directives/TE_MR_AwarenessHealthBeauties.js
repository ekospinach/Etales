define(['directives', 'services'], function(directives) {

    directives.directive('marketAwarenessHealthBeauties', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_awarenessHealthBeauties.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadAwareness = function(data, category, market) {
                        scope.brandNames = new Array();
                        var count = 0;
                        /*
                        if latestAwareness>=previousAwareness
                        then value =previousAwareness;
                        increase=latestAwareness-previousAwareness;
                        drop=0;
                        else
                        then value =latestAwareness;
                        drop=previousAwareness-latestAwareness;
                        increase=0;
                    */
                        data.brandInfo.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                scope.brandNames[count] = singleData.brandName;
                                switch (market) {
                                    case 2:
                                        if (singleData.latestAwareness >= singleData.previousAwareness) {
                                            scope.valueRural[count] = singleData.previousAwareness * 100;
                                            scope.increaseRural[count] = (singleData.latestAwareness - singleData.previousAwareness) * 100;
                                            scope.dropRural[count] = 0;
                                        } else {
                                            scope.valueRural[count] = singleData.latestAwareness * 100;
                                            scope.dropRural[count] = (singleData.previousAwareness - singleData.latestAwareness) * 100;
                                            scope.increaseRural[count] = 0;
                                        };
                                        break;
                                    case 1:
                                        if (singleData.latestAwareness >= singleData.previousAwareness) {
                                            scope.valueUrban[count] = singleData.previousAwareness * 100;
                                            scope.increaseUrban[count] = (singleData.latestAwareness - singleData.previousAwareness) * 100;
                                            scope.dropUrban[count] = 0;
                                        } else {
                                            scope.valueUrban[count] = singleData.latestAwareness * 100;
                                            scope.dropUrban[count] = (singleData.previousAwareness - singleData.latestAwareness) * 100;
                                            scope.increaseUrban[count] = 0;
                                        };
                                        break;

                                }
                                count++;
                            }
                        })
                        switch (market) {
                            case 2:
                                scope.awarenessHealthBeauties1Series = [{
                                    name: Label.getContent('Drop'),
                                    data: scope.dropRural,
                                    color: PlayerColor.drop
                                }, {
                                    name: Label.getContent('Increase'),
                                    data: scope.increaseRural,
                                    color: PlayerColor.increase
                                }, {
                                    name: Label.getContent('Awareness Value'),
                                    data: scope.valueRural,
                                    color: PlayerColor.awareness
                                }];
                                scope.awarenessHealthBeauties1Config = {
                                    options: {
                                        chart: {
                                            type: 'bar'
                                        },
                                        tooltip: {
                                            valueDecimals: 2
                                        },
                                        plotOptions: {
                                            series: {
                                                stacking: 'normal'
                                            }
                                        },
                                        xAxis: {
                                            categories: scope.brandNames
                                        },
                                        yAxis: {
                                            title: {
                                                text: '%'
                                            }
                                        }
                                    },
                                    series: scope.awarenessHealthBeauties1Series,
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: Label.getContent('Rural')
                                    }
                                };
                                break;
                            case 1:
                                scope.awarenessHealthBeauties2Series = [{
                                    name: Label.getContent('Drop'),
                                    data: scope.dropUrban,
                                    color: PlayerColor.drop
                                }, {
                                    name: Label.getContent('Increase'),
                                    data: scope.increaseUrban,
                                    color: PlayerColor.increase
                                }, {
                                    name: Label.getContent('Awareness Value'),
                                    data: scope.valueUrban,
                                    color: PlayerColor.awareness
                                }];
                                scope.awarenessHealthBeauties2Config = {
                                    options: {
                                        chart: {
                                            type: 'bar'
                                        },
                                        tooltip: {
                                            valueDecimals: 2
                                        },
                                        plotOptions: {
                                            series: {
                                                stacking: 'normal'
                                            }
                                        },
                                        xAxis: {
                                            categories: scope.brandNames
                                        },
                                        yAxis: {
                                            title: {
                                                text: '%'
                                            }
                                        }
                                    },
                                    series: scope.awarenessHealthBeauties2Series,
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: Label.getContent('Urban')
                                    }
                                };
                                break;
                        }
                    }

                    var getResult = function() {
                        var url = '/getMR-awarenessEvolution/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        scope.valueRural    = [];
                        scope.valueUrban    = [];
                        scope.dropRural     = [];
                        scope.dropUrban     = [];
                        scope.increaseRural = [];
                        scope.increaseUrban = [];
                        loadAwareness(data, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadAwareness(data, StaticValues.categoryID.hea, StaticValues.marketID.rural);
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