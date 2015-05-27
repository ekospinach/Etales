var retailerRetailSalesCtrl = function($scope, $http, PlayerColor, Label) {
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

    var organiseArray = function(data, periods, marketID, categoryID) {
        // BMS, NETIZENS, MIXED, ALLSHOPPERS
        // { It is a bit overloaded with data. For absolute values in the top line you only need: [market, category, period, ALLSHOPPERS, ALlStoresMaxTotal].xfsss_Absolute element } 
        // { For left side bar charts use: [market, category, period, BMS/NETIZENS/MIXED, ALlStoresMaxTotal].xfsss_Importance }
        // { For right side bar use: [market, category, period, ALLSHOPPERS, store].xfsss_Importance }
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
                xAxis: 2, //第二个X轴
            }, {
                name: Label.getContent('Retailer') + ' 1',
                data: [],
                color: PlayerColor.r1,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [],
                color: PlayerColor.r2,
                xAxis: 0
            }, {
                name: Label.getContent('Traditional Trade'),
                data: [],
                color: PlayerColor.r3,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 1',
                data: [],
                color: PlayerColor.s1,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 2',
                data: [],
                color: PlayerColor.s2,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 3',
                data: [],
                color: PlayerColor.s3,
                xAxis: 0
            }],
            categories: []
        };
        var list = {};

        for (var i = 0; i < 2 * periods.length + 1; i++) {
            result.data[0].data[i] = null;
            result.data[1].data[i] = null;
            result.data[2].data[i] = null;
            result.data[4].data[i] = null;
            result.data[5].data[i] = null;
            result.data[6].data[i] = null;
            result.data[7].data[i] = null;
            result.data[8].data[i] = null;
            result.data[9].data[i] = null;
            result.data[10].data[i] = null;
            result.categories[i] = ' ';
        }

        periods.forEach(function(singlePeriod) {
            //period
            data.forEach(function(singleData) {
                lists = _.filter(data, function(obj) {
                    return (obj.period == singlePeriod && obj.categoryID == categoryID && obj.marketID == marketID);
                })
                lists.forEach(function(singleList) {
                    switch (singleList.shopperKind) {
                        case 'BMS':
                            if (singleList.storeID == 8) {
                                result.data[0].data[singlePeriod + periods.length - 1] = singleList.importance * 100;
                            }
                            break;
                        case 'NETIZENS':
                            if (singleList.storeID == 8) {
                                result.data[1].data[singlePeriod + periods.length - 1] = singleList.importance * 100;
                            }
                            break;
                        case 'MIXED':
                            if (singleList.storeID == 8) {
                                result.data[2].data[singlePeriod + periods.length - 1] = singleList.importance * 100;
                            }
                            break;
                        case 'ALLSHOPPERS':
                            if (singleList.storeID == 4) {
                                result.data[5].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 5) {
                                result.data[6].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 6) {
                                result.data[7].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 1) {
                                result.data[8].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 2) {
                                result.data[9].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 3) {
                                result.data[10].data[2 * periods.length + singlePeriod] = singleList.importance * 100;
                            }
                            if (singleList.storeID == 8) {
                                result.categories[singlePeriod + periods.length - 1] = singleList.absolute.toFixed(2);
                                result.categories[2 * periods.length + singlePeriod] = singleList.absolute.toFixed(2);
                            }
                            break;
                    }
                })

            })
        });
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
            'urban_ele': {
                data: {},
                categories: {}
            },
            'urban_hea': {
                data: {},
                categories: {}
            },
            'rural_ele': {
                data: {},
                categories: {}
            },
            'rural_hea': {
                data: {},
                categories: {}
            },
        }
        result.urban_ele = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 1);
        result.urban_hea = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 2);
        result.rural_ele = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 2, 1);
        result.rural_hea = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 2, 2);
        $scope.urban_eleRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban_ele.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
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
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize: '18px'
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
                }
            },
            title: {
                text: ''
            },
            series: result.urban_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.urban_heaRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban_hea.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
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
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize: '18px'
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
                }
            },
            title: {
                text: ''
            },
            series: result.urban_hea.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rural_eleRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural_ele.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
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
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize: '18px'
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
                }
            },
            title: {
                text: ''
            },
            series: result.rural_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rural_heaRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural_hea.categories,
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
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
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: 'white',
                            style: {
                                textShadow: '0 0 3px black',
                                fontSize: '18px'
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
                }
            },
            title: {
                text: ''
            },
            series: result.rural_hea.data,
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