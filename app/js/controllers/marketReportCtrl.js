define(['app','socketIO','routingConfig'], function(app) {

	app.controller('marketReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth', function($scope, $http, ProducerDecisionBase,$rootScope,Auth) {
		// You can access the scope of the controller from here
		
		var myreport=myfinreport="";
		$scope.myreport=myreport;
		$scope.myfinreport=myfinreport;
		var getReport=function(seminar,titleENG,period){
			$scope.seminar=seminar;
			$scope.period=period;
			var url='/marketReport?seminar='+seminar+'&titleENG='+titleENG+'&period='+period;
			$scope.showTitleENG=titleENG.replace('%2B','+');
			$scope.realTitleENG=titleENG.replace('+','%2B');
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
		    $scope.reportCollection=_.find(myreport.reportCollection,function(obj){
		      return (obj.market==market&&obj.category==cat)
		    });
		    var charttable = {};
	        charttable.type = "Table";
	        charttable.displayed = true;
	        charttable.cssStyle = "height:400px; width:100%;";
	        charttable.data=$scope.reportCollection.data;
	        /*multilingual*/
	        var title="";
	        if(language=="Russian"){
	          title=myreport.documentTitleRUS;
	          for(var i=0;i<charttable.data.cols.length;i++){
	            charttable.data.cols[i].label=charttable.data.cols[i].labelRUS;
	          }
	        }
	        else if(language=="English"){
	          title=myreport.documentTitleENG;
	          for(var i=0;i<charttable.data.cols.length;i++){
	            charttable.data.cols[i].label=charttable.data.cols[i].labelENG;
	          }
	        }
	        else if(language=="Chinese"){
	          title=myreport.documentTitleCHN;
	          for(var i=0;i<charttable.data.cols.length;i++){
	            charttable.data.cols[i].label=charttable.data.cols[i].labelCHN;
	          }
	        }
	        charttable.options = {
	          "title": title,
	          "isStacked": "true",
	          "fill": 20,
	          "displayExactValues": true,
	          "vAxis": {
	              "title": "Sales unit", "gridlines": {"count": 10}
	          },
	          "hAxis": {
	              "title": "Date"
	          }
	      	}
	      	$scope.optitle=title;
	      	$scope.charttable=charttable;
	  	}


		  var seminar=$rootScope.user.seminar;
		  var titleENG="Brand Awareness";
		  $scope.seminar=seminar;
		  $scope.realTitleENG=titleENG;
		  $scope.showTitleENG=titleENG;
		  $scope.period=period;
		  var startFrom=$rootScope.rootStartFrom;
		  var endWith=$rootScope.rootEndWith;



		  var period=endWith;
		  var periods=new Array();
		  for(var i=startFrom;i<=endWith;i++){
		    periods.push(i);
		  }
		  $scope.periods=periods;

		  var cat="HealthBeauties";
		  var market="Rural";
		  var language="English";
		  //var detail="Brand";
		  $scope.cat=cat;
		  $scope.market=market;
		  $scope.language=language;
		  //$scope.detail=detail;

		  //$scope.getFinReport=getFinReport;
		  //$scope.showFinReport=showFinReport;
		  $scope.getReport=getReport;
		  $scope.showReport=showReport;

		  getReport(seminar,titleENG,period);

	}]);

});

