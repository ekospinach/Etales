var retailerProfitCtrl = function($scope, $http, PlayerColor, Label) {
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

    var organiseGrossArray = function(data, periods) {

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
            }, {
                name: ' ',
                data: [],
                color: 'transparent',
                xAxis: 1, //第2个X轴
            }, {
                name: ' ',
                data: [],
                color: 'transparent',
                xAxis: 2, //第3个X轴
            }],
            categories: [],
            subCategories: [],
            thirdCategories: []
        }

        var lists;

        for (var i = 0; i < 17; i++) {
            result.data[0].data[i] = result.data[1].data[i] = result.data[2].data[i] = result.data[3].data[i] = result.data[4].data[i] = null;
            result.data[5].data[i] = result.data[6].data[i] = null;
        }

        result.categories = [periods[0], periods[1], periods[0], periods[1], ' ', periods[0], periods[1], periods[0], periods[1], ' ', periods[0], periods[1], periods[0], periods[1], ' ', periods[0], periods[1]];
        result.subCategories = [Label.getContent('Retailer'), '1', Label.getContent('Retailer'), '2', ' ', Label.getContent('Retailer'), '1', Label.getContent('Retailer'), '2', ' ', Label.getContent('Retailer'), '1', Label.getContent('Retailer'), '2', ' ', ' ', ' ']
        result.thirdCategories = [' ', Label.getContent('Urban'), Label.getContent('Market'), ' ', ' ', ' ', Label.getContent('Rural'), Label.getContent('Market'), ' ', ' ', ' ', Label.getContent('feedback Total'), Label.getContent('Market'), ' ', ' ', Label.getContent('feedback Online'), Label.getContent('Market')];


        // { last third dimension (TBMRetailersTotal/BMRetailerID), highest index(4) is for On-line combined across all Producers }
        //bmretailerID 4 ===> online
        //bmretailerID 1 ===> retailer 1
        //bmretailerID 2 ===> retailer 2
        periods.forEach(function(singlePeriod, periodIndex) {
            lists = _.filter(data, function(obj) {
                return (obj.categoryID == 3 && obj.period == singlePeriod);
            });
            lists.forEach(function(singleList) {

                switch (singleList.BMRetailerID) {
                    case 1:
                        if (singleList.marketID == 1) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[periodIndex] = singleList.value;
                            }
                        } else if (singleList.marketID == 2) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[5 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[5 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[5 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[5 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[5 + periodIndex] = singleList.value;
                            }
                        } else if (singleList.marketID == 3) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[10 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[10 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[10 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[10 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[10 + periodIndex] = singleList.value;
                            }
                        }
                        break;
                    case 2:
                        if (singleList.marketID == 1) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[periodIndex + 2] = singleList.value;
                            }
                        } else if (singleList.marketID == 2) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[5 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[5 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[5 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[5 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[5 + periodIndex + 2] = singleList.value;
                            }
                        } else if (singleList.marketID == 3) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[10 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[10 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[10 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[10 + periodIndex + 2] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[10 + periodIndex + 2] = singleList.value;
                            }
                        }

                        break;
                    case 3:
                        break;
                    case 4:
                        if (singleList.marketID == 3) {
                            if (singleList.brandOwnerID == 1) {
                                result.data[2].data[15 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 2) {
                                result.data[3].data[15 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 3) {
                                result.data[4].data[15 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 5) {
                                result.data[0].data[15 + periodIndex] = singleList.value;
                            }
                            if (singleList.brandOwnerID == 6) {
                                result.data[1].data[15 + periodIndex] = singleList.value;
                            }
                        }

                        break; //online
                }
            })
        })
        return result;

    }

    var organiseMarginArray = function(data, periods) {

        var result = {
            data: [{
                name: Label.getContent('Retailer') + ' 1',
                data: [],
                color: PlayerColor.r1
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [],
                color: PlayerColor.r2
            }, {
                name: Label.getContent('Supplier') + ' 1',
                data: [],
                color: PlayerColor.s1
            }, {
                name: Label.getContent('Supplier') + ' 2',
                data: [],
                color: PlayerColor.s2
            }, {
                name: Label.getContent('Supplier') + ' 3',
                data: [],
                color: PlayerColor.s3
            }]
        }
        var lists;

        periods.forEach(function(singlePeriod) {

            lists = _.filter(data, function(obj) {
                return (obj.categoryID == 3 && obj.marketID == 3 && obj.period == singlePeriod);
            })
            lists.forEach(function(singleList) {
                switch (singleList.storeID) {
                    case 1:
                        result.data[0].data[singlePeriod + 3] = singleList.value * 100;
                        break;
                    case 2:
                        result.data[1].data[singlePeriod + 3] = singleList.value * 100;
                        break;
                    case 3:
                        break;
                    case 4:
                        result.data[2].data[singlePeriod + 3] = singleList.value * 100;
                        break;
                    case 5:
                        result.data[3].data[singlePeriod + 3] = singleList.value * 100;
                        break;
                    case 6:
                        result.data[4].data[singlePeriod + 3] = singleList.value * 100;
                        break;
                    case 7:
                        break;
                    default:
                        break;
                }
            })
        })
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        var grossPeriods = [];

        for (var i = -3; i <= Request['period']; i++) {
            periods.push(i);
        }
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            grossPeriods.push(i);
        }
        var result = {
            'profit': {
                data: {},
                categories: {}
            },
            'gross': {
                data: {}
            },
            'operating': {
                data: {}
            },
            'net': {
                data: {}
            }
        }
        result.profit = organiseGrossArray($scope.feedback.xf_RetailerGrossProfitPerBrandOwner, grossPeriods);
        result.gross = organiseMarginArray($scope.feedback.xf_StoreGrossProfitMargin, periods);
        result.operating = organiseMarginArray($scope.feedback.xf_StoreOperatingProfitMargin, periods);
        result.net = organiseMarginArray($scope.feedback.xf_StoreNetProfitMargin, periods);

        $scope.profitGross = {
            options: {
                xAxis: [{
                    categories: result.profit.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.profit.subCategories,
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.profit.thirdCategories,
                    labels: {
                        style: {
                            fontSize: '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
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
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.series.name + ':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                    }

                },
                legend: {
                    borderWidth: 0,
                    x: 50,
                }
            },
            title: {
                text: ''
            },
            series: result.profit.data,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.grossProfitsMargins = {
            options: {
                title: {
                    text: Label.getContent('Gross Profit Margin'),
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                xAxis: {
                    categories: periods,
                    title: {
                        text: Label.getContent('Period')
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: result.gross.data,
            loading: false
        }
        $scope.operatingProfitsMargins = {
            options: {
                title: {
                    text: Label.getContent('Operating Profit Margin'),
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                xAxis: {
                    categories: periods,
                    title: {
                        text: Label.getContent('Period')
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: result.operating.data,
            loading: false
        }
        $scope.netProfitsMargins = {
            options: {
                title: {
                    text: Label.getContent('Net Profit Margin'),
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: '%'
                    }
                },
                xAxis: {
                    categories: periods,
                    title: {
                        text: Label.getContent('Period')
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: result.net.data,
            loading: false
        }
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}