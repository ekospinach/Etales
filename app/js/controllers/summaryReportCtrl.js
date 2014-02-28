define(['app','socketIO','routingConfig'], function(app) {

	app.controller('summaryReportCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope','Auth','$anchorScroll', function($scope, $http, ProducerDecisionBase,$rootScope,Auth,$anchorScroll) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

	}]);

});
