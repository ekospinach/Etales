define(['directives', 'services'], function(directives){

    directives.directive('overviewShareOfShoppers', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor){
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
			    	var urbanOnline=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var urbanBM=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var urbanMixed=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var urbanTotal=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var ruralOnline=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var ruralBM=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var ruralMixed=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		            var ruralTotal=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});
		        /*highchart data init end*/
		        /*set highchart data start*/
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_ShoppersShare.length;i++){
		                    if(scope.feedBack.f_ShoppersShare[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_ShoppersShare[i].shopperKind){
		                            case 'BMS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanBM[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralBM[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'NETIZENS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanOnline[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralOnline[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'MIXED':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanMixed[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralMixed[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }
		                            break; 
		                            case 'ALLSHOPPERS':
		                                if(scope.feedBack.f_ShoppersShare[i].marketID==1){
		                                    urbanTotal[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
		                                }else if(scope.feedBack.f_ShoppersShare[i].marketID==2){
		                                    ruralTotal[scope.feedBack.f_ShoppersShare[i].storeID-1].data.push(scope.feedBack.f_ShoppersShare[i].value);
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
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Online Only')
		                },
		                loading: false
		            }
		            scope.urbanBMShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('B&M Only')
		                },
		                loading: false
		            }
		            scope.urbanMixedShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Mixed')
		                },
		                loading: false
		            }
		            scope.urbanTotalShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Total')
		                },
		                loading: false
		            }
		            scope.ruralOnlineShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Online Only')
		                },
		                loading: false
		            }
		            scope.ruralBMShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('B&M Only')
		                },
		                loading: false
		            }
		            scope.ruralMixedShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Mixed')
		                },
		                loading: false
		            }
		            scope.ruralTotalShareOfShoppers={
		                options: {
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%)</p>';
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
		                    text: Label.getContent('Total')
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