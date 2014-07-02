define(['app','socketIO'], function(app) {

	app.controller('loginCtrl',['$scope', '$http', '$location','$rootScope','Auth','$q','PlayerInfo','SeminarInfo','PeriodInfo','RoleInfo','$modal','$window','notify','$routeParams', 
						function($scope, $http, $location,$rootScope,Auth,$q,PlayerInfo,SeminarInfo,PeriodInfo,RoleInfo,$modal, $window, notify,$routeParams) {
		// You can access the scope of the controller from here

		    $rootScope.loginFooter="container";
		    $rootScope.loginCss="bs-docs-home";
		    $rootScope.loginLink="bs-masthead-links";
		    $rootScope.loginDiv="";
		    $rootScope.loadShow=true;

		var userRoles = routingConfig.userRoles;

		$scope.userRole=0;
		$scope.errorInfo="Login Success";
		$scope.infoClass="login-info";

		$scope.playerLogin=function(){
			var username="";
			var seminar=$scope.userSeminar;
			var password=$scope.userPassword;
			if($scope.userRole == '0'){
				$scope.errorInfo="Role Error"; 
				$scope.infoClass="login-error-info";				
			}else{
				switch($scope.userRole){
					case '1':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
					case '2':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
					case '3':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
					case '4':username=seminar+'^'+userRoles.producer+'^'+$scope.userRole;break;
					case '5':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
					case '6':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
					case '7':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
					case '8':username=seminar+'^'+userRoles.retailer+'^'+($scope.userRole-4);break;
					case '9':username=seminar+'^'+userRoles.facilitator+'^'+($scope.userRole-8);break;
				}
				Auth.login({
					username:username,
					password:password,
					rememberme:true
				},function(res){
					$scope.errorInfo="Login Success";
					$scope.infoClass="login-info";
					
					var url="/currentPeriod/"+seminar;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						SeminarInfo.setSelectedSeminar(data.data);
						PeriodInfo.setCurrentPeriod(data.data.currentPeriod);
						$rootScope.rootStartFrom=-2;
						$rootScope.rootEndWith=data.currentPeriod-1;
						$location.path('/home');					
					}).then(function(){
						//console.log($rootScope.user.userRole);
						PlayerInfo.setPlayer($rootScope.user.roleID);
						RoleInfo.setRole($rootScope.user.role);
					});
				},function(res){
					$scope.errorInfo="Login Fail"; 
					$scope.infoClass="login-error-info";
				});	
			}
		}

		var adminLoginModalCtrl=function($location,$scope,$modalInstance,Label,SeminarInfo,RoleInfo,PeriodInfo,PlayerInfo){
			$scope.Label=Label;
			var cancel = function () {
			    $modalInstance.dismiss('cancel');
			};
			$scope.cancel=cancel;
			$scope.showbubleMsg=showbubleMsg;
			$scope.adminLogin=function(){
				if(adminSeminar.value=="MAY"&&adminPassword.value=="123"){
					showbubleMsg('login success',5);
					cancel();
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

	    //if cookie is not empty, initialize login overall parameters and login system automatically 
	    if($rootScope.user.username){	    		    	
			var url="/currentPeriod/"+$rootScope.user.seminar;
			$http({
				method:'GET',
				url:url
			}).then(function(data){
				
				SeminarInfo.setSelectedSeminar(data.data);
				PeriodInfo.setCurrentPeriod(data.data.currentPeriod);
				PlayerInfo.setPlayer($rootScope.user.roleID);
				RoleInfo.setRole($rootScope.user.role);
				
				$rootScope.rootStartFrom=-2;
				$rootScope.rootEndWith=data.currentPeriod-1;
				
				console.log('$routeParams: ' + $routeParams.reportLocateId);
				if($routeParams.reportLocateId == 'general'){
					$location.path('/facilitatorGeneralReport');	
				} else if($routeParams.reportLocateId == 'confidential'){
					$location.path('/facilitatorConfidentialReport');	
				} else if($routeParams.reportLocateId == 'market'){
					$location.path('/facilitatorMarketReport');	
				} else {
					$location.path('/home');										
				}				
			});	    	
	    } else {
		   // $location.path('/login');    	
	    } 


	}]);

});

