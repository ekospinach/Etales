define(['app','socketIO'], function(app) {

	app.controller('loginCtrl',['$scope', '$http', 'ProducerDecisionBase','$rootScope', function($scope, $http, ProducerDecisionBase,$rootScope) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hey this is loginCtrl.js!';
		$scope.loginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		$scope.adminLoginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		$scope.openLoginModal=function(){
			$scope.loginModal=true;
		}
		$scope.closeLoginModal=function(){
			$scope.loginModal=false;
		}

		$scope.openAdminLoginModal=function(){
			$scope.aminLoginModal=true;
		}
		$scope.closeAdminLoginModal=function(){
			$scope.aminLoginModal=false;
		}

	}]);

});

