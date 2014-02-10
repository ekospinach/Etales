define(['app'], function(app) {
		app.controller('facilitatorDecisionCtrl',
			['$scope','$q','$rootScope','$location','$http','$filter','Label', function($scope,$q,$rootScope,$location,$http,$filter,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		    $scope.userRole=1;

		}]);
});