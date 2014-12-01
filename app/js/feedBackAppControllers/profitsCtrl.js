var profitsCtrl = function($scope, $http, PlayerColor) {
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

        var currentOperatingProfits = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var currentOperatingProfitMargins = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var currentNetProfits = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var currentNetProfitMargins = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var previousOperatingProfits = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var previousOperatingProfitMargins = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var previousNetProfits = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        var previousNetProfitMargins = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        });
        currentCategories.forEach(function(single){
            $scope.feedBack.f_OperatingProfit.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            currentOperatingProfits[singleData.actorID - 1].data.push(singleData.value);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            currentOperatingProfits[singleData.actorID - 2].data.push(singleData.value);
                        }
                    }
                }
            })
            $scope.feedBack.f_OperatingProfitMargin.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            currentOperatingProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            currentOperatingProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
                        }
                    }
                }
            })
            $scope.feedBack.f_NetProfit.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            currentNetProfits[singleData.actorID - 1].data.push(singleData.value);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            currentNetProfits[singleData.actorID - 2].data.push(singleData.value);
                        }
                    }
                }
            })
            $scope.feedBack.f_NetProfitMargin.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            currentNetProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            currentNetProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
                        }
                    }
                }
            })
        })

        previousCategories.forEach(function(single){
            $scope.feedBack.f_OperatingProfit.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            previousOperatingProfits[singleData.actorID - 1].data.push(singleData.value);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            previousOperatingProfits[singleData.actorID - 2].data.push(singleData.value);
                        }
                    }
                }
            })

            $scope.feedBack.f_OperatingProfitMargin.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            previousOperatingProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            previousOperatingProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
                        }
                    }
                }
            })

            $scope.feedBack.f_NetProfit.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            previousNetProfits[singleData.actorID - 1].data.push(singleData.value);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            previousNetProfits[singleData.actorID - 2].data.push(singleData.value);
                        }
                    }
                }
            })

            $scope.feedBack.f_NetProfitMargin.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 3) {
                        if (singleData.actorID < 4) {
                            previousNetProfitMargins[singleData.actorID - 1].data.push(singleData.value * 100);
                        } else if (singleData.actorID > 4 && singleData.actorID < 7) {
                            previousNetProfitMargins[singleData.actorID - 2].data.push(singleData.value * 100);
                        }
                    }
                }
            })
        })

        $scope.previousOperatingProfits = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Operating Profits'),
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
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousOperatingProfits,
            loading: false
        }
        $scope.previousOperatingProfitMargins = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Operating Profit Margins'),
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
                        text: '%',
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousOperatingProfitMargins,
            loading: false
        }
        $scope.previousNetProfits = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Net Profits'),
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
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousNetProfits,
            loading: false
        }
        $scope.previousNetProfitMargins = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Net Profit Margins'),
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
                        text: '%',
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.newLabel.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousNetProfitMargins,
            loading: false
        }


        $scope.currentOperatingProfits = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Operating Profits'),
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
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    }
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentOperatingProfits,
            loading: false
        }
        $scope.currentOperatingProfitMargins = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Operating Profit Margins'),
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
                        text: '%',
                        style: {
                            'font-size': '16px'
                        }
                    }
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentOperatingProfitMargins,
            loading: false
        }
        $scope.currentNetProfits = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Net Profits'),
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
                        text: $scope.newLabel.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    }
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentNetProfits,
            loading: false
        }
        $scope.currentNetProfitMargins = {
            options: {
                title: {
                    text: $scope.newLabel.getContent('Net Profit Margins'),
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
                        text: '%',
                        style: {
                            'font-size': '16px'
                        }
                    }
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    positioner: function() {
                        return {
                            x: 80,
                            y: 50
                        };
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentNetProfitMargins,
            loading: false
        }

    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}