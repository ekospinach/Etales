//facilitatorSummaryReportCtrl.js
define(['app'], function(app) {
		app.controller('facilitatorGeneralReportCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','RoleInfo', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    $scope.userRole=1;
		    $scope.selectPeriod=1;
		    PlayerInfo.setPlayer(1);
		    RoleInfo.setRole(2);
		    PeriodInfo.setCurrentPeriod(1);

		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar().seminarCode;
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				for (var i=1;i<=data.data.currentPeriod;i++){
					$scope.periods.push(i);
				}
				console.log($scope.periods);
				$scope.currentPeriod = data.data.currentPeriod;
			},function(){
				console.log('fail');
			})

			$scope.msg = '';

		    $scope.setPreriod=function(period){
		    	if(period){
			    	PeriodInfo.setCurrentPeriod(period);	    			    			
		    	} else {
		    		$scope.msg = 'Please choose period.';
		    	}
		    }

		}]);
});