var shelfSpaceCtrl = function($scope, $http, PlayerColor) {
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

        var currentShelfSpaceElecssories = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1,
            actorID: 1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2,
            actorID: 2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3,
            actorID: 3
        },
        //{name:$scope.newLabel.getContent('Supplier')+'-4',data:[],color:PlayerColor.s4, actorID : 4},
        {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1,
            actorID: 5
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2,
            actorID: 6
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3,
            actorID: 7
        });
        var currentShelfSpaceHealthBeauties = new Array({
            name: $scope.newLabel.getContent('Supplier')+'-1',
            data: [],
            color: PlayerColor.s1,
            actorID: 1
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-2',
            data: [],
            color: PlayerColor.s2,
            actorID: 2
        }, {
            name: $scope.newLabel.getContent('Supplier')+'-3',
            data: [],
            color: PlayerColor.s3,
            actorID: 3
        },
        //{name:$scope.newLabel.getContent('Supplier')+'-4',data:[],color:PlayerColor.s4, actorID : 4},
        {
            name: $scope.newLabel.getContent('Retailer')+'-1',
            data: [],
            color: PlayerColor.r1,
            actorID: 5
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-2',
            data: [],
            color: PlayerColor.r2,
            actorID: 6
        }, {
            name: $scope.newLabel.getContent('Retailer')+'-3',
            data: [],
            color: PlayerColor.r3,
            actorID: 7
        });

        currentCategories.forEach(function(single){
            $scope.feedBack.f_ShelfSpaceAllocation.forEach(function(singleData){
                if (singleData.period == single) {

                    if (singleData.categoryID == 1) {

                        currentShelfSpaceElecssories.forEach(function(value, item, array) {
                            if (singleData.actorID == array[item].actorID) {
                                array[item].data.push(singleData.value * 100);
                            }
                        })

                    } else if (singleData.categoryID == 2) {
                        currentShelfSpaceHealthBeauties.forEach(function(value, item, array) {
                            if (singleData.actorID == array[item].actorID) {
                                array[item].data.push(singleData.value * 100);
                            }
                        })

                    }
                }
            })
        })

        $scope.currentShelfSpaceElecssories = {
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
                        text: $scope.newLabel.getContent('Shelf Space Allocation')+' (%)',
                        style: {
                            'font-size': '16px'
                        }
                    },

                    gridLineColor: 'transparent',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Shelf Space Allocation')+':' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentShelfSpaceElecssories,
            loading: false
        }
        $scope.currentShelfSpaceHealthBeauties = {
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
                        text: $scope.newLabel.getContent('Shelf Space Allocation')+' (%)',
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
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Period')+':' + this.key + '</p>' + '<p style="font-size:20px;line-height:20px;">'+$scope.newLabel.getContent('Shelf Space Allocation')+':' + this.point.y.toFixed(2) + '%</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
                },
                credits: {
                    enabled: false
                }
            },
            series: currentShelfSpaceHealthBeauties,
            loading: false
        }

    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}