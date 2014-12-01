var retailerKPIsCtrl = function($scope, $http, PlayerColor) {
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
        var Request = GetRequest();
        var url = '/getFeedBack/' + Request['seminar'] + '/' + Request['period'];
        var showCategories = [];
        var currentCategories = [];
        var previousCategories = [];

        for (var i = -3; i <= Request['period']; i++) {
            if (i != Request['period']) {
                currentCategories.push(i);
                previousCategories.push(i);
            } else {
                currentCategories.push(i);
            }
        }

        specialCategories = [Request['period'] - 1, Request['period']];
        showCategories = [Request['period'] - 1, Request['period'], '', Request['period'] - 1, Request['period']];

        var salesValueElecssories = [];

        var rotationIndexSalesValueElecssories = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var rotationIndexSalesValueHealthBeauties = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var rotationIndexSalesVolumeElecssories = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var rotationIndexSalesVolumeHealthBeauties = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });

        var previousUrbanProfitabilityIndex = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var currentUrbanProfitabilityIndex = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var previousRuralProfitabilityIndex = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var currentRuralProfitabilityIndex = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });

        var ruralStockCover = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var urbanStockCover = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var EStockCover = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var HStockCover = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });

        var ruralShareOfShoppers = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var urbanShareOfShoppers = new Array({
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });

        //rotationIndexSalesValue

        specialCategories.forEach(function(single){
            $scope.feedBack.f_RetailersValueRotationIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        if (singleData.marketID == 1) {
                            rotationIndexSalesValueElecssories[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    } else if (singleData.categoryID == 2) {
                        if (singleData.marketID == 1) {
                            rotationIndexSalesValueHealthBeauties[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })

        for (var i = 0; i < 2; i++) {
            rotationIndexSalesValueElecssories[i].data.push('');
            rotationIndexSalesValueHealthBeauties[i].data.push('');
        }

        specialCategories.forEach(function(single){
            $scope.feedBack.f_RetailersValueRotationIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        if (singleData.marketID == 2) {
                            rotationIndexSalesValueElecssories[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    } else if (singleData.categoryID == 2) {
                        if (singleData.marketID == 2) {
                            rotationIndexSalesValueHealthBeauties[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })

        //rotationIndexSalesVolume
        specialCategories.forEach(function(single){
            $scope.feedBack.f_RetailersVolumeRotationIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        if (singleData.marketID == 1) {
                            rotationIndexSalesVolumeElecssories[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    } else if (singleData.categoryID == 2) {
                        if (singleData.marketID == 1) {
                            rotationIndexSalesVolumeHealthBeauties[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })

        for (var i = 0; i < 2; i++) {
            rotationIndexSalesVolumeElecssories[i].data.push('');
            rotationIndexSalesVolumeHealthBeauties[i].data.push('');
        }

        specialCategories.forEach(function(single){
            $scope.feedBack.f_RetailersVolumeRotationIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        if (singleData.marketID == 2) {
                            rotationIndexSalesVolumeElecssories[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    } else if (singleData.categoryID == 2) {
                        if (singleData.marketID == 2) {
                            rotationIndexSalesVolumeHealthBeauties[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })

        currentCategories.forEach(function(single){
            //currentProfitability Index
            $scope.feedBack.f_RetailersProfitabilityIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.marketID == 1) {
                            currentUrbanProfitabilityIndex[singleData.retailerID - 1].data.push(singleData.value);
                        } else if (singleData.marketID == 2) {
                            currentRuralProfitabilityIndex[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
            //Stock Cover
            $scope.feedBack.f_RetailersStocksCover.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.marketID == 3) {
                        if (singleData.categoryID == 1) {
                            EStockCover[singleData.retailerID - 1].data.push(singleData.value);
                        } else if (singleData.categoryID == 2) {
                            HStockCover[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })

        //previousProfitability Index
        previousCategories.forEach(function(single){
            $scope.feedBack.f_RetailersProfitabilityIndex.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.marketID == 1) {
                            previousUrbanProfitabilityIndex[singleData.retailerID - 1].data.push(singleData.value);
                        } else if (singleData.marketID == 2) {
                            previousRuralProfitabilityIndex[singleData.retailerID - 1].data.push(singleData.value);
                        }
                    }
                }
            })
        })



        $scope.rotationIndexSalesValueElecssories = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesValueElecssories,
            title: {
                text: $scope.newLabel.getContent('Elecssories')+'-'+$scope.newLabel.getContent('Sales Values'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">'+$scope.newLabel.getContent('Urban Market')+'</p><p style="font-size:20px;float:right;" class="text-right">'+$scope.newLabel.getContent('Rural Market')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesValueHealthBeauties = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesValueHealthBeauties,
            title: {
                text: $scope.newLabel.getContent('HealthBeauties')+'-'+$scope.newLabel.getContent('Sales Values'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">'+$scope.newLabel.getContent('Urban Market')+'</p><p style="font-size:20px;float:right;" class="text-right">'+$scope.newLabel.getContent('Rural Market')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesVolumeElecssories = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('units mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesVolumeElecssories,
            title: {
                text: $scope.newLabel.getContent('Elecssories')+'-'+$scope.newLabel.getContent('Sales Volume'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">'+$scope.newLabel.getContent('Urban Market')+'</p><p style="font-size:20px;float:right;" class="text-right">'+$scope.newLabel.getContent('Rural Market')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rotationIndexSalesVolumeHealthBeauties = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('units mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent',
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                // legend: {
                //     layout: 'vertical',
                //     align: 'right',
                //     verticalAlign: 'middle'
                // },
                credits: {
                    enabled: false
                }
            },
            series: rotationIndexSalesVolumeHealthBeauties,
            title: {
                text: $scope.newLabel.getContent('HealthBeauties')+'-'+$scope.newLabel.getContent('Sales Volume'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;float:left;" class="text-left">'+$scope.newLabel.getContent('Urban Market')+'</p><p style="font-size:20px;float:right;" class="text-right">'+$scope.newLabel.getContent('Rural Market')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.previousRuralProfitabilityIndex = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Rural Market'),
                    style: {
                        'font-size': '16px'
                    }
                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Profitability Index')+'('+$scope.newLabel.getContent('$mln')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Profitability Index')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('$mln')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousRuralProfitabilityIndex,
            loading: false
        }
        $scope.previousUrbanProfitabilityIndex = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Urban Market'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Profitability Index')+'('+$scope.newLabel.getContent('$mln')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Profitability Index')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('$mln')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousUrbanProfitabilityIndex,
            loading: false
        }
        $scope.currentRuralProfitabilityIndex = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Rural Market'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Profitability Index')+'('+$scope.newLabel.getContent('$mln')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Profitability Index')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('$mln')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentRuralProfitabilityIndex,
            loading: false
        }
        $scope.currentUrbanProfitabilityIndex = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Urban Market'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Profitability Index')+'('+$scope.newLabel.getContent('$mln')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Profitability Index')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('$mln')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentUrbanProfitabilityIndex,
            loading: false
        }

        $scope.EStockCover = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Elecssories'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Stock Cover')+'('+$scope.newLabel.getContent('in Weeks')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Stock Cover')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('in Weeks')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: EStockCover,
            loading: false
        }
        $scope.HStockCover = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('HealthBeauties'),
                    style: {
                        'font-size': '16px'
                    }

                },
                chart: {
                    type: 'line',
                    backgroundColor: 'transparent',
                },
                yAxis: {
                    title: {
                        text: $scope.newLabel.getContent('Stock Cover')+'('+$scope.newLabel.getContent('in Weeks')+')',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Stock Cover')+':' + this.point.y.toFixed(2) + '('+$scope.newLabel.getContent('in Weeks')+')</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: HStockCover,
            loading: false
        }
    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}