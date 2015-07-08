var marketEvolutionCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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


    var loadConsumerSegment = function(data, category, market, periods) {
        var result = {};
        var series = [{
            name: Label.getContent('Price Sensitive'),
            data: [],
            color: PlayerColor.price
        }, {
            name: Label.getContent('Value for Money'),
            data: [],
            color: PlayerColor.value
        }, {
            name: Label.getContent('Fashion') + ' / ' + Label.getContent('Health Conscious'),
            data: [],
            color: PlayerColor.fashion

        }, {
            name: Label.getContent('Freaks') + ' / ' + Label.getContent('Impatient'),
            data: [],
            color: PlayerColor.freaks
        }]
        periods.forEach(function(singlePeriod) {
            data.forEach(function(singleData) {
                if (singleData.period == singlePeriod && singleData.categoryID == category && singleData.marketID == market) {
                    if (singleData.segmentID != 5) {
                        series[singleData.segmentID - 1].data[singleData.period + 3] = singleData.value;
                    }
                }
            })
        })

        result = {
            options: {
                xAxis: {
                    categories: periods,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Period') + ':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '</p>';
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
            series: series,
            loading: false
        }

        return result;


    }

    var loadShopperSegment = function(data, category, market, periods) {
        var result = {};
        var series = [{
            name: Label.getContent('B&M Only'),
            data: [],
            color: PlayerColor.bm
        }, {
            name: Label.getContent('Online Only'),
            data: [],
            color: PlayerColor.online
        }, {
            name: Label.getContent('Mixed'),
            data: [],
            color: PlayerColor.mixed

        }]
        periods.forEach(function(singlePeriod) {
            data.forEach(function(singleData) {
                if (singleData.period == singlePeriod && singleData.categoryID == category && singleData.marketID == market) {
                    series[0].data[singleData.period + 3] = singleData.BMS_importance;
                    series[1].data[singleData.period + 3] = singleData.NETIZENS_importance;
                    series[2].data[singleData.period + 3] = singleData.MIXED_importance;
                }
            })
        })

        result = {
            options: {
                xAxis: {
                    categories: periods,
                    title: {
                        text: $scope.Label.getContent('Period'),
                    }
                },
                yAxis: {
                    title: {
                        text: '',
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Period') + ':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '</p>';
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
            series: series,
            loading: false
        }

        return result;

    }


    var initPage = function() {
        var Request = GetRequest();
        var result = {
            'consumer': {
                'ele_urban': {},
                'ele_rural': {},
                'hea_urban': {},
                'hea_rural': {}
            },
            'shopper': {
                'ele_urban': {},
                'ele_rural': {},
                'hea_urban': {},
                'hea_rural': {}
            }
        }
        var periodsShown = [];

        for (var i = -3; i <= Request['period']; i++) {
            periodsShown.push(i);
        }
        result.consumer.ele_urban = loadConsumerSegment($scope.feedback.xf_ConsumerSegmentsShares, 1, 1, periodsShown);
        result.consumer.ele_urban.title = {
            'text': Label.getContent('Elecssories') + ' ' + Label.getContent('Urban')
        };
        result.consumer.ele_rural = loadConsumerSegment($scope.feedback.xf_ConsumerSegmentsShares, 1, 2, periodsShown);
        result.consumer.ele_rural.title = {
            'text': Label.getContent('Elecssories') + ' ' + Label.getContent('Rural')
        };
        result.consumer.hea_urban = loadConsumerSegment($scope.feedback.xf_ConsumerSegmentsShares, 2, 1, periodsShown);
        result.consumer.hea_urban.title = {
            'text': Label.getContent('HealthBeauties') + ' ' + Label.getContent('Urban')
        }
        result.consumer.hea_rural = loadConsumerSegment($scope.feedback.xf_ConsumerSegmentsShares, 2, 2, periodsShown);
        result.consumer.hea_rural.title = {
            'text': Label.getContent('HealthBeauties') + ' ' + Label.getContent('Rural')
        }

        result.shopper.ele_urban = loadShopperSegment($scope.feedback.xf_ShoppersSegmentsShares, 1, 1, periodsShown);
        result.shopper.ele_urban.title = {
            'text': Label.getContent('Elecssories') + ' ' + Label.getContent('Urban')
        };
        result.shopper.ele_rural = loadShopperSegment($scope.feedback.xf_ShoppersSegmentsShares, 1, 2, periodsShown);
        result.shopper.ele_rural.title = {
            'text': Label.getContent('Elecssories') + ' ' + Label.getContent('Rural')
        };
        result.shopper.hea_urban = loadShopperSegment($scope.feedback.xf_ShoppersSegmentsShares, 2, 1, periodsShown);
        result.shopper.hea_urban.title = {
            'text': Label.getContent('HealthBeauties') + ' ' + Label.getContent('Urban')
        }
        result.shopper.hea_rural = loadShopperSegment($scope.feedback.xf_ShoppersSegmentsShares, 2, 2, periodsShown);
        result.shopper.hea_rural.title = {
            'text': Label.getContent('HealthBeauties') + ' ' + Label.getContent('Rural')
        }


        $scope.marketEvolution = result;
        $scope.myModel = 'marketEvolution';
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}