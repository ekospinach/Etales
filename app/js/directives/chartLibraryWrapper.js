define(['directives'], function(directives){
    directives.directive('jqueryPlot',function(){
        return function(scope,elem, attrs){
            scope.$watch(attrs.ngModel, function(v){
                $("#chart1b").empty();
                if(scope.data!=undefined){
                    var plot1b=$.jqplot('chart1b',[scope.data],{
                        grid:{
                            backgroundColor: "transparent",
                        },
                        axes: {
                            xaxis: {
                                label: scope.xTitle,
                                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                            },
                            yaxis:{
                                label: scope.yTitle,
                                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                            }
                        },
                        seriesColors:scope.colors,   
                        seriesDefaults:{
                            renderer: $.jqplot.BubbleRenderer,
                            rendererOptions: {
                                bubbleAlpha: 0.6,
                                highlightAlpha: 0.8,
                                showLabels: true
                            },
                            shadow: true,
                            shadowAlpha: 0.05
                        }
                    });
                    $('#chart1b').bind('jqplotDataHighlight',function (ev, seriesIndex, pointIndex, data, radius) {
                        var chart_left = $('#chart1b').offset().left,
                        chart_top = $('#chart1b').offset().top,
                        x = plot1b.axes.xaxis.u2p(data[0]),  // convert x axis unita to pixels
                        y = plot1b.axes.yaxis.u2p(data[1]);  // convert y axis units to pixels
                        var color = 'rgb(86%,61%,124%)';
                        $('#tooltip1b').addClass("highlight the-icons");
                        var htmls=new Array();
                        htmls[0]=data[4].easeOfUsePerception.Value;//+"(+3)UP";
                        htmls[1]=data[4].qualityPerception.Value;//+"(+3)UP";  
                        htmls[2]=data[4].pricePerception.Value;//+"(+3)UP";
                        htmls[3]=data[4].marketShare.Value;//+"(+3)UP";  
                        htmls[4]=data[4].brandAwareness.Value;//+"(+3)UP";
                        htmls[5]=data[4].visibilityShare.Value;//+"(+3)UP";           
                        var icons=new Array(["","","","","",""]);
                        for(var i=0;i<6;i++){
                            if(htmls[i].substring(htmls[i].length-4,htmls[i].length)=="DOWN"){
                                htmls[i]=htmls[i].substring(0,htmls[i].length-4);
                                icons[i]='<span class="icon-arrow-down"></span>';
                            }
                            else if(htmls[i].substring(htmls[i].length-2,htmls[i].length)=="UP"){
                                htmls[i]=htmls[i].substring(0,htmls[i].length-2);
                                icons[i]='<span class="icon-arrow-up"></span>';
                            }
                            else if(htmls[i].substring(htmls[i].length-4,htmls[i].length)=="SAME"){
                                htmls[i]=htmls[i].substring(0,htmls[i].length-4);
                                icons[i]='<span class="icon-arrow-right" style="width:20px"></span>';
                            }
                        }
                        $('#tooltip1b').html('<p style="font-size:14px;font-weight:bold;color:' + color + ';">' + data[3] + '</p>' + 
                            '<p class="text-muted p-one"><label style="width:200px">'+data[4].easeOfUsePerception.Selectlabel+'</label><label style="width:100px">'+ htmls[0]+'</label>'+icons[0]+'</p>'+
                            '<p class="text-muted p-double"><label style="width:200px">'+data[4].qualityPerception.Selectlabel+'</label><label style="width:100px">'+ htmls[1]+'</label>'+icons[1]+'</p>'+
                            '<p class="text-muted p-one"><label style="width:200px">'+data[4].pricePerception.Selectlabel+'</label><label style="width:100px">'+ htmls[2]+'</label>'+icons[2]+'</p>'+
                            '<p class="text-muted p-double"><label style="width:200px">'+data[4].marketShare.Selectlabel+'</label><label style="width:100px">'+ htmls[3]+'</label>'+icons[3]+'</p>'+
                            '<p class="text-muted p-one"><label style="width:200px">'+data[4].brandAwareness.Selectlabel+'</label><label style="width:100px">'+ htmls[4]+'</label>'+icons[4]+'</p>'+
                            '<p class="text-muted p-double"><label style="width:200px">'+data[4].visibilityShare.Selectlabel+'</label><label style="width:100px">'+ htmls[5]+'</label>'+icons[5]+'</p>');
                        if(x+radius+350>=$("#chart1b").width()){
                            $('#tooltip1b').css({left:x-radius-320, top:y+radius-10 });
                        }
                        else if(x+radius+350<$("#chart1b").width()){
                            $('#tooltip1b').css({left:x+radius+15, top:y+radius-10 });
                        }
                        $('#tooltip1b').show();
                        $('#legend1b tr').css('background-color', '#ffffff');
                        $('#legend1b tr').eq(pointIndex+1).css('background-color', color);
                    });
                    $('#chart1b').bind('jqplotDataUnhighlight',function (ev, seriesIndex, pointIndex, data) {
                        $('#tooltip1b').empty();
                        $('#tooltip1b').hide();
                        $('#legend1b tr').css('background-color', '#ffffff');
                    });
                }
            });
        }
    })

    .directive('jqueryPlot2',function(){
        return function(scope,elem, attrs){
            scope.$watch(attrs.ngModel, function(v){
                $("#chart2b").empty();
                if(scope.costData!=undefined){
                    var plot2b=$.jqplot('chart2b',[scope.costData],{
                        grid:{
                            backgroundColor: "transparent",
                        },
                        axes:{
                            xaxis:{
                                tickOptions:{
                                    show:false
                                }
                            },
                            yaxis:{
                                label: scope.zTitle,
                                labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                            }
                        },
                        seriesColors:scope.costColors,   
                        seriesDefaults:{
                            renderer: $.jqplot.BubbleRenderer,
                            rendererOptions: {
                                bubbleAlpha: 0.6,
                                highlightAlpha: 0.8,
                                showLabels: true
                            },
                            shadow: true,
                            shadowAlpha: 0.05
                        }
                    });
                }
            });
        }
    })
    //ruralElecssories
    .directive('ruralElecssoriesBrand1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart1')!=undefined){
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
                            title:{text:scope.xTitle1}
                        },
                        yAxis:{
                            title:{text:scope.yTitle1}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    .directive('ruralElecssoriesBrand2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart2')!=undefined){
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
                            categories: ['','']
                        }, 
                        yAxis:{
                            title:{text:scope.yTitle2}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.y.toFixed(2)+')</p>';
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
    .directive('urbanElecssoriesBrand1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart3')!=undefined){
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
                            title:{text:scope.xTitle1}
                        },
                        yAxis:{
                            title:{text:scope.yTitle1}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    .directive('urbanElecssoriesBrand2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart4')!=undefined){
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
                            categories: ['','']
                        }, 
                        yAxis:{
                            title:{text:scope.yTitle2}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.y.toFixed(2)+')</p>';
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
    .directive('ruralHealthBeautiesBrand1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart5')!=undefined){
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
                            title:{text:scope.xTitle1}
                        },
                        yAxis:{
                            title:{text:scope.yTitle1}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    .directive('ruralHealthBeautiesBrand2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart6')!=undefined){
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
                            categories: ['','']
                        }, 
                        yAxis:{
                            title:{text:scope.yTitle2}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.y.toFixed(2)+')</p>';
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
    .directive('urbanHealthBeautiesBrand1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart7')!=undefined){
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
                            title:{text:scope.xTitle1}
                        },
                        yAxis:{
                            title:{text:scope.yTitle1}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    .directive('urbanHealthBeautiesBrand2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart8')!=undefined){
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
                            categories: ['','']
                        }, 
                        yAxis:{
                            title:{text:scope.yTitle2}
                        },  
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.y.toFixed(2)+')</p>';
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
    .directive('retailerPerceptions1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart9')!=undefined){
                    $('#highchart9').empty();
                    $('#highchart9').highcharts({
                        chart: {
                            type: 'bubble',
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            title:{text:scope.xTitle3}
                        },
                        yAxis:{
                            title:{text:scope.yTitle3}
                        }, 
                        plotOptions: {
                            bubble: {
                                minSize: 50,
                                maxSize: 50
                            }
                        }, 
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.series.name+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    .directive('retailerPerceptions2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel, function(v){
                if($('#highchart10')!=undefined){
                    $('#highchart10').empty();
                    $('#highchart10').highcharts({
                        chart: {
                            type: 'bubble',
                            zoomType: 'xy'
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            title:{text:scope.xTitle3}
                        },
                        yAxis:{
                            title:{text:scope.yTitle3}
                        }, 
                        plotOptions: {
                            bubble: {
                                minSize: 50,
                                maxSize: 50
                            }
                        }, 
                        tooltip: {
                            formatter: function() {
                                var s = '<p>'+this.series.name+'</p>'+'<p>('+this.point.x.toFixed(2)+','+this.point.y.toFixed(2)+')</p>';
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
    //ForecastsConsumer
    .directive('forecastsConsumer1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment1')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsConsumer2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment2')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsConsumer3',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment3')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsConsumer4',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment4')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsShopper1',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment5')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsShopper2',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment6')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsShopper3',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment7')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('forecastsShopper4',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#segment8')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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
    .directive('wizard',function(){
        return function(scope,elem,attrs){
            $("#wizard").steps({
                headerTag: "h2",
                bodyTag: "section",
                transitionEffect: "slideLeft"
            });
        }
    })
    .directive('forecastCategory',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#forecastCategory')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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

    .directive('forecastInternet',function(){
        return function(scope,elem,attrs){
            scope.$watch(attrs.ngModel,function(v){
                if($('#forecastInternet')!=undefined){
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
                            title:{text:scope.segmentXTitle},categories:scope.categories
                        },
                        yAxis:{
                            title:{text:scope.segmentYTitle}
                            
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

    // .directive('doubleScroll',function(){
    //     return function(scope,elem,attrs){
    //         $('.double-scroll').doubleScroll();
    //     }
    // })

    .directive('googleChart', ['$timeout','$window', function ($timeout, $window) {
        return {
            restrict: 'A',
            scope: {
                chart: '=chart1'
            },
            link: function ($scope, $elm, $attr) {
                $scope.$watch('chart', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                }, true); // true is for deep object equality checking
                angular.element($window).bind('resize', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                });
                function draw() {
                    if (!draw.triggered && ($scope.chart != undefined)&&($scope.chart.data!=undefined)) {
                        draw.triggered = true;
                        $timeout(function () {
                            draw.triggered = false;
                            var dataTable = new google.visualization.DataTable($scope.chart.data, 0.5);

                            var chartWrapperArgs = {
                                chartType: $scope.chart.type,
                                dataTable: dataTable,
                                view: $scope.chart.view,
                                options: $scope.chart.options,
                                containerId: $elm[0]
                            };

                            if($scope.chartWrapper==null) {
                                $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
                                google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
                                    $scope.chart.displayed = true;
                                });
                                google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
                                    console.log("Chart not displayed due to error: " + err.message);
                                });
                            }
                            else {
                                $scope.chartWrapper.setChartType($scope.chart.type);
                                $scope.chartWrapper.setDataTable(dataTable);
                                $scope.chartWrapper.setView($scope.chart.view);
                                $scope.chartWrapper.setOptions($scope.chart.options);
                            }
                                
                            $timeout(function () {
                                $scope.chartWrapper.draw();
                            });
                        }, 0, true);
                    }
                }
            }
        };
    }])
    .directive('googleChart2', ['$timeout', '$window', function ($timeout, $window) {
        return {
            restrict: 'A',
            scope: {
                chart: '=chart2'
            },
            link: function ($scope, $elm, $attr) {
                // Watches, to refresh the chart when its data, title or dimensions change
                $scope.$watch('chart', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                }, true); // true is for deep object equality checking

                // Redraw the chart if the window is resized 
                angular.element($window).bind('resize', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                });
                function draw() {
            //        console.log($scope.chart);
                    if (!draw.triggered && ($scope.chart != undefined)&&($scope.chart.data!=undefined)) {
                        draw.triggered = true;
                        $timeout(function () {
                            draw.triggered = false;
                            var dataTable = new google.visualization.DataTable($scope.chart.data, 0.5);

                            var chartWrapperArgs = {
                                chartType: $scope.chart.type,
                                dataTable: dataTable,
                                view: $scope.chart.view,
                                options: $scope.chart.options,
                                containerId: $elm[0]
                            };

                            if($scope.chartWrapper==null) {
                                $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
                                google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
                                    $scope.chart.displayed = true;
                                });
                                google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
                                    console.log("Chart not displayed due to error: " + err.message);
                                });
                            }
                            else {
                                $scope.chartWrapper.setChartType($scope.chart.type);
                                $scope.chartWrapper.setDataTable(dataTable);
                                $scope.chartWrapper.setView($scope.chart.view);
                                $scope.chartWrapper.setOptions($scope.chart.options);
                            }
                                
                            $timeout(function () {
                                $scope.chartWrapper.draw();
                            });
                        }, 0, true);
                    }
                }
            }
        };
    }])
    .directive('googleChart3', ['$timeout', '$window', function ($timeout, $window) {
        return {
            restrict: 'A',
            scope: {
                chart: '=chart3'
            },
            link: function ($scope, $elm, $attr) {
                // Watches, to refresh the chart when its data, title or dimensions change
                $scope.$watch('chart', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                }, true); // true is for deep object equality checking

                // Redraw the chart if the window is resized 
                angular.element($window).bind('resize', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                });
                function draw() {
            //        console.log($scope.chart);
                    if (!draw.triggered && ($scope.chart != undefined)&&($scope.chart.data!=undefined)) {
                        draw.triggered = true;
                        $timeout(function () {
                            draw.triggered = false;
                            var dataTable = new google.visualization.DataTable($scope.chart.data, 0.5);

                            var chartWrapperArgs = {
                                chartType: $scope.chart.type,
                                dataTable: dataTable,
                                view: $scope.chart.view,
                                options: $scope.chart.options,
                                containerId: $elm[0]
                            };

                            if($scope.chartWrapper==null) {
                                $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
                                google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
                                    $scope.chart.displayed = true;
                                });
                                google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
                                    console.log("Chart not displayed due to error: " + err.message);
                                });
                            }
                            else {
                                $scope.chartWrapper.setChartType($scope.chart.type);
                                $scope.chartWrapper.setDataTable(dataTable);
                                $scope.chartWrapper.setView($scope.chart.view);
                                $scope.chartWrapper.setOptions($scope.chart.options);
                            }
                                
                            $timeout(function () {
                                $scope.chartWrapper.draw();
                            });
                        }, 0, true);
                    }
                }
            }
        };
    }])
    .directive('googleChart4', ['$timeout', '$window', function ($timeout, $window) {
        return {
            restrict: 'A',
            scope: {
                chart: '=chart4'
            },
            link: function ($scope, $elm, $attr) {
                // Watches, to refresh the chart when its data, title or dimensions change
                $scope.$watch('chart', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                }, true); // true is for deep object equality checking

                // Redraw the chart if the window is resized 
                angular.element($window).bind('resize', function () {
                    if($scope.chart.data!=undefined){
                        draw();
                        $elm.css("display","block");
                    }
                    else{
                        $elm.css("display","none");
                    }
                });
                function draw() {
            //        console.log($scope.chart);
                    if (!draw.triggered && ($scope.chart != undefined)&&($scope.chart.data!=undefined)) {
                        draw.triggered = true;
                        $timeout(function () {
                            draw.triggered = false;
                            var dataTable = new google.visualization.DataTable($scope.chart.data, 0.5);

                            var chartWrapperArgs = {
                                chartType: $scope.chart.type,
                                dataTable: dataTable,
                                view: $scope.chart.view,
                                options: $scope.chart.options,
                                containerId: $elm[0]
                            };

                            if($scope.chartWrapper==null) {
                                $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
                                google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
                                    $scope.chart.displayed = true;
                                });
                                google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
                                    console.log("Chart not displayed due to error: " + err.message);
                                });
                            }
                            else {
                                $scope.chartWrapper.setChartType($scope.chart.type);
                                $scope.chartWrapper.setDataTable(dataTable);
                                $scope.chartWrapper.setView($scope.chart.view);
                                $scope.chartWrapper.setOptions($scope.chart.options);
                            }
                                
                            $timeout(function () {
                                $scope.chartWrapper.draw();
                            });
                        }, 0, true);
                    }
                }
            }
        };
    }]);

})
