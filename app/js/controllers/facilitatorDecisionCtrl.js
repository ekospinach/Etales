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
		    PlayerInfo.setPlayer(1);

		    $scope.setPlayer=function(userRole){
		    	if(userRole>4){
		    		userRole-=4;
		    	}
		    	PlayerInfo.setPlayer(userRole);
		    	PeriodInfo.getCurrentPeriod();
		    }

		    var periods=new Array();
		    $scope.periods=periods;
		    
		    var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar().seminarCode;
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
			$scope.setSupplierPeriod = function(period){
				if($scope.selectedPeriod){
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/supplierDecision');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}

			$scope.setRetailerPeriod = function(period){
				if($scope.selectedPeriod){
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/retailerDecision');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}

		}]);
});