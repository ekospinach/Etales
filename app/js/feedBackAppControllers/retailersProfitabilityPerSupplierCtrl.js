var retailersProfitabilityPerSupplierCtrl = function($scope, $http, PlayerColor, StaticValues) {

    var organiseTableArray = function(data, marketID, categoryID, retailerID) {
        var retailerDetail = {
            salesValues: {},
            rotations: {},
            grossContributions: {},
            grossContributionPerShelfSpaces: {},
            shelfSpaces: {},
            salesValueShare: {},
            grossContributionShares: {}
        };
        var list = _.filter(data, function(obj) {
            return (obj.marketID == marketID && obj.categoryID == categoryID && obj.BMRetailerID == retailerID);
        });
        list.forEach(function(singleData) {
            switch (singleData.supplierID) {
                case 1:
                    retailerDetail.salesValues.supplier1 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier1 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier1 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier1 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier1 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier1 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier1 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                case 2:
                    retailerDetail.salesValues.supplier2 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier2 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier2 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier2 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier2 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier2 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier2 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                case 3:
                    retailerDetail.salesValues.supplier3 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier3 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier3 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier3 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier3 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier3 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier3 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                default:
                    retailerDetail.salesValues.privateLabel = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.privateLabel = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.privateLabel = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.privateLabel = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.privateLabel = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.privateLabel = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.privateLabel = singleData.xfrpps_GrossContributionShare * 100;
                    break;
            }
        })
        return retailerDetail;
    }

    var initPage = function() {
        var data = {
            'retailer_1': {
                'urban_ele': {},
                'urban_hea': {},
                'rural_ele': {},
                'rural_hea': {}
            },
            'retailer_2': {
                'urban_ele': {},
                'urban_hea': {},
                'rural_ele': {},
                'rural_hea': {}
            }
        }
        data.retailer_1.urban_ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 1, 1); // market category retailer
        data.retailer_1.urban_hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 2, 1);
        data.retailer_1.rural_ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 1, 1);
        data.retailer_1.rural_hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 2, 1);
        data.retailer_2.urban_ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 1, 2);
        data.retailer_2.urban_hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 2, 2);
        data.retailer_2.rural_ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 1, 2);
        data.retailer_2.rural_hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 2, 2);
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