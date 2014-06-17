define(['app'], function(app) {
		app.controller('feedbackCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo) {
			$rootScope.decisionActive="active";

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
				for (var i=-3;i<=data.data.currentPeriod-1;i++){
					$scope.periods.push(i);
				}
				console.log($scope.periods);
			},function(){
				console.log('fail');
			})

			$scope.openTab = function(period){
				$window.open('feedbackENG?seminar=' + SeminarInfo.getSelectedSeminar().seminarCode + '&period=' + period);
			}
							
		}]);
});