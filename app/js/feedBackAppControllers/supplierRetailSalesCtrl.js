var supplierRetailSalesCtrl = function($scope, $http, PlayerColor, Label) {
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
                data: [null, null, null, null, null],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }],
            categories: [periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1]],
            subCategories: [Label.getContent('Total Market'), Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks')]

        };
        var list = {};

        for (var i = 0; i < 5 * periods.length; i++) {
            result.data[0].data[i] = result.data[1].data[i] = result.data[2].data[i] = result.data[3].data[i] = result.data[4].data[i] = 1;
        }

        // periods.forEach(function(singlePeriod, periodIndex) {
        //     //period
        //     data.forEach(function(singleData) {
        //         lists = _.filter(data, function(obj) {
        //             return (obj.period == singlePeriod && obj.categoryID == categoryID && obj.marketID == marketID);
        //         })
        //         lists.forEach(function(singleList) {
        //             switch (singleList.shopperKind) {
        //                 case 'BMS':
        //                     if (singleList.storeID == 8) {
        //                         result.data[0].data[periodIndex] = singleList.importance * 100;
        //                     }
        //                     break;
        //                 case 'NETIZENS':
        //                     if (singleList.storeID == 8) {
        //                         result.data[1].data[periodIndex] = singleList.importance * 100;
        //                     }
        //                     break;
        //                 case 'MIXED':
        //                     if (singleList.storeID == 8) {
        //                         result.data[2].data[periodIndex] = singleList.importance * 100;
        //                     }
        //                     break;
        //                 case 'ALLSHOPPERS':
        //                     if (singleList.storeID == 4) {
        //                         result.data[5].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 5) {
        //                         result.data[6].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 6) {
        //                         result.data[7].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 1) {
        //                         result.data[8].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 2) {
        //                         result.data[9].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 3) {
        //                         result.data[10].data[3 + periodIndex] = singleList.importance * 100;
        //                     }
        //                     if (singleList.storeID == 8) {
        //                         result.categories[periodIndex] = singleList.absolute.toFixed(2);
        //                         result.categories[3 + periodIndex] = singleList.absolute.toFixed(2);
        //                     }
        //                     break;
        //             }
        //         })

        //     })
        // });
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            periods.push(i);
        }
        var result = {
            'ele': {
                data: {},
                categories: {},
                subCategories: {}
            },
            'hea': {
                data: {},
                categories: {},
                subCategories: {}
            }
        }
        result.ele = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 1);
        result.hea = organiseArray($scope.feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 2);

        $scope.eleRetailSales = {
            options: {
                xAxis: [{
                    categories: result.ele.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.ele.subCategories,
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
                                if (this.y != null) {
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
            series: result.ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.heaRetailSales = {
            options: {
                xAxis: [{
                    categories: result.hea.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: result.hea.subCategories,
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
                                if (this.y != null) {
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
            series: result.hea.data,
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