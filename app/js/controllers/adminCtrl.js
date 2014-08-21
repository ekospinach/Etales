define(['app','socketIO'], function(app) {

	app.controller('adminCtrl',['$scope', '$http','$rootScope','EditSeminarInfo','$location','$modal','Label', function($scope, $http,$rootScope, EditSeminarInfo, $location,$modal,Label) {

		console.warn(message);

		var initializePage = function(){
			$http.get('/seminarList').success(function(data){
				$scope.seminars=data;
			});
		}
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

		initializePage();

		$scope.checkSeminarDetails = function(seminar){
			
			EditSeminarInfo.setSelectedSeminar(seminar);
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

		$scope.openNewSeminarModal=function(){
			var modalInstance = $modal.open({
				templateUrl: '../../partials/modal/newSeminarModal.html',
				controller: newSeminarModalCtrl
		    });
		    modalInstance.result.then(function(){
		    	console.log('new Seminar');
		    })
		}

		var newSeminarModalCtrl=function($scope, $http,$rootScope, EditSeminarInfo, $location,$modalInstance){
			$scope.Label=Label;
			$scope.initializePage=initializePage;
			var closeSeminarModal=function(){
			    $modalInstance.dismiss('cancel');
			}
			$scope.closeSeminarModal=closeSeminarModal;
			$scope.showbubleMsg=showbubleMsg;

			$scope.addSeminar=function(){
				var data={
					'seminarCode':seminarCode.value,
					'seminarDescription':seminarDescription.value
				}
				$http({method: 'POST', url: '/addSeminar',data:data}).success(function(data, status, headers, config) {
					showbubleMsg('Save new seminar successfully',2);
					closeSeminarModal();
					initializePage();

				}).error(function(data, status, headers, config) {
					showbubleMsg('Insert failure, ' + data,1);
					$scope.newSeminarModal=false;
				});
			}
		}

		//$scope.openNewSeminarModal=function(seminar){ $scope.newSeminarModal=true; }
		


		//$scope.closeNewSeminarModal=function(){ $scope.newSeminarModal=false; }

		$scope.openDuplicateSeminarModal=function(seminar){ $scope.originalSeminarCode = seminar.seminarCode; $scope.duplicateSeminarModal=true; }
		$scope.closeDuplicateSeminarModal=function(){ $scope.duplicateSeminarModal=false; }


		// $scope.seminarOpts = {
		// 	backdropFade: true,
		// 	dialogFade:true
		// };

		
	}]);

});
