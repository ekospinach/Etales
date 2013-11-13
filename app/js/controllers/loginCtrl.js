define(['app','socketIO'], function(app) {

	app.controller('loginCtrl',['$scope', '$http', '$location','$rootScope', function($scope, $http, $location,$rootScope) {
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
		var closeLoginModal=function(){
			$scope.loginModal=false;
		}

		$scope.openAdminLoginModal=function(){
			$scope.aminLoginModal=true;
		}
		var closeAdminLoginModal=function(){
			$scope.aminLoginModal=false;
			$scope.bubleClassName = "";    
            $scope.bubleTitle = "";
            $scope.bubleMsg = "";
		}

		$scope.adminLogin=function(){
			if($scope.adminSeminar=="MAY"&&$scope.adminPassword=="123"){
				closeAdminLoginModal();
				$location.path('/admin');
			}else{
				$scope.bubleClassName = "alert alert-danger";    
                $scope.bubleTitle = "Error";
                $scope.bubleMsg = " Failed to login";
			}
		}

		$scope.closeLoginModal=closeLoginModal;
		$scope.closeAdminLoginModal=closeAdminLoginModal;

	}]);

});

