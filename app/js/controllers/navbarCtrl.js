define(['app'], function(app) {

	app.controller('NavbarCtrl', ['$scope', '$http', '$location','$rootScope','Auth','Label','notify','ProducerDecisionBase','RetailerDecisionBase','NegotiationBase','SeminarInfo', '$window','$routeParams','TimerBase', 
									function($scope, $http, $location,$rootScope,Auth,Label,notify, ProducerDecisionBase, RetailerDecisionBase, NegotiationBase, SeminarInfo,$window,$routeParams, TimerBase) {
	    $scope.getUserRoleText = function(role) {

	//        console.log('trying to get user role text:' + _.invert(Auth.userRoles)[role]);
	        return _.invert(Auth.userRoles)[role].toUpperCase() + ' ' + $rootScope.user.roleID;
	    };

	    $scope.getRoleNormal=function(role){
	    	var normal=_.invert(Auth.userRoles)[role];
	    	normal=normal.substring(0,1).toUpperCase();
	    	return _.invert(Auth.userRoles)[role].substring(0,1).toUpperCase()+_.invert(Auth.userRoles)[role].substring(1,_.invert(Auth.userRoles)[role].length);
	    }

	    $scope.logout = function(){
	        console.log('trying to logout...');
	        Auth.logout(function() {
	            $location.path('/login');
	        }, function() {
	            $rootScope.error = "Failed to logout";
	        });	    	
	    }
	    var openurl=function(url,time){
	    	setTimeout(function () {  
	             $window.open(url,time); 
	         }, time);  
	    }

	    $scope.openTabs = function(){	    	
			$window.open('#/confidentialReport');		
			$window.open('#/generalReport');		
			$window.open('#/marketReport');		

	    }
	    
	    $scope.$on("$routeChangeSuccess", function(next, current){
	    	if(SeminarInfo.getSelectedSeminar()){
				//if login
				$scope.pageHeader="show";
				$scope.pageFooter="show";
				$scope.pageLoader="hide";
				$scope.pageBody="general-docs-home";	    		
	    	}else{
	    		$scope.pageHeader="hide";
				$scope.pageFooter="hide";	
	    	}
	    	
	    	if(window.location.hash.substring(2,7)=="login"){
	    		//login page
	    		$scope.pageBody="bs-docs-home";
	    	}
		})

		$scope.Label = Label;

		//handle global push notification messages		
		notify.config({
			template:'/partials/gmail-template.html',
			position:'center'			
		});

		$scope.$on('producerPortfolioDecisionStatusChanged', function(event, data, newBase) {  
			notify('Supplier ' + data.producerID  + ' just committed portfolio decision for period ' + data.period + '.');
		});

		$scope.$on('SeminarPeriodChanged', function(event, data) {  
			notify('Period has been changed to ' + data.period + ' / ' + data.span);
			$scope.currentPeriod = data.period;
			$scope.span = data.span;
			$scope.seminar = data.seminar;
		});	

		$scope.$on('SeminarPeriodChangedFromRoute',function(event, data){
			$scope.currentPeriod = data.currentPeriod;
			$scope.span = data.simulationSpan;
			$scope.seminar = data.seminarCode;
		})	

		//Register socketIO listeners in NavCtrl which will only be activated once in application
		ProducerDecisionBase.startListenChangeFromServer(); 
		RetailerDecisionBase.startListenChangeFromServer();		
		NegotiationBase.startListenChangeFromServer();
		TimerBase.startListenChangeFromServer();

		console.log('$routeParams: ' + $routeParams);
	}]);

});

