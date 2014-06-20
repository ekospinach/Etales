define(['app'], function(app) {
		app.controller('facilitatorDecisionCtrl',
			['RoleInfo', '$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo','PeriodInfo','SeminarInfo','$window',
	 function(RoleInfo, $scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo,PeriodInfo,SeminarInfo, $window) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    var userRoles = routingConfig.userRoles;
		    var selectedPlayer;

		    if(RoleInfo.getRole() == userRoles.facilitator){
		    	$scope.selectedItem = 1;		    	
		    	selectedPlayer = 1;
		    } else if(RoleInfo.getRole() == userRoles.producer){
		    	selectedPlayer = PlayerInfo.getPlayer();
		    	$scope.selectedItem = selectedPlayer;		    			    	
		    } else if(RoleInfo.getRole() == userRoles.retailer){
		    	selectedPlayer = PlayerInfo.getPlayer();
		    	$scope.selectedItem = selectedPlayer + 4;		    			    	
		    }
		   
		    $scope.setPlayer=function(selectedItem){
		    	if(selectedItem>4){
		    		selectedItem-=4;
		    	} 
		    	selectedPlayer = selectedItem;
		    }

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
			});

			$scope.msg = '';		
			$scope.setSupplierPeriod = function(period){
				if($scope.selectedPeriod && selectedPlayer){
			    	PlayerInfo.setPlayer(selectedPlayer);					
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/supplierDecision');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}

			$scope.setRetailerPeriod = function(period){
				if($scope.selectedPeriod && selectedPlayer){					
			    	PlayerInfo.setPlayer(selectedPlayer);							
					PeriodInfo.setCurrentPeriod($scope.selectedPeriod);					
					$location.path('/retailerDecision');
				} else {
					$scope.msg = $scope.msg = 'Please choose period.';
				}
			}

		}]);
});