define(['app','socketIO'], function(app) {

	app.controller('adminCtrl',['$scope', '$http','$rootScope','SeminarInfo','$location', function($scope, $http,$rootScope, SeminarInfo, $location) {
		$rootScope.loginCss="";
	    $rootScope.loginFooter="bs-footer";
	    $rootScope.loginLink="footer-links";
	    $rootScope.loginDiv="container";

		var initializePage = function(){
			$http.get('/seminarList').success(function(data){
				$scope.seminars=data;
			});
		}

		initializePage();

		$scope.checkSeminarDetails = function(seminar){
			SeminarInfo.setSelectedSeminar(seminar);
			$location.path('/adminDetails')
		}

		$scope.getSeminarStatus = function(status){
			if (status) return 'Active'; 
			else return 'Closed';
		}

		$scope.deleteSeminar = function(seminar){
			var data = {
				'seminarCode' : seminar
			}
			$http({method: 'POST', url: '/deleteSeminar',data:data}).success(function(data, status, headers, config) {
				showbubleMsg('Remove seminar successfully',2);
				initializePage();
			}).error(function(data, status, headers, config) {
				showbubleMsg(data,1);
			});

		}
		
		$scope.addSeminar=function(){
			var data={
				'seminarCode':$scope.seminarCode,
				'seminarDescription':$scope.seminarDescription
			}
			$http({method: 'POST', url: '/addSeminar',data:data}).success(function(data, status, headers, config) {
				showbubleMsg('Save new seminar successfully',2);
				$scope.seminars.push(data);
				$scope.newSeminarModal=false;

			}).error(function(data, status, headers, config) {
				showbubleMsg('Insert failure, ' + data,1);
				$scope.newSeminarModal=false;
			});
		}

		$scope.duplicateSeminar = function(){
			var data = {
				'originalSeminarCode' : $scope.originalSeminarCode,
				'targetSeminarCode':$scope.targetSeminarCode,
				'seminarDescription':$scope.targetSeminarDescription
			}

			$http({method: 'POST', url: '/duplicateSeminar', data:data}).success(function(data, status, headers, config) {

			}).error(function(data, status, headers, config){

			})

		}

		$scope.openNewSeminarModal=function(seminar){ $scope.newSeminarModal=true; }
		$scope.closeNewSeminarModal=function(){ $scope.newSeminarModal=false; }

		$scope.openDuplicateSeminarModal=function(seminar){ $scope.originalSeminarCode = seminar.seminarCode; $scope.duplicateSeminarModal=true; }
		$scope.closeDuplicateSeminarModal=function(){ $scope.duplicateSeminarModal=false; }


		$scope.seminarOpts = {
			backdropFade: true,
			dialogFade:true
		};

		var showbubleMsg = function(content, status){
	 		$scope.bubleMsg = ' ' + content;
	 		switch(status){
	 			case 1: 
	 				$scope.bubleClassName = 'alert alert-danger'; 
	 				$scope.bubleTitle = 'Error ';
	 				break;
	 			case 2: 
	 				$scope.bubleClassName = 'alert alert-success'; 
	 				$scope.bubleTitle = 'Success ';
	 				break;
	 			case 3:
	 				$scope.bubleClassName = 'alert alert-block'; 
	 				$scope.bubleTitle = 'Warning ';
	 				break;	 			
	 			default:
	 			 $scope.bubleClassName = 'alert'; 
	 		}
	 		console.log('infoBuble.show');
	 		$scope.infoBuble = true;
	 	};
	}]);

});
