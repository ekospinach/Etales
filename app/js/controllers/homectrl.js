define(['app','socketIO','routingConfig'], function(app) {

	app.controller('homeCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll) {
		// You can access the scope of the controller from here
		$scope.value = "10";
		$scope.options = {				
				from: 0,
				to: 40,
				step: 0.5,
				dimension: " $",
				round: 1,
				scale: [0, '|', 10, '|', 20, '|' , 30, '|', 40],
				heterogeneity: ['50/100', '75/250']
				// calculate: calculate
			};

	}]);

});

