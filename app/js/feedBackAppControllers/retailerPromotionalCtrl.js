var retailerPromotionalCtrl = function($scope, $http, PlayerColor, Label) {
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

    var organiseTableArray = function(data, categoryID,marketID){
        
    }

    var organiseChartArray = function(data, periods) {

        var result = {
            data: [{
                name: Label.getContent('Retailer') +' 1',
                data: [5,4,null,2,1],
                color: PlayerColor.r1,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') +' 2',
                data: [1,2,null,4,5],
                color: PlayerColor.r2,
                xAxis: 0
            },{
                name: ' ',
                data: [null, null],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }]
        }

        // for (var i = 0; i < 2 * periods.length + 1; i++) {
        //     result.data[0].data[i] = 1;
        //     result.data[1].data[i] = 1;
        //     result.data[2].data[i] = 1;
        //     result.data[4].data[i] = 1;
        // }

        // periods.forEach(function(singlePeriod, periodIndex) {
        //     data.forEach(function(singleData) {
        //         if (singleData.marketID == marketID && singleData.period == singlePeriod) {
        //             switch (singleData.categoryID) {
        //                 case 1:
        //                     result.data[0].data[periodIndex] = singleData.BMS_importance * 100;
        //                     result.data[1].data[periodIndex] = singleData.NETIZENS_importance * 100;
        //                     result.data[2].data[periodIndex] = singleData.MIXED_importance * 100;
        //                     result.data[4].data[periodIndex] = null;
        //                     result.categories[periodIndex] = singleData.totalMarket.toFixed(2);
        //                     break;
        //                 case 2:
        //                     result.data[0].data[3 + periodIndex] = singleData.BMS_importance * 100;
        //                     result.data[1].data[3 + periodIndex] = singleData.NETIZENS_importance * 100;
        //                     result.data[2].data[3 + periodIndex] = singleData.MIXED_importance * 100;
        //                     result.data[4].data[3 + periodIndex] = null;
        //                     result.categories[3 + periodIndex] = singleData.totalMarket.toFixed(2);
        //                     break;
        //             }
        //         }
        //     })
        // })
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
            }
        }
        result.retailerLocalAdvertising = organiseChartArray($scope.feedback.xf_ShoppersSegmentsShares, periods);

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
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.series.name + ' : <b>' + this.point.y.toFixed(2) +' '+ Label.getContent('$mln')+'</b></p>';
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
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}