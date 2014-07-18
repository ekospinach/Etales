define(['directives', 'services'], function(directives){

    directives.directive('overviewSales', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
            	isPageShown : '=',
                isPageLoading : '=',
                feedBack : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/OR_sales.html',            
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
			        var currentElecssoriesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var currentElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var currentHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		            var currentHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:'#3257A7'},{name:'Supplier-2',data:new Array(),color:'#B11E22'},{name:'Supplier-3',data:new Array(),color:'#F6B920'},{name:'Supplier-4',data:new Array(),color:'#329444'},{name:'Retailer-1',data:new Array(),color:'#8B288B'},{name:'Retailer-2',data:new Array(),color:'#F05422'},{name:'Retailer-3',data:new Array(),color:'#00AFEF'});
		        /*highchart data init end*/
		        /*highchart set data  start*/
		        	//sales Volume
				    for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_MarketSalesVolume.length;i++){
		                    if(scope.feedBack.f_MarketSalesVolume[i].period==currentCategories[j]){
		                        if(scope.feedBack.f_MarketSalesVolume[i].categoryID==1){
		                            currentElecssoriesVolume[scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push(scope.feedBack.f_MarketSalesVolume[i].value);
		                        }else if(scope.feedBack.f_MarketSalesVolume[i].categoryID==2){
		                            currentHealthBeautiesVolume[scope.feedBack.f_MarketSalesVolume[i].actorID-1].data.push(scope.feedBack.f_MarketSalesVolume[i].value);
		                        }
		                    }
		                }
		            }
		            //sales value
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_MarketSalesValue.length;i++){
		                    if(scope.feedBack.f_MarketSalesValue[i].period==currentCategories[j]){
		                        if(scope.feedBack.f_MarketSalesValue[i].categoryID==1){
		                            currentElecssoriesValue[scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push(scope.feedBack.f_MarketSalesValue[i].value);
		                        }else if(scope.feedBack.f_MarketSalesValue[i].categoryID==2){
		                            currentHealthBeautiesValue[scope.feedBack.f_MarketSalesValue[i].actorID-1].data.push(scope.feedBack.f_MarketSalesValue[i].value);
		                        }
		                    }
		                }
		            }
		        /*highchart set data end*/
		        /*set highchart function start*/
		        	scope.currentSalesVolumeElecssories = {
		                options: {
		                    title:{
		                        text:'Sales Volumes',
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: 'mln units'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>mln units:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentElecssoriesVolume,
		                loading: false
		            }
		            scope.currentSalesVolumeHealthBeauties = {
		                options: {
		                    title:{
		                        text:'Sales Volumes',
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: 'mln units'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>mln units:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentHealthBeautiesVolume,
		                loading: false
		            }
		            scope.currentSalesValueElecssories = {
		                options: {
		                    title:{
		                        text:'Sales Values',
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '$mln'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>$mln:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentElecssoriesValue,
		                loading: false
		            }
		            scope.currentSalesValueHealthBeauties = {
		                options: {
		                    title:{
		                        text:'Sales Values',
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '$mln'
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>$mln:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentHealthBeautiesValue,
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