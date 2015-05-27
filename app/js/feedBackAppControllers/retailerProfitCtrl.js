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
                        result.data[0].data[singlePeriod + 3] = singleList.value;
                        break;
                    case 2:
                        result.data[1].data[singlePeriod + 3] = singleList.value;
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                        result.data[2].data[singlePeriod + 3] = singleList.value;
                    case 5:
                        result.data[3].data[singlePeriod + 3] = singleList.value;
                        break;
                    case 6:
                        result.data[4].data[singlePeriod + 3] = singleList.value;
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
        for (var i = -3; i <= Request['period']; i++) {
            periods.push(i);
        }
        var result = {
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
        result.gross = organiseMarginArray($scope.feedback.xf_StoreGrossProfitMargin, periods);
        result.operating = organiseMarginArray($scope.feedback.xf_StoreOperatingProfitMargin, periods);
        result.net = organiseMarginArray($scope.feedback.xf_StoreNetProfitMargin, periods);

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
                        text: Label.getContent('$mln')
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
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
                        text: Label.getContent('$mln')
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
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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
                        text: Label.getContent('$mln')
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
                        var s = '<p>' + this.series.name + '</p>' + '<p>' + Label.getContent("Period") + ':' + this.key + '</p>' + '<p>' + Label.getContent('$mln') + ':' + this.point.y.toFixed(2) + '</p>';
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