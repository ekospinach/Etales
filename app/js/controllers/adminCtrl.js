define(['app','socketIO'], function(app) {

	app.controller('adminCtrl',['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hey this is adminCtrl.js!';

		var showView=function(){
			$http.get('/seminarList').success(function(data){
				$scope.seminars=data;
			});
		}
		showView();
		$scope.showView=showView;
		$scope.getSeminarStatus = function(status){
			if (status) return 'Finish'; 
			else return 'Undo';
		}

		$scope.addSeminar=function(){
			var data={
				'seminarCode':$scope.seminarCode,
				'seminarDescription':$scope.seminarDescription,
				'currentPeriod':0,
				//'seminarDate':
			}
			$http.post('/addSeminar',data).success(function(data){
				//console.log(data);
				$scope.seminars.push(data);
			});
		}
	}]);

});

