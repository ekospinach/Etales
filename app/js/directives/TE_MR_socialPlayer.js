define(['directives', 'services'], function(directives) {

    directives.directive('marketSocialPlayer', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_socialPlayer.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/getMR-webTrawlerScores/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            return organiseArray(data.data.playerInfo);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
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

                        scope.players=[Label.getContent('Retailer')+' 1',Label.getContent('Retailer')+' 2',Label.getContent('Supplier')+' 1',Label.getContent('Supplier')+' 2',Label.getContent('Supplier')+' 3'];
                        scope.playerSentiment=new Array({
                            name:Label.getContent('Web Sentiment Index')+' ',
                            data:[{'y':null,'color':PlayerColor.r1},{'y':null,'color':PlayerColor.r2},{'y':null,'color':PlayerColor.s1},{'y':null,'color':PlayerColor.s2},{'y':null,'color':PlayerColor.s3}]
                        },{
                            name:Label.getContent('Web Sentiment Index'),
                            data:[{'y':null,'color':PlayerColor.r1},{'y':null,'color':PlayerColor.r2},{'y':null,'color':PlayerColor.s1},{'y':null,'color':PlayerColor.s2},{'y':null,'color':PlayerColor.s3}]
                        })
                        scope.playerStrength = {
                            name:Label.getContent('Web Strength Index'),
                            data:[{'y':null,'color':PlayerColor.r1},{'y':null,'color':PlayerColor.r2},{'y':null,'color':PlayerColor.s1},{'y':null,'color':PlayerColor.s2},{'y':null,'color':PlayerColor.s3}]
                        };

                        var eleCount = heaCount = 0;
                        data.forEach(function(singleData){
                            switch(singleData.actorID){
                                case 1://supplier
                                    if (singleData.sentimentIdx >= 0) {
                                        scope.playerSentiment[0].data[2].y = singleData.sentimentIdx;
                                    } else {
                                        scope.playerSentiment[1].data[2].y = singleData.sentimentIdx;
                                    }
                                    scope.playerStrength.data[2].y = singleData.strengthIdx;

                                    break;
                                case 2:
                                    if (singleData.sentimentIdx >= 0) {
                                        scope.playerSentiment[0].data[3].y = singleData.sentimentIdx;
                                    } else {
                                        scope.playerSentiment[1].data[3].y = singleData.sentimentIdx;
                                    }
                                    scope.playerStrength.data[3].y = singleData.strengthIdx;

                                    break;
                                case 3:
                                    if (singleData.sentimentIdx >= 0) {
                                        scope.playerSentiment[0].data[4].y = singleData.sentimentIdx;
                                    } else {
                                        scope.playerSentiment[1].data[4].y = singleData.sentimentIdx;
                                    }
                                    scope.playerStrength.data[4].y = singleData.strengthIdx;

                                    break;
                                case 5:
                                    if (singleData.sentimentIdx >= 0) {
                                        scope.playerSentiment[0].data[0].y = singleData.sentimentIdx;
                                    } else {
                                        scope.playerSentiment[1].data[0].y = singleData.sentimentIdx;
                                    }
                                    scope.playerStrength.data[0].y = singleData.strengthIdx;

                                    break;
                                case 6:
                                    if (singleData.sentimentIdx >= 0) {
                                        scope.playerSentiment[0].data[1].y = singleData.sentimentIdx;
                                    } else {
                                        scope.playerSentiment[1].data[1].y = singleData.sentimentIdx;
                                    }
                                    scope.playerStrength.data[1].y = singleData.strengthIdx;

                                    break;
                            }
                        });
                        scope.playerSentimentConfig = {
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
                                    categories: scope.players
                                },
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    tickPositions: [-5,-4,-3,-2,-1,0,1,2,3,4,5],
                                    min: -5,
                                    max: 5
                                },
                                legend: {
                                    enabled: false
                                }
                            },
                            series: scope.playerSentiment,
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: Label.getContent('Web Sentiment Index')
                            }
                        };
                        scope.playerStrengthConfig = {
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
                                    categories: scope.players,
                                    labels:{
                                        formatter: function() {
                                            return ' ';
                                        }
                                    }
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
                                    max: 1
                                },
                                legend: {
                                    enabled: false
                                }
                            },
                            series: [{
                                name:scope.playerStrength.name,
                                data:scope.playerStrength.data
                            }],
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: Label.getContent('Web Strength Index')
                            }
                        }
                    
                        var curP = scope.selectedPeriod;
                        scope.myModel = 'Socail' + curP;
                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }


                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPeriod', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})