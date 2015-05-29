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
                                if (singleList.accountID != 4) {
                                    result.data[singleList.accountID - 1].data[periodIndex] = singleList.value;
                                } else {
                                    result.data[singleData.accountID - 1].data[periodIndex] = {
                                        y: singleList.value,
                                        color: PlayerColor.s1
                                    }
                                }
                                break;
                            case 2:
                                if (singleList.accountID != 4) {
                                    result.data[singleList.accountID - 1].data[periodIndex + 2] = singleList.value;
                                } else {
                                    result.data[singleData.accountID - 1].data[periodIndex + 2] = {
                                        y: singleList.value,
                                        color: PlayerColor.s2
                                    }
                                }
                                break;
                            case 3:
                                if (singleList.accountID != 4) {
                                    result.data[singleList.accountID - 1].data[periodIndex + 4] = singleList.value;
                                } else {
                                    result.data[singleData.accountID - 1].data[periodIndex + 4] = {
                                        y: singleList.value,
                                        color: PlayerColor.s3
                                    }
                                }
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

    var originPortfolioAarray=function(data,periods,categoryID){
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
                name: Label.getContent('Supplier')+' 1',
                data: [],
                color: PlayerColor.s1
            }, {
                name: Label.getContent('Supplier')+' 2',
                data: [],
                color: PlayerColor.s2
            }, {
                name: Label.getContent('Supplier')+' 3',
                data: [],
                color: PlayerColor.s3
            }],
            categories: [periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1], periods[0], periods[1]],
            subCategories: [Label.getContent('Supplier') + ' 1', Label.getContent('Supplier') + ' 2', Label.getContent('Supplier') + ' 3', Label.getContent('Retailer') + ' 1', Label.getContent('Retailer') + ' 2']

        };
    }

    var dataTest=function(){
        console.log('Financialand Page Test:');
        var result=0;
        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==-1&&obj.ownerID==1&&obj.accountID==1);
        });
        console.log('supplier 1 Period -1 retailer 1 value:'+result.value);
        
        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==0&&obj.ownerID==2&&obj.accountID==2);
        });
        console.log('supplier 2 Period 0 retailer 2 value:'+result.value);
        
        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==-1&&obj.ownerID==3&&obj.accountID==3);
        });
        console.log('supplier 3 Period -1 trade value:'+result.value);

        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==0&&obj.ownerID==3&&obj.accountID==4);
        });
        console.log('supplier 3 Period 0 online value:'+result.value);
        
        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==0&&obj.ownerID==5&&obj.accountID==1);
        });
        console.log('retailer 1 Period 0  retailer1 value:'+result.value);
        
        result=_.find($scope.feedback.xf_BrandOwnersChannelSalesValue,function(obj){
            return (obj.marketID==3&&obj.categoryID==1&&obj.period==-1&&obj.ownerID==6&&obj.accountID==2);
        });
        console.log('retailer 2 Period -1 retailer1 value:'+result.value);
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
        dataTest();
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
                        stacking: 'normal'
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
                        stacking: 'normal'
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
                        stacking: 'normal'
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
                        stacking: 'normal'
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
                        stacking: 'normal'
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
                        stacking: 'normal'
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