define(['directives', 'services'], function(directives) {

    directives.directive('generalHealthBeautiesSegmentLeadership', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues', 'PlayerColor',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues, PlayerColor) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_healthBeautiesSegmentLeadership.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        //switching('showPerformance');
                        var url = '/segmentLeadership/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod+'/2';
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            return organiseArray(data.data);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        });
                    }

                    var setData=function(dataA,dataB,dataC,dataD){
                        //dataA = data.priceSensitive.xxxx
                        //dataB = data.value.xxxx
                        //dataC = data.fashion.xxxx
                        //dataD = data.freaks.xxxx
                        var result={
                            priceSensitive:[],
                            value:[],
                            fashion:[],
                            freaks:[]
                        };
                        var color="";

                        dataA.forEach(function(single){
                            switch(single.parentID){
                                case 1:color=PlayerColor.s1;break;
                                case 2:color=PlayerColor.s2;break;
                                case 3:color=PlayerColor.s3;break;
                                case 5:color=PlayerColor.r1;break;
                                case 6:color=PlayerColor.r1;break;
                                default:color=PlayerColor.s1;break;
                            }
                            result.priceSensitive.push({
                                name:single.name,
                                data:[[Label.getContent('Price Sensitive'),single.value*100]],
                                type:'column',
                                color:color,
                                stack: single.name
                            });
                        });
                        dataB.forEach(function(single){
                            switch(single.parentID){
                                case 1:color=PlayerColor.s1;break;
                                case 2:color=PlayerColor.s2;break;
                                case 3:color=PlayerColor.s3;break;
                                case 5:color=PlayerColor.r1;break;
                                case 6:color=PlayerColor.r1;break;
                                default:color=PlayerColor.s1;break;
                            }
                            result.value.push({
                                name:single.name,
                                data:[[Label.getContent('Value for Money'),single.value*100]],
                                type:'column',
                                color:color,
                                stack: single.name
                            });
                        });
                        dataC.forEach(function(single){
                            switch(single.parentID){
                                case 1:color=PlayerColor.s1;break;
                                case 2:color=PlayerColor.s2;break;
                                case 3:color=PlayerColor.s3;break;
                                case 5:color=PlayerColor.r1;break;
                                case 6:color=PlayerColor.r1;break;
                                default:color=PlayerColor.s1;break;
                            }
                            result.fashion.push({
                                name:single.name,
                                data:[[Label.getContent('Fashion'),single.value*100]],
                                type:'column',
                                color:color,
                                stack: single.name
                            });
                        });
                        dataD.forEach(function(single){
                            switch(single.parentID){
                                case 1:color=PlayerColor.s1;break;
                                case 2:color=PlayerColor.s2;break;
                                case 3:color=PlayerColor.s3;break;
                                case 5:color=PlayerColor.r1;break;
                                case 6:color=PlayerColor.r1;break;
                                default:color=PlayerColor.s1;break;
                            }
                            result.freaks.push({
                                name:single.name,
                                data:[[Label.getContent('Freaks'),single.value*100]],
                                type:'column',
                                color:color,
                                stack: single.name
                            });
                        });
                        return result;
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();

                        scope.priceSensitiveSerie4s=[];
                        scope.priceSensitiveSerie5s=[];
                        scope.priceSensitiveSerie6s=[];

                        scope.valueSerie4s=[];
                        scope.valueSerie5s=[];
                        scope.valueSerie6s=[];

                        scope.fashionSerie4s=[];
                        scope.fashionSerie5s=[];
                        scope.fashionSerie6s=[];

                        scope.freaksSerie4s=[];
                        scope.freaksSerie5s=[];
                        scope.freaksSerie6s=[];

                        var CORPORATEResult=setData(data.priceSensitive.CORPORATE,data.value.CORPORATE,data.fashion.CORPORATE,data.freaks.CORPORATE);
                        
                        scope.priceSensitiveSerie4s=CORPORATEResult.priceSensitive;
                        scope.valueSerie4s=CORPORATEResult.value;
                        scope.fashionSerie4s=CORPORATEResult.fashion;
                        scope.freaksSerie4s=CORPORATEResult.freaks;

                        var TRADITIONALResult=setData(data.priceSensitive.TRADITIONAL,data.value.TRADITIONAL,data.fashion.TRADITIONAL,data.freaks.TRADITIONAL);
                        
                        scope.priceSensitiveSerie5s=TRADITIONALResult.priceSensitive;
                        scope.valueSerie5s=TRADITIONALResult.value;
                        scope.fashionSerie5s=TRADITIONALResult.fashion;
                        scope.freaksSerie5s=TRADITIONALResult.freaks;

                        var INTERNETResult=setData(data.priceSensitive.INTERNET,data.value.INTERNET,data.fashion.INTERNET,data.freaks.INTERNET);
                        
                        scope.priceSensitiveSerie6s=INTERNETResult.priceSensitive;
                        scope.valueSerie6s=INTERNETResult.value;
                        scope.fashionSerie6s=INTERNETResult.fashion;
                        scope.freaksSerie6s=INTERNETResult.freaks;
                        

                        scope.priceSensitiveSerie4Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.priceSensitiveSerie4s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie4Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.valueSerie4s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie4Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.fashionSerie4s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie4Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.freaksSerie4s,
                            title: {
                                text: Label.getContent('Freaks')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };

                        scope.priceSensitiveSerie5Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.priceSensitiveSerie5s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie5Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.valueSerie5s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie5Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.fashionSerie5s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie5Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.freaksSerie5s,
                            title: {
                                text: Label.getContent('Freaks')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };

                        scope.priceSensitiveSerie6Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.priceSensitiveSerie6s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie6Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.valueSerie6s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie6Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.fashionSerie6s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie6Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    }
                                },
                                yAxis: {
                                    title: {
                                        text:''
                                    }
                                },
                                tooltip: {
                                    valueDecimals: 2
                                },
                                dataLabels: {
                                    enabled: true //是否显示数据标签
                                }
                            },
                            series: scope.freaksSerie6s,
                            title: {
                                text: Label.getContent('Freaks')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };



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