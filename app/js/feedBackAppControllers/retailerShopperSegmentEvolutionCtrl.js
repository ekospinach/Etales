var retailerShopperSegmentEvolutionCtrl = function($scope, $http, PlayerColor, Label) {
    function GetRequest() {
        var url = document.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var organiseArray = function(data, periods, marketID) {

        var result = {
            data: [{
                name: Label.getContent('B&M Only'),
                data: [],
                color: PlayerColor.bm,
                xAxis: 0
            }, {
                name: Label.getContent('Online Only'),
                data: [],
                color: PlayerColor.online,
                xAxis: 0
            }, {
                name: Label.getContent('Mixed'),
                data: [],
                color: PlayerColor.mixed,
                xAxis: 0
            }, {
                name: ' ',
                data: [null, null],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }, {
                name: ' ',
                data: [],
                color: 'transparent',
                xAxis: 2, //第3个X轴
            }],
            categories: []
        }

        for (var i = 0; i < 2 * periods.length + 1; i++) {
            result.data[0].data[i] = null;
            result.data[1].data[i] = null;
            result.data[2].data[i] = null;
            result.data[4].data[i] = null;
            result.categories[i] = ' ';
        }

        periods.forEach(function(singlePeriod) {
            data.forEach(function(singleData) {
                if (singleData.marketID == marketID && singleData.period == singlePeriod) {
                    switch (singleData.categoryID) {
                        case 1:
                            result.data[0].data[singlePeriod + periods.length - 1] = singleData.BMS_importance * 100;
                            result.data[1].data[singlePeriod + periods.length - 1] = singleData.NETIZENS_importance * 100;
                            result.data[2].data[singlePeriod + periods.length - 1] = singleData.MIXED_importance * 100;
                            result.data[4].data[singlePeriod + periods.length - 1] = null;
                            result.categories[singlePeriod + periods.length - 1] = singleData.totalMarket.toFixed(2);
                            break;
                        case 2:
                            result.data[0].data[2 * periods.length + singlePeriod] = singleData.BMS_importance * 100;
                            result.data[1].data[2 * periods.length + singlePeriod] = singleData.NETIZENS_importance * 100;
                            result.data[2].data[2 * periods.length + singlePeriod] = singleData.MIXED_importance * 100;
                            result.data[4].data[2 * periods.length + singlePeriod] = null;
                            result.categories[2 * periods.length + singlePeriod] = singleData.totalMarket.toFixed(2);
                            break;
                    }
                }
            })
        })
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        $scope.categories = [];
        $scope.subCategories = [];
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
            periods.push(i);
        }
        $scope.categories.push(' ');
        $scope.subCategories.push(' ');
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
        }
        var result = {
            'urban': {
                data: {},
                categories: {}
            },
            'rural': {
                data: {},
                categories: {}
            }
        }
        result.urban = organiseArray($scope.feedback.xf_ShoppersSegmentsShares, periods, 1);
        result.rural = organiseArray($scope.feedback.xf_ShoppersSegmentsShares, periods, 2);

        $scope.urbanShopperSegmentEvolution = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Elecssories'), Label.getContent('HealthBeauties')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Market Size'),
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.series.name + ':' + this.point.y.toFixed(2) + ' %</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                legend: {
                    borderWidth: 0,
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize:'18px'
                            },
                            formatter: function() {
                                if (this.y != null) {
                                    return this.y.toFixed(2) + '%'
                                } else {
                                    return "";
                                }

                            }
                        }
                    },
                    series: {
                        stacking: 'percent'
                    }
                },

            },
            title: {
                text: ''
            },
            series: result.urban.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.ruralShopperSegmentEvolution = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Elecssories'), Label.getContent('HealthBeauties')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Market Size'),
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.series.name + ':' + this.point.y.toFixed(2) + ' %</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                legend: {
                    borderWidth: 0,
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize:'18px'
                            },
                            formatter: function() {
                                if (this.y != null) {
                                    return this.y.toFixed(2) + '%'
                                } else {
                                    return "";
                                }

                            }
                        }
                    },
                    series: {
                        stacking: 'percent'
                    }
                },

            },
            title: {
                text: ''
            },
            series: result.rural.data,
            credits: {
                enabled: false
            },
            loading: false
        }
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}