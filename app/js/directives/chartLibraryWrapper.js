define(['directives'], function(directives) {
        directives.directive('ruralElecssoriesBrand1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart1') != undefined) {
                        $('#highchart1').empty();
                        $('#highchart1').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle1
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle1
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries1
                        });
                    }
                });
            }
        })
        .directive('ruralElecssoriesBrand2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart2') != undefined) {
                        $('#highchart2').empty();
                        $('#highchart2').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['', '']
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle2
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries2
                        });
                    }
                });
            }
        })
        .directive('urbanElecssoriesBrand1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart3') != undefined) {
                        $('#highchart3').empty();
                        $('#highchart3').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle1
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle1
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries1
                        });
                    }

                });
            }
        })
        .directive('urbanElecssoriesBrand2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart4') != undefined) {
                        $('#highchart4').empty();
                        $('#highchart4').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['', '']
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle2
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries2
                        });
                    }
                });
            }
        })
        .directive('ruralHealthBeautiesBrand1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart5') != undefined) {
                        $('#highchart5').empty();
                        $('#highchart5').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle1
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle1
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries1
                        });
                    }
                });
            }
        })
        .directive('ruralHealthBeautiesBrand2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart6') != undefined) {
                        $('#highchart6').empty();
                        $('#highchart6').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['', '']
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle2
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries2
                        });
                    }
                });
            }
        })
        .directive('urbanHealthBeautiesBrand1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart7') != undefined) {
                        $('#highchart7').empty();
                        $('#highchart7').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle1
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle1
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries1
                        });
                    }
                });
            }
        })
        .directive('urbanHealthBeautiesBrand2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart8') != undefined) {
                        $('#highchart8').empty();
                        $('#highchart8').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['', '']
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle2
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 20,
                                    maxSize: 20
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    var s = '<p>' + this.point.z + '</p>' + '<p>(' + this.point.y.toFixed(2) + ')</p>';
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.mySeries2
                        });
                    }

                });
            }
        })
        .directive('retailerPerceptions1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart9') != undefined) {
                        $('#highchart9').empty();
                        $('#highchart9').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: scope.ruralTitle
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle3
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle3
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 15,
                                    maxSize: 50
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    if (this.point.z == 10) {
                                        var s = '<p>' + this.series.name + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    } else {
                                        var s = '<p>' + scope.previousInfo + '</p><p>' + this.series.name + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    }
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.retailerPerceptionsSeries1
                        });
                    }

                });
            }
        })
        .directive('retailerPerceptions2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#highchart10') != undefined) {
                        $('#highchart10').empty();
                        $('#highchart10').highcharts({
                            chart: {
                                type: 'bubble',
                                zoomType: 'xy'
                            },
                            title: {
                                text: scope.urbanTitle
                            },
                            xAxis: {
                                title: {
                                    text: scope.xTitle3
                                }
                            },
                            yAxis: {
                                title: {
                                    text: scope.yTitle3
                                }
                            },
                            plotOptions: {
                                bubble: {
                                    minSize: 15,
                                    maxSize: 50
                                }
                            },
                            tooltip: {
                                formatter: function() {
                                    if (this.point.z == 10) {
                                        var s = '<p>' + this.series.name + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    } else {
                                        var s = '<p>' + scope.previousInfo + '</p><p>' + this.series.name + '</p>' + '<p>(' + this.point.x.toFixed(2) + ',' + this.point.y.toFixed(2) + ')</p>';
                                    }
                                    return s;
                                },
                                shared: false,
                                useHTML: true
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.retailerPerceptionsSeries2
                        });
                    }

                });
            }
        })
        .directive('forecastsConsumer1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment1') != undefined) {
                        $('#segment1').empty();
                        $('#segment1').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title1
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsConsumerSeries1
                        });
                    }

                });
            }
        })
        .directive('forecastsConsumer2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment2') != undefined) {
                        $('#segment2').empty();
                        $('#segment2').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title2
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsConsumerSeries2
                        });
                    }

                });
            }
        })
        .directive('forecastsConsumer3', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment3') != undefined) {
                        $('#segment3').empty();
                        $('#segment3').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title3
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsConsumerSeries3
                        });
                    }

                });
            }
        })
        .directive('forecastsConsumer4', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment4') != undefined) {
                        $('#segment4').empty();
                        $('#segment4').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title4
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsConsumerSeries4
                        });
                    }

                });
            }
        })
        .directive('forecastsShopper1', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment5') != undefined) {
                        $('#segment5').empty();
                        $('#segment5').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title1
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsShopperSeries1
                        });
                    }
                });
            }
        })
        .directive('forecastsShopper2', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment6') != undefined) {
                        $('#segment6').empty();
                        $('#segment6').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title2
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsShopperSeries2
                        });
                    }

                });
            }
        })
        .directive('forecastsShopper3', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment7') != undefined) {
                        $('#segment7').empty();
                        $('#segment7').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title3
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsShopperSeries3
                        });
                    }

                });
            }
        })
        .directive('forecastsShopper4', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#segment8') != undefined) {
                        $('#segment8').empty();
                        $('#segment8').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: scope.title4
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastsShopperSeries4
                        });
                    }

                });
            }
        })
        .directive('forecastCategory', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#forecastCategory') != undefined) {
                        $('#forecastCategory').empty();
                        $('#forecastCategory').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastCategorySeries
                        });
                    }

                });
            }
        })
        .directive('forecastInternet', function() {
            return function(scope, elem, attrs) {
                scope.$watch(attrs.ngModel, function(v) {
                    if ($('#forecastInternet') != undefined) {
                        $('#forecastInternet').empty();
                        $('#forecastInternet').highcharts({
                            chart: {
                                type: 'arearange',
                                zoomType: 'x'
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                title: {
                                    text: scope.segmentXTitle
                                },
                                categories: scope.categories
                            },
                            yAxis: {
                                title: {
                                    text: scope.segmentYTitle
                                }

                            },
                            tooltip: {
                                crosshairs: true,
                                valueDecimals: 2
                            },
                            credits: {
                                enabled: false
                            },
                            series: scope.forecastInternetSeries
                        });
                    }

                });
            }
        })
        .directive('wizard', function() {
            return function(scope, elem, attrs) {
                $("#wizard").steps({
                    headerTag: "h2",
                    bodyTag: "section",
                    transitionEffect: "slideLeft"
                });
            }
        })
        .directive('clockChart',function(){
            return function(scope,elem,attr){
                scope.$watch('myModel',function(newValue,oldValue){
                    console.log('new:'+newValue+',old:'+oldValue);
                    if(newValue!=oldValue||newValue=="hello1"){
                        if($('#clockChart')!=undefined){
                            $('#clockChart').empty();
                            var mark="Product Portfolio";
                            $('#clockChart').highcharts({
                                chart: {
                                    type: 'pie',
                                    height:scope.height,
                                    width:scope.width
                                },
                                title: {
                                    text: ''
                                },
                                credits: {
                                    enabled: false
                                },
                                tooltip: {
                                    enabled: true,
                                    formatter: function() {
                                        if(this.key!="Gone"&&this.key!="历时"){
                                            return this.key+'<br/>'+'Total Time:'+this.y+'<br/>'+'Left Time:'+this.point.z;
                                        }else{
                                            return 'Time gone:'+this.y;
                                        }
                                    }
                                },
                                plotOptions: {
                                    pie: {
                                        borderColor: null,
                                        innerSize: '70%',
                                        dataLabels: {
                                            enabled: true,
                                            distance: scope.distance,
                                            formatter: function () {
                                                if (this.point.name != mark) {
                                                    return "";
                                                } else {
                                                    return 'Time Left:'+this.point.z;                                    
                                                }
                                            },
                                            style: {
                                                fontSize: "10px"
                                            }
                                        }
                                    }
                                },
                                series: scope.chartSeries
                            })
                        }
                    }
                });
            }
        })

})