define(['app'], function(app) {

	app.controller('NavbarCtrl',['$scope', '$http', '$location','$rootScope','Auth', function($scope, $http, $location,$rootScope,Auth) {
	    $scope.getUserRoleText = function(role) {

	//        console.log('trying to get user role text:' + _.invert(Auth.userRoles)[role]);
	        return _.invert(Auth.userRoles)[role] + ' ' + $rootScope.user.roleID;
	    };		
	    $scope.logout = function(){
	        console.log('trying to logout...');
	        Auth.logout(function() {
	            $location.path('/login');
	        }, function() {
	            $rootScope.error = "Failed to logout";
	        });	    	
	    }
	    $location.path('/login');

	}]);

});

