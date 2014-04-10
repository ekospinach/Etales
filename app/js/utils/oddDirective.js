define(['angular','services'], function(angular, services) {
<<<<<<< HEAD
        'use strict';
        angular.module('myApp.directives', ['myApp.services'])
                .directive('appVersion', ['version', function(version) {
                        return function(scope, elm, attrs) {
                                elm.text(version);
                        };
                }])        
                .directive('btnLoading',function () {        
                        return {
                            link:function (scope, element, attrs) {
                                scope.$watch(
                                    function () {
                                        return scope.$eval(attrs.btnLoading);
                                    },
                                    function (value) {
                                            //console.log('directive, btnLoading:' + value);
                                        if(value) {
                                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                                element.addClass('disabled').attr('disabled', 'disabled');
                                            }
                                            element.data('resetText', element.html());
                                            element.html(element.data('loading-text'));
                                        } else {
                                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                                element.removeClass('disabled').removeAttr('disabled');
                                            }
                                            element.html(element.data('resetText'));
                                        }
                                    }
                                );
                            }
                        };

                })
/*
                .directive('tableExcel',function(){
                    return {
                        restrict:'A',
                        link:function(scope,element,attrs){

                            var tableToExcel = (function() {
                              var uri = 'data:application/vnd.ms-excel;base64,'
                                , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
                                , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
                                , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
                              return function(table, name) {
                                if (!table.nodeType) table = document.getElementById(table)
                                var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
                                window.location.href = uri + base64(format(template, ctx))
                              }
                            })() 

                            $('#tableToExcel').click(function(){
                                tableToExcel('testTable', 'xls','W3C Example Table');
                            });
                        }
                    }
                })
                .directive('tableExcel2',function(){
                    return {
                        restrict:'A',
                        link:function(scope,element,attrs){
                            var data = generatedata(100);

                            var source = {
                                localdata: data,
                                datatype: "array",
                                updaterow: function(rowid, rowdata) {
                                    // synchronize with the server - send update command   
                                }
                            };

                            var dataAdapter = new $.jqx.dataAdapter(source);

                            // initialize jqxGrid
                            $("#jqxgrid").jqxGrid({
                                width: 1,
                                source: dataAdapter,
                                theme: 'energyblue',
                                altrows: true,
                                pageable: true,
                                //autoheight: true,
                                height:1,
                                selectionmode: 'multiplecellsextended',
                                columns: [
                                    {
                                    text: 'First Name',
                                    datafield: 'firstname',
                                    width: 90},
                                {
                                    text: 'Last Name',
                                    datafield: 'lastname',
                                    width: 90},
                                {
                                    text: 'Product',
                                    datafield: 'productname',
                                    width: 177},
                                {
                                    text: 'Available',
                                    datafield: 'available',
                                    width: 67,
                                    cellsalign: 'center',
                                    align: 'center'},
                                {
                                    text: 'Ship Date',
                                    datafield: 'date',
                                    width: 90,
                                    align: 'right',
                                    cellsalign: 'right',
                                    cellsformat: 'd'},
                                {
                                    text: 'Quantity',
                                    datafield: 'quantity',
                                    width: 70,
                                    align: 'right',
                                    cellsalign: 'right'},
                                {
                                    text: 'Price',
                                    datafield: 'price',
                                    cellsalign: 'right',
                                    align: 'right',
                                    cellsformat: 'c2'}
                                ]
                            });

                            $('#jqxgrid').css('visibility','hidden');

                            $("#excelExport").jqxButton({
                                theme: 'energyblue'
                            });

                            $("#excelExport").click(function() {
                                $("#jqxgrid").jqxGrid('exportdata', 'xls', 'jqxGrid');
                            });
                        }
                    }
                })
*/
                .directive('loadEnd',function(){
                    return function(scope,elm,attrs){
                       var pageheader=document.getElementById('pageheader'),
                       pagefooter=document.getElementById('pagefooter'),
                       pageloader=document.getElementById('pageloader');
                       pageheader.style.display="block";
                       pagefooter.style.display="block";
                       pageloader.style.display="none";
                    }
                })
                .directive('activeNav', ['$location', function(location) {
                    return {
                        restrict: 'A',
                        link: function(scope, element, attrs) {
                            var nestedA = element.find('a')[0];
                            var path = nestedA.href;
                            scope.location = location;
                            scope.$watch('location.absUrl()', function(newPath) {
                                if (path === newPath) {
                                    element.addClass('active');
                                } else {
                                    element.removeClass('active');
                                }
                            });
                        }
                    };
                }])
                .directive('navBootstrap',function(){
                    return {
                        restrict:'A',
                        link:function(scope,element,attrs){
                            $('.bs-sidenav li').click(function(){
                                $(".bs-sidenav li").removeClass("active");
                                $(this).addClass('active');
                                //$(this).firstChild.addClass('active');
                            });
                            $('.second-sidenav li').click(function(){
                                $('.second-sidenav li').removeClass("active");
                                $(".bs-sidenav li").removeClass("active");
                                $($($(this).parent()).parent()).addClass("active");
                                $(this).addClass('active');
                            })
                        }

                    }
                })
                .directive('angularBootstrap',function(){
                    return function(scope,elm,attrs){
                        $(".bs-docs-sidenav>li>a").click(function(){
                            $(".bs-docs-sidenav li").removeClass("active");
                            $(this).parent().addClass("active");
                            if($($($(this).parent()).children()[1]).children()[0]!=undefined){
                                $($($($(this).parent()).children()[1]).children()[0]).addClass('active');
                            }
                        });
                        $(".second-sidenav>li>a").click(function(){
                            $(".second-sidenav li").removeClass("active");
                            $(this).parent().addClass("active");
                        });
                    }
                })
                .directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
                    return {
                        restrict: 'A',
                        link: function(scope, element, attrs) {
                            var prevDisp = element.css('display');
                            $rootScope.$watch('user.role', function(role) {
                                //console.log('Directive handle, attrs.accessLevel: ' + attrs.accessLevel + ',try to call auth.authorize()...');
                                if(!Auth.authorize(attrs.accessLevel))
                                    element.css('display', 'none');
                                else
                                    element.css('display', prevDisp);
                            });
                        }
                    };
                }])
                .directive('jqxTree',function(){
                    return function(scope,elm,attrs){
                        $('.listTree').listTree(scope.tree, { "startCollapsed": true });
                        scope.$watch(attrs.ngModel,function(v){
                            $('.listTree').listTree('update', scope.tree,{"startCollapsed": true});
                            $(document).on('click', '.jqx-btn-success', function(e) {
                                $('.listTree').listTree('selectAll');
                            }).on('click', '.jqx-btn-danger', function(e) {
                                $('.listTree').listTree('deselectAll');
                            }).on('click', '.jqx-btn-primary', function(e) {
                                var data="?period="+scope.period+"&cat="+scope.cat+"&market="+scope.market+"&language="+scope.language+"&data="+JSON.stringify($('.listTree').data('listTree').selected);
                                scope.params=data;
                            });
                        })
                    }
                })
                .directive('scrollSpy', function($timeout){
                    return {
                        restrict: 'A',
                        link: function(scope, elem, attr) {
                            var offset = parseInt(attr.scrollOffset, 10)
                            if(!offset) offset = 10;
                            console.log("offset:  " + offset);
                            elem.scrollspy({ "offset" : offset});
                            scope.$watch(attr.scrollSpy, function(value) {
                                $timeout(function() { 
                                  elem.scrollspy('refresh', { "offset" : offset})
                                }, 1);
                            }, true);
                        }
                    }
                })
                .directive('preventDefault',function(){
                    return function(scope, element, attrs) {
                        jQuery(element).click(function(event) {
                            event.preventDefault();
                        });
                    }
                })
                .directive('scrollTo',["$window", function($window){
                    return {
                        restrict : "AC",
                        compile : function(){

                            function scrollInto(elementId) {
                                if(!elementId) $window.scrollTo(0, 0);
                                //check if an element can be found with id attribute
                                var el = document.getElementById(elementId);
                                if(el) el.scrollIntoView();
                            }

                            return function(scope, element, attr) {
                                element.bind("click", function(event){
                                    scrollInto(attr.scrollTo);
                                });
                            };
                        }
                    };
                }])
                .directive( 'affix', [ '$window', '$document', '$parse', function ( $window, $document, $parse ) {
                  return {
                    scope: { affix: '@' },
                    link: function ( scope, element, attrs ) {
                      var win = angular.element ( $window ),
                        affixed;
                                    
                      // Obviously, whenever a scroll occurs, we need to check and possibly 
                      // adjust the position of the affixed element.
                      win.bind( 'scroll', checkPosition );
                      
                      // Less obviously, when a link is clicked (in theory changing the current
                      // scroll position), we need to check and possibly adjsut the position. We,
                      // however, can't do this instantly as the page may not be in the right
                      // position yet.
                      win.bind( 'click', function () {
                        setTimeout( checkPosition, 1 );
                      });
                      
                      function checkPosition() {
                        var offset = $parse(scope.affix)(scope); 
                        var affix = win.prop('pageYOffset') <= offset ? 'top' : false;
                        
                        if (affixed === affix) return;
                          
                        affixed = affix;
                          
                        element.removeClass('affix affix-top').addClass('affix' + (affix ? '-' + affix : ''));
                      }
                    }
                  };
                }])
                .directive('highchart1',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel, function(v){
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
                                        var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.x+','+this.point.y+')</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },                      
                                series: scope.mySeries1     
                            });
                        });   
                    }
                })
                .directive('highchart2',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel, function(v){
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
                                        var s = '<p>'+this.point.z+'</p>'+'<p>('+this.point.y+')</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                 },                      
                                series: scope.mySeries2     
                            });
                        });
                    }
                })
                .directive('highchart3',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel, function(v){
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
                                    title:{text:scope.xTitle3}
                                },
                                yAxis:{
                                    title:{text:scope.yTitle3}
                                },  
                                tooltip: {
                                    formatter: function() {
                                        var s = '<p>'+this.series.name+'</p>'+'<p>('+this.point.x+','+this.point.y+')</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },                      
                                series: scope.mySeries1     
                            });
                        });   
                    }
                })
                .directive('highchart4',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel, function(v){
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
                                    title:{text:scope.xTitle3}
                                },
                                yAxis:{
                                    title:{text:scope.yTitle3}
                                }, 
                                tooltip: {
                                    formatter: function() {
                                        var s = '<p>'+this.series.name+'</p>'+'<p>('+this.point.x+','+this.point.y+')</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },                      
                                series: scope.mySeries2     
                            });
                        });   
                    }
                })
                //ForecastsConsumer
                .directive('highchartSegment1',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel,function(v){
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
                                    title:{text:scope.segmentXTitle},categories:['','-3','-2','-1','+1','+2']
                                },
                                yAxis:{
                                    title:{text:scope.segmentYTitle}
                                    
                                }, 
                                tooltip: {
                                    crosshairs: true
                                },                     
                                series: scope.mySeries1     
                            });
                        });
                    }
                })
                .directive('highchartSegment2',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel,function(v){
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
                                    title:{text:scope.segmentXTitle},categories:['','-3','-2','-1','+1','+2']
                                },
                                yAxis:{
                                    title:{text:scope.segmentYTitle}
                                    
                                }, 
                                tooltip: {
                                    crosshairs: true
                                },                     
                                series: scope.mySeries2     
                            });
                        });
                    }
                })
                .directive('highchartSegment3',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel,function(v){
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
                                    title:{text:scope.segmentXTitle},categories:['','-3','-2','-1','+1','+2']
                                },
                                yAxis:{
                                    title:{text:scope.segmentYTitle}
                                    
                                }, 
                                tooltip: {
                                    crosshairs: true
                                },                     
                                series: scope.mySeries3     
                            });
                        });
                    }
                })
                .directive('highchartSegment4',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel,function(v){
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
                                    title:{text:scope.segmentXTitle},categories:['','-3','-2','-1','+1','+2']
                                },
                                yAxis:{
                                    title:{text:scope.segmentYTitle}
                                    
                                }, 
                                tooltip: {
                                    crosshairs: true
                                },                     
                                series: scope.mySeries4     
                            });
                        });
                    }
                })
                .directive('forecast',function(){
                    return function(scope,elem,attrs){
                        scope.$watch(attrs.ngModel,function(v){
                            $('#forecast').empty();
                            $('#forecast').highcharts({
                                chart: {
                                    type: 'arearange',
                                    zoomType: 'x'
                                },
                                title: {
                                    text: ''
                                },
                                xAxis: {
                                    title:{text:scope.segmentXTitle},categories:['','-3','-2','-1','+1','+2']
                                },
                                yAxis:{
                                    title:{text:scope.segmentYTitle}
                                    
                                }, 
                                tooltip: {
                                    crosshairs: true
                                },                     
                                series: scope.forecastSeries     
                            });
                        });
                    }
                })
                .directive('jqueryPlot',function(){
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

                .directive('googleChart', ['$timeout','$window', function ($timeout, $window) {
                return {
                    restrict: 'A',
                    scope: {
                        chart: '=chart1'
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
                            //console.log($scope.chart);
                            if (!draw.triggered && ($scope.chart != undefined)&&($scope.chart.data!=undefined)) {
             //                   console.log($scope.chart.data);
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
        }

);
=======
    return angular.module('myApp.directives', ['myApp.services']);
});
>>>>>>> 48a1631e6877b0e2da1962e9d6ea5823558c059c