define(['directives', 'services'], function(directives){

    directives.directive('overviewShelfSpaceAllocation', ['Label','SeminarInfo','$http','PeriodInfo','$q', 'PlayerColor', function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor){
        return {
            scope : {
            	isPageShown : '=',
                isPageLoading : '=',
                feedBack : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/OR_shelfSpaceAllocation.html',            
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
			    	var currentShelfSpaceElecssories=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0], actorID : 1},
			    		{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1], actorID : 2},
			    		{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2], actorID : 3},
			    		{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3], actorID : 4},
			    		{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4], actorID : 5},
			    		{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5], actorID : 6},
			    		{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6], actorID : 7});
            		var currentShelfSpaceHealthBeauties=new Array({name:Label.getContent('Supplier')+'-'+1,data:new Array(),color:PlayerColor.getColors()[0], actorID : 1},
            			{name:Label.getContent('Supplier')+'-'+2,data:new Array(),color:PlayerColor.getColors()[1], actorID : 2},
            			{name:Label.getContent('Supplier')+'-'+3,data:new Array(),color:PlayerColor.getColors()[2], actorID : 3},
            			{name:Label.getContent('Supplier')+'-'+4,data:new Array(),color:PlayerColor.getColors()[3], actorID : 4},
            			{name:Label.getContent('Retailer')+'-'+1,data:new Array(),color:PlayerColor.getColors()[4], actorID : 5},
            			{name:Label.getContent('Retailer')+'-'+2,data:new Array(),color:PlayerColor.getColors()[5], actorID : 6},
            			{name:Label.getContent('Retailer')+'-'+3,data:new Array(),color:PlayerColor.getColors()[6], actorID : 7});

		        /*highchart data init end*/
		        /*highchart set data  start*/
			        for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_ShelfSpaceAllocation.length;i++){
		                    if(scope.feedBack.f_ShelfSpaceAllocation[i].period==currentCategories[j]){
		                        if(scope.feedBack.f_ShelfSpaceAllocation[i].categoryID==1){

		                            //currentShelfSpaceElecssories[scope.feedBack.f_ShelfSpaceAllocation[i].actorID-1].data.push(scope.feedBack.f_ShelfSpaceAllocation[i].value);
		                            currentShelfSpaceElecssories.forEach(function(value, item, array){
		                                if(scope.feedBack.f_ShelfSpaceAllocation[i].actorID == array[item].actorID){
		                                    array[item].data.push(scope.feedBack.f_ShelfSpaceAllocation[i].value * 100);
		                                }
		                            })		                            

		                        }else if(scope.feedBack.f_ShelfSpaceAllocation[i].categoryID==2){

		                            //currentShelfSpaceHealthBeauties[scope.feedBack.f_ShelfSpaceAllocation[i].actorID-1].data.push(scope.feedBack.f_ShelfSpaceAllocation[i].value);
		                            currentShelfSpaceHealthBeauties.forEach(function(value, item, array){
		                                if(scope.feedBack.f_ShelfSpaceAllocation[i].actorID == array[item].actorID){
		                                    array[item].data.push(scope.feedBack.f_ShelfSpaceAllocation[i].value * 100);
		                                }
		                            })		   
		                        }
		                    }
		                }
		            }
		        /*highchart set data end*/
		        /*set highchart function start*/
		        	scope.currentShelfSpaceElecssories = {
		                options: {
		                    title:{
		                        text:Label.getContent('Elecssories'),
		                    },
		                    chart: {
		                        
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('Shelf Space Allocation')+' (%)'
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>Shelf Space Allocation:'+this.point.y.toFixed(2)+'%</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentShelfSpaceElecssories,
		                loading: false
		            }
		            scope.currentShelfSpaceHealthBeauties = {
		                options: {
		                    title:{
		                        text:Label.getContent('HealthBeauties'),
		                    },
		                    chart: {
		                        
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: Label.getContent('Shelf Space Allocation')+' (%)'
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
		                            var s = '<p>'+this.series.name+'</p>'+'<p>'+Label.getContent('Period')+':'+this.key+'</p>'+'<p>Shelf Space Allocation:'+this.point.y.toFixed(2)+'%</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentShelfSpaceHealthBeauties,
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