define(['app','socketIO','routingConfig'], function(app) {

	app.controller('marketReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth', function($scope, $http, ProducerDecisionBase,$rootScope,Auth) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    		
		var myreport=myfinreport="";
		$scope.myreport=myreport;
		$scope.myfinreport=myfinreport;

		//languages
	    $scope.titles=getMarketReport();

		var getReport=function(seminar,titleENG,period,language){
			$scope.seminar=seminar;
			$scope.period=period;
			$scope.titleENG=titleENG;
			var url='/marketReport?seminar='+seminar+'&titleENG='+titleENG+'&period='+period;
			// $scope.showTitleENG=titleENG.replace('%2B','+');
			// $scope.realTitleENG=titleENG.replace('+','%2B');

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

			for(var i=0;i<$scope.titles.length;i++){
				if(language=="English"){
					$scope.titles[i].title=$scope.titles[i].titleENG;
					if($scope.titleENG==$scope.titles[i].titleENG){
						$scope.showTitle=$scope.titles[i].titleENG;
						$scope.subTitle=$scope.titles[i].subTitleENG;					}
				}else if(language=="Russian"){
					$scope.titles[i].title=$scope.titles[i].titleRUS;
					if($scope.titleENG==$scope.titles[i].titleENG){
						$scope.showTitle=$scope.titles[i].titleRUS;
						$scope.subTitle=$scope.titles[i].subTitleRUS;
					}
				}else{
					$scope.titles[i].title=$scope.titles[i].titleCHN;
					if($scope.titleENG==$scope.titles[i].titleENG){
						$scope.showTitle=$scope.titles[i].titleCHN;
						$scope.subTitle=$scope.titles[i].subTitleCHN;
					}					
				}
			}

		    var reportCollection=_.find(myreport.reportCollection,function(obj){
		      return (obj.market==market&&obj.category==cat)
		    });
	        var title="";
	        if(language=="Russian"){
	          title=myreport.documentTitleRUS;
	          for(var i=0;i<reportCollection.data.cols.length;i++){
	            reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelRUS;
	          }
	        }
	        else if(language=="English"){
	          title=myreport.documentTitleENG;
	          for(var i=0;i<reportCollection.data.cols.length;i++){
	            reportCollection.data.cols[i].label=reportCollection.data.cols[i].labelENG;
	          }
	        }
	        else if(language=="Chinese"){
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

		  getReport(seminar,titleENG,period,language);


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
//		  	console.log('row:' + JSON.stringify(row.c));
		  	return row.c[$scope.sort.column].v;
		  }
	}]);

});

