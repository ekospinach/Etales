define(['directives', 'services'], function(directives) {

    directives.directive('marketSocialBrand', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_socialBrand.html',
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
                            return organiseArray(data.data.brandInfo);
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
                        scope.eleBrandNames = new Array();
                        scope.eleSentiment=new Array({
                            name:Label.getContent('Web Sentiment Index')+' ',
                            data:[]
                        },{
                            name:Label.getContent('Web Sentiment Index'),
                            data:[]
                        })
                        scope.eleStrengths = {
                            name:Label.getContent('Web Strength Index'),
                            data:[],
                        };
                        
                        scope.heaBrandNames = new Array();
                        scope.heaSentiment=new Array({
                            name:Label.getContent('Web Sentiment Index')+' ',
                            data:[]
                        },{
                            name:Label.getContent('Web Sentiment Index'),
                            data:[]
                        })
                        scope.heaStrengths = {
                            name:Label.getContent('Web Strength Index'),
                            data:[],
                        };

                        var eleCount = heaCount = 0;
                        data.forEach(function(singleData){
                            if(singleData.categoryID==1){
                                scope.eleBrandNames[eleCount] = singleData.brandName;
                                if(singleData.sentimentIdx>=0){
                                    scope.eleSentiment[0].data.push({'y':singleData.sentimentIdx,'color':getColor(singleData.parentCompanyID)});
                                    scope.eleSentiment[1].data.push({'y':null,'color':getColor(singleData.parentCompanyID)});
                                }else{
                                    scope.eleSentiment[0].data.push({'y':null,'color':getColor(singleData.parentCompanyID)});
                                    scope.eleSentiment[1].data.push({'y':singleData.sentimentIdx,'color':getColor(singleData.parentCompanyID)});
                                }

                                scope.eleStrengths.data.push({'y':singleData.strengthIdx,'color':getColor(singleData.parentCompanyID)});
                                eleCount++;
                            }else if(singleData.categoryID==2){
                                scope.heaBrandNames[heaCount] = singleData.brandName;
                                if(singleData.sentimentIdx>=0){
                                    scope.heaSentiment[0].data.push({'y':singleData.sentimentIdx,'color':getColor(singleData.parentCompanyID)});
                                    scope.heaSentiment[1].data.push({'y':null,'color':getColor(singleData.parentCompanyID)});
                                }else{
                                    scope.heaSentiment[0].data.push({'y':null,'color':getColor(singleData.parentCompanyID)});
                                    scope.heaSentiment[1].data.push({'y':singleData.sentimentIdx,'color':getColor(singleData.parentCompanyID)});
                                }

                                scope.heaStrengths.data.push({'y':singleData.strengthIdx,'color':getColor(singleData.parentCompanyID)});
                                heaCount++;
                            }
                        });
                        scope.sentimentElecssoriesConfig = {
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
                                    categories: scope.eleBrandNames,
                                    tickLength: 0
                                },
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    tickPositions: [-5,-4,-3,-2,-1,0,1,2,3,4,5],
                                    min: -5,
                                    max: 5,
                                    tickLength: 0
                                },
                                legend: {
                                    enabled: false
                                }
                            },
                            series: scope.eleSentiment,
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: Label.getContent('Web Sentiment Index')
                            }
                        };
                        scope.strengthElecssoriesConfig = {
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
                                    categories: scope.eleBrandNames,
                                    labels:{
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
                                name:scope.eleStrengths.name,
                                data:scope.eleStrengths.data
                            }],
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: Label.getContent('Web Strength Index') 
                            }
                        }
                        scope.sentimentHealthBeautiesConfig = {
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
                                    categories: scope.heaBrandNames,
                                    tickLength: 0
                                },
                                yAxis: {
                                    title: {
                                        text: null
                                    },
                                    tickPositions: [-5,-4,-3,-2,-1,0,1,2,3,4,5],
                                    min: -5,
                                    max: 5,
                                    tickLength: 0
                                },
                                legend: {
                                    enabled: false
                                }
                            },
                            series: scope.heaSentiment,
                            credits: {
                                enabled: false
                            },
                            title: {
                                text: Label.getContent('Web Sentiment Index')
                            }
                        };
                        scope.strengthHealthBeautiesConfig = {
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
                                    categories: scope.heaBrandNames,
                                    labels:{
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
                                name:scope.heaStrengths.name,
                                data:scope.heaStrengths.data
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