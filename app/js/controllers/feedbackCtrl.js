define(['app'], function(app) {
		app.controller('feedbackCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','$window', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo,$window) {
			$rootScope.decisionActive="active";

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";		
						
		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/seminarInfo/"+SeminarInfo.getSelectedSeminar().seminarCode;
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				for (var i=data.data.currentPeriod;i>=-2;i--){
					$scope.periods.push(i);
				}
				$scope.selectedPeriod = data.data.currentPeriod;
			},function(){
				console.log('fail');
			})

			$scope.msg = '';		
			$scope.setPeriod = function(period){
				if($scope.selectedPeriod){
					//PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$window.open('feedbackENG?seminar=' + SeminarInfo.getSelectedSeminar().seminarCode + '&period=' + ($scope.selectedPeriod - 1));									
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}


		}]);
});