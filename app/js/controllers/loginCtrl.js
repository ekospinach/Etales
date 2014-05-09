define(['app','socketIO'], function(app) {

	app.controller('loginCtrl',['$scope', '$http', '$location','$rootScope','Auth','$q','PlayerInfo','SeminarInfo','PeriodInfo','RoleInfo','$modal', function($scope, $http, $location,$rootScope,Auth,$q,PlayerInfo,SeminarInfo,PeriodInfo,RoleInfo,$modal) {
		// You can access the scope of the controller from here

		    $rootScope.loginFooter="container";
		    $rootScope.loginCss="bs-docs-home";
		    $rootScope.loginLink="bs-masthead-links";
		    $rootScope.loginDiv="";
		    $rootScope.loadShow=true;

		var userRoles = routingConfig.userRoles;


		$scope.welcomeMessage = 'hey this is loginCtrl.js!';
		$scope.loginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		$scope.adminLoginOpts = {
			backdropFade: true,
			dialogFade:true
		};
		// $scope.openLoginModal=function(){
		// 	$scope.loginModal=true;
		// }
		var closeLoginModal=function(){
			$scope.loginModal=false;
			
		}
		$scope.openLoginModal=function(size){
			var modalInstance = $modal.open({
				templateUrl: '../../partials/modal/loginModal.html',
				controller: ModalLoginCtrl,
				size: size
		    });

		    modalInstance.result.then(function(){
		    	console.log('login');
		    });
		}

		var ModalLoginCtrl=function($rootScope,$scope,$modalInstance,Label,SeminarInfo,RoleInfo,PeriodInfo,PlayerInfo){
			$scope.Label=Label;
			var cancel = function () {
			    $modalInstance.dismiss('cancel');
			};
			$scope.cancel=cancel;
			$scope.userLogin=function(){
				var username="";
				var seminar=userSeminar.value;
				SeminarInfo.setSelectedSeminar(seminar);
				var password=userPassword.value;
				switch(userRole.value){
					case '1':username=seminar+'^'+userRoles.producer+'^'+userRole.value;break;
					case '2':username=seminar+'^'+userRoles.producer+'^'+userRole.value;break;
					case '3':username=seminar+'^'+userRoles.producer+'^'+userRole.value;break;
					case '4':username=seminar+'^'+userRoles.producer+'^'+userRole.value;break;
					case '5':username=seminar+'^'+userRoles.retailer+'^'+(userRole.value-4);break;
					case '6':username=seminar+'^'+userRoles.retailer+'^'+(userRole.value-4);break;
					case '7':username=seminar+'^'+userRoles.retailer+'^'+(userRole.value-4);break;
					case '8':username=seminar+'^'+userRoles.retailer+'^'+(userRole.value-4);break;
					case '9':username=seminar+'^'+userRoles.facilitator+'^'+(userRole.value-8);break;
				}
				Auth.login({
					username:username,
					password:password,
					rememberme:true
				},function(res){
					showbubleMsg('login success.',2);
					var url="/currentPeriod/"+seminar;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						//$rootScope.currentPeriod=data.currentPeriod;
						PeriodInfo.setCurrentPeriod(data.data.currentPeriod);
						$rootScope.rootStartFrom=-2;
						$rootScope.rootEndWith=data.currentPeriod-1;
						cancel();
					}).then(function(){
						//console.log($rootScope.user.userRole);
						PlayerInfo.setPlayer($rootScope.user.roleID);
						RoleInfo.setRole($rootScope.user.role);
					});
				},function(res){
					showbubleMsg('login failure.',1);
				});	
			}

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

		// $scope.userLogin=function(){
		// 	var username="";
		// 	var seminar=$scope.userSeminar;
		// 	SeminarInfo.setSelectedSeminar(seminar);
		// 	var password=$scope.userPassword;
		// 	switch($scope.userRole){
		// 		case '1':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
		// 		case '2':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
		// 		case '3':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
		// 		case '4':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
		// 		case '5':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
		// 		case '6':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
		// 		case '7':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
		// 		case '8':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
		// 		case '9':username=seminar+'^'+userRoles.facilitator+'^'+($scope.userRole-8);break;
		// 	}
		// 	Auth.login({
		// 		username:username,
		// 		password:password,
		// 		rememberme:true
		// 	},function(res){
		// 		showbubleMsg('login success.',2);
		// 		var url="/currentPeriod/"+seminar;
		// 		$http({
		// 			method:'GET',
		// 			url:url
		// 		}).then(function(data){
		// 			//$rootScope.currentPeriod=data.currentPeriod;
		// 			PeriodInfo.setCurrentPeriod(data.data.currentPeriod);
		// 			$rootScope.rootStartFrom=-2;
		// 			$rootScope.rootEndWith=data.currentPeriod-1;
		// 			closeLoginModal();
		// 		}).then(function(){
		// 			//console.log($rootScope.user.userRole);
		// 			PlayerInfo.setPlayer($rootScope.user.roleID);
		// 			RoleInfo.setRole($rootScope.user.role);
		// 		});
		// 	},function(res){
		// 		showbubleMsg('login failure.',1);
		// 	});	
		// }

		$scope.adminLogin=function(){
			if($scope.adminSeminar=="MAY"&&$scope.adminPassword=="123"){
				showbubleMsg('login success',5);
				closeAdminLoginModal();
				$location.path('/admin');
			}else{
                showbubleMsg('Failed to login',4);
			}
		}

		var showbubleMsg = function(content, status){
	 		$scope.bubleMsg = ' ' + content;
	 		switch(status){
	 			case 1: 
	 				$scope.userBubleClassName = 'alert alert-danger'; 
	 				$scope.userBubleTitle = 'Error!';
	 				$scope.userBubleMsg=content;
	 				break;
	 			case 2: 
	 				$scope.userBubleClassName = 'alert alert-success'; 
	 				$scope.userBubleTitle = 'Success!';
	 				$scope.userBubleMsg=content;
	 				break;
	 			case 3:
	 				$scope.userBubleClassName = 'alert alert-block'; 
	 				$scope.userBubleTitle = 'Warning!';
	 				$scope.userBubleMsg=content;
	 				break;	
	 			case 4: 
	 				$scope.adminBubleClassName = 'alert alert-danger'; 
	 				$scope.adminBubleTitle = 'Error!';
	 				$scope.adminBubleMsg=content;
	 				break;
	 			case 5: 
	 				$scope.adminBubleClassName = 'alert alert-success'; 
	 				$scope.adminBubleTitle = 'Success!';
	 				$scope.adminBubleMsg=content;
	 				break;
	 			case 6:
	 				$scope.adminBubleClassName = 'alert alert-block'; 
	 				$scope.adminBubleTitle = 'Warning!';
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

