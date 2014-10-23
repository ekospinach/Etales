define(['directives', 'services'], function(directives) {

    directives.directive('generalCrossSegmentSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q','PlayerColor',
        function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerColor) {
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
                        scope.Label         = Label;
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

                        scope.priceSensitives = new Array();
                        scope.valueForMoneies = new Array();
                        scope.fashions        = new Array();
                        scope.freakses        = new Array();
                        for (var i = 0; i < 4; i++) {
                            scope.priceSensitives[i] = new Array();
                            scope.valueForMoneies[i] = new Array();
                            scope.fashions[i]        = new Array();
                            scope.freakses[i]        = new Array();
                        }

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
                            var elecssory = 0, healthBeauty = 1;
                            var urban = 0 ,rural =1;
                            var price = 0, value = 1, fashion = 2, freakse = 3;
                            var bm = 0 , online = 1 , mixed = 2;
                            var elecssory_urban = 0, elecssory_rural =1, healthBeauty_urban =2, healthBeauty_rural =3;
                            //priceSensitives
                            scope.priceSensitives[elecssory_urban].push(data.categoryInfo[elecssory].marketInfo[urban].segmentInfo[price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[elecssory_rural].push(data.categoryInfo[elecssory].marketInfo[rural].segmentInfo[price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[healthBeauty_urban].push(data.categoryInfo[healthBeauty].marketInfo[urban].segmentInfo[price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.priceSensitives[healthBeauty_rural].push(data.categoryInfo[healthBeauty].marketInfo[rural].segmentInfo[price].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //valueForMoneies
                            scope.valueForMoneies[elecssory_urban].push(data.categoryInfo[elecssory].marketInfo[urban].segmentInfo[value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[elecssory_rural].push(data.categoryInfo[elecssory].marketInfo[rural].segmentInfo[value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[healthBeauty_urban].push(data.categoryInfo[healthBeauty].marketInfo[urban].segmentInfo[value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.valueForMoneies[healthBeauty_rural].push(data.categoryInfo[healthBeauty].marketInfo[rural].segmentInfo[value].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //fashions
                            scope.fashions[elecssory_urban].push(data.categoryInfo[elecssory].marketInfo[urban].segmentInfo[fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[elecssory_rural].push(data.categoryInfo[elecssory].marketInfo[rural].segmentInfo[fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[healthBeauty_urban].push(data.categoryInfo[healthBeauty].marketInfo[urban].segmentInfo[fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.fashions[healthBeauty_rural].push(data.categoryInfo[healthBeauty].marketInfo[rural].segmentInfo[fashion].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            //freakses
                            scope.freakses[elecssory_urban].push(data.categoryInfo[elecssory].marketInfo[urban].segmentInfo[freakse].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[elecssory_rural].push(data.categoryInfo[elecssory].marketInfo[rural].segmentInfo[freakse].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[healthBeauty_urban].push(data.categoryInfo[healthBeauty].marketInfo[urban].segmentInfo[freakse].shopperInfo[i].grcss_CrossSegmentsVolumes);
                            scope.freakses[healthBeauty_rural].push(data.categoryInfo[healthBeauty].marketInfo[rural].segmentInfo[freakse].shopperInfo[i].grcss_CrossSegmentsVolumes);
                        }

                        scope.crossSegment1Series = [{
                            "name": Label.getContent('B&M Only'),
                            "data": [scope.priceSensitives[elecssory_urban][bm], scope.valueForMoneies[elecssory_urban][bm], scope.fashions[elecssory_urban][bm], scope.freakses[elecssory_urban][bm]],
                            type: "column",
                            color: PlayerColor.getColors()[1]
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[elecssory_urban][online], scope.valueForMoneies[elecssory_urban][online], scope.fashions[elecssory_urban][online], scope.freakses[elecssory_urban][online]],
                            type: "column",
                            color: PlayerColor.getColors()[0]
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[elecssory_urban][mixed], scope.valueForMoneies[elecssory_urban][mixed], scope.fashions[elecssory_urban][mixed], scope.freakses[elecssory_urban][mixed]],
                            type: "column",
                            color: PlayerColor.getColors()[5]
                        } ];

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
                            "data": [scope.priceSensitives[elecssory_rural][bm], scope.valueForMoneies[elecssory_rural][bm], scope.fashions[elecssory_rural][bm], scope.freakses[elecssory_rural][bm]],
                            type: "column",
                            color: PlayerColor.getColors()[1]
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[elecssory_rural][online], scope.valueForMoneies[elecssory_rural][online], scope.fashions[elecssory_rural][online], scope.freakses[elecssory_rural][online]],
                            type: "column",
                            color: PlayerColor.getColors()[0]
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[elecssory_rural][mixed], scope.valueForMoneies[elecssory_rural][mixed], scope.fashions[elecssory_rural][mixed], scope.freakses[elecssory_rural][mixed]],
                            type: "column",
                            color: PlayerColor.getColors()[5]
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
                            "data": [scope.priceSensitives[healthBeauty_urban][bm], scope.valueForMoneies[healthBeauty_urban][bm], scope.fashions[healthBeauty_urban][bm], scope.freakses[healthBeauty_urban][bm]],
                            type: "column",
                            color: PlayerColor.getColors()[1]
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[healthBeauty_urban][online], scope.valueForMoneies[healthBeauty_urban][online], scope.fashions[healthBeauty_urban][online], scope.freakses[healthBeauty_urban][online]],
                            type: "column",
                            color: PlayerColor.getColors()[0]
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[healthBeauty_urban][mixed], scope.valueForMoneies[healthBeauty_urban][mixed], scope.fashions[healthBeauty_urban][mixed], scope.freakses[healthBeauty_urban][mixed]],
                            type: "column",
                            color: PlayerColor.getColors()[5]
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
                            "data": [scope.priceSensitives[healthBeauty_rural][bm], scope.valueForMoneies[healthBeauty_rural][bm], scope.fashions[healthBeauty_rural][bm], scope.freakses[healthBeauty_rural][bm]],
                            type: "column",
                            color: PlayerColor.getColors()[1]
                        }, {
                            "name": Label.getContent('Online Only'),
                            "data": [scope.priceSensitives[healthBeauty_rural][online], scope.valueForMoneies[healthBeauty_rural][online], scope.fashions[healthBeauty_rural][online], scope.freakses[healthBeauty_rural][online]],
                            type: "column",
                            color: PlayerColor.getColors()[0]
                        }, {
                            "name": Label.getContent('Mixed'),
                            "data": [scope.priceSensitives[healthBeauty_rural][mixed], scope.valueForMoneies[healthBeauty_rural][mixed], scope.fashions[healthBeauty_rural][mixed], scope.freakses[healthBeauty_rural][mixed]],
                            type: "column",
                            color: PlayerColor.getColors()[5]
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