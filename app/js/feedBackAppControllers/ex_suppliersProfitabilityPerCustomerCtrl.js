var suppliersProfitabilityPerCustomerCtrl = function($scope, $http, PlayerColor, StaticValues) {

    var supplierProfitabilityPerCustomerSchema = {
        marketID: 1,
        categoryID: 1,

        xfsppr_SalesValue: 1,
        xfsppr_GrossProfit: 1,
        xfsppr_TradeSupport: 1,
        xfsppr_TradeProfit: 1,
        xfsppr_VisibilityShare: 1,
        xfsppr_TradeSupportShare: 1,
        xfsppr_SalesValueShare: 1,
        xfsppr_GrossProfitShare: 1,
        xfsppr_TradeProfitShare: 1,
    }

    var organiseTableArray = function(data, supplierID, categoryID) {
        var supplierDetail = {
            salesValues: {},
            grossProfits: {},
            tradeSupports: {},
            tradeProfits: {},
            visibilityShares: {},
            tradeSupportShares: {},
            salesValueShares: {},
            grossProfitShares: {},
            tradeProfitShares: {}
        };
        var list = _.filter(data, function(obj) {
            return (obj.categoryID == categoryID && obj.supplierID == supplierID && obj.marketID == 3); //supplierID
        });
        list.forEach(function(singleData) {
            switch (singleData.accountID) { //bmretailerid
                case 1:
                    supplierDetail.salesValues.retailer1 = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.retailer1 = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.retailer1 = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.retailer1 = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.retailer1 = singleData.xfsppr_VisibilityShare*100;
                    supplierDetail.tradeSupportShares.retailer1 = singleData.xfsppr_TradeSupportShare*100;
                    supplierDetail.salesValueShares.retailer1 = singleData.xfsppr_SalesValueShare*100;
                    supplierDetail.grossProfitShares.retailer1 = singleData.xfsppr_GrossProfitShare*100;
                    supplierDetail.tradeProfitShares.retailer1 = singleData.xfsppr_TradeProfitShare*100;
                    break;
                case 2:
                    supplierDetail.salesValues.retailer2 = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.retailer2 = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.retailer2 = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.retailer2 = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.retailer2 = singleData.xfsppr_VisibilityShare*100;
                    supplierDetail.tradeSupportShares.retailer2 = singleData.xfsppr_TradeSupportShare*100;
                    supplierDetail.salesValueShares.retailer2 = singleData.xfsppr_SalesValueShare*100;
                    supplierDetail.grossProfitShares.retailer2 = singleData.xfsppr_GrossProfitShare*100;
                    supplierDetail.tradeProfitShares.retailer2 = singleData.xfsppr_TradeProfitShare*100;
                    break;
                case 3:
                    supplierDetail.salesValues.tt = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.tt = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.tt = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.tt = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.tt = singleData.xfsppr_VisibilityShare*100;
                    supplierDetail.tradeSupportShares.tt = singleData.xfsppr_TradeSupportShare*100;
                    supplierDetail.salesValueShares.tt = singleData.xfsppr_SalesValueShare*100;
                    supplierDetail.grossProfitShares.tt = singleData.xfsppr_GrossProfitShare*100;
                    supplierDetail.tradeProfitShares.tt = singleData.xfsppr_TradeProfitShare*100;
                    break;
                case 4:
                    supplierDetail.salesValues.online = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.online = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.online = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.online = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.online = singleData.xfsppr_VisibilityShare*100;
                    supplierDetail.tradeSupportShares.online = singleData.xfsppr_TradeSupportShare*100;
                    supplierDetail.salesValueShares.online = singleData.xfsppr_SalesValueShare*100;
                    supplierDetail.grossProfitShares.online = singleData.xfsppr_GrossProfitShare*100;
                    supplierDetail.tradeProfitShares.online = singleData.xfsppr_TradeProfitShare*100;
                    break;
            }
        });
        return supplierDetail;

    }

    var initPage = function() {
        var data = {
            'supplier_1': {
                'ele': {},
                'hea': {}
            },
            'supplier_2': {
                'ele': {},
                'hea': {}
            },
            'supplier_3': {
                'ele': {},
                'hea': {}
            },
        };
        data.supplier_1.ele = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 1, 1);
        data.supplier_1.hea = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 1, 2);

        data.supplier_2.ele = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 2, 1);
        data.supplier_2.hea = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 2, 2);

        data.supplier_3.ele = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 3, 1);
        data.supplier_3.hea = organiseTableArray($scope.feedback.xf_SuppliersProfitabilityPerCustomer, 3, 2);
        $scope.data = data;

        $scope.supplierNegotiationResults = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Volume Discounts given by Suppliers'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Supplier')+'-1',
                    y: $scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierNegotiationResultsTotal = ($scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].totalValue).toFixed(2);

        $scope.retailerNegotiationResults = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Volume Discounts given by Retailers'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Retailer')+'-1',
                    y: $scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.normalfeedback.f_DiscountsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
                    color: PlayerColor.r2
                }]
            }],
            loading: false
        }

        $scope.supplierPerformanceBonuses = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Performance Bonuses given by Suppliers'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Supplier')+'-1',
                    y: $scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierPerformanceBonusesTotal = ($scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].totalValue).toFixed(2);

        $scope.retailerPerformanceBonuses = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Performance Bonuses received by Retailers'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Retailer')+'-1',
                    y: $scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.normalfeedback.f_PerformanceBonusesValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
                    color: PlayerColor.r2
                }]
            }],
            loading: false
        }

        $scope.supplierOtherCompensation = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Other Compensation given by Suppliers'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Supplier')+'-1',
                    y: $scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierOtherCompensationTotal = ($scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].totalValue).toFixed(2);

        $scope.retailerOtherCompensation = {
            options: {
                title: {
                    text: $scope.Label.getContent('Breakdown of Other Compensation received by Retailers'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -100,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: [{
                    'name': $scope.Label.getContent('Retailer')+'-1',
                    y: $scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.normalfeedback.f_OtherCompensationsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
                    color: PlayerColor.r2
                }]
            }],
            loading: false
        }


        var termsofPayment = new Array();

        $scope.normalfeedback.f_TransactionsPerTOP.forEach(function(singleData){
            if (singleData.categoryID == 3) {
                if (singleData.topDays == 0) {
                    if (singleData.value != 0) {
                        termsofPayment.push({
                            name: $scope.Label.getContent('COD'),
                            y: singleData.value
                        })
                    }
                } else {
                    if (singleData.value != 0) {
                        termsofPayment.push({
                            name: singleData.topDays * 15 + ' ' + $scope.Label.getContent('Days'),
                            y: singleData.value
                        })
                    }
                }
            }
        })


        $scope.termsofPayment = {
            options: {
                title: {
                    text: $scope.Label.getContent('Transaction Values by Terms of Payment'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'pie',
                    backgroundColor: 'transparent',
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p><b>' + this.key + '</b></p>' + '<p>' + this.point.y.toFixed(2) + $scope.Label.getContent('$mln')+'</p>' + '<p>' + this.point.percentage.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            distance: -80,
                            rotation: 0,
                            color: 'white',
                            format: '<p style="font-size:16px">{point.name}</br>' + '{point.y:.2f}'+ $scope.Label.getContent('$mln')+'</br>' + '{point.percentage:.2f}%</br></p>',
                            useHTML: true
                        },
                        showInLegend: true
                    }
                },
                credits: {
                    enabled: false
                }
            },
            series: [{
                type: 'pie',
                data: termsofPayment
            }],
            loading: false
        }
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}