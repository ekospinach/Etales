var supplierFinancialandKPICtrl = function($scope, $http, PlayerColor, Label) {
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

    var organiseFinancialArray = function(data, periods, categoryID) {
        var result = {
            data: [{
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
                name: Label.getContent('Online'),
                data: [],
                color: PlayerColor.online,
                xAxis: 0
            }, {
                name: ' ',
                data: [null, null, null, null, null],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }],
            categories: [periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1]],
            subCategories: [Label.getContent('Supplier') + ' 1', Label.getContent('Supplier') + ' 2', Label.getContent('Supplier') + ' 3', Label.getContent('Retailer') + ' 1', Label.getContent('Retailer') + ' 2']

        };
        var list = {};

        for (var i = 0; i < 5 * periods.length; i++) {
            result.data[0].data[i] = result.data[1].data[i] = result.data[2].data[i] = result.data[3].data[i] = null;
        }

        periods.forEach(function(singlePeriod, periodIndex) {
            //period
            data.forEach(function(singleData) {
                lists = _.filter(data, function(obj) {
                    return (obj.period == singlePeriod && obj.categoryID == categoryID && obj.marketID == 3);
                })
                lists.forEach(function(singleList) {
                    if (singleList.accountID <= 4) {

                        switch (singleList.ownerID) {
                            case 1:
                                result.data[singleList.accountID - 1].data[periodIndex] = singleList.value;
                                break;
                            case 2:
                                result.data[singleList.accountID - 1].data[periodIndex + 2] = singleList.value;
                                break;
                            case 3:
                                result.data[singleList.accountID - 1].data[periodIndex + 4] = singleList.value;
                                break;
                            case 4:
                                break;
                            case 5:
                                result.data[singleList.accountID - 1].data[periodIndex + 6] = singleList.value;
                                break;
                            case 6:
                                result.data[singleList.accountID - 1].data[periodIndex + 8] = singleList.value;
                                break;
                        }
                    }
                })

            })
        });
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            periods.push(i);
        }
        var result = {
            'sales_ele': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'sales_hea': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'gross_ele': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'gross_hea': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'trade_ele': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'trade_hea': {
                data: {},
                categories: {},
                subCategories: {}
            },
        }
        result.sales_ele = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelSalesValue, periods, 1);
        result.sales_hea = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelSalesValue, periods, 2);

        result.gross_ele = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelGrossProfit, periods, 1);
        result.gross_hea = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelGrossProfit, periods, 2);

        result.trade_ele = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelTradeProfit, periods, 1);
        result.trade_hea = organiseFinancialArray($scope.feedback.xf_BrandOwnersChannelTradeProfit, periods, 2);


        $scope.sales_eleFinancial = {
            options: {
                xAxis: [{
                    categories: result.sales_ele.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.sales_ele.subCategories,
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '16px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.sales_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.sales_heaFinancial = {
            options: {
                xAxis: [{
                    categories: result.sales_hea.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.sales_hea.subCategories,
                    labels: {
                        style: {
                            fontSize: '14px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '14px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.sales_hea.data,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.gross_eleFinancial = {
            options: {
                xAxis: [{
                    categories: result.gross_ele.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.gross_ele.subCategories,
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '16px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.gross_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.gross_heaFinancial = {
            options: {
                xAxis: [{
                    categories: result.gross_hea.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.gross_hea.subCategories,
                    labels: {
                        style: {
                            fontSize: '14px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '14px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.gross_hea.data,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.trade_eleFinancial = {
            options: {
                xAxis: [{
                    categories: result.trade_ele.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.trade_ele.subCategories,
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '16px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.trade_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.trade_heaFinancial = {
            options: {
                xAxis: [{
                    categories: result.trade_hea.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.trade_hea.subCategories,
                    labels: {
                        style: {
                            fontSize: '14px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }],
                yAxis: {
                    title: {
                        text: Label.getContent('$mln')
                    },
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + Label.getContent('Period') + ':' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + '</b></p>';
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
                                fontSize: '14px'
                            },
                            formatter: function() {
                                if (this.y != null && this.y != 0) {
                                    return this.y.toFixed(2);
                                } else {
                                    return "";
                                }

                            }
                        }
                    }
                },
                legend: {
                    borderWidth: 0,
                }
            },
            title: {
                text: ''
            },
            series: result.trade_hea.data,
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