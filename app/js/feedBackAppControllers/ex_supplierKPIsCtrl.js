var supplierKPIsCtrl = function($scope, $http, PlayerColor, Label) {
    function GetRequest() {
        var url = document.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var loadPortfolioStrength = function(data, category, periods) {
        var result = {};
        var series = [{
            "name": Label.getContent('Supplier') + ' 1',
            "data": [],
            color: PlayerColor.s1
        }, {
            "name": Label.getContent('Supplier') + ' 2',
            "data": [],
            color: PlayerColor.s2
        }, {
            "name": Label.getContent('Supplier') + ' 3',
            "data": [],
            color: PlayerColor.s3
        }, {
            "name": Label.getContent('Retailer') + ' 1',
            "data": [],
            color: PlayerColor.r1
        }, {
            "name": Label.getContent('Retailer') + ' 2',
            "data": [],
            color: PlayerColor.r2
        }];

        periods.forEach(function(singlePeriod) {
            data.forEach(function(singleData) {
                if (singleData.period == singlePeriod && singleData.categoryID == category) {
                    if (singleData.ownerID < 4) {
                        series[singleData.ownerID - 1].data.push({
                            x: singlePeriod,
                            y: singleData.value
                        })
                    } else if (singleData.ownerID > 4) {
                        series[singleData.ownerID - 2].data.push({
                            x: singlePeriod,
                            y: singleData.value
                        })
                    }

                }
            })
        });

        result = {
            options: {
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: Label.getContent('Strength Index'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    title: {
                        text: Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + Label.getContent('Strength Index') + ':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: series,
            loading: false
        }
        return result;
    }

    var loadChannel = function(data, category, periods, type) {
        var result = {};
        var categories = [];
        var series = [{
            "name": Label.getContent('Supplier') + ' 1',
            "data": [0, 0, 0, 0, 0, 0],
            color: PlayerColor.s1,
            xAxis: 0
        }, {
            "name": Label.getContent('Supplier') + ' 2',
            "data": [0, 0, 0, 0, 0, 0],
            color: PlayerColor.s2,
            xAxis: 0
        }, {
            "name": Label.getContent('Supplier') + ' 3',
            "data": [0, 0, 0, 0, 0, 0],
            color: PlayerColor.s3,
            xAxis: 0
        }, {
            name: ' ',
            data: [null, null, null],
            color: 'transparent',
            xAxis: 1, //第二个X轴
        }];

        if (type == "bm") {
            periods.forEach(function(singlePeriod, index) {
                data.f_SuppliersBMValueSalesShare.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[index] = singleData.value * 100;
                        }
                    }
                })
                data.f_SuppliersBMVolumeSalesShare.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[2 + index] = singleData.value * 100;
                        }
                    }
                })
                data.f_SuppliersBMShareOfShoppers.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[4 + index] = singleData.value * 100;
                        }
                    }
                })
            });
        } else {
            periods.forEach(function(singlePeriod, index) {
                data.f_SuppliersOnlineValueSalesShare.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[index] = singleData.value * 100;
                        }
                    }
                })
                data.f_SuppliersOnlineVolumeSalesShare.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[2 + index] = singleData.value * 100;
                        }
                    }
                })
                data.f_SuppliersOnlineShareOfShoppers.forEach(function(singleData) {
                    if (singleData.period == singlePeriod && singleData.categoryID == category) {
                        if (singleData.supplierID < 4) {
                            series[singleData.supplierID - 1].data[4 + index] = singleData.value * 100;
                        }
                    }
                })
            });
        }

        for (var i = 0; i < periods.length; i++) {
            categories.push(periods[i]);
        }
        for (var i = 0; i < periods.length; i++) {
            categories.push(periods[i]);
        }
        for (var i = 0; i < periods.length; i++) {
            categories.push(periods[i]);
        }

        result = {
            options: {
                xAxis: [{
                    categories: categories,
                    title: {
                        text: Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                }, {
                    categories: [Label.getContent('Share of Value Sales'), Label.getContent('Share of Volume Sales'), Label.getContent('Share of Shoppers')],
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                            'text-align': 'center'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + Label.getContent('Period') + ':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + ' %</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: series,
            credits: {
                enabled: false
            },
            loading: false
        }

        return result;
    }

    var loadAggregatedChannels = function(data, category, market, periods, type) {

        var series = [{
            "name": Label.getContent('Total Sales'),
            "data": [],
            color: PlayerColor.s1
        }, {
            "name": Label.getContent('Online'),
            "data": [],
            color: PlayerColor.online
        }, {
            "name": Label.getContent('Traditional Trade'),
            "data": [],
            color: PlayerColor.r3
        }, {
            "name": Label.getContent('Modem Retailers'),
            "data": [],
            color: PlayerColor.r1
        }];
        periods.forEach(function(singlePeriod) {
            if (type == "salesVolume") {

                data.xf_AggregatedChannelsSalesVolume.forEach(function(singleData) {
                    if (singleData.marketID == market && singleData.period == singlePeriod && singleData.categoryID == category) {
                        switch (singleData.aggregatedChannel) {
                            case 'TOTAL_MARKET':
                                series[0].data.push(singleData.value);
                                break;
                            case 'ONLINE_SALES':
                                series[1].data.push(singleData.value);
                                break;
                            case 'TRADITIONAL_TRADE':
                                series[2].data.push(singleData.value);
                                break;
                            case 'MODERN_RETAILERS':
                                series[3].data.push(singleData.value);
                                break;
                        }
                    }
                })

            } else if (type == "salesValue") {
                data.xf_AggregatedChannelsSalesValue.forEach(function(singleData) {
                    if (singleData.marketID == market && singleData.period == singlePeriod && singleData.categoryID == category) {
                        switch (singleData.aggregatedChannel) {
                            case 'TOTAL_MARKET':
                                series[0].data.push(singleData.value);
                                break;
                            case 'ONLINE_SALES':
                                series[1].data.push(singleData.value);
                                break;
                            case 'TRADITIONAL_TRADE':
                                series[2].data.push(singleData.value);
                                break;
                            case 'MODERN_RETAILERS':
                                series[3].data.push(singleData.value);
                                break;
                        }
                    }
                })

            } else if (type == "netProfit") {
                data.xf_AggregatedChannelsNetProfit.forEach(function(singleData) {
                    if (singleData.marketID == market && singleData.period == singlePeriod && singleData.categoryID == category) {
                        switch (singleData.aggregatedChannel) {
                            case 'TOTAL_MARKET':
                                series[0].data.push(singleData.value);
                                break;
                            case 'ONLINE_SALES':
                                series[1].data.push(singleData.value);
                                break;
                            case 'TRADITIONAL_TRADE':
                                series[2].data.push(singleData.value);
                                break;
                            case 'MODERN_RETAILERS':
                                series[3].data.push(singleData.value);
                                break;
                        }
                    }
                })
            }

        })
        result = {
            options: {
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: periods,
                    title: {
                        text: Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + Label.getContent('Strength Index') + ':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                },
                title: {
                    text: ''
                }
            },
            series: series,
            loading: false
        }
        console.log('aggregatedChannels:'+result);
        return result;

    }

    var initPage = function() {
        var Request = GetRequest();
        var result = {
            'portfolio': {
                'ele': {},
                'hea': {}
            },
            'bm': {
                'ele': {},
                'hea': {}
            },
            'online': {
                'ele': {},
                'hea': {}
            },
            'salesVolume': {
                'ele': {},
                'hea': {}
            },
            'salesValue': {},
            'netProfit': {},
        }
        var periodShown = [];
        var lessPerios = [Request['period']-1,Request['period']];

        for (var i = -3; i <= Request['period']; i++) {
            periodShown.push(i);
        }

        result.portfolio.ele = loadPortfolioStrength($scope.normalfeedback.f_PortfolioStrength, 1, periodShown);
        result.portfolio.ele.options.title = {
            text: Label.getContent('Elecssories'),
            style: {
                'font-size': '16px'
            }
        }
        result.portfolio.hea = loadPortfolioStrength($scope.normalfeedback.f_PortfolioStrength, 2, periodShown);
        result.portfolio.hea.options.title = {
            text: Label.getContent('HealthBeauties'),
            style: {
                'font-size': '16px'
            }
        }

        result.bm.ele = loadChannel($scope.normalfeedback, 1, lessPerios, 'bm');
        result.bm.ele.options.title = {
            text: Label.getContent('Elecssories'),
            style: {
                'font-size': '16px'
            }
        }
        result.bm.hea = loadChannel($scope.normalfeedback, 2, lessPerios, 'bm');
        result.bm.hea.options.title = {
            text: Label.getContent('HealthBeauties'),
            style: {
                'font-size': '16px'
            }
        }

        result.online.ele = loadChannel($scope.normalfeedback, 1, lessPerios, 'online');
        result.online.ele.options.title = {
            text: Label.getContent('Elecssories'),
            style: {
                'font-size': '16px'
            }
        }
        result.online.hea = loadChannel($scope.normalfeedback, 2, lessPerios, 'online');
        result.online.hea.options.title = {
            text: Label.getContent('HealthBeauties'),
            style: {
                'font-size': '16px'
            }
        }

        result.salesVolume.ele = loadAggregatedChannels($scope.feedback, 1, 3, periodShown, 'salesVolume');
        result.salesVolume.hea = loadAggregatedChannels($scope.feedback, 2, 3, periodShown, 'salesVolume');
        result.salesValue = loadAggregatedChannels($scope.feedback, 3, 3, periodShown, 'salesValue');
        result.netProfit = loadAggregatedChannels($scope.feedback, 3, 3, periodShown, 'netProfit');


        $scope.supplierKPI = result;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}