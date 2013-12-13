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

		    var reportCollection=_.find(myreport.reportCollection,function(obj){
		      return (obj.market==market&&obj.category==cat)
		    });
	        var title="";
	        if(language=="RUS"){
	          title=myreport.documentTitleRUS;
	          for(var i=0;i<reportCollection.data.cols.length;i++){
	            reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelRUS;
	          }
	        }
	        else if(language=="ENG"){
	          title=myreport.documentTitleENG;
	          for(var i=0;i<reportCollection.data.cols.length;i++){
	            reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelENG;
	          }
	        }
	        else if(language=="CHN"){
	          title=myreport.documentTitleCHN;
	          for(var i=0;i<reportCollection.data.cols.length;i++){
	            reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelCHN;
	          }
	        }
	      	$scope.optitle=title;
	      	$scope.reportCollection = reportCollection;
		    // var charttable = {};
	     //    charttable.type = "Table";
	     //    charttable.displayed = true;
	     //    charttable.cssStyle = "height:400px; width:100%;";
	     //    charttable.data=$scope.reportCollection.data;
	        /*multilingual*/
	        //test subTitles

	       //  charttable.options = {
	       //    "title": title,
	       //    "isStacked": "true",
	       //    "fill": 20,
	       //    "displayExactValues": true,
	       //    "vAxis": {
	       //        "title": "Sales unit", "gridlines": {"count": 10}
	       //    },
	       //    "hAxis": {
	       //        "title": "Date"
	       //    }
	      	// }
	      	// $scope.charttable=charttable;
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

