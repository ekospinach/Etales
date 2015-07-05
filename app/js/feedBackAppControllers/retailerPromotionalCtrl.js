var retailerPromotionalCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var loadPromotion = function(data, category) {
        var result = {
            player1s: [],
            player2s: [],
            player3s: [],
            player5s: [],
            player6s: []
        }

        data.variantInfo.forEach(function(singleData) {
            if (singleData.parentCategoryID == category) {
                var fullName = singleData.parentBrandName + singleData.variantName;
                var rural1Length = rural1Depth = urban1Length = urban1Depth = rural2Length = rural2Depth = urban2Length = urban2Depth = 0;

                //depth=variantInfo[].accountInfo[retailerID-1].promoRate[catrgoryID-1]
                //length=variantInfo[].accountInfo[retailerID-1].promoFrequency[categoryID-1]
                //variantInfo[].parentCompanyID decide player num
                //player 1 2 3 -->supplier
                //player 5 6 -->retailer

                if (singleData.accountInfo[StaticValues.player.r1] != undefined) {
                    if (singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea] != 0) {
                        rural1Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea] * 100 * 100) / 100);
                    } else {
                        rural1Depth = singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea];
                    }
                    rural1Length = singleData.accountInfo[StaticValues.player.r1].promoFrequency[StaticValues.category.hea];
                    if (singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele] != 0) {
                        urban1Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele] * 100 * 100) / 100);
                    } else {
                        urban1Depth = singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele];
                    }
                    urban1Length = singleData.accountInfo[StaticValues.player.r1].promoFrequency[StaticValues.category.ele];
                }
                if (singleData.accountInfo[StaticValues.player.r2] != undefined) {
                    if (singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea] != 0) {
                        rural2Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea] * 100 * 100) / 100);
                    } else {
                        rural2Depth = singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea];
                    }
                    rural2Length = singleData.accountInfo[StaticValues.player.r2].promoFrequency[StaticValues.category.hea];
                    if (singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele] != 0) {
                        urban2Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele] * 100 * 100) / 100);
                    } else {
                        urban2Depth = singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele];

                    }
                    urban2Length = singleData.accountInfo[StaticValues.player.r2].promoFrequency[StaticValues.category.ele];
                }
                switch (singleData.parentCompanyID) {
                    case 1:
                        result.player1s.push({
                            'fullName': fullName,
                            'rural1Length': rural1Length,
                            'rural1Depth': rural1Depth,
                            'urban1Length': urban1Length,
                            'urban1Depth': urban1Depth,
                            'rural2Length': rural2Length,
                            'rural2Depth': rural2Depth,
                            'urban2Length': urban2Length,
                            'urban2Depth': urban2Depth
                        });
                        break;
                    case 2:
                        result.player2s.push({
                            'fullName': fullName,
                            'rural1Length': rural1Length,
                            'rural1Depth': rural1Depth,
                            'urban1Length': urban1Length,
                            'urban1Depth': urban1Depth,
                            'rural2Length': rural2Length,
                            'rural2Depth': rural2Depth,
                            'urban2Length': urban2Length,
                            'urban2Depth': urban2Depth
                        });
                        break;
                    case 3:
                        result.player3s.push({
                            'fullName': fullName,
                            'rural1Length': rural1Length,
                            'rural1Depth': rural1Depth,
                            'urban1Length': urban1Length,
                            'urban1Depth': urban1Depth,
                            'rural2Length': rural2Length,
                            'rural2Depth': rural2Depth,
                            'urban2Length': urban2Length,
                            'urban2Depth': urban2Depth
                        });
                        break;
                    case 5:
                        result.player5s.push({
                            'fullName': fullName,
                            'rural1Length': rural1Length,
                            'rural1Depth': rural1Depth,
                            'urban1Length': urban1Length,
                            'urban1Depth': urban1Depth,
                            'rural2Length': rural2Length,
                            'rural2Depth': rural2Depth,
                            'urban2Length': urban2Length,
                            'urban2Depth': urban2Depth
                        });
                        break;
                    case 6:
                        result.player6s.push({
                            'fullName': fullName,
                            'rural1Length': rural1Length,
                            'rural1Depth': rural1Depth,
                            'urban1Length': urban1Length,
                            'urban1Depth': urban1Depth,
                            'rural2Length': rural2Length,
                            'rural2Depth': rural2Depth,
                            'urban2Length': urban2Length,
                            'urban2Depth': urban2Depth
                        });
                        break;
                }
            }
        })
        return result;
    }

    var organiseChartArray = function(data,periods) {

        var result = {
            data: [{
                name: Label.getContent('Retailer') + ' 1',
                data: [null, null, null, null, null],
                color: PlayerColor.r1,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [null, null, null, null, null],
                color: PlayerColor.r2,
                xAxis: 0
            }, {
                name: ' ',
                data: [null, null],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }]
        }



        periods.forEach(function(singlePeriod, periodIndex) {
            data.forEach(function(singleData) {
                if (singleData.period == singlePeriod) {

                    if (singleData.marketID == 1) {
                        switch (singleData.retailerID) {
                            case 1:
                                result.data[0].data[periodIndex] = singleData.value;
                                break;
                            case 2:
                                result.data[1].data[periodIndex] = singleData.value;
                                break;
                        }
                    } else if (singleData.marketID == 2) {
                        switch (singleData.retailerID) {
                            case 1:
                                result.data[0].data[3 + periodIndex] = singleData.value;
                                break;
                            case 2:
                                result.data[1].data[3 + periodIndex] = singleData.value;
                                break;
                        }
                    }

                }
            })
        })
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        $scope.categories = [];
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
            periods.push(i);
        }
        $scope.categories.push(' ');
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
        }
        var result = {
            'retailerLocalAdvertising': {
                data: {}
            },
            'ele': {},
            'hea': {}
        }
        result.retailerLocalAdvertising = organiseChartArray($scope.feedback.xf_RetailersLocalAdvertising, periods);

        $scope.retailerLocalAdvertising = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Urban Market'), Label.getContent('Rural Market')],
                    labels: {
                        style: {
                            fontSize: '20px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: '',
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
                        text: Label.getContent('$mln')
                    }
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) + ' ' + Label.getContent('$mln') + '</b></p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                legend: {
                    borderWidth: 0,
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
                                    return this.y.toFixed(2)
                                } else {
                                    return "";
                                }

                            }
                        }
                    },
                    series: {
                        stacking: 'normal'
                    }
                },

            },
            title: {
                text: ''
            },
            series: result.retailerLocalAdvertising.data,
            credits: {
                enabled: false
            },
            loading: false
        }

        result.ele = loadPromotion($scope.pricePromotions, StaticValues.categoryID.ele);
        result.hea = loadPromotion($scope.pricePromotions, StaticValues.categoryID.hea);
        $scope.result = result;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}