var negotiationResultsCtrl = function($scope, $http, $q, StaticValues, PlayerColor) {
    
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
    var initPage = function() {

        //Negotiation Results
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
                    y: $scope.feedBack.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.feedBack.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.feedBack.f_DiscountsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierNegotiationResultsTotal = ($scope.feedBack.f_DiscountsValue[StaticValues.category.total].totalValue).toFixed(2);

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
                    y: $scope.feedBack.f_DiscountsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.feedBack.f_DiscountsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
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
                    y: $scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierPerformanceBonusesTotal = ($scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].totalValue).toFixed(2);

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
                    y: $scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.feedBack.f_PerformanceBonusesValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
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
                    y: $scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s1].value,
                    color: PlayerColor.s1
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-2',
                    y: $scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s2].value,
                    color: PlayerColor.s2
                }, {
                    'name': $scope.Label.getContent('Supplier')+'-3',
                    y: $scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].fcni_SuppliersCost[StaticValues.player.s3].value,
                    color: PlayerColor.s3
                }]
            }],
            loading: false
        }

        $scope.supplierOtherCompensationTotal = ($scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].totalValue).toFixed(2);

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
                    y: $scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r1].value,
                    color: PlayerColor.r1
                }, {
                    'name': $scope.Label.getContent('Retailer')+'-2',
                    y: $scope.feedBack.f_OtherCompensationsValue[StaticValues.category.total].fcni_RetailersBenefits[StaticValues.player.r2].value,
                    color: PlayerColor.r2
                }]
            }],
            loading: false
        }


        var termsofPayment = new Array();

        $scope.feedBack.f_TransactionsPerTOP.forEach(function(singleData){
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


    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}