define(['directives', 'services'], function(directives){

    directives.directive('overviewMarketShares', ['Label','SeminarInfo','$http','PeriodInfo','$q','PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q,PlayerColor){
        return {
            scope : {
            	isPageShown : '=',
                isPageLoading : '=',
                feedBack : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/OR_marketShares.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    console.log('initializePage some small...');                    
                    scope.isPageLoading = true;  
                    scope.isResultShown = false;             
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                	var currentCategories=new Array();
			        for(var i=-3;i<=scope.selectedPeriod;i++){
			            currentCategories.push(i);
			        }
			    /*highchart data init start*/
			    	var currentElecssoriesVolume=
			    	new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Supplier-4',data:new Array(),color:PlayerColor.getColors()[3]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]},{name:'Retailer-3',data:new Array(),color:PlayerColor.getColors()[6]});
			    	var currentElecssoriesValue=new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Supplier-4',data:new Array(),color:PlayerColor.getColors()[3]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]},{name:'Retailer-3',data:new Array(),color:PlayerColor.getColors()[6]});
			    	var currentHealthBeautiesVolume=new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Supplier-4',data:new Array(),color:PlayerColor.getColors()[3]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]},{name:'Retailer-3',data:new Array(),color:PlayerColor.getColors()[6]});
			    	var currentHealthBeautiesValue=new Array({name:'Supplier-1',data:new Array(),color:PlayerColor.getColors()[0]},{name:'Supplier-2',data:new Array(),color:PlayerColor.getColors()[1]},{name:'Supplier-3',data:new Array(),color:PlayerColor.getColors()[2]},{name:'Supplier-4',data:new Array(),color:PlayerColor.getColors()[3]},{name:'Retailer-1',data:new Array(),color:PlayerColor.getColors()[4]},{name:'Retailer-2',data:new Array(),color:PlayerColor.getColors()[5]},{name:'Retailer-3',data:new Array(),color:PlayerColor.getColors()[6]});
		        /*highchart data init end*/
		        /*highchart set data  start*/
		        	//share Volume
			        for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_VolumeMarketShares.length;i++){
		                    if(scope.feedBack.f_VolumeMarketShares[i].period==currentCategories[j]){
		                        if(scope.feedBack.f_VolumeMarketShares[i].categoryID==1){
	                                currentElecssoriesVolume[scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push(scope.feedBack.f_VolumeMarketShares[i].value * 100);
	                            }else if(scope.feedBack.f_VolumeMarketShares[i].categoryID==2){
	                                currentHealthBeautiesVolume[scope.feedBack.f_VolumeMarketShares[i].actorID-1].data.push(scope.feedBack.f_VolumeMarketShares[i].value * 100);
	                            }
		                    }
		                }
		            }
		            //share value
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_ValueMarketShares.length;i++){
		                    if(scope.feedBack.f_ValueMarketShares[i].period==currentCategories[j]){
		                        if(scope.feedBack.f_ValueMarketShares[i].categoryID==1){
	                                currentElecssoriesValue[scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push(scope.feedBack.f_ValueMarketShares[i].value * 100);
	                            }else if(scope.feedBack.f_ValueMarketShares[i].categoryID==2){
	                                currentHealthBeautiesValue[scope.feedBack.f_ValueMarketShares[i].actorID-1].data.push(scope.feedBack.f_ValueMarketShares[i].value * 100);
	                            }
		                    }
		                }
		            }
		        /*highchart set data end*/
		        /*set highchart function start*/
		        	scope.currentSharesVolumeElecssories = {
		                options: {
		                    title:{
		                        text:'Volumes Shares',
		                    },
		                    chart: {
		                        width:550,
		                        height:500,
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '%'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%</p>';
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
		            scope.currentSharesVolumeHealthBeauties = {
		                options: {
		                    title:{
		                        text:'Volumes Shares',
		                    },
		                    chart: {
		                        width:550,
		                        height:500,
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '%'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%</p>';
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
		            scope.currentSharesValueElecssories = {
		                options: {
		                    title:{
		                        text:'Values Shares',
		                    },
		                    chart: {
		                        width:550,
		                        height:500,
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '%'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%</p>';
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
		            scope.currentSharesValueHealthBeauties = {
		                options: {
		                    title:{
		                        text:'Values Shares',
		                    },
		                    chart: {
		                        width:550,
		                        height:500,
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '%'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: 'Period'
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p>'+this.series.name+'</p>'+'<p>Period:'+this.key+'</p>'+'<p>'+this.point.y.toFixed(2)+'%</p>';
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