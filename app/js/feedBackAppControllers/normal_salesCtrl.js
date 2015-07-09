var salesCtrl = function($scope, $http, PlayerColor) {
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

        var currentElecssoriesVolume = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var currentElecssoriesValue = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var previousElecssoriesVolume = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var previousElecssoriesValue = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var currentHealthBeautiesVolume = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var currentHealthBeautiesValue = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var previousHealthBeautiesVolume = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })
        var previousHealthBeautiesValue = new Array({
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
        }, {
            name: $scope.Label.getContent('Supplier')+'-4',
            data: [],
            color: PlayerColor.s4
        }, {
            name: $scope.Label.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1
        }, {
            name: $scope.Label.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2
        }, {
            name: $scope.Label.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3
        })

        currentCategories.forEach(function(single){
            $scope.feedBack.f_MarketSalesVolume.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        currentElecssoriesVolume[singleData.actorID - 1].data.push(singleData.value);
                    } else if (singleData.categoryID == 2) {
                        currentHealthBeautiesVolume[singleData.actorID - 1].data.push(singleData.value);
                    }
                }
            })
            $scope.feedBack.f_MarketSalesValue.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        currentElecssoriesValue[singleData.actorID - 1].data.push(singleData.value);
                    } else if (singleData.categoryID == 2) {
                        currentHealthBeautiesValue[singleData.actorID - 1].data.push(singleData.value);
                    }
                }
            })
        })

        previousCategories.forEach(function(single){
            $scope.feedBack.f_MarketSalesVolume.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        previousElecssoriesVolume[singleData.actorID - 1].data.push(singleData.value);
                    } else if (singleData.categoryID == 2) {
                        previousHealthBeautiesVolume[singleData.actorID - 1].data.push(singleData.value);
                    }
                }
            })

            $scope.feedBack.f_MarketSalesValue.forEach(function(singleData){
                if (singleData.period == single) {
                    if (singleData.categoryID == 1) {
                        previousElecssoriesValue[singleData.actorID - 1].data.push(singleData.value);
                    } else if (singleData.categoryID == 2) {
                        previousHealthBeautiesValue[singleData.actorID - 1].data.push(singleData.value);
                    }
                }
            })
        })

        $scope.previousSalesVolumeElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Volumes'),
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
                        text: $scope.Label.getContent('units mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    tickmarkPlacement: 'on'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousElecssoriesVolume,
            loading: false
        }
        $scope.previousSalesVolumeHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Volumes'),
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
                        text: $scope.Label.getContent('units mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousHealthBeautiesVolume,
            loading: false
        }
        $scope.previousSalesValueElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Values'),
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
                        text: $scope.Label.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    tickmarkPlacement: 'on'
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousElecssoriesValue,
            loading: false
        }
        $scope.previousSalesValueHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Values'),
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
                        text: $scope.Label.getContent('$mln'),
                        style: {
                            'font-size': '16px'
                        }
                    },
                    gridLineColor: 'transparent'
                },
                xAxis: {
                    categories: previousCategories,
                    title: {
                        text: $scope.Label.getContent('Period'),
                        style: {
                            'font-size': '16px'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: previousHealthBeautiesValue,
            loading: false
        }
        $scope.currentSalesVolumeElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Volumes'),
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
                        text: $scope.Label.getContent('units mln'),
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentElecssoriesVolume,
            loading: false
        }
        $scope.currentSalesVolumeHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Volumes'),
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
                        text: $scope.Label.getContent('units mln'),
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('units mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentHealthBeautiesVolume,
            loading: false
        }
        $scope.currentSalesValueElecssories = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Values'),
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
                        text: $scope.Label.getContent('$mln'),
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentElecssoriesValue,
            loading: false
        }
        $scope.currentSalesValueHealthBeauties = {
            options: {
                title: {
                    text: $scope.Label.getContent('Sales Values'),
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
                        text: $scope.Label.getContent('$mln'),
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.Label.getContent('$mln')+':' + this.point.y.toFixed(2) + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentHealthBeautiesValue,
            loading: false
        }

    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}