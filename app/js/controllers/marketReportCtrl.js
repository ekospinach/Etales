define(['app','socketIO','routingConfig'], function(app) {

	app.controller('marketReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','Label', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,Label) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    		
		var myreport=myfinreport="";
		$scope.myreport=myreport;
		$scope.myfinreport=myfinreport;


		var getReport=function(seminar,titleENG,period,language){
			$scope.seminar=seminar;
			$scope.period=period;
			$scope.titleENG=titleENG;
			var url='/marketReport?seminar='+seminar+'&titleENG='+titleENG+'&period='+period;

			$http({method: 'GET', url: url}).
			success(function(data, status, headers, config) {
				myreport=data;
				showReport($scope.cat,$scope.market,$scope.language);
			}).
			error(function(data, status, headers, config) {
				myreport=null;
			});
		};

		var showReport=function(cat,market,language){
		  	$scope.cat=cat;
		    $scope.market=market;
		    $scope.language=language;
		    if($scope.titleENG=="Retailer Perceptions"){
		    	$scope.reportCollection=_.find(myreport.reportCollection,function(obj){
		    		return (obj.market==market)
		    	});
		    }else{
		    	$scope.reportCollection=_.find(myreport.reportCollection,function(obj){
			    	return (obj.market==market&&obj.category==cat)
			    });
		    }
	  	}


		  $scope.seminar=$rootScope.user.seminar;
		  $scope.titleENG="Brand Awareness";
		  $scope.period=$rootScope.rootEndWith;
		  var startFrom=$rootScope.rootStartFrom;
		  var endWith=$rootScope.rootEndWith;
		   $scope.periods=new Array();
		  for(var i=startFrom;i<=endWith;i++){
		  	$scope.periods.push(i);
		  }
		  $scope.cat="HealthBeauties";
		  $scope.market="Rural";
		  $scope.language=Label.getCurrentLanguage();
		  //$scope.detail=detail;

		  $scope.getReport=getReport;
		  $scope.showReport=showReport;

		  getReport($scope.seminar,$scope.titleENG,$scope.period,$scope.language);


		  $scope.sort = {
		  	column : 1,
		  	descending : false
		  }

		  $scope.changeSorting = function(column){
		  	var sort = $scope.sort;
		  	if(sort.column == column){
		  		sort.descending = !sort.descending;
		  	} else {
		  		sort.column = column;
		  		sort.descending = false;
		  	}
		  }

		  $scope.mySorting = function(row){
		  	return row.c[$scope.sort.column].v;
		  }
	}]);

});

