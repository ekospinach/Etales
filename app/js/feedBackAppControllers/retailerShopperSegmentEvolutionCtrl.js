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

    var feedback = {
        xf_ShoppersSegmentsShares: [{
            period: -1,
            categoryID: 1,
            marketID: 1,
            totalMarket: 11,
            BMS_importance: 11,
            NETIZENS_importance: 12,
            MIXED_importance: 13,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -1,
            categoryID: 1,
            marketID: 2,
            totalMarket: 12,
            BMS_importance: 12,
            NETIZENS_importance: 13,
            MIXED_importance: 14,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -1,
            categoryID: 2,
            marketID: 1,
            totalMarket: 21,
            BMS_importance: 21,
            NETIZENS_importance: 22,
            MIXED_importance: 23,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -1,
            categoryID: 2,
            marketID: 2,
            totalMarket: 22,
            BMS_importance: 22,
            NETIZENS_importance: 23,
            MIXED_importance: 24,
            ALLSHOPPERS_importance: 1,
        }, {
            period: 0,
            categoryID: 1,
            marketID: 1,
            totalMarket: 111,
            BMS_importance: 111,
            NETIZENS_importance: 112,
            MIXED_importance: 113,
            ALLSHOPPERS_importance: 1,
        }, {
            period: 0,
            categoryID: 1,
            marketID: 2,
            totalMarket: 112,
            BMS_importance: 112,
            NETIZENS_importance: 113,
            MIXED_importance: 114,
            ALLSHOPPERS_importance: 1,
        }, {
            period: 0,
            categoryID: 2,
            marketID: 1,
            totalMarket: 121,
            BMS_importance: 121,
            NETIZENS_importance: 122,
            MIXED_importance: 123,
            ALLSHOPPERS_importance: 1,
        }, {
            period: 0,
            categoryID: 2,
            marketID: 2,
            totalMarket: 122,
            BMS_importance: 122,
            NETIZENS_importance: 123,
            MIXED_importance: 124,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -2,
            categoryID: 1,
            marketID: 1,
            totalMarket: 211,
            BMS_importance: 211,
            NETIZENS_importance: 212,
            MIXED_importance: 213,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -2,
            categoryID: 1,
            marketID: 2,
            totalMarket: 212,
            BMS_importance: 212,
            NETIZENS_importance: 213,
            MIXED_importance: 214,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -2,
            categoryID: 2,
            marketID: 1,
            totalMarket: 221,
            BMS_importance: 221,
            NETIZENS_importance: 222,
            MIXED_importance: 223,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -2,
            categoryID: 2,
            marketID: 2,
            totalMarket: 222,
            BMS_importance: 222,
            NETIZENS_importance: 223,
            MIXED_importance: 224,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -3,
            categoryID: 1,
            marketID: 1,
            totalMarket: 311,
            BMS_importance: 311,
            NETIZENS_importance: 312,
            MIXED_importance: 313,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -3,
            categoryID: 1,
            marketID: 2,
            totalMarket: 312,
            BMS_importance: 312,
            NETIZENS_importance: 313,
            MIXED_importance: 314,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -3,
            categoryID: 2,
            marketID: 1,
            totalMarket: 321,
            BMS_importance: 321,
            NETIZENS_importance: 322,
            MIXED_importance: 323,
            ALLSHOPPERS_importance: 1,
        }, {
            period: -3,
            categoryID: 2,
            marketID: 2,
            totalMarket: 322,
            BMS_importance: 322,
            NETIZENS_importance: 323,
            MIXED_importance: 324,
            ALLSHOPPERS_importance: 1,
        }]
    }


    var organiseArray = function(data,periods, marketID) {

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
                data: [0, 0],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }, {
                name: ' ',
                data: [],
                color: 'transparent',
                xAxis: 2, //第二个X轴
            }],
            categories: []
        }

        periods.forEach(function(singlePeriod){
            data.forEach(function(singleData) {
                if (singleData.marketID == marketID&&singleData.period==singlePeriod) {
                    switch (singleData.categoryID) {
                        case 1:
                            result.data[0].data[singleData.period + 3] = singleData.BMS_importance;
                            result.data[1].data[singleData.period + 3] = singleData.NETIZENS_importance;
                            result.data[2].data[singleData.period + 3] = singleData.MIXED_importance;
                            result.data[4].data[singleData.period + 3] = 0;
                            result.categories[singleData.period + 3] = singleData.totalMarket;
                            break;
                        case 2:
                            result.data[0].data[($scope.categories.length - 1) / 2 + singleData.period + 4] = singleData.BMS_importance;
                            result.data[1].data[($scope.categories.length - 1) / 2 + singleData.period + 4] = singleData.NETIZENS_importance;
                            result.data[2].data[($scope.categories.length - 1) / 2 + singleData.period + 4] = singleData.MIXED_importance;
                            result.data[4].data[($scope.categories.length - 1) / 2 + singleData.period + 4] = 0;
                            result.categories[($scope.categories.length - 1) / 2 + singleData.period + 4] = singleData.totalMarket;
                            break;
                    }
                }
            })
        })

        result.data[0].data[($scope.categories.length - 1) / 2] = 0;
        result.data[1].data[($scope.categories.length - 1) / 2] = 0;
        result.data[2].data[($scope.categories.length - 1) / 2] = 0;
        result.data[4].data[($scope.categories.length - 1) / 2] = 0;
        result.categories[($scope.categories.length - 1) / 2] = ' ';
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        $scope.categories = [];
        $scope.subCategories = [];
        for (var i = -3; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
            periods.push(i);
        }
        $scope.categories.push(' ');
        $scope.subCategories.push(' ');
        for (var i = -3; i <= Request['period']; i++) {
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
        result.urban = organiseArray(feedback.xf_ShoppersSegmentsShares,periods, 1);
        result.rural = organiseArray(feedback.xf_ShoppersSegmentsShares,periods, 2);

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
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Market Size'),
                        style: {
                            'font-size': '16px',
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
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
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
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Market Size'),
                        style: {
                            'font-size': '16px',
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
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
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