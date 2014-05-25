define(['app'], function(app) {
		app.controller('facilitatorDecisionCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','$window',
	 function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo, $window) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    $scope.userRole=1;
		    $scope.selectPeriod=1;
		    PlayerInfo.setPlayer(1);
		    PeriodInfo.setCurrentPeriod(1);

		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar();
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				for (var i=0;i<=data.data.currentPeriod;i++){
					$scope.periods.push(i);
				}
				console.log($scope.periods);
			},function(){
				console.log('fail');
			})

		    $scope.setPlayer=function(userRole){
		    	if(userRole>4){
		    		userRole-=4;
		    	}
		    	PlayerInfo.setPlayer(userRole);
		    }

		    $scope.setPreriod=function(period){
		    	PeriodInfo.setCurrentPeriod(period);
		    }

			$scope.openTab = function() {
				console.log('open new tab');
				$window.open('www.google.com');
			}

		}]);
});