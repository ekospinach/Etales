define(['directives', 'services'], function(directives) {

    directives.directive('generalElecssoriesSegmentLeadership', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues', 'PlayerColor',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues, PlayerColor) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_elecssoriesSegmentLeadership.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        //switching('showPerformance');
                        var url = '/segmentLeadership/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod+'/1';
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
                                name:Label.getContent('Fashion'),
                                data:[]
                            }],
                            freaks:[{
                                name:Label.getContent('Freaks'),
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

                        scope.priceSensitiveSerie1s=[];
                        scope.priceSensitiveSerie2s=[];
                        scope.priceSensitiveSerie3s=[];

                        scope.valueSerie1s=[];
                        scope.valueSerie2s=[];
                        scope.valueSerie3s=[];

                        scope.fashionSerie1s=[];
                        scope.fashionSerie2s=[];
                        scope.fashionSerie3s=[];

                        scope.freaksSerie1s=[];
                        scope.freaksSerie2s=[];
                        scope.freaksSerie3s=[];

                        scope.priceSensitiveSerie1Cate=[];
                        scope.priceSensitiveSerie2Cate=[];
                        scope.priceSensitiveSerie3Cate=[];

                        scope.valueSerie1Cate=[];
                        scope.valueSerie2Cate=[];
                        scope.valueSerie3Cate=[];

                        scope.fashionSerie1Cate=[];
                        scope.fashionSerie2Cate=[];
                        scope.fashionSerie3Cate=[];

                        scope.freaksSerie1Cate=[];
                        scope.freaksSerie2Cate=[];
                        scope.freaksSerie3Cate=[];


                        var CORPORATEResult=setData(data.priceSensitive.CORPORATE,data.value.CORPORATE,data.fashion.CORPORATE,data.freaks.CORPORATE);
                        
                        scope.priceSensitiveSerie1s=CORPORATEResult.priceSensitive;
                        scope.priceSensitiveSerie1Cate=CORPORATEResult.priceSensitiveCate;
                        scope.valueSerie1s=CORPORATEResult.value;
                        scope.valueSerie1Cate=CORPORATEResult.valueCate;
                        scope.fashionSerie1s=CORPORATEResult.fashion;
                        scope.fashionSerie1Cate=CORPORATEResult.fashionCate;
                        scope.freaksSerie1s=CORPORATEResult.freaks;
                        scope.freaksSerie1Cate=CORPORATEResult.freaksCate;

                        var TRADITIONALResult=setData(data.priceSensitive.TRADITIONAL,data.value.TRADITIONAL,data.fashion.TRADITIONAL,data.freaks.TRADITIONAL);
                        
                        scope.priceSensitiveSerie2s=TRADITIONALResult.priceSensitive;
                        scope.priceSensitiveSerie2Cate=TRADITIONALResult.priceSensitiveCate;
                        scope.valueSerie2s=TRADITIONALResult.value;
                        scope.valueSerie2Cate=TRADITIONALResult.valueCate;
                        scope.fashionSerie2s=TRADITIONALResult.fashion;
                        scope.fashionSerie2Cate=TRADITIONALResult.fashionCate;
                        scope.freaksSerie2s=TRADITIONALResult.freaks;
                        scope.freaksSerie2Cate=TRADITIONALResult.freaksCate;


                        var INTERNETResult=setData(data.priceSensitive.INTERNET,data.value.INTERNET,data.fashion.INTERNET,data.freaks.INTERNET);
                        
                        scope.priceSensitiveSerie3s=INTERNETResult.priceSensitive;
                        scope.priceSensitiveSerie3Cate=INTERNETResult.priceSensitiveCate;
                        scope.valueSerie3s=INTERNETResult.value;
                        scope.valueSerie3Cate=INTERNETResult.valueCate;
                        scope.fashionSerie3s=INTERNETResult.fashion;
                        scope.fashionSerie3Cate=INTERNETResult.fashionCate;
                        scope.freaksSerie3s=INTERNETResult.freaks;
                        scope.freaksSerie3Cate=INTERNETResult.freaksCate;
                        

                        scope.priceSensitiveSerie1Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie1Cate
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
                            series: scope.priceSensitiveSerie1s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie1Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie1Cate
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
                            series: scope.valueSerie1s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie1Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie1Cate
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
                            series: scope.fashionSerie1s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie1Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie1Cate
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
                            series: scope.freaksSerie1s,
                            title: {
                                text: Label.getContent('Freaks')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };

                        scope.priceSensitiveSerie2Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie2Cate
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
                            series: scope.priceSensitiveSerie2s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie2Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie2Cate
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
                            series: scope.valueSerie2s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie2Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie2Cate
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
                            series: scope.fashionSerie2s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie2Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie2Cate
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
                            series: scope.freaksSerie2s,
                            title: {
                                text: Label.getContent('Freaks')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };

                        scope.priceSensitiveSerie3Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.priceSensitiveSerie3Cate
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
                            series: scope.priceSensitiveSerie3s,
                            title: {
                                text: Label.getContent('Price Sensitive')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.valueSerie3Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.valueSerie3Cate
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
                            series: scope.valueSerie3s,
                            title: {
                                text: Label.getContent('Value for Money')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.fashionSerie3Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.fashionSerie3Cate
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
                            series: scope.fashionSerie3s,
                            title: {
                                text: Label.getContent('Fashion')
                            },
                            credits: {
                                enabled: false
                            },
                            
                            loading: false
                        };
                        scope.freaksSerie3Config = {
                            options: {
                                xAxis: {
                                    labels: {
                                        enabled: false //是否显示x轴刻度值
                                    },
                                    tickWidth: 0,
                                    categories:scope.freaksSerie3Cate
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
                            series: scope.freaksSerie3s,
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