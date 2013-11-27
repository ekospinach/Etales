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

		var titles=[{
				title:'',
	        	titleENG:'Brand Awareness',
	        	titleRUS:'Brand Awareness 暂未翻译',
	        	titleCHN:'Brand Awareness 暂未翻译',
	        	subTitleENG:'Extent to which consumers are aware of a particular product measured as percentage of total. Gives you an idea how your promotional expenses and investments into visibility paid off.',
	        	subTitleRUS:'Brand Awareness RUS 暂未翻译',
	        	subTitleCHN:'Brand Awareness CHN 暂未翻译',
	        },{
				title:'',
	        	titleENG:'Market Share (Volume)',
	        	titleRUS:'Market Share (Volume) 暂未翻译',
	        	titleCHN:'Market Share (Volume) 暂未翻译',
	        	subTitleENG:'Percentage of a total market, in terms of volume, accounted for by the sales of a specific brand.',
	        	subTitleRUS:'Market Share (Volume) RUS 暂未翻译',
	        	subTitleCHN:'Market Share (Volume) CHN 暂未翻译',
	        },{
				title:'',
	        	titleENG:'Market Share (Value)',
	        	titleRUS:'Market Share (Value) 暂未翻译',
	        	titleCHN:'Market Share (Value) 暂未翻译',
	        	subTitleENG:'Percentage of a total market, in terms of value, accounted for by the sales of a specific brand.',
	        	subTitleRUS:'Market Share (Value) 暂未翻译',
	        	subTitleCHN:'Market Share (Value) 暂未翻译',
	        },{
				title:'',
	        	titleENG:'Average Net Market Price',
	        	titleRUS:'Average Net Market Price 暂未翻译',
	        	titleCHN:'Average Net Market Price 暂未翻译',
	        	subTitleENG:'Price at which a product is selling in the open market. It is averaged across all channels. Promotional discounts off normal retail price are also accounted for.',
	        	subTitleRUS:'Average Net Market Price 暂未翻译',
	        	subTitleCHN:'verage Net Market Price 暂未翻译',
	        },{
				title:'',
	        	titleENG:'Brand Visibility Share',
	        	titleRUS:'Brand Visibility Share 暂未翻译',
	        	titleCHN:'Brand Visibility Share 暂未翻译',
	        	subTitleENG:'An integral measure that averages brand space share and marketing activities increasing brand visibility at a given channel.',
	        	subTitleRUS:'Brand Visibility Share 暂未翻译',
	        	subTitleCHN:'Brand Visibility Share 暂未翻译',
	        },{
				title:'',
	        	titleENG:'Consumer off-take',
	        	titleRUS:'Consumer off-take 暂未翻译',
	        	titleCHN:'Consumer off-take 暂未翻译',
	        	subTitleENG:'This measure indicates how many units of a product have been sold to the consumer.',
	        	subTitleRUS:'Consumer off-take 暂未翻译',
	        	subTitleCHN:'Consumer off-take 暂未翻译',
	        }];
	        $scope.titles=titles;

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

		    $scope.reportCollection=_.find(myreport.reportCollection,function(obj){
		      return (obj.market==market&&obj.category==cat)
		    });
		    var charttable = {};
	        charttable.type = "Table";
	        charttable.displayed = true;
	        charttable.cssStyle = "height:400px; width:100%;";
	        charttable.data=$scope.reportCollection.data;
	        /*multilingual*/
	        //test subTitles

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

		  getReport(seminar,titleENG,period,language);

	}]);

});

