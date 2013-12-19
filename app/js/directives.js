define(['angular','services'], function(angular, services) {
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
                .directive('angularBootstrap',function(){
                    return function(scope,elm,attrs){
                        $(".bs-sidenav>li>a").click(function(elm){
                            $(".bs-sidenav li").removeClass("active");
                            $(this).parent().addClass("active");
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
                            elem.attr.scrollspy({ "offset" : offset});
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
                .directive('jqueryPlot',function(){
                    return function(scope,elem, attrs){
                            scope.$watch(attrs.ngModel, function(v){
                            $("#chart1b").empty();
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
                            $('#chart1b').bind('jqplotDataHighlight',
                            function (ev, seriesIndex, pointIndex, data, radius) {
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
                                        icons[i]='<span class="glyphicon glyphicon-arrow-down"></span>';
                                    }
                                    else if(htmls[i].substring(htmls[i].length-2,htmls[i].length)=="UP"){
                                        htmls[i]=htmls[i].substring(0,htmls[i].length-2);
                                        icons[i]='<span class="glyphicon glyphicon-arrow-up"></span>';
                                    }
                                    else if(htmls[i].substring(htmls[i].length-4,htmls[i].length)=="SAME"){
                                        htmls[i]=htmls[i].substring(0,htmls[i].length-4);
                                        icons[i]='<span class="glyphicon glyphicon-arrow-right" style="width:20px"></span>';
                                    }
                                }
                                $('#tooltip1b').html('<p style="font-size:14px;font-weight:bold;color:' + 
                                    color + ';">' + data[3] + '</p>' + 
                                    '<p class="text-muted p-one"><label style="width:200px">'+data[4].easeOfUsePerception.Selectlabel+'</label><label style="width:100px">'+ htmls[0]+'</label>'+icons[0]+'</p>'+
                                    '<p class="text-muted p-double"><label style="width:200px">'+data[4].qualityPerception.Selectlabel+'</label><label style="width:100px">'+ htmls[1]+'</label>'+icons[1]+'</p>'+
                                    '<p class="text-muted p-one"><label style="width:200px">'+data[4].pricePerception.Selectlabel+'</label><label style="width:100px">'+ htmls[2]+'</label>'+icons[2]+'</p>'+
                                    '<p class="text-muted p-double"><label style="width:200px">'+data[4].marketShare.Selectlabel+'</label><label style="width:100px">'+ htmls[3]+'</label>'+icons[3]+'</p>'+
                                    '<p class="text-muted p-one"><label style="width:200px">'+data[4].brandAwareness.Selectlabel+'</label><label style="width:100px">'+ htmls[4]+'</label>'+icons[4]+'</p>'+
                                    '<p class="text-muted p-double"><label style="width:200px">'+data[4].visibilityShare.Selectlabel+'</label><label style="width:100px">'+ htmls[5]+'</label>'+icons[5]+'</p>'
                                    );
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
                          $('#chart1b').bind('jqplotDataUnhighlight',
                            function (ev, seriesIndex, pointIndex, data) {
                                $('#tooltip1b').empty();
                                $('#tooltip1b').hide();
                                $('#legend1b tr').css('background-color', '#ffffff');
                            });
                       });
                    }
                })

                .directive('jqueryPlot2',function(){
                    return function(scope,elem, attrs){
                            scope.$watch(attrs.ngModel, function(v){
                                    $("#chart2b").empty();
                                    var plot2b=$.jqplot('chart2b',[scope.costData],{
                                    grid:{
                                        backgroundColor: "transparent",
                                    },
                                    axes:{
                                            xaxis:{
                                                    //label:"No data",
                                                    //labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
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