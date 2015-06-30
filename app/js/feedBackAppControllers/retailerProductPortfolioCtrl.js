var retailerProductPortfolioCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var loadValue = function(data, store, market) {
        var array = _.find(data, function(obj) {
            return (obj.storeID == store && obj.marketID == market)
        });
        return array;
    }

    var organiseArray = function(data, category) {
        var result = {
            'technology': {},
            'design': {},
            'active': {},
            'pack': {}
        }

        result.pack = [{
            name: Label.getContent('Retailer') + ' 1',
            data: [
                [1, 1],
                [2, 1],
                [3, 1]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [
                [3, 2],
                [2, 2], {
                    name: 'HELLP',
                    x: 1,
                    y: 2,
                    marker: {
                        symbol: 'triangle'
                    }
                }
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }, {
            name: Label.getContent('Supplier') + ' 1',
            data: [
                [1, 3],
                [2, 3],
                [3, 3]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [
                [1, 4],
                [2, 4],
                [3, 4]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [
                [1, 5],
                [2, 5],
                [3, 5]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }];


        result.active = result.design = result.technology = [{
            name: Label.getContent('Retailer') + ' 1',
            data: [
                [6, 1],
                [7, 1],
                [10, 1]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [
                [6, 2],
                [7, 2], {
                    name: 'HELLP',
                    x: 10,
                    y: 2,
                    marker: {
                        symbol: 'triangle'
                    }
                }
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }, {
            name: Label.getContent('Supplier') + ' 1',
            data: [
                [6, 3],
                [7, 3],
                [10, 3]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [
                [6, 4],
                [7, 4],
                [10, 4]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [
                [6, 5],
                [7, 5],
                [10, 5]
            ],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }];
        //$scope.myModel = "RetailerPerceptions";
        return result;
    }

    var initPage = function() {
        var result = {
            'ele': {},
            'hea': {}
        }
        result.ele = organiseArray($scope.feedback, 1);
        result.hea = organiseArray($scope.feedback, 2);


        $scope.ele_technology = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Technology Level')
            },
            series: result.ele.technology,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_design = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Design Level')
            },
            series: result.ele.design,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_active = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Quality-of-Raw-Materials')
            },
            series: result.ele.active,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.ele_pack = {
            options: {
                xAxis: {
                    labels: {
                        formatter: function() {
                            var label = '';

                            switch (this.value) {
                                case 1:
                                    label = Label.getContent('ECONOMY');
                                    break;
                                case 2:
                                    label = Label.getContent('STANDARD');
                                    break;
                                case 3:
                                    label = Label.getContent('PREMIUM');
                                    break;
                                default:
                                    label = '';
                                    break;
                            }
                            return label;
                        }
                    }
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Pack Format')
            },
            series: result.ele.pack,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_technology = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Technology Level')
            },
            series: result.hea.technology,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_design = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Design Level')
            },
            series: result.hea.design,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_active = {
            options: {
                xAxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Active agent')
            },
            series: result.hea.active,
            credits: {
                enabled: false
            },
            loading: false
        }

        $scope.hea_pack = {
            options: {
                xAxis: {
                    labels: {
                        formatter: function() {
                            var label = '';

                            switch (this.value) {
                                case 1:
                                    label = Label.getContent('ECONOMY');
                                    break;
                                case 2:
                                    label = Label.getContent('STANDARD');
                                    break;
                                case 3:
                                    label = Label.getContent('PREMIUM');
                                    break;
                                default:
                                    label = '';
                                    break;
                            }
                            return label;
                        }
                    }
                },
                yAxis: {
                    labels: {
                        enabled: false
                    },
                    gridLineWidth: 0,
                    title: {
                        text: ''
                    }
                },
                chart: {
                    backgroundColor: 'transparent',
                    type: 'scatter',
                    zoomType: 'xy'
                },
                credits: {
                    enabled: false
                }
            },
            title: {
                text: Label.getContent('Pack Format')
            },
            series: result.hea.pack,
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