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
		    	$scope.operatingProfits=new Array();
		    	$scope.cumulativeInvestments=new Array();
		    	$scope.salesVolumes=new Array();
		    	$scope.salesValues=new Array();
		    	$scope.volumeShares=new Array();
		    	$scope.valueShares=new Array();
		    	for(i=0;i<5;i++){
		    		$scope.operatingProfits.push($scope.generalReport[0].actorInfo[i].grph_OperatingProfit);
		    		$scope.cumulativeInvestments.push($scope.generalReport[0].actorInfo[i].grph_CumulativeInvestment);
		    		for(j=0;j<2;j++){
		    			$scope.salesVolumes.push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_SalesVolume);
		    			$scope.salesValues.push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_NetSalesValue);
		    			$scope.valueShares.push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_ValueMarketShare);
		    			$scope.volumeShares.push($scope.generalReport[0].actorInfo[i].actorCategoryInfo[j].grph_VolumeMarketShare);
		    		}
		    	}
		    	console.log($scope.valueShares);
		    }

		    $scope.showPerformance=showPerformance;

	}]);

});
