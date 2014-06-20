//facilitatorSummaryReportCtrl.js
define(['app'], function(app) {
		app.controller('facilitatorMarketReportCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','RoleInfo', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar().seminarCode;
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				for (var i=data.data.currentPeriod;i>=0;i--){
					$scope.periods.push(i);
				}
				$scope.selectedPeriod = data.data.currentPeriod;
			},function(){
				console.log('fail');
			})

			$scope.msg = '';		
			$scope.setPeriod = function(period){
				if($scope.selectedPeriod){
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/marketReport');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}


		}]);
});