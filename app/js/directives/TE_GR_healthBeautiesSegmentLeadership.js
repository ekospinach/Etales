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
                            priceSensitive:[{
                                name:Label.getContent('Price Sensitive'),
                                data:[]
                            }],
                            value:[{
                                name:Label.getContent('Value for Money'),
                                data:[]
                            }],
                            fashion:[{
                                name:Label.getContent('Health Conscious'),
                                data:[]
                            }],
                            freaks:[{
                                name:Label.getContent('Impatient'),
                                data:[]
                            }],
                            priceSensitiveCate:[],
                            valueCate:[],
                            fashionCate:[],
                            freaksCate:[],
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
                            result.priceSensitive[0].data.push({
                                y:single.value*100,
                                color:color
                            });
                            result.priceSensitiveCate.push(single.name);
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
                            result.value[0].data.push({
                                y:single.value*100,
                                color:color
                            });
                            result.valueCate.push(single.name);
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
                            result.fashion[0].data.push({
                                y:single.value*100,
                                color:color
                            });
                            result.fashionCate.push(single.name);
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
                            result.freaks[0].data.push({
                                y:single.value*100,
                                color:color
                            });
                            result.freaksCate.push(single.name);
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

                        scope.priceSensitiveSerie4Cate=[];
                        scope.priceSensitiveSerie5Cate=[];
                        scope.priceSensitiveSerie6Cate=[];

                        scope.valueSerie4Cate=[];
                        scope.valueSerie5Cate=[];
                        scope.valueSerie6Cate=[];

                        scope.fashionSerie4Cate=[];
                        scope.fashionSerie5Cate=[];
                        scope.fashionSerie6Cate=[];

                        scope.freaksSerie4Cate=[];
                        scope.freaksSerie5Cate=[];
                        scope.freaksSerie6Cate=[];





                        var CORPORATEResult=setData(data.priceSensitive.CORPORATE,data.value.CORPORATE,data.fashion.CORPORATE,data.freaks.CORPORATE);
                        
                        scope.priceSensitiveSerie4s=CORPORATEResult.priceSensitive;
                        scope.priceSensitiveSerie4Cate=CORPORATEResult.priceSensitiveCate;
                        scope.valueSerie4s=CORPORATEResult.value;
                        scope.valueSerie4Cate=CORPORATEResult.valueCate;
                        scope.fashionSerie4s=CORPORATEResult.fashion;
                        scope.fashionSerie4Cate=CORPORATEResult.fashionCate;
                        scope.freaksSerie4s=CORPORATEResult.freaks;
                        scope.freaksSerie4Cate=CORPORATEResult.freaksCate;

                        var TRADITIONALResult=setData(data.priceSensitive.TRADITIONAL,data.value.TRADITIONAL,data.fashion.TRADITIONAL,data.freaks.TRADITIONAL);
                        
                        scope.priceSensitiveSerie5s=TRADITIONALResult.priceSensitive;
                        scope.priceSensitiveSerie5Cate=TRADITIONALResult.priceSensitiveCate;
                        scope.valueSerie5s=TRADITIONALResult.value;
                        scope.valueSerie5Cate=TRADITIONALResult.valueCate;
                        scope.fashionSerie5s=TRADITIONALResult.fashion;
                        scope.fashionSerie5Cate=TRADITIONALResult.fashionCate;
                        scope.freaksSerie5s=TRADITIONALResult.freaks;
                        scope.freaksSerie5Cate=TRADITIONALResult.freaksCate;


                        var INTERNETResult=setData(data.priceSensitive.INTERNET,data.value.INTERNET,data.fashion.INTERNET,data.freaks.INTERNET);
                        
                        scope.priceSensitiveSerie6s=INTERNETResult.priceSensitive;
                        scope.priceSensitiveSerie6Cate=INTERNETResult.priceSensitiveCate;
                        scope.valueSerie6s=INTERNETResult.value;
                        scope.valueSerie6Cate=INTERNETResult.valueCate;
                        scope.fashionSerie6s=INTERNETResult.fashion;
                        scope.fashionSerie6Cate=INTERNETResult.fashionCate;
                        scope.freaksSerie6s=INTERNETResult.freaks;
                        scope.freaksSerie6Cate=INTERNETResult.freaksCate;
                        

                        scope.priceSensitiveSerie4Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie4Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie4Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie4Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Health Conscious')
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie4Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Impatient')
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie5Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie5Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie5Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Health Conscious')
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie5Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Impatient')
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie6Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie6Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie6Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Health Conscious')
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
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie6Cate
                                },
                                yAxis: {
                                    title: {
                                        text:'%'
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
                                text: Label.getContent('Impatient')
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