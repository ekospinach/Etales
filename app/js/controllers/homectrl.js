define(['app','socketIO','routingConfig'], function(app) {

	app.controller('homeCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll) {
		// You can access the scope of the controller from here
			$scope.value = "1";
			$scope.options = {				
				from: -3,
				to: 4,
				step: 1,
				dimension: "th period",
				round: 1,
				scale: [-3, -2,-1,0,1,2,3,4]
				// calculate: calculate
			};
			$scope.$watch('value',function(newValue,oldValue){
				console.log(newValue);
			})

	}]);

});

