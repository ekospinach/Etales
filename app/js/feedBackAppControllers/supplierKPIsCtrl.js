var supplierKPIsCtrl = function($scope, $http, PlayerColor) {
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
        showCategories = [Request['period'] - 1, Request['period'], '', Request['period'] - 1, Request['period'], '', Request['period'] - 1, Request['period']];

        var tradeSpendingElecssories = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var tradeSpendingHealthBeauties = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var marketingSpendingElecssories = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var marketingSpendingHealthBeauties = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var bmChannelStrengthElecssories = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var bmChannelStrengthHealthBeauties = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var onlineChannelStrengthElecssories = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });
        var onlineChannelStrengthHealthBeauties = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        });

        //add Retailer
        var portfolioStrengthElecssories = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1,
            ownerID: 1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2,
            ownerID: 2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3,
            ownerID: 3
        },
        //{name:$scope.Label.getContent('Supplier')+'-4',data:[],color:PlayerColor.s4, ownerID : 4},
        {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1,
            ownerID: 5
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2,
            ownerID: 6
        });

        var portfolioStrengthHealthBeauties = new Array({
            name: $scope.Label.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1,
            ownerID: 1
        }, {
            name: $scope.Label.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2,
            ownerID: 2
        }, {
            name: $scope.Label.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3,
            ownerID: 3
        },
        //{name:$scope.Label.getContent('Supplier')+'-4',data:[],color:PlayerColor.s4, ownerID : 4},
        {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1,
            ownerID: 5
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2,
            ownerID: 6
        });

        currentCategories.forEach(function(single){
            $scope.feedBack.f_TradeSpendingEffectiveness.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        tradeSpendingElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        tradeSpendingHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })

            $scope.feedBack.f_MarketingSpendingEffectiveness.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        marketingSpendingElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        marketingSpendingHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })

            $scope.feedBack.f_PortfolioStrength.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {

                        portfolioStrengthElecssories.forEach(function(value, item, array) {
                            if (singleData.ownerID == array[item].ownerID) {
                                array[item].data.push(singleData.value);
                            }
                        })

                    } else if (singleData.categoryID == 2) {
                        portfolioStrengthHealthBeauties.forEach(function(value, item, array) {
                            if (singleData.ownerID == array[item].ownerID) {
                                array[item].data.push(singleData.value);
                            }
                        })

                    }
                }
            })
        })        

        //bmChannelStrength
        specialCategories.forEach(function(single){
            $scope.feedBack.f_SuppliersBMValueSalesShare.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        bmChannelStrengthElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        bmChannelStrengthHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })
        })

        for (var i = 0; i < 3; i++) {
            bmChannelStrengthElecssories[i].data.push('');
            bmChannelStrengthHealthBeauties[i].data.push('');
        }

        specialCategories.forEach(function(single){
            $scope.feedBack.f_SuppliersBMVolumeSalesShare.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        bmChannelStrengthElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        bmChannelStrengthHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })  
        })

        //onlineChannelStrength
        specialCategories.forEach(function(single){
            $scope.feedBack.f_SuppliersOnlineValueSalesShare.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        onlineChannelStrengthElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        onlineChannelStrengthHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })
        })
        for (var i = 0; i < 3; i++) {
            onlineChannelStrengthElecssories[i].data.push('');
            onlineChannelStrengthHealthBeauties[i].data.push('');
        }
        specialCategories.forEach(function(single){
            $scope.feedBack.f_SuppliersOnlineVolumeSalesShare.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        onlineChannelStrengthElecssories[singleData.supplierID - 1].data.push(singleData.value * 100);
                    } else if (singleData.categoryID == 2) {
                        onlineChannelStrengthHealthBeauties[singleData.supplierID - 1].data.push(singleData.value * 100);
                    }
                }
            })
        })


        $scope.tradeSpendingElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Elecssories'),
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
                        text: $scope.Label.getContent('Return on Investment')+' (%)',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Return on Investment')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: tradeSpendingElecssories,
            loading: false
        }
        $scope.tradeSpendingHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('HealthBeauties'),
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
                        text: $scope.Label.getContent('Return on Investment')+' (%)',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Return on Investment')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: tradeSpendingHealthBeauties,
            loading: false
        }
        $scope.marketingSpendingElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Elecssories'),
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
                        text: $scope.Label.getContent('Return on Investment')+' (%)',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Return on Investment')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: marketingSpendingElecssories,
            loading: false
        }
        $scope.marketingSpendingHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('HealthBeauties'),
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
                        text: $scope.Label.getContent('Return on Investment')+' (%)',
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Return on Investment')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: marketingSpendingHealthBeauties,
            loading: false
        }
        $scope.portfolioStrengthElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Elecssories'),
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
                        text: $scope.Label.getContent('Strength Index'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Strength Index')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: portfolioStrengthElecssories,
            loading: false
        }
        $scope.portfolioStrengthHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('HealthBeauties'),
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
                        text: $scope.Label.getContent('Strength Index'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: currentCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Strength Index')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: portfolioStrengthHealthBeauties,
            loading: false
        }
        $scope.bmChannelStrengthElecssories = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '(' + this.point.percentage.toFixed(2) + '%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: bmChannelStrengthElecssories,
            title: {
                text: $scope.Label.getContent('Elecssories'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;width:50%;" class="text-left">'+$scope.Label.getContent('Share of Value Sales')+'</p><p style="font-size:20px;width:45%;" class="text-right">'+$scope.Label.getContent('Share of Volume Sales')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.bmChannelStrengthHealthBeauties = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '(' + this.point.percentage.toFixed(2) + '%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: bmChannelStrengthHealthBeauties,
            title: {
                text: $scope.Label.getContent('HealthBeauties'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;width:50%" class="text-left">'+$scope.Label.getContent('Share of Value Sales')+'</p><p style="font-size:20px;width:45%" class="text-right">'+$scope.Label.getContent('Share of Volume Sales')+'</p>',
                useHTML: true,
            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.onlineChannelStrengthElecssories = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '(' + this.point.percentage.toFixed(2) + '%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: onlineChannelStrengthElecssories,
            title: {
                text: $scope.Label.getContent('Elecssories'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;width:50%;" class="text-left">'+$scope.Label.getContent('Share of Value Sales')+'</p><p style="font-size:20px;width:45%;" class="text-right">'+$scope.Label.getContent('Share of Volume Sales')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.onlineChannelStrengthHealthBeauties = {
            options: {
                xAxis: {
                    categories: showCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: '%',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '(' + this.point.percentage.toFixed(2) + '%)</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },
                credits: {
                    enabled: false
                }
            },
            series: onlineChannelStrengthHealthBeauties,
            title: {
                text: $scope.Label.getContent('HealthBeauties'),
                style: {
                    'font-size': '16px'
                }
            },
            subtitle: {
                text: '<p style="font-size:20px;width:50%;" class="text-left">'+$scope.Label.getContent('Share of Value Sales')+'</p><p style="font-size:20px;width:45%;" class="text-right">'+$scope.Label.getContent('Share of Volume Sales')+'</p>',
                useHTML: true,

            },
            credits: {
                enabled: false
            },
            loading: false
        }


    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}