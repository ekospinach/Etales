define(['app','socketIO','routingConfig'], function(app) {

	app.controller('lineChartCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','Label', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,Label) {
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
			if(groupTitle == 'Wholesales Market Results') $scope.role = 'Producer';
			if(groupTitle == 'Retail Market Results') $scope.role = 'Retailer';

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
		    	title=Label.getContent($scope.chartdata.chartSetCollection[i].titleENG);
		    	for(var j=0;j<$scope.chartCollection.data.cols.length;j++)
		    	{
		    		$scope.chartCollection.data.cols[j].label=Label.getContent($scope.chartCollection.data.cols[j].labelENG);
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
			    	charts[i].cssStyle="height:100%; width:800;";
			    	charts[i].options = {
				        "title": title,
				        "isStacked": "true",
				        "fill": 20,
				        "displayExactValues": true,
				        "colors":colors,
				        "titleTextStyle" : { 
			        	  color: "black",
						  fontName: "",
						  fontSize: 15,
						  bold: false,
						  italic: false 
						},
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
	        console.log($scope.chart1);
	    }

	    var initialisePage = function(){
		  	var startFrom=$rootScope.rootStartFrom;
		  	var endWith=$rootScope.rootEndWith;
		  	$scope.periods=new Array();
		  	for(var i=startFrom;i<=endWith;i++){
		    	$scope.periods.push(i);
		  	}
		 	$scope.seminar=$rootScope.user.seminar;;
		  	$scope.groupTitle="Profitability Absolute RMB";
		  	$scope.period=endWith;

			$scope.cat="HealthBeauties";
			$scope.market="Rural";
			$scope.language=Label.getCurrentLanguage();

		    $scope.showLineChart=showLineChart;//("HealthBeauties","Rural","Producer");
		    $scope.getLineChart=getLineChart;	    	

		    switch(parseInt($rootScope.user.role)){
		    	case Auth.userRoles.producer:
					$scope.role="Producer";
					$scope.isRoleChangeBtnShow = false;
					break;
		    	case Auth.userRoles.retailer:
					$scope.role="Retailer";
					$scope.isRoleChangeBtnShow = false;
					break;		    	
		    	case Auth.userRoles.facilitator:
					$scope.role="Producer";
					$scope.isRoleChangeBtnShow = true;
					break;
		    	default:
					$scope.role="Producer";
					$scope.isRoleChangeBtnShow = false;
		    }

			getLineChart($scope.seminar,$scope.groupTitle,$scope.period);
	    }
	    initialisePage();
	}]);

});

