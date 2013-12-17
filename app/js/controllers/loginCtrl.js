define(['app','socketIO'], function(app) {

	app.controller('loginCtrl',['$scope', '$http', '$location','$rootScope','Auth','Label', function($scope, $http, $location,$rootScope,Auth,Label) {
		// You can access the scope of the controller from here

		    $rootScope.loginFooter="container";
		    $rootScope.loginCss="bs-docs-home";
		    $rootScope.loginLink="bs-masthead-links";
		    $rootScope.loginDiv="";

		var userRoles = routingConfig.userRoles;

		$scope.loginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		$scope.adminLoginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		$scope.openLoginModal=function(){
			$scope.userRole='1';
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

		$scope.userLogin=function(){
			var username="";
			var seminar=$scope.userSeminar;
			var password=$scope.userPassword;
			switch($scope.userRole){
				case '1':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
				case '2':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
				case '3':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
				case '4':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-3);break;
				case '5':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-3);break;
				case '6':username=seminar+'^'+userRoles.facilitator+'^'+($scope.userRole-5);break;
			}
			Auth.login({
				username:username,
				password:password,
				rememberme:true
			},function(res){
				showbubleMsg(Label.getContent('Login successful'),2);
				var url="/currentPeriod/"+seminar;
				$http.get(url).success(function(data){
					$rootScope.currentPeriod=data.currentPeriod;
					$rootScope.rootStartFrom=-2;
					$rootScope.rootEndWith=$rootScope.currentPeriod-1;
					closeLoginModal();
				});
			},function(res){
				showbubleMsg(Label.getContent('Login fail'),1);
			})			
		}

		$scope.adminLogin=function(){
			if($scope.adminSeminar=="MAY"&&$scope.adminPassword=="123"){
				showbubleMsg(Label.getContent('Login successful'),5);
				closeAdminLoginModal();
				$location.path('/admin');
			}else{
                showbubleMsg(Label.getContent('Login fail'),4);
			}
		}

		var showbubleMsg = function(content, status){
	 		$scope.bubleMsg = ' ' + content;
	 		switch(status){
	 			case 1: 
	 				$scope.userBubleClassName = 'alert alert-danger'; 
	 				$scope.userBubleTitle = Label.getContent('Error')+'!';
	 				$scope.userBubleMsg=content;
	 				break;
	 			case 2: 
	 				$scope.userBubleClassName = 'alert alert-success'; 
	 				$scope.userBubleTitle = Label.getContent('Success')+'!';
	 				$scope.userBubleMsg=content;
	 				break;
	 			case 3:
	 				$scope.userBubleClassName = 'alert alert-block'; 
	 				$scope.userBubleTitle = Label.getContent('Warning')+'!';
	 				$scope.userBubleMsg=content;
	 				break;	
	 			case 4: 
	 				$scope.adminBubleClassName = 'alert alert-danger'; 
	 				$scope.adminBubleTitle = Label.getContent('Error')+'!';
	 				$scope.adminBubleMsg=content;
	 				break;
	 			case 5: 
	 				$scope.adminBubleClassName = 'alert alert-success'; 
	 				$scope.adminBubleTitle = Label.getContent('Success')+'!';
	 				$scope.adminBubleMsg=content;
	 				break;
	 			case 6:
	 				$scope.adminBubleClassName = 'alert alert-block'; 
	 				$scope.adminBubleTitle = Label.getContent('Warning')+'!';
	 				$scope.adminBubleMsg=content;
	 				break;	  			
	 			default:
	 			 $scope.userBubleClassName = 'alert'; 
	 			 $scope.adminBubleClassName = 'alert'; 
	 		}
	 		console.log('infoBuble.show');
	 		$scope.infoBuble = true;
	 	};

	 	$scope.showbubleMsg=showbubleMsg;
		$scope.closeLoginModal=closeLoginModal;
		$scope.closeAdminLoginModal=closeAdminLoginModal;

	}]);

});

