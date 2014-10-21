var app = angular.module('directive',[]);
app.directive('feedbackEleUrban',function(){
    return function(scope,elem,attrs){
        scope.$watch(attrs.ngModel, function(newValue){
            if(newValue!=undefined){

                var charts = [];

                //根据角标动态判断是显示还是隐藏每一个图表内对应series的数据
                function toggleSeries(i) {
                    var li = $('#feedBackEleUrbanLegend li:eq('+i+')').toggleClass('hidden'),
                        hidden = li.hasClass('hidden');
                    //遍历所有图表对象
                    for(var serie, c=0; c < charts.length; c++) {
                        serie = charts[c].series[i];
                        serie[hidden ? 'hide' : 'show']();
                    }
                }  
                charts[0]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart50',backgroundColor: 'transparent'},
                    xAxis:scope.E_urbanOnlineShareOfShoppers.options.xAxis,
                    yAxis:scope.E_urbanOnlineShareOfShoppers.options.yAxis,
                    tooltip:scope.E_urbanOnlineShareOfShoppers.options.tooltip,
                    series:scope.E_urbanOnlineShareOfShoppers.series,
                    title:scope.E_urbanOnlineShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                },function(chart){
                    var $legend = $('#feedBackEleUrbanLegend');
                    //动态渲染图例且给每一个li对象绑定click点击事件
                    for(i=0; i<chart.series.length; i++) {
                        (function(serie, i, $legend){
                            $('<li>')
                                .css('color', serie.color)
                                .append('<span class="circle" style="background-color:'+serie.color+';">&nbsp;</span>')
                                .append(serie.name)
                                .click(function(){
                                    toggleSeries(i);
                                })
                                .appendTo($legend);
                        })(chart.series[i], i, $legend);
                    } 
                });
                charts[1]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart51',backgroundColor: 'transparent'},
                    xAxis:scope.E_urbanBMShareOfShoppers.options.xAxis,
                    yAxis:scope.E_urbanBMShareOfShoppers.options.yAxis,
                    tooltip:scope.E_urbanBMShareOfShoppers.options.tooltip,
                    series:scope.E_urbanBMShareOfShoppers.series,
                    title:scope.E_urbanBMShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[2]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart52',backgroundColor: 'transparent'},
                    xAxis:scope.E_urbanMixedShareOfShoppers.options.xAxis,
                    yAxis:scope.E_urbanMixedShareOfShoppers.options.yAxis,
                    tooltip:scope.E_urbanMixedShareOfShoppers.options.tooltip,
                    series:scope.E_urbanMixedShareOfShoppers.series,
                    title:scope.E_urbanMixedShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[3]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart53',backgroundColor: 'transparent'},
                    xAxis:scope.E_urbanTotalShareOfShoppers.options.xAxis,
                    yAxis:scope.E_urbanTotalShareOfShoppers.options.yAxis,
                    tooltip:scope.E_urbanTotalShareOfShoppers.options.tooltip,
                    series:scope.E_urbanTotalShareOfShoppers.series,
                    title:scope.E_urbanTotalShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });                

            }

        });
    }
});
app.directive('feedbackEleRural',function(){
    return function(scope,elem,attrs){
        scope.$watch(attrs.ngModel, function(newValue){
            if(newValue!=undefined){

                var charts = [];

                //根据角标动态判断是显示还是隐藏每一个图表内对应series的数据
                function toggleSeries(i) {
                    var li = $('#feedBackEleRuralLegend li:eq('+i+')').toggleClass('hidden'),
                        hidden = li.hasClass('hidden');
                    //遍历所有图表对象
                    for(var serie, c=0; c < charts.length; c++) {
                        serie = charts[c].series[i];
                        serie[hidden ? 'hide' : 'show']();
                    }
                }  
                charts[0]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart54',backgroundColor: 'transparent'},
                    xAxis:scope.E_ruralOnlineShareOfShoppers.options.xAxis,
                    yAxis:scope.E_ruralOnlineShareOfShoppers.options.yAxis,
                    tooltip:scope.E_ruralOnlineShareOfShoppers.options.tooltip,
                    series:scope.E_ruralOnlineShareOfShoppers.series,
                    title:scope.E_ruralOnlineShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                },function(chart){
                    var $legend = $('#feedBackEleRuralLegend');
                    //动态渲染图例且给每一个li对象绑定click点击事件
                    for(i=0; i<chart.series.length; i++) {
                        (function(serie, i, $legend){
                            $('<li>')
                                .css('color', serie.color)
                                .append('<span class="circle" style="background-color:'+serie.color+';">&nbsp;</span>')
                                .append(serie.name)
                                .click(function(){
                                    toggleSeries(i);
                                })
                                .appendTo($legend);
                        })(chart.series[i], i, $legend);
                    } 
                });
                charts[1]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart55',backgroundColor: 'transparent'},
                    xAxis:scope.E_ruralBMShareOfShoppers.options.xAxis,
                    yAxis:scope.E_ruralBMShareOfShoppers.options.yAxis,
                    tooltip:scope.E_ruralBMShareOfShoppers.options.tooltip,
                    series:scope.E_ruralBMShareOfShoppers.series,
                    title:scope.E_ruralBMShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[2]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart56',backgroundColor: 'transparent'},
                    xAxis:scope.E_ruralMixedShareOfShoppers.options.xAxis,
                    yAxis:scope.E_ruralMixedShareOfShoppers.options.yAxis,
                    tooltip:scope.E_ruralMixedShareOfShoppers.options.tooltip,
                    series:scope.E_ruralMixedShareOfShoppers.series,
                    title:scope.E_ruralMixedShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[3]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart57',backgroundColor: 'transparent'},
                    xAxis:scope.E_ruralTotalShareOfShoppers.options.xAxis,
                    yAxis:scope.E_ruralTotalShareOfShoppers.options.yAxis,
                    tooltip:scope.E_ruralTotalShareOfShoppers.options.tooltip,
                    series:scope.E_ruralTotalShareOfShoppers.series,
                    title:scope.E_ruralTotalShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });                

            }

        });
    }
});
app.directive('feedbackHeaUrban',function(){
    return function(scope,elem,attrs){
        scope.$watch(attrs.ngModel, function(newValue){
            if(newValue!=undefined){

                var charts = [];

                //根据角标动态判断是显示还是隐藏每一个图表内对应series的数据
                function toggleSeries(i) {
                    var li = $('#feedBackHeaUrbanLegend li:eq('+i+')').toggleClass('hidden'),
                        hidden = li.hasClass('hidden');
                    //遍历所有图表对象
                    for(var serie, c=0; c < charts.length; c++) {
                        serie = charts[c].series[i];
                        serie[hidden ? 'hide' : 'show']();
                    }
                }  
                charts[0]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart58',backgroundColor: 'transparent'},
                    xAxis:scope.H_urbanOnlineShareOfShoppers.options.xAxis,
                    yAxis:scope.H_urbanOnlineShareOfShoppers.options.yAxis,
                    tooltip:scope.H_urbanOnlineShareOfShoppers.options.tooltip,
                    series:scope.H_urbanOnlineShareOfShoppers.series,
                    title:scope.H_urbanOnlineShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                },function(chart){
                    var $legend = $('#feedBackHeaUrbanLegend');
                    //动态渲染图例且给每一个li对象绑定click点击事件
                    for(i=0; i<chart.series.length; i++) {
                        (function(serie, i, $legend){
                            $('<li>')
                                .css('color', serie.color)
                                .append('<span class="circle" style="background-color:'+serie.color+';">&nbsp;</span>')
                                .append(serie.name)
                                .click(function(){
                                    toggleSeries(i);
                                })
                                .appendTo($legend);
                        })(chart.series[i], i, $legend);
                    } 
                });
                charts[1]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart59',backgroundColor: 'transparent'},
                    xAxis:scope.H_urbanBMShareOfShoppers.options.xAxis,
                    yAxis:scope.H_urbanBMShareOfShoppers.options.yAxis,
                    tooltip:scope.H_urbanBMShareOfShoppers.options.tooltip,
                    series:scope.H_urbanBMShareOfShoppers.series,
                    title:scope.H_urbanBMShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[2]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart60',backgroundColor: 'transparent'},
                    xAxis:scope.H_urbanMixedShareOfShoppers.options.xAxis,
                    yAxis:scope.H_urbanMixedShareOfShoppers.options.yAxis,
                    tooltip:scope.H_urbanMixedShareOfShoppers.options.tooltip,
                    series:scope.H_urbanMixedShareOfShoppers.series,
                    title:scope.H_urbanMixedShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[3]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart61',backgroundColor: 'transparent'},
                    xAxis:scope.H_urbanTotalShareOfShoppers.options.xAxis,
                    yAxis:scope.H_urbanTotalShareOfShoppers.options.yAxis,
                    tooltip:scope.H_urbanTotalShareOfShoppers.options.tooltip,
                    series:scope.H_urbanTotalShareOfShoppers.series,
                    title:scope.H_urbanTotalShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });                

            }

        });
    }
});
app.directive('feedbackHeaRural',function(){
    return function(scope,elem,attrs){
        scope.$watch(attrs.ngModel, function(newValue){
            if(newValue!=undefined){

                var charts = [];

                //根据角标动态判断是显示还是隐藏每一个图表内对应series的数据
                function toggleSeries(i) {
                    var li = $('#feedBackHeaRuralLegend li:eq('+i+')').toggleClass('hidden'),
                        hidden = li.hasClass('hidden');
                    //遍历所有图表对象
                    for(var serie, c=0; c < charts.length; c++) {
                        serie = charts[c].series[i];
                        serie[hidden ? 'hide' : 'show']();
                    }
                }  
                charts[0]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart62',backgroundColor: 'transparent'},
                    xAxis:scope.H_ruralOnlineShareOfShoppers.options.xAxis,
                    yAxis:scope.H_ruralOnlineShareOfShoppers.options.yAxis,
                    tooltip:scope.H_ruralOnlineShareOfShoppers.options.tooltip,
                    series:scope.H_ruralOnlineShareOfShoppers.series,
                    title:scope.H_ruralOnlineShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                },function(chart){
                    var $legend = $('#feedBackHeaRuralLegend');
                    //动态渲染图例且给每一个li对象绑定click点击事件
                    for(i=0; i<chart.series.length; i++) {
                        (function(serie, i, $legend){
                            $('<li>')
                                .css('color', serie.color)
                                .append('<span class="circle" style="background-color:'+serie.color+';">&nbsp;</span>')
                                .append(serie.name)
                                .click(function(){
                                    toggleSeries(i);
                                })
                                .appendTo($legend);
                        })(chart.series[i], i, $legend);
                    } 
                });
                charts[1]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart63',backgroundColor: 'transparent'},
                    xAxis:scope.H_ruralBMShareOfShoppers.options.xAxis,
                    yAxis:scope.H_ruralBMShareOfShoppers.options.yAxis,
                    tooltip:scope.H_ruralBMShareOfShoppers.options.tooltip,
                    series:scope.H_ruralBMShareOfShoppers.series,
                    title:scope.H_ruralBMShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[2]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart64',backgroundColor: 'transparent'},
                    xAxis:scope.H_ruralMixedShareOfShoppers.options.xAxis,
                    yAxis:scope.H_ruralMixedShareOfShoppers.options.yAxis,
                    tooltip:scope.H_ruralMixedShareOfShoppers.options.tooltip,
                    series:scope.H_ruralMixedShareOfShoppers.series,
                    title:scope.H_ruralMixedShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });
                charts[3]=new Highcharts.Chart({
                    chart: {renderTo: 'shareChart65',backgroundColor: 'transparent'},
                    xAxis:scope.H_ruralTotalShareOfShoppers.options.xAxis,
                    yAxis:scope.H_ruralTotalShareOfShoppers.options.yAxis,
                    tooltip:scope.H_ruralTotalShareOfShoppers.options.tooltip,
                    series:scope.H_ruralTotalShareOfShoppers.series,
                    title:scope.H_ruralTotalShareOfShoppers.title,
                    legend: {enabled: false},
                    credits: {enabled: false}
                });                

            }

        });
    }
});
