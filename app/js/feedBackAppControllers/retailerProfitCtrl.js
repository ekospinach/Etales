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
                data: [1,1,1,1,null,1,1,1,1,null,1,1,1,1,null,1,1],
                color: PlayerColor.r1,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [1,1,1,1,null,1,1,1,1,null,1,1,1,1,null,1,1],
                color: PlayerColor.r2,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 1',
                data: [1,1,1,1,null,1,1,1,1,null,1,1,1,1,null,1,1],
                color: PlayerColor.s1,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 2',
                data: [1,1,1,1,null,1,1,1,1,null,1,1,1,1,null,1,1],
                color: PlayerColor.s2,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 3',
                data: [1,1,1,1,null,1,1,1,1,null,1,1,1,1,null,1,1],
                color: PlayerColor.s3,
                xAxis: 0
            }, {
                name: ' ',
                data: [null, null, null, null, null, null, null, null, null, null],
                color: 'transparent',
                xAxis: 1, //第2个X轴
            }, {
                name: ' ',
                data: [null,null,null,null],
                color: 'transparent',
                xAxis: 2, //第3个X轴
            }],
            categories: [],
            subCategories:[],
            thirdCategories:[]
        }

        // for (var i = 0; i < 7 * periods.length + 4; i++) {
        //     result.data[0].data[i] = 1;
        //     result.data[1].data[i] = 1;
        //     result.data[2].data[i] = 1;
        //     result.data[3].data[i] = 1;
        //     result.data[4].data[i] = 1;
        // }
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        result.categories.push(' ');
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        result.categories.push(' ');
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }
        result.categories.push(' ');
        for(var i=0;i<2;i++){
            result.categories.push(periods[i]);
        }


        result.subCategories=[Label.getContent('Retailer')+' 1',Label.getContent('Retailer')+' 2',' ',Label.getContent('Retailer')+' 1',Label.getContent('Retailer')+' 2',' ',Label.getContent('Retailer')+' 1',Label.getContent('Retailer')+' 2',' ',' ']
        result.thirdCategories=[Label.getContent('Urban Market'),Label.getContent('Rural Market'),Label.getContent('Total Market'),Label.getContent('Online Market')]

        return result;


        // periods.forEach(function(singlePeriod){

        // })
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
        result.profit = organiseGrossArray($scope.xf_RetailerGrossProfitPerBrandOwner, grossPeriods);
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
                            fontSize: '18px',
                            'color': '#f26c4f',
                            'align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.profit.thirdCategories,
                    labels: {
                        style: {
                            fontSize: '18px',
                            'color': '#f26c4f',
                        },
                        y: -30
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
                    },

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