define(['directives', 'services'], function(directives){

    directives.directive('overviewSales', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor){
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
			        var currentElecssoriesVolume=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});;
		            var currentElecssoriesValue=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});;
		            var currentHealthBeautiesVolume=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});;
		            var currentHealthBeautiesValue=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0]},{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1]},{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2]},{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3]},{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4]},{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5]},{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6]});;
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
		                        text:Label.getContent('Sales Volumes'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('units mln')
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+Label.getContent('units mln')+':'+this.point.y.toFixed(2)+'</p>';
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
		                        text:Label.getContent('Sales Volumes'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('units mln')
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+Label.getContent('units mln')+':'+this.point.y.toFixed(2)+'</p>';
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
		                        text:Label.getContent('Sales Values'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('$mln')
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+Label.getContent('$mln')+':'+this.point.y.toFixed(2)+'</p>';
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
		                        text:Label.getContent('Sales Values'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('$mln')
		                        },
		                        gridLineColor: 'transparent'
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>'+Label.getContent('$mln')+':'+this.point.y.toFixed(2)+'</p>';
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
                    if(newValue==true) {
                        initializePage();
                    }
                })
                
            }
        }
    }])
})