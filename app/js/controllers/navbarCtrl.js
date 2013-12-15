define(['app'], function(app) {

	app.controller('NavbarCtrl', ['$scope', '$http', '$location','$rootScope','Auth','Label', function($scope, $http, $location,$rootScope,Auth,Label) {
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
	}]);

});

