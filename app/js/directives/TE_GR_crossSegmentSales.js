define(['directives', 'services'], function(directives) {

    directives.directive('generalCrossSegmentSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_crossSegmentSales.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        //switching('showPerformance');
                        var url = '/crossSegmentSales/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;

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

                        scope.priceSensitives = [[],[],[],[]];
                        scope.valueForMoneies = [[],[],[],[]];
                        scope.fashions = [[],[],[],[]];
                        scope.freakses = [[],[],[],[]];

                        for (var i = 0; i < 4; i++) {
                            /*
                            data push info
                        
                            data[0]    {'categoryID':1,'marketID':1} 
                            data[1]    {'categoryID':1,'marketID':2} 
                            data[2]    {'categoryID':2,'marketID':1} 
                            data[3]    {'categoryID':2,'marketID':2} 

                            data[x][0] BMS
                            data[x][1] NETIZENS
                            data[x][2] MIXED
                            data[x][3] ALLSHOPPERS

                        */
                            //priceSensitives
                            scope.priceSensitives[StaticValues.CandM.eleUrban].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[StaticValues.CandM.eleRural].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[StaticValues.CandM.heaUrban].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[StaticValues.CandM.heaRural].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //valueForMoneies
                            scope.valueForMoneies[StaticValues.CandM.eleUrban].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[StaticValues.CandM.eleRural].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[StaticValues.CandM.heaUrban].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[StaticValues.CandM.heaRural].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //fashions
                            scope.fashions[StaticValues.CandM.eleUrban].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[StaticValues.CandM.eleRural].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[StaticValues.CandM.heaUrban].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[StaticValues.CandM.heaRural].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //freakses
                            scope.freakses[StaticValues.CandM.eleUrban].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.freaks].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[StaticValues.CandM.eleRural].push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.freaks].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[StaticValues.CandM.heaUrban].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.urban].segmentInfo[StaticValues.segment.freaks].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[StaticValues.CandM.heaRural].push(data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.rural].segmentInfo[StaticValues.segment.freaks].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        }

                        scope.crossSegment1Series = [{
                            "name": Label.getContent('B&M Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleUrban][StaticValues.shopper.bm], scope.valueForMoneies[StaticValues.CandM.eleUrban][StaticValues.shopper.bm], scope.fashions[StaticValues.CandM.eleUrban][StaticValues.shopper.bm], scope.freakses[StaticValues.CandM.eleUrban][StaticValues.shopper.bm]],
                            type: "column",
                            color: PlayerColor.bm
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleUrban][StaticValues.shopper.online], scope.valueForMoneies[StaticValues.CandM.eleUrban][StaticValues.shopper.online], scope.fashions[StaticValues.CandM.eleUrban][StaticValues.shopper.online], scope.freakses[StaticValues.CandM.eleUrban][StaticValues.shopper.online]],
                            type: "column",
                            color: PlayerColor.online
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleUrban][StaticValues.shopper.mixed], scope.valueForMoneies[StaticValues.CandM.eleUrban][StaticValues.shopper.mixed], scope.fashions[StaticValues.CandM.eleUrban][StaticValues.shopper.mixed], scope.freakses[StaticValues.CandM.eleUrban][StaticValues.shopper.mixed]],
                            type: "column",
                            color: PlayerColor.mixed
                        }];

                        scope.crossSegment1Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions: {
                                    series: {
                                        stacking: ''
                                    }
                                }
                            },
                            series: scope.crossSegment1Series,
                            title: {
                                text: Label.getContent('Elecssories') + ' - ' + Label.getContent('Urban')
                            },
                            subtitle: {
                                text: '<p class="text-center" style="font-size:16px">' + Label.getContent('Consumer Segments') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.crossSegment2Series = [{
                            "name": Label.getContent('B&M Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleRural][StaticValues.shopper.bm], scope.valueForMoneies[StaticValues.CandM.eleRural][StaticValues.shopper.bm], scope.fashions[StaticValues.CandM.eleRural][StaticValues.shopper.bm], scope.freakses[StaticValues.CandM.eleRural][StaticValues.shopper.bm]],
                            type: "column",
                            color: PlayerColor.bm
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleRural][StaticValues.shopper.online], scope.valueForMoneies[StaticValues.CandM.eleRural][StaticValues.shopper.online], scope.fashions[StaticValues.CandM.eleRural][StaticValues.shopper.online], scope.freakses[StaticValues.CandM.eleRural][StaticValues.shopper.online]],
                            type: "column",
                            color: PlayerColor.online
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[StaticValues.CandM.eleRural][StaticValues.shopper.mixed], scope.valueForMoneies[StaticValues.CandM.eleRural][StaticValues.shopper.mixed], scope.fashions[StaticValues.CandM.eleRural][StaticValues.shopper.mixed], scope.freakses[StaticValues.CandM.eleRural][StaticValues.shopper.mixed]],
                            type: "column",
                            color: PlayerColor.mixed
                        }, ];

                        scope.crossSegment2Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions: {
                                    series: {
                                        stacking: ''
                                    }
                                }
                            },
                            series: scope.crossSegment2Series,
                            title: {
                                text: Label.getContent('Elecssories') + ' - ' + Label.getContent('Rural')
                            },
                            subtitle: {
                                text: '<p class="text-center" style="font-size:16px">' + Label.getContent('Consumer Segments') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.crossSegment3Series = [{
                            "name": Label.getContent('B&M Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaUrban][StaticValues.shopper.bm], scope.valueForMoneies[StaticValues.CandM.heaUrban][StaticValues.shopper.bm], scope.fashions[StaticValues.CandM.heaUrban][StaticValues.shopper.bm], scope.freakses[StaticValues.CandM.heaUrban][StaticValues.shopper.bm]],
                            type: "column",
                            color: PlayerColor.bm
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaUrban][StaticValues.shopper.online], scope.valueForMoneies[StaticValues.CandM.heaUrban][StaticValues.shopper.online], scope.fashions[StaticValues.CandM.heaUrban][StaticValues.shopper.online], scope.freakses[StaticValues.CandM.heaUrban][StaticValues.shopper.online]],
                            type: "column",
                            color: PlayerColor.online
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaUrban][StaticValues.shopper.mixed], scope.valueForMoneies[StaticValues.CandM.heaUrban][StaticValues.shopper.mixed], scope.fashions[StaticValues.CandM.heaUrban][StaticValues.shopper.mixed], scope.freakses[StaticValues.CandM.heaUrban][StaticValues.shopper.mixed]],
                            type: "column",
                            color: PlayerColor.mixed
                        }, ];

                        scope.crossSegment3Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions: {
                                    series: {
                                        stacking: ''
                                    }
                                }
                            },
                            series: scope.crossSegment3Series,
                            title: {
                                text: Label.getContent('HealthBeauties') + ' - ' + Label.getContent('Urban')
                            },
                            subtitle: {
                                text: '<p class="text-center" style="font-size:16px">' + Label.getContent('Consumer Segments') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.crossSegment4Series = [{
                            "name": Label.getContent('B&M Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaRural][StaticValues.shopper.bm], scope.valueForMoneies[StaticValues.CandM.heaRural][StaticValues.shopper.bm], scope.fashions[StaticValues.CandM.heaRural][StaticValues.shopper.bm], scope.freakses[StaticValues.CandM.heaRural][StaticValues.shopper.bm]],
                            type: "column",
                            color: PlayerColor.bm
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaRural][StaticValues.shopper.online], scope.valueForMoneies[StaticValues.CandM.heaRural][StaticValues.shopper.online], scope.fashions[StaticValues.CandM.heaRural][StaticValues.shopper.online], scope.freakses[StaticValues.CandM.heaRural][StaticValues.shopper.online]],
                            type: "column",
                            color: PlayerColor.online
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[StaticValues.CandM.heaRural][StaticValues.shopper.mixed], scope.valueForMoneies[StaticValues.CandM.heaRural][StaticValues.shopper.mixed], scope.fashions[StaticValues.CandM.heaRural][StaticValues.shopper.mixed], scope.freakses[StaticValues.CandM.heaRural][StaticValues.shopper.mixed]],
                            type: "column",
                            color: PlayerColor.mixed
                        }, ];

                        scope.crossSegment4Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                plotOptions: {
                                    series: {
                                        stacking: ''
                                    }
                                }
                            },
                            series: scope.crossSegment4Series,
                            title: {
                                text: Label.getContent('HealthBeauties') + ' - ' + Label.getContent('Rural')
                            },
                            subtitle: {
                                text: '<p class="text-center" style="font-size:16px">' + Label.getContent('Consumer Segments') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

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