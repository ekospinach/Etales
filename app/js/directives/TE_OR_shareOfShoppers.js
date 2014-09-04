define(['directives', 'services'], function(directives){

    directives.directive('overviewShareOfShoppers', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
            	isPageShown : '=',
                isPageLoading : '=',
                feedBack : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/OR_shareOfShoppers.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;  
                    scope.isResultShown = false;             
                    scope.Label = Label;
                    if(scope.feedBack!=undefined)
                    getResult();                   
                }

                var getResult =function(){
                	var currentCategories=new Array();
			        for(var i=-3;i<=scope.selectedPeriod;i++){
			            currentCategories.push(i);
			        }
			    /*highchart data init start*/
			    	var urbanOnline=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var urbanBM=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var urbanMixed=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var urbanTotal=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var ruralOnline=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var ruralBM=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var ruralMixed=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var ruralTotal=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		        /*highchart data init end*/
		        /*set highchart data start*/
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_ShoppersShare.length;i++){
		                    if(scope.feedBack.f_ShoppersShare[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_ShoppersShare[i].shopperKind){
		                            case 'BMS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanBM[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralBM[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'NETIZENS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanOnline[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralOnline[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'MIXED':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanMixed[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralMixed[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'ALLSHOPPERS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanTotal[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralTotal[scope.feedBack.f_ShoppersShare[i].actorID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                        }

		                    }
		                }
		            }
		        /*set highchart data end*/
		        /*set highchart function start*/
		            scope.urbanOnlineShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: urbanOnline,
		                title: {
		                    text: 'Online Only'
		                },
		                loading: false
		            }
		            scope.urbanBMShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: urbanBM,
		                title: {
		                    text: 'B & M Only'
		                },
		                loading: false
		            }
		            scope.urbanMixedShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: urbanMixed,
		                title: {
		                    text: 'Mixed'
		                },
		                loading: false
		            }
		            scope.urbanTotalShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: urbanTotal,
		                title: {
		                    text: 'Total'
		                },
		                loading: false
		            }
		            scope.ruralOnlineShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: ruralOnline,
		                title: {
		                    text: 'Online Only'
		                },
		                loading: false
		            }
		            scope.ruralBMShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: ruralBM,
		                title: {
		                    text: 'B & M Only'
		                },
		                loading: false
		            }
		            scope.ruralMixedShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: ruralMixed,
		                title: {
		                    text: 'Mixed'
		                },
		                loading: false
		            }
		            scope.ruralTotalShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    yAxis:{
		                        title: {
		                            text: '%'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    chart: {
		                        type: 'line',
		                        height:300,
		                        width:550,
		                        backgroundColor: 'transparent',
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%)</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: ruralTotal,
		                title: {
		                    text: 'Total'
		                },
		                loading: false
		            }
		            scope.isPageLoading = false;
		            scope.isResultShown = true;  
		        /*set highchart function end*/

                }
                
                scope.$watch('isPageShown', function(newValue, oldValue){
                    console.log('watch is actived');
                    if(newValue==true) {
                        initializePage();
                    }
                })
                
            }
        }
    }])
})