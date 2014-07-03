//facilitatorSummaryReportCtrl.js
define(['app'], function(app) {
		app.controller('facilitatorConfidentialReportCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','RoleInfo', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo,RoleInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    $scope.userRole=1;
		    $scope.selectPeriod=1;

		    var userRoles = routingConfig.userRoles;
		    if(RoleInfo.getRole() == userRoles.facilitator){
			    PlayerInfo.setPlayer(1);
			    RoleInfo.setRole(2);
		    }

		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/seminarInfo/"+SeminarInfo.getSelectedSeminar().seminarCode;
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

		    $scope.setPlayer=function(userRole){
		    	var role=2;
		    	if(userRole){
			    	if(userRole>4){
			    		userRole-=4;
			    		role=4;
			    	}
			    	PlayerInfo.setPlayer(userRole);
			    	RoleInfo.setRole(role);
		    	} else {
		    		$scope.msg = 'Please choose userRole.';
		    	}
		    }

			$scope.msg = '';		
			$scope.setPeriod = function(period){
				if($scope.selectedPeriod){
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/confidentialReport');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}

		}]);
});