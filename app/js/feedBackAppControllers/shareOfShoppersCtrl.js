var shareOfShoppersCtrl = function($scope, $http, PlayerColor) {
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

    function newChartData(searchKeys) {
        var chartSeries = new Array({
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1,
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Traditional Trade'),
            data: [],
            color: PlayerColor.r3
        }, {
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        });

        return {
            searchKeys: {
                shopperKind: searchKeys.shopperKind,
                marketID: searchKeys.marketID,
                categoryID: searchKeys.categoryID
            },
            chartSeries: chartSeries
        }
    }
    var initPage = function() {
        var Request = GetRequest();
        var periodsShown = [];

        for (var i = -3; i <= Request['period']; i++) {
            periodsShown.push(i);
        }
        var E_urbanOnline = newChartData({
            shopperKind: 'NETIZENS',
            marketID: 1,
            categoryID: 1
        });
        var E_urbanBM = newChartData({
            shopperKind: 'BMS',
            marketID: 1,
            categoryID: 1
        });
        var E_urbanMixed = newChartData({
            shopperKind: 'MIXED',
            marketID: 1,
            categoryID: 1
        });
        var E_urbanTotal = newChartData({
            shopperKind: 'ALLSHOPPERS',
            marketID: 1,
            categoryID: 1
        });

        var E_ruralOnline = newChartData({
            shopperKind: 'NETIZENS',
            marketID: 2,
            categoryID: 1
        });
        var E_ruralBM = newChartData({
            shopperKind: 'BMS',
            marketID: 2,
            categoryID: 1
        });
        var E_ruralMixed = newChartData({
            shopperKind: 'MIXED',
            marketID: 2,
            categoryID: 1
        });
        var E_ruralTotal = newChartData({
            shopperKind: 'ALLSHOPPERS',
            marketID: 2,
            categoryID: 1
        });

        var H_urbanOnline = newChartData({
            shopperKind: 'NETIZENS',
            marketID: 1,
            categoryID: 2
        });
        var H_urbanBM = newChartData({
            shopperKind: 'BMS',
            marketID: 1,
            categoryID: 2
        });
        var H_urbanMixed = newChartData({
            shopperKind: 'MIXED',
            marketID: 1,
            categoryID: 2
        });
        var H_urbanTotal = newChartData({
            shopperKind: 'ALLSHOPPERS',
            marketID: 1,
            categoryID: 2
        });

        var H_ruralOnline = newChartData({
            shopperKind: 'NETIZENS',
            marketID: 2,
            categoryID: 2
        });
        var H_ruralBM = newChartData({
            shopperKind: 'BMS',
            marketID: 2,
            categoryID: 2
        });
        var H_ruralMixed = newChartData({
            shopperKind: 'MIXED',
            marketID: 2,
            categoryID: 2
        });
        var H_ruralTotal = newChartData({
            shopperKind: 'ALLSHOPPERS',
            marketID: 2,
            categoryID: 2
        });

        var allChartsData = [];
        allChartsData.push(E_urbanOnline, E_urbanBM, E_urbanMixed, E_urbanTotal, E_ruralOnline, E_ruralBM, E_ruralMixed, E_ruralTotal,
            H_urbanOnline, H_urbanBM, H_urbanMixed, H_urbanTotal, H_ruralOnline, H_ruralBM, H_ruralMixed, H_ruralTotal);

        periodsShown.forEach(function(single){
            $scope.feedBack.f_ShoppersShare.forEach(function(singleData){
                if (singleData.period == single) {

                    allChartsData.forEach(function(singleChartData) {
                        if ((singleChartData.searchKeys.shopperKind == singleData.shopperKind) && (singleChartData.searchKeys.marketID == singleData.marketID) && (singleChartData.searchKeys.categoryID == singleData.categoryID)) {

                            singleChartData.chartSeries[singleData.storeID - 1].data.push(singleData.value * 100);
                        }
                    });
                }
            })
        })

        // $scope.E_urbanOnline=E_urbanOnline;

        //Category E:
        $scope.E_urbanOnlineShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanOnline.chartSeries,
            title: {
                text: $scope.Label.getContent('Online Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_urbanBMShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanBM.chartSeries,
            title: {
                text: $scope.Label.getContent('B&M Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_urbanMixedShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanMixed.chartSeries,
            title: {
                text: $scope.Label.getContent('Mixed'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_urbanTotalShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_urbanTotal.chartSeries,
            title: {
                text: $scope.Label.getContent('Total'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_ruralOnlineShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralOnline.chartSeries,
            title: {
                text: $scope.Label.getContent('Online Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_ruralBMShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralBM.chartSeries,
            title: {
                text: $scope.Label.getContent('B&M Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.E_ruralMixedShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralMixed.chartSeries,
            title: {
                text: $scope.Label.getContent('Mixed'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }

        $scope.E_ruralTotalShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: E_ruralTotal.chartSeries,
            title: {
                text: $scope.Label.getContent('Total'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }


        //Category H:
        $scope.H_urbanOnlineShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanOnline.chartSeries,
            title: {
                text: $scope.Label.getContent('Online Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_urbanBMShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanBM.chartSeries,
            title: {
                text: $scope.Label.getContent('B&M Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_urbanMixedShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanMixed.chartSeries,
            title: {
                text: $scope.Label.getContent('Mixed'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_urbanTotalShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_urbanTotal.chartSeries,
            title: {
                text: $scope.Label.getContent('Total'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_ruralOnlineShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralOnline.chartSeries,
            title: {
                text: $scope.Label.getContent('Online Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_ruralBMShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralBM.chartSeries,
            title: {
                text: $scope.Label.getContent('B&M Only'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.H_ruralMixedShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralMixed.chartSeries,
            title: {
                text: $scope.Label.getContent('Mixed'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }

        $scope.H_ruralTotalShareOfShoppers = {
            options: {
                xAxis: {
                    categories: periodsShown,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: H_ruralTotal.chartSeries,
            title: {
                text: $scope.Label.getContent('Total'),
                style: {
                    'font-size': '16px'
                }
            },
            loading: false
        }
        $scope.myModel = $scope.H_ruralTotalShareOfShoppers;
    }


    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}