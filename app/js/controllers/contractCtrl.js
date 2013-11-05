define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter', function($scope,$q,$rootScope,$http,$filter) {
			$scope.info="contractCtrl";
		}]
	)
});