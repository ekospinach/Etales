define(['app'], function(app) {
		app.controller('facilitatorDecisionCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label','PlayerInfo', function($scope,$q,$rootScope,$location,$http,$filter,Label,PlayerInfo) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
		    $scope.userRole=1;
		    PlayerInfo.setPlayer(1);

		    $scope.setPlayer=function(userRole){
		    	PlayerInfo.setPlayer(userRole);
		    }
		}]);
});