define(['app'], function(app) {

	app.controller('NavbarCtrl', ['$scope', '$http', '$location','$rootScope','Auth','Label','notify','ProducerDecisionBase','RetailerDecisionBase','NegotiationBase',  function($scope, $http, $location,$rootScope,Auth,Label,notify, ProducerDecisionBase, RetailerDecisionBase, NegotiationBase) {
	    $scope.getUserRoleText = function(role) {

	//        console.log('trying to get user role text:' + _.invert(Auth.userRoles)[role]);
	        return _.invert(Auth.userRoles)[role].toUpperCase() + ' ' + $rootScope.user.roleID;
	    };

	    $scope.getRoleNormal=function(role){
	    	var normal=_.invert(Auth.userRoles)[role];
	    	normal=normal.substring(0,1).toUpperCase();
	    	return _.invert(Auth.userRoles)[role].substring(0,1).toUpperCase()+_.invert(Auth.userRoles)[role].substring(1,_.invert(Auth.userRoles)[role].length);
	    }

	    $scope.logout = function(){
	        console.log('trying to logout...');
	        Auth.logout(function() {
	            $location.path('/login');
	        }, function() {
	            $rootScope.error = "Failed to logout";
	        });	    	
	    }
	    $location.path('/login');
	    $scope.$on("$routeChangeSuccess", function(next, current){
			$scope.currentPeriod = $rootScope.currentPeriod;	    
		})

		$scope.Label = Label;

		//handle global push notification messages		
		notify.config({
				template:'/partials/gmail-template.html',
				position:'center'			
		});

		$scope.$on('producerPortfolioDecisionStatusChanged', function(event, data, newBase) {  
			notify('Supplier ' + data.producerID  + ' just committed portfolio decision for period ' + data.period + '.');
		});

		$scope.$on('SeminarPeriodChanged', function(event, data) {  
			notify('Period has been changed to ' + data.period + ' / ' + data.span);
		});		

		//Register socketIO listeners in NavCtrl which will only be activated once in application
		ProducerDecisionBase.startListenChangeFromServer(); 
		RetailerDecisionBase.startListenChangeFromServer();		
		NegotiationBase.startListenChangeFromServer();
	}]);

});

