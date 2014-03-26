//facilitatorSummaryReportCtrl.js
define(['app'], function(app) {
		app.controller('facilitatorSummaryReportCtrl',
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
		    
		    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar();
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				for (var i=1;i<=data.data.currentPeriod;i++){
					$scope.periods.push(i);
				}
				console.log($scope.periods);
			},function(){
				console.log('fail');
			})

		    $scope.setPlayer=function(userRole){
		    	var role=2;
		    	if(userRole>4){
		    		userRole-=4;
		    		role=4;
		    	}
		    	PlayerInfo.setPlayer(userRole);
		    	RoleInfo.setRole(role);
		    }

		    $scope.setPreriod=function(period){
		    	PeriodInfo.setCurrentPeriod(period);
		    }

		}]);
});