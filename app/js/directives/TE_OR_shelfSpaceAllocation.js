define(['directives', 'services'], function(directives) {

    directives.directive('overviewShelfSpaceAllocation', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    feedBack: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/OR_shelfSpaceAllocation.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        console.log('initializePage OR_shelfSpaceAllocation small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        //if(scope.feedBack!=undefined&&scope.shopperReady)
                        getResult();
                    }

                    var getResult = function() {
                        var currentCategories = [];
                        for (var i = -3; i <= scope.selectedPeriod; i++) {
                            currentCategories.push(i);
                        }
                        /*highchart data init start*/
                        var currentShelfSpaceElecssories = new Array({
                            name: Label.getContent('Supplier') + '-1',
                            data: [],
                            color: PlayerColor.s1,
                            actorID: 1
                        }, {
                            name: Label.getContent('Supplier') + '-2',
                            data: [],
                            color: PlayerColor.s2,
                            actorID: 2
                        }, {
                            name: Label.getContent('Supplier') + '-3',
                            data: [],
                            color: PlayerColor.s3,
                            actorID: 3
                        }, {
                            name: Label.getContent('Supplier') + '-4',
                            data: [],
                            color: PlayerColor.s4,
                            actorID: 4
                        }, {
                            name: Label.getContent('Retailer') + '-1',
                            data: [],
                            color: PlayerColor.r1,
                            actorID: 5
                        }, {
                            name: Label.getContent('Retailer') + '-2',
                            data: [],
                            color: PlayerColor.r2,
                            actorID: 6
                        }, {
                            name: Label.getContent('Retailer') + '-3',
                            data: [],
                            color: PlayerColor.r3,
                            actorID: 7
                        });
                        var currentShelfSpaceHealthBeauties = new Array({
                            name: Label.getContent('Supplier') + '-1',
                            data: [],
                            color: PlayerColor.s1,
                            actorID: 1
                        }, {
                            name: Label.getContent('Supplier') + '-2',
                            data: [],
                            color: PlayerColor.s2,
                            actorID: 2
                        }, {
                            name: Label.getContent('Supplier') + '-3',
                            data: [],
                            color: PlayerColor.s3,
                            actorID: 3
                        }, {
                            name: Label.getContent('Supplier') + '-4',
                            data: [],
                            color: PlayerColor.s4,
                            actorID: 4
                        }, {
                            name: Label.getContent('Retailer') + '-1',
                            data: [],
                            color: PlayerColor.r1,
                            actorID: 5
                        }, {
                            name: Label.getContent('Retailer') + '-2',
                            data: [],
                            color: PlayerColor.r2,
                            actorID: 6
                        }, {
                            name: Label.getContent('Retailer') + '-3',
                            data: [],
                            color: PlayerColor.r3,
                            actorID: 7
                        });

                        /*highchart data init end*/
                        /*highchart set data  start*/
                        currentCategories.forEach(function(data) {
                            scope.feedBack.f_ShelfSpaceAllocation.forEach(function(singleData) {
                                if (singleData.period == data) {
                                    if (singleData.categoryID == 1) {

                                        //currentShelfSpaceElecssories[singleData.actorID-1].data.push(singleData.value);
                                        currentShelfSpaceElecssories.forEach(function(value, item, array) {
                                            if (singleData.actorID == array[item].actorID) {
                                                array[item].data.push(singleData.value * 100);
                                            }
                                        })

                                    } else if (singleData.categoryID == 2) {

                                        //currentShelfSpaceHealthBeauties[singleData.actorID-1].data.push(singleData.value);
                                        currentShelfSpaceHealthBeauties.forEach(function(value, item, array) {
                                            if (singleData.actorID == array[item].actorID) {
                                                array[item].data.push(singleData.value * 100);
                                            }
                                        })
                                    }
                                }
                            })
                        })


                        /*highchart set data end*/
                        /*set highchart function start*/
                        scope.currentShelfSpaceElecssories = {
                            options: {
                                title: {
                                    text: Label.getContent('Elecssories'),
                                },
                                chart: {

                                    type: 'line',
                                    backgroundColor: 'transparent',
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('Shelf Space Allocation') + ' (%)'
                                    },
                                    gridLineColor: 'transparent'
                                },
                                xAxis: {
                                    categories: currentCategories,
                                    title: {
                                        text: Label.getContent('Period')
                                    }
                                },
                                tooltip: {
                                    formatter: function() {
                                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('Shelf Space Allocation') + ':' + this.point.y.toFixed(2) + '%</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                credits: {
                                    enabled: false
                                }
                            },
                            series: currentShelfSpaceElecssories,
                            loading: false
                        }
                        scope.currentShelfSpaceHealthBeauties = {
                            options: {
                                title: {
                                    text: Label.getContent('HealthBeauties'),
                                },
                                chart: {

                                    type: 'line',
                                    backgroundColor: 'transparent',
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('Shelf Space Allocation') + ' (%)'
                                    },
                                    gridLineColor: 'transparent'
                                },
                                xAxis: {
                                    categories: currentCategories,
                                    title: {
                                        text: Label.getContent('Period')
                                    }
                                },
                                tooltip: {
                                    formatter: function() {
                                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p>' + Label.getContent('Shelf Space Allocation') + ':' + this.point.y.toFixed(2) + '%</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                credits: {
                                    enabled: false
                                }
                            },
                            series: currentShelfSpaceHealthBeauties,
                            loading: false
                        }
                        scope.isPageLoading = false;
                        scope.isResultShown = true;
                        console.log('shelfReady');
                        /*set highchart function end*/
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})