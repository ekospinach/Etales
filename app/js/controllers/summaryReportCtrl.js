define(['app','socketIO','routingConfig'], function(app) {

	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    var generalReport="";
		    var url="/getGeneralReport/"+SeminarInfo.getSelectedSeminar()+'/'+PeriodInfo.getCurrentPeriod();
		    $http({
		    	method:'GET',
		    	url:url
		    }).then(function(data){
		    	$scope.generalReport=data.data;
		    	console.log($scope.generalReport);
		    	showPerformance();
		    });

		    var showPerformance=function(){
		    	$scope.Performance=true;
		    	$scope.MarketShare=false;
		    	$scope.Product=false;
		    	$scope.EMallPrices=false;

		    	$scope.operatingProfits=new Array();
		    	$scope.cumulativeInvestments=new Array();
		    	$scope.salesVolumes=new Array();
		    	$scope.salesValues=new Array();
		    	$scope.volumeShares=new Array();
		    	$scope.valueShares=new Array();
		    	for(i=0;i<$scope.generalReport[0].actorInfo.length;i++){
		    		$scope.operatingProfits.push({'value':$scope.generalReport[0].actorInfo[i].grph_OperatingProfit});
		    		$scope.cumulativeInvestments.push({'value':$scope.generalReport[0].actorInfo[i].grph_CumulativeInvestment});
		    		for(j=0;j<$scope.generalReport[0].actorInfo[i].actorCategoryInfo.length-1;j++){
		    			$scope.salesVolumes.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_SalesVolume});
		    			$scope.salesValues.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_NetSalesValue});
		    			$scope.valueShares.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_ValueMarketShare});
		    			$scope.volumeShares.push({'value':$scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_VolumeMarketShare});
		    		}
		    	}
		    	console.log($scope.valueShares);
		    }

		    var showMarketShare=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=true;
		    	$scope.Product=false;
		    	$scope.EMallPrices=false;

		    	$scope.totals=new Array();

		    	for(i=0;i<5;i++){

		    	}

		    	$scope.chartSeries = [
			        {"name": "Some data", "data": [1, 2, 4, 7, 3],type: "column"},
			        {"name": "Some data 3", "data": [3, 1, 5, 5, 2], type: "column"},
			        {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
			        {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
			    ];

			    $scope.chartConfig = {
			        options: {
			            chart: {
			                type: 'areaspline'
			            },
			            plotOptions: {
			                series: {
			                    stacking: 'percent'
			                }
			            }
			        },
			        series: $scope.chartSeries,
			        title: {
			            text: 'Hello'
			        },
			        credits: {
			            enabled: true
			        },
			        loading: false
			    }
		    }

		    var showProduct=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=false;
		    	$scope.Product=true;
		    	$scope.EMallPrices=false;
		    }

		    var showEMallPrices=function(){
		    	$scope.Performance=false;
		    	$scope.MarketShare=false;
		    	$scope.Product=false;
		    	$scope.EMallPrices=true;
		    }

		    $scope.showPerformance=showPerformance;
		    $scope.showMarketShare=showMarketShare;
		    $scope.showProduct=showProduct;
		  	$scope.showEMallPrices=showEMallPrices;

	}]);

});
