var productPortfolioCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var getFormatValue = function(packFormat) {
        var result = 0;
        switch (packFormat) {
            case 'ECONOMY':
                result = 1;
                break;
            case 'STANDARD':
                result = 2;
                break;
            case 'PREMIUM':
                result = 3;
                break;
        }
        return result;
    }

    var organiseArray = function(data, category) {
        var result = {
            'technology': {},
            'design': {},
            'active': {},
            'pack': {}
        }
        result.pack = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];


        result.active = result.design = result.technology = [{
            name: Label.getContent('Supplier') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier') + ' 3',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.s3
        }, {
            name: Label.getContent('Retailer') + ' 1',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: [],
            marker: {
                enabled: true,
                symbol: 'circle',
                radius: 10
            },
            lineWidth: 0,
            color: PlayerColor.r2
        }];

        data.forEach(function(singleData) {
            if (singleData.categoryID == category) {

                singleData.xfpp_Attributes.forEach(function(singleAttributes) {
                    switch (singleAttributes.index) {
                        case 1:
                            if (singleAttributes.ownerID < 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.design[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.design[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count
                                    })
                                }
                            } else if (singleAttributes.ownerID > 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.design[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.design[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count
                                    })
                                }
                            }
                            break;
                        case 2:
                            if (singleAttributes.ownerID < 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.technology[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.technology[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count
                                    })
                                }
                            } else if (singleAttributes.ownerID > 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.technology[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.technology[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count
                                    })
                                }
                            }

                            break;
                        case 3:
                            if (singleAttributes.ownerID < 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.active[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.active[singleAttributes.ownerID - 1].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID,
                                        z: singleAttributes.count
                                    })
                                }
                            } else if (singleAttributes.ownerID > 4) {
                                if (singleAttributes.isNewProduct) {
                                    result.active[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count,
                                        marker: {
                                            symbol: 'triangle'
                                        }
                                    })
                                } else {
                                    result.active[singleAttributes.ownerID - 2].data.push({
                                        x: singleAttributes.level,
                                        y: singleAttributes.ownerID - 1,
                                        z: singleAttributes.count,
                                    })
                                }
                            }
                            break;
                    }
                })

                singleData.xfpp_PackFormat.forEach(function(singeFormat) {
                    if (singeFormat.ownerID < 4) {
                        if (singeFormat.isNewProduct) {
                            result.pack[singeFormat.ownerID - 1].data.push({
                                x: getFormatValue(singeFormat.packFormat),
                                y: singeFormat.ownerID,
                                z: singeFormat.count,
                                marker: {
                                    symbol: 'triangle'
                                }
                            })
                        } else {
                            result.pack[singeFormat.ownerID - 1].data.push({
                                x: getFormatValue(singeFormat.packFormat),
                                y: singeFormat.ownerID,
                                z: singeFormat.count
                            })
                        }
                    } else if (singeFormat.ownerID > 4) {
                        if (singeFormat.isNewProduct) {
                            result.pack[singeFormat.ownerID - 2].data.push({
                                x: getFormatValue(singeFormat.packFormat),
                                y: singeFormat.ownerID - 1,
                                z: singeFormat.count,
                                marker: {
                                    symbol: 'triangle'
                                }
                            })
                        } else {
                            result.pack[singeFormat.ownerID - 2].data.push({
                                x: getFormatValue(singeFormat.packFormat),
                                y: singeFormat.ownerID - 1,
                                z: singeFormat.count
                            })
                        }
                    }
                })

            }
        })
        return result;
    }

    var initPage = function() {
        var result = {
            'ele': {},
            'hea': {}
        }
        result.ele = organiseArray($scope.feedback.xf_ProductPortfolios, 1);
        result.hea = organiseArray($scope.feedback.xf_ProductPortfolios, 2);


        $scope.ele_technology = {
            options: {
                xAxis: {
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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
                },
                tooltip: {
                    formatter: function() {
                        var s = '<p style="font-size:20px;line-height:20px;">' + this.series.name + '</p>' + '<p style="font-size:20px;line-height:20px;">' + $scope.Label.getContent('Count') + ':' + this.point.z + '</p>';
                        return s;
                    },
                    shared: false,
                    useHTML: true
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