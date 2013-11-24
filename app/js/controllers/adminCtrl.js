define(['app','socketIO'], function(app) {

	app.controller('adminCtrl',['$scope', '$http','$rootScope', function($scope, $http,$rootScope) {
		// You can access the scope of the controller from here

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

		$scope.welcomeMessage = 'hey this is adminCtrl.js!';

		var showView=function(){
			$http.get('/seminarList').success(function(data){
				$scope.seminars=data;
			});
		}
		showView();
		$scope.showView=showView;
		$scope.getSeminarStatus = function(status){
			if (status) return 'Finish'; 
			else return 'Undo';
		}

		$scope.addSeminar=function(){
			var data={
				'seminarCode':$scope.seminarCode,
				'seminarDescription':$scope.seminarDescription,
				'currentPeriod':0,
				//'seminarDate':
			}
			$http({method: 'POST', url: '/addSeminar',data:data}).success(function(data, status, headers, config) {
				showbubleMsg('Save new seminar successfully',2);
				$scope.seminars.push(data);
			}).error(function(data, status, headers, config) {
				showbubleMsg('Insert failure, ' + data,1);
			});
		}

		$scope.openSeminarModal=function(seminar){
			$scope.selectSeminar=seminar;
			$scope.seminarModal=true;
		}

		$scope.closeSeminarModal=function(){
			$scope.seminarModal=false;
		}

		$scope.seminarOpts = {
			backdropFade: true,
			dialogFade:true
		};

		$scope.initialiseSeminar=function(seminarCode){
			var postData={
				seminar:seminarCode,
			}
			$http({method:'POST', url:'/initialiseSeminar', data: postData}).then(function(res){
		  		console.log('testInitialise Success:' + res.data);
		  	},function(res){
		  		console.log('testInitialise Failed:' + res.data);
		  	})		
		}

		$scope.updatePassword=function(seminar,location,additionalIdx){
			var data={
				seminarCode:seminar.seminarCode,
				location:location,
				additionalIdx:additionalIdx,
				value:seminar[location][additionalIdx].password,
				behaviour:'updatePassword'
			}
			$http({method: 'POST', url: '/updateSeminar',data:data}).
			  success(function(data, status, headers, config) {
			  	console.log('update success');
			  }).
			  error(function(data, status, headers, config) {
			  	console.log('update error');
			  });
		}

		var showbubleMsg = function(content, status){
	 		$scope.bubleMsg = ' ' + content;
	 		switch(status){
	 			case 1: 
	 				$scope.bubleClassName = 'alert alert-danger'; 
	 				$scope.bubleTitle = 'Error!';
	 				break;
	 			case 2: 
	 				$scope.bubleClassName = 'alert alert-success'; 
	 				$scope.bubleTitle = 'Success!';
	 				break;
	 			case 3:
	 				$scope.bubleClassName = 'alert alert-block'; 
	 				$scope.bubleTitle = 'Warning!';
	 				break;	 			
	 			default:
	 			 $scope.bubleClassName = 'alert'; 
	 		}
	 		console.log('infoBuble.show');
	 		$scope.infoBuble = true;
	 	};
	}]);

});

