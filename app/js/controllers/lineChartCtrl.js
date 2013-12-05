define(['app','socketIO','routingConfig'], function(app) {

	app.controller('lineChartCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth', function($scope, $http, ProducerDecisionBase,$rootScope,Auth) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";	    
		var chartdata="";
	  	$scope.chartdata=chartdata;
	    	var chart1=chart2=chart3=chart4={};
	  	    $scope.chart1=chart1;  
	        $scope.chart2=chart2;
	        $scope.chart3=chart3;
	        $scope.chart4=chart4;

		var getLineChart=function(seminar,groupTitle,period){
			$scope.seminar=seminar;
			$scope.period=period;

			var url='/lineChart?seminar='+seminar+'&groupTitleENG='+groupTitle+'&period='+period;
		    $scope.showGroupENG=groupTitle.replace('as %25 of','as % of');
		    $scope.realGroupENG=groupTitle.replace('as % of','as %25 of');

		    $http({method: 'GET', url: url}).
		    success(function(data, status, headers, config) {
		      $scope.chartdata=data;
		      showLineChart($scope.cat,$scope.market,$scope.role,$scope.language);
		    }).
		    error(function(data, status, headers, config) {
		      $scope.chartdata=null;
		    });
		}

	    var showLineChart=function(cat,market,role,language){
	    	$scope.cat=cat;
	    	$scope.market=market;
	    	$scope.role=role;
	    	$scope.language=language;
	    	var charts = new Array({},{},{},{});
	    	var pColors=new Array("#004CE5","#BB0000","#FFBC01","#34393D");
	    	var rColors=new Array("#339933","#990099","#FF5200","#272727");
	    	var colors=new Array();
	    	var title="";
	    	for (var i=0;i<$scope.chartdata.chartSetCollection.length;i++){
		    	$scope.chartCollection=_.find($scope.chartdata.chartSetCollection[i].chartCollection,function(obj){
		    		return (obj.market==market&&obj.category==cat&&obj.seriesRole==role)
		    	});
		    	charts[i].data=$scope.chartCollection.data;
		    	if(language=="English"){
		    		title=$scope.chartdata.chartSetCollection[i].titleENG;
		    	}
		    	else if(language=="Chinese"){
		    		title=$scope.chartdata.chartSetCollection[i].titleCHN;
		    	}
		    	else if(language=="Russian"){
		    		title=$scope.chartdata.chartSetCollection[i].titleRUS;
		    	}

		    	for(var j=0;j<$scope.chartCollection.data.cols.length;j++)
		    	{
		    		$scope.chartCollection.data.cols[j].label=$scope.chartCollection.data.cols[j].labelENG;
		    	}
		    	if(role=="Producer"){
		    		colors=pColors;
		    	}
		    	else if(role=="Retailer"){
		    		colors=rColors;
		    	}
		    	if(charts[i].data!=undefined)
		    	{
			    	charts[i].type="LineChart";
			    	charts[i].displayed=true;
			    	charts[i].cssStyle="height:400px; width:100%;";
			    	charts[i].options = {
				        "title": title,
				        "isStacked": "true",
				        "fill": 20,
				        "displayExactValues": true,
				        "colors":colors
			    	}
		    	}
		    	else{
		    		charts[i]=null;
		    	}
	    	}
	    	$scope.chart1=charts[0]; 
	        $scope.chart2=charts[1];
	        $scope.chart3=charts[2];
	        $scope.chart4=charts[3];
	    }

	  	var startFrom=$rootScope.rootStartFrom;
	  	var endWith=$rootScope.rootEndWith;
	  	
	  	var periods=new Array();
	  	for(var i=startFrom;i<=endWith;i++){
	    	periods.push(i);
	  	}
	  	$scope.periods=periods;

	 	$scope.seminar=$rootScope.user.seminar;;
	  	$scope.groupTitle="Profitability Absolute RMB";
	  	$scope.period=endWith;

		getLineChart($scope.seminar,$scope.groupTitle,$scope.period);

		$scope.cat="HealthBeauties";
		$scope.market="Rural";
		$scope.role="Producer";
		$scope.language=="English";

	    $scope.showLineChart=showLineChart;//("HealthBeauties","Rural","Producer");
	    $scope.getLineChart=getLineChart;

	}]);

});

