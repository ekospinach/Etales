define(['directives', 'services'], function(directives){

    directives.directive('overviewProfits', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
            	isPageShown : '=',
                isPageLoading : '=',
                feedBack : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/OR_profits.html',            
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
			        for(var i=-3;i<scope.selectedPeriod;i++){
			            currentCategories.push(i);
			        }
			    /*highchart data init start*/
				    var currentOperatingProfits=new Array({
		                name:'Supplier-1',
		                data:new Array(),
		                color:'#3257A7'
		            },{
		                name:'Supplier-2',
		                data:new Array(),
		                color:'#B11E22'
		            },{
		                name:'Supplier-3',
		                data:new Array(),
		                color:'#F6B920'
		            },{
		                name:'Retailer-1',
		                data:new Array(),
		                color:'#8B288B'
		            },{
		                name:'Retailer-2',
		                data:new Array(),
		                color:'#F05422'
		            });
		            var currentOperatingProfitMargins=new Array({
		                name:'Supplier-1',
		                data:new Array(),
		                color:'#3257A7'
		            },{
		                name:'Supplier-2',
		                data:new Array(),
		                color:'#B11E22'
		            },{
		                name:'Supplier-3',
		                data:new Array(),
		                color:'#F6B920'
		            },{
		                name:'Retailer-1',
		                data:new Array(),
		                color:'#8B288B'
		            },{
		                name:'Retailer-2',
		                data:new Array(),
		                color:'#F05422'
		            });
		            var currentNetProfits=new Array({
		                name:'Supplier-1',
		                data:new Array(),
		                color:'#3257A7'
		            },{
		                name:'Supplier-2',
		                data:new Array(),
		                color:'#B11E22'
		            },{
		                name:'Supplier-3',
		                data:new Array(),
		                color:'#F6B920'
		            },{
		                name:'Retailer-1',
		                data:new Array(),
		                color:'#8B288B'
		            },{
		                name:'Retailer-2',
		                data:new Array(),
		                color:'#F05422'
		            });
		            var currentNetProfitMargins=new Array({
		                name:'Supplier-1',
		                data:new Array(),
		                color:'#3257A7'
		            },{
		                name:'Supplier-2',
		                data:new Array(),
		                color:'#B11E22'
		            },{
		                name:'Supplier-3',
		                data:new Array(),
		                color:'#F6B920'
		            },{
		                name:'Retailer-1',
		                data:new Array(),
		                color:'#8B288B'
		            },{
		                name:'Retailer-2',
		                data:new Array(),
		                color:'#F05422'
		            });
		        /*highchart data init end*/
		        /*highchart set data  start*/
		        	//OperatingProfits
			        for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_OperatingProfit.length;i++){
		                    if(scope.feedBack.f_OperatingProfit[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_OperatingProfit[i].actorID){
		                            case 1:
		                            if(scope.feedBack.f_OperatingProfit[i].categoryID==3){
		                                currentOperatingProfits[0].data.push(scope.feedBack.f_OperatingProfit[i].value);
		                            }
		                            break;
		                            case 2:
		                            if(scope.feedBack.f_OperatingProfit[i].categoryID==3){
		                                currentOperatingProfits[1].data.push(scope.feedBack.f_OperatingProfit[i].value);
		                            }
		                            break;
		                            case 3:
		                            if(scope.feedBack.f_OperatingProfit[i].categoryID==3){
		                                currentOperatingProfits[2].data.push(scope.feedBack.f_OperatingProfit[i].value);
		                            }
		                            break;
		                            case 4:
		                            if(scope.feedBack.f_OperatingProfit[i].categoryID==3){
		                                currentOperatingProfits[3].data.push(scope.feedBack.f_OperatingProfit[i].value);
		                            }
		                            break;
		                            case 5:
		                            if(scope.feedBack.f_OperatingProfit[i].categoryID==3){
		                                currentOperatingProfits[4].data.push(scope.feedBack.f_OperatingProfit[i].value);
		                            }
		                            break;
		                        }
		                    }
		                }
		            }
		            //OperatingProfitMargins
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_OperatingProfitMargin.length;i++){
		                    if(scope.feedBack.f_OperatingProfitMargin[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_OperatingProfitMargin[i].actorID){
		                            case 1:
		                            if(scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
		                                currentOperatingProfitMargins[0].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
		                            }
		                            break;
		                            case 2:
		                            if(scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
		                                currentOperatingProfitMargins[1].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
		                            }
		                            break;
		                            case 3:
		                            if(scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
		                                currentOperatingProfitMargins[2].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
		                            }
		                            break;
		                            case 4:
		                            if(scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
		                                currentOperatingProfitMargins[3].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
		                            }
		                            break;
		                            case 5:
		                            if(scope.feedBack.f_OperatingProfitMargin[i].categoryID==3){
		                                currentOperatingProfitMargins[4].data.push(scope.feedBack.f_OperatingProfitMargin[i].value);
		                            }
		                            break;
		                        }
		                    }
		                }
		            }
		            //NetProfits
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_NetProfit.length;i++){
		                    if(scope.feedBack.f_NetProfit[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_NetProfit[i].actorID){
		                            case 1:
		                            if(scope.feedBack.f_NetProfit[i].categoryID==3){
		                                currentNetProfits[0].data.push(scope.feedBack.f_NetProfit[i].value);
		                            }
		                            break;
		                            case 2:
		                            if(scope.feedBack.f_NetProfit[i].categoryID==3){
		                                currentNetProfits[1].data.push(scope.feedBack.f_NetProfit[i].value);
		                            }
		                            break;
		                            case 3:
		                            if(scope.feedBack.f_NetProfit[i].categoryID==3){
		                                currentNetProfits[2].data.push(scope.feedBack.f_NetProfit[i].value);
		                            }
		                            break;
		                            case 4:
		                            if(scope.feedBack.f_NetProfit[i].categoryID==3){
		                                currentNetProfits[3].data.push(scope.feedBack.f_NetProfit[i].value);
		                            }
		                            break;
		                            case 5:
		                            if(scope.feedBack.f_NetProfit[i].categoryID==3){
		                                currentNetProfits[4].data.push(scope.feedBack.f_NetProfit[i].value);
		                            }
		                            break;
		                        }
		                    }
		                }
		            }
		            //NetProfitMargins
		            for(var j=0;j<currentCategories.length;j++){
		                for(var i=0;i<scope.feedBack.f_NetProfitMargin.length;i++){
		                    if(scope.feedBack.f_NetProfitMargin[i].period==currentCategories[j]){
		                        switch(scope.feedBack.f_NetProfitMargin[i].actorID){
		                            case 1:
		                            if(scope.feedBack.f_NetProfitMargin[i].categoryID==3){
		                                currentNetProfitMargins[0].data.push(scope.feedBack.f_NetProfitMargin[i].value);
		                            }
		                            break;
		                            case 2:
		                            if(scope.feedBack.f_NetProfitMargin[i].categoryID==3){
		                                currentNetProfitMargins[1].data.push(scope.feedBack.f_NetProfitMargin[i].value);
		                            }
		                            break;
		                            case 3:
		                            if(scope.feedBack.f_NetProfitMargin[i].categoryID==3){
		                                currentNetProfitMargins[2].data.push(scope.feedBack.f_NetProfitMargin[i].value);
		                            }
		                            break;
		                            case 4:
		                            if(scope.feedBack.f_NetProfitMargin[i].categoryID==3){
		                                currentNetProfitMargins[3].data.push(scope.feedBack.f_NetProfitMargin[i].value);
		                            }
		                            break;
		                            case 5:
		                            if(scope.feedBack.f_NetProfitMargin[i].categoryID==3){
		                                currentNetProfitMargins[4].data.push(scope.feedBack.f_NetProfitMargin[i].value);
		                            }
		                            break;
		                        }
		                    }
		                }
		            }
		        /*highchart set data end*/
		        /*set highchart function start*/
		        	scope.currentOperatingProfits = {
		                options: {
		                    title:{
		                        text:Label.getContent('Operating Profits'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '$mln'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentOperatingProfits,
		                loading: false
		            }
		            scope.currentOperatingProfitMargins = {
		                options: {
		                    title:{
		                        text:Label.getContent('Operating Profit Margins'),
		                    },
		                    chart: {
		                        type: 'line',
		                        backgroundColor: 'transparent',
		                    },
		                    yAxis: {
		                        title: {
		                            text: '$mln'
		                        }
		                    },
		                    xAxis: {
		                        categories: currentCategories,
		                        title: {
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">$mln:'+this.point.y.toFixed(2)+'</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentOperatingProfitMargins,
		                loading: false
		            }
		            scope.currentNetProfits = {
		                options: {
		                    title:{
		                        text:Label.getContent('Net Profits'),
		                    },
		                    chart: {
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
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentNetProfits,
		                loading: false
		            }
		            scope.currentNetProfitMargins = {
		                options: {
		                    title:{
		                        text:Label.getContent('Net Profit Margins'),
		                    },
		                    chart: {
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
		                            text: Label.getContent('Period')
		                        }
		                    },
		                    tooltip: {
		                        formatter: function() {
		                            var s = '<p style="font-size:20px;line-height:20px;">'+this.series.name+'</p>'+'<p style="font-size:20px;line-height:20px;">Period:'+this.key+'</p>'+'<p style="font-size:20px;line-height:20px;">'+this.point.y.toFixed(2)+'%</p>';
		                            return s;
		                        },
		                        shared: false,
		                        useHTML: true
		                    },
		                    credits: {
		                        enabled: false
		                    }
		                },
		                series: currentNetProfitMargins,
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