define(['angular', 'services'], function (angular) {
	'use strict';

	return angular.module('myApp.controllers', ['myApp.services'])
		// Sample controller where service is being used
		.controller('MyCtrl1', ['$scope', 'version', function ($scope, version) {
			$scope.scopedAppVersion = version;
			$scope.user = {
				name: 'awesome user'
			}
		}])
		// More involved example where controller is required from an external file
		.controller('HomeCtrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/homectrl'], function(homectrl) {
				$injector.invoke(homectrl, this, {'$scope': $scope});
			});
		}])
		.controller('ProducerDecisionStep1Ctrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/producerDecisionStep1ctrl'], function(decisionctrl) {
				$injector.invoke(decisionctrl, this, {'$scope': $scope});
			});
		}])
		.controller('ProducerDecisionStep2Ctrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/producerDecisionStep2ctrl'], function(decisionctrl) {
				$injector.invoke(decisionctrl, this, {'$scope': $scope});
			});
		}])
		.controller('ProducerDecisionStep3Ctrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/producerDecisionStep3ctrl'], function(decisionctrl) {
				$injector.invoke(decisionctrl, this, {'$scope': $scope});
			});
		}])
		.controller('ProducerDecisionStep4Ctrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/producerDecisionStep4ctrl'], function(decisionctrl) {
				$injector.invoke(decisionctrl, this, {'$scope': $scope});
			});
		}])
		.controller('RetailerDecisionCtrl', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/retailerRecisionCtrl'], function(decisionctrl) {
				$injector.invoke(decisionctrl, this, {'$scope': $scope});
			});
		}])
		.controller('MyCtrl2', ['$scope', '$injector', function($scope, $injector) {
			require(['controllers/myctrl2'], function(myctrl2) {
				// injector method takes an array of modules as the first argument
				// if you want your controller to be able to use components from
				// any of your other modules, make sure you include it together with 'ng'
				// Furthermore we need to pass on the $scope as it's unique to this controller
				$injector.invoke(myctrl2, this, {'$scope': $scope});
			});
		}]);
});

