var socialBrandCtrl = function($scope, $http, PlayerColor, $q) {
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
        var url = '/getMR-webTrawlerScores/' + Request['seminar'] + '/' + Request['period'];
        $http({
            method: 'GET',
            url: url
        }).then(function(data) {
            return organiseArray(data.data);
        }, function() {
            console.log('fail');
        });
    }

    var getColor = function(id) {
        var color = '';
        switch (id) {
            case 1:
                color = PlayerColor.s1;
                break;
            case 2:
                color = PlayerColor.s2;
                break;
            case 3:
                color = PlayerColor.s3;
                break;
            case 4:
                color = PlayerColor.s4;
                break;
            case 5:
                color = PlayerColor.r1;
                break;
            case 6:
                color = PlayerColor.r2;
                break;
            case 7:
                color = PlayerColor.r3;
                break;
            default:
                color = PlayerColor.s1;
                break;
        }
        return color;
    }

    var organiseArray = function(data) {
        var deferred = $q.defer();
        $scope.eleBrandNames = new Array();
        $scope.eleSentiment = new Array({
            name: $scope.Label.getContent('Web Sentiment Index') + ' ',
            data: []
        }, {
            name: $scope.Label.getContent('Web Sentiment Index'),
            data: []
        })
        $scope.eleStrengths = {
            name: $scope.Label.getContent('Web Strength Index'),
            data: [],
        };

        $scope.heaBrandNames = new Array();
        $scope.heaSentiment = new Array({
            name: $scope.Label.getContent('Web Sentiment Index') + ' ',
            data: []
        }, {
            name: $scope.Label.getContent('Web Sentiment Index'),
            data: []
        })
        $scope.heaStrengths = {
            name: $scope.Label.getContent('Web Strength Index'),
            data: [],
        };

        var eleCount = heaCount = 0;
        data.brandInfo.forEach(function(singleData) {
            if (singleData.categoryID == 1) {
                $scope.eleBrandNames[eleCount] = singleData.brandName;
                if (singleData.sentimentIdx >= 0) {
                    $scope.eleSentiment[0].data.push({
                        'y': singleData.sentimentIdx,
                        'color': getColor(singleData.parentCompanyID)
                    });
                    $scope.eleSentiment[1].data.push({
                        'y': null,
                        'color': getColor(singleData.parentCompanyID)
                    });
                } else {
                    $scope.eleSentiment[0].data.push({
                        'y': null,
                        'color': getColor(singleData.parentCompanyID)
                    });
                    $scope.eleSentiment[1].data.push({
                        'y': singleData.sentimentIdx,
                        'color': getColor(singleData.parentCompanyID)
                    });
                }

                $scope.eleStrengths.data.push({
                    'y': singleData.strengthIdx,
                    'color': getColor(singleData.parentCompanyID)
                });
                eleCount++;
            } else if (singleData.categoryID == 2) {
                $scope.heaBrandNames[heaCount] = singleData.brandName;
                if (singleData.sentimentIdx >= 0) {
                    $scope.heaSentiment[0].data.push({
                        'y': singleData.sentimentIdx,
                        'color': getColor(singleData.parentCompanyID)
                    });
                    $scope.heaSentiment[1].data.push({
                        'y': null,
                        'color': getColor(singleData.parentCompanyID)
                    });
                } else {
                    $scope.heaSentiment[0].data.push({
                        'y': null,
                        'color': getColor(singleData.parentCompanyID)
                    });
                    $scope.heaSentiment[1].data.push({
                        'y': singleData.sentimentIdx,
                        'color': getColor(singleData.parentCompanyID)
                    });
                }

                $scope.heaStrengths.data.push({
                    'y': singleData.strengthIdx,
                    'color': getColor(singleData.parentCompanyID)
                });
                heaCount++;
            }
        });
        $scope.sentimentElecssoriesConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.eleBrandNames,
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    tickPositions: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
                    min: -5,
                    max: 5,
                    tickLength: 0
                },
                legend: {
                    enabled: false
                }
            },
            series: $scope.eleSentiment,
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Sentiment Index')
            }
        };
        $scope.strengthElecssoriesConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.eleBrandNames,
                    labels: {
                        formatter: function() {
                            return ' ';
                        }
                    },
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function() {
                            return (Math.abs(this.value));
                        }
                    },
                    min: 0,
                    max: 1,
                    tickLength: 0
                },
                legend: {
                    enabled: false
                }
            },
            series: [{
                name: $scope.eleStrengths.name,
                data: $scope.eleStrengths.data
            }],
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Strength Index')
            }
        }
        $scope.sentimentHealthBeautiesConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.heaBrandNames,
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    tickPositions: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
                    min: -5,
                    max: 5,
                    tickLength: 0
                },
                legend: {
                    enabled: false
                }
            },
            series: $scope.heaSentiment,
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Sentiment Index')
            }
        };
        $scope.strengthHealthBeautiesConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.heaBrandNames,
                    labels: {
                        formatter: function() {
                            return ' ';
                        }
                    },
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function() {
                            return (Math.abs(this.value));
                        }
                    },
                    tickLength: 0,
                    min: 0,
                    max: 1
                },
                legend: {
                    enabled: false
                }
            },
            series: [{
                name: $scope.heaStrengths.name,
                data: $scope.heaStrengths.data
            }],
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Strength Index')
            }
        }

        $scope.players = [$scope.Label.getContent('Retailer') + ' 1', $scope.Label.getContent('Retailer') + ' 2', $scope.Label.getContent('Supplier') + ' 1', $scope.Label.getContent('Supplier') + ' 2', $scope.Label.getContent('Supplier') + ' 3'];
        $scope.playerSentiment = new Array({
            name: $scope.Label.getContent('Web Sentiment Index') + ' ',
            data: [{
                'y': null,
                'color': PlayerColor.r1
            }, {
                'y': null,
                'color': PlayerColor.r2
            }, {
                'y': null,
                'color': PlayerColor.s1
            }, {
                'y': null,
                'color': PlayerColor.s2
            }, {
                'y': null,
                'color': PlayerColor.s3
            }]
        }, {
            name: $scope.Label.getContent('Web Sentiment Index'),
            data: [{
                'y': null,
                'color': PlayerColor.r1
            }, {
                'y': null,
                'color': PlayerColor.r2
            }, {
                'y': null,
                'color': PlayerColor.s1
            }, {
                'y': null,
                'color': PlayerColor.s2
            }, {
                'y': null,
                'color': PlayerColor.s3
            }]
        })
        $scope.playerStrength = {
            name: $scope.Label.getContent('Web Strength Index'),
            data: [{
                'y': null,
                'color': PlayerColor.r1
            }, {
                'y': null,
                'color': PlayerColor.r2
            }, {
                'y': null,
                'color': PlayerColor.s1
            }, {
                'y': null,
                'color': PlayerColor.s2
            }, {
                'y': null,
                'color': PlayerColor.s3
            }]
        };

        console.log('data:'+data);
        data.playerInfo.forEach(function(singleData) {
            switch (singleData.actorID) {
                case 1: //supplier
                    if (singleData.sentimentIdx >= 0) {
                        $scope.playerSentiment[0].data[2].y = singleData.sentimentIdx;
                    } else {
                        $scope.playerSentiment[1].data[2].y = singleData.sentimentIdx;
                    }
                    $scope.playerStrength.data[2].y = singleData.strengthIdx;

                    break;
                case 2:
                    if (singleData.sentimentIdx >= 0) {
                        $scope.playerSentiment[0].data[3].y = singleData.sentimentIdx;
                    } else {
                        $scope.playerSentiment[1].data[3].y = singleData.sentimentIdx;
                    }
                    $scope.playerStrength.data[3].y = singleData.strengthIdx;

                    break;
                case 3:
                    if (singleData.sentimentIdx >= 0) {
                        $scope.playerSentiment[0].data[4].y = singleData.sentimentIdx;
                    } else {
                        $scope.playerSentiment[1].data[4].y = singleData.sentimentIdx;
                    }
                    $scope.playerStrength.data[4].y = singleData.strengthIdx;

                    break;
                case 5:
                    if (singleData.sentimentIdx >= 0) {
                        $scope.playerSentiment[0].data[0].y = singleData.sentimentIdx;
                    } else {
                        $scope.playerSentiment[1].data[0].y = singleData.sentimentIdx;
                    }
                    $scope.playerStrength.data[0].y = singleData.strengthIdx;

                    break;
                case 6:
                    if (singleData.sentimentIdx >= 0) {
                        $scope.playerSentiment[0].data[1].y = singleData.sentimentIdx;
                    } else {
                        $scope.playerSentiment[1].data[1].y = singleData.sentimentIdx;
                    }
                    $scope.playerStrength.data[1].y = singleData.strengthIdx;

                    break;
            }
        });
        $scope.playerSentimentConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.players,
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    tickPositions: [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
                    tickLength: 0,
                    min: -5,
                    max: 5
                },
                legend: {
                    enabled: false
                }
            },
            series: $scope.playerSentiment,
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Sentiment Index')
            }
        };
        $scope.playerStrengthConfig = {
            options: {
                chart: {
                    type: 'bar'
                },
                tooltip: {
                    valueDecimals: 2
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                xAxis: {
                    categories: $scope.players,
                    labels: {
                        formatter: function() {
                            return ' ';
                        }
                    },
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {
                        formatter: function() {
                            return (Math.abs(this.value));
                        }
                    },
                    tickLength: 0,
                    min: 0,
                    max: 1
                },
                legend: {
                    enabled: false
                }
            },
            series: [{
                name: $scope.playerStrength.name,
                data: $scope.playerStrength.data
            }],
            credits: {
                enabled: false
            },
            title: {
                text: $scope.Label.getContent('Web Strength Index')
            }
        }

        var curP = $scope.selectedPeriod;

        $scope.myModel = 'Socail' + curP;
        deferred.resolve({
            msg: 'Array is ready.'
        });
        return deferred.promise;
    }

    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}