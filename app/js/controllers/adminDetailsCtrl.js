define(['app','socketIO'], function(app) {

	app.controller('adminDetailsCtrl',['$scope', '$http','$rootScope','SeminarInfo', function($scope, $http,$rootScope, SeminarInfo) {
		$rootScope.loginCss="";
	    $rootScope.loginFooter="bs-footer";
	    $rootScope.loginLink="footer-links";
	    $rootScope.loginDiv="container";

		var socket = io.connect('http://localhost');
		socket.on('AdminProcessLog', function(data){
			$scope.isInitializeMessageShown = true;			
			if(data.msg != ''){ $scope.initializeMessage.push(data.msg); }
			
		}).on('PassiveProcessLog', function(data){
			$scope.isKernelMessageShown = true;
			if(data.msg != ''){ $scope.kernelMessage.push(data.msg); }
		}).on('KernelProcessLog', function(data){
			$scope.isKernelMessageShown = true;
			if(data.msg != ''){ $scope.kernelMessage.push(data.msg); }
		});	        

		var initializePage=function(){
			$scope.seminar = SeminarInfo.getSelectedSeminar();
			$scope.isMessageShown = false;
			console.log($scope.seminar);
		}
		initializePage();
	
	    $scope.$watch('seminar.traceActive', function() {
	      console.log('traceActive changeed.');
	    });		

		$scope.getSeminarStatus = function(value){
			if(value){
				return 'Ture';
			} else {
				return 'False (Please set related paramters below and initialise seminar)'
			}
		}
		$scope.updatePassword=function(seminar,location,additionalIdx){
			var data={
				seminarCode:seminar.seminarCode,
				location:location,
				additionalIdx:additionalIdx,
				value:seminar[location][additionalIdx].password,
				behaviour:'updatePassword'

			}
			console.log('post data:' + data);
			$http({method: 'POST', url: '/updateSeminar',data:data}).
			  success(function(data, status, headers, config) {
			  	console.log('update success');
			  }).
			  error(function(data, status, headers, config) {
			  	console.log('update error');
			  });
		}

		$scope.updateCurrentPeriod = function(seminar){
			var data = {
				seminarCode : seminar.seminarCode,
				value : seminar.currentPeriod,
				behaviour:'updateCurrentPeriod'
			}
			$http({method: 'POST', url: '/updateSeminar',data:data}).
			  success(function(data, status, headers, config) {
			  	console.log('update success');
			  }).
			  error(function(data, status, headers, config) {
			  	console.log('update error');
			  });			
		}

		$scope.Initialize =function(seminar){
			$scope.isInitializeMessageShown = false;
			$scope.initializeMessage = [];
			$scope.isInitializeConfirmInfoShown = false;
			$scope.isActive = false;
			var postData = {
				seminar : seminar.seminarCode,
			    simulationSpan : seminar.simulationSpan,
			    traceActive : seminar.traceActive,
			    traditionalTradeActive : seminar.traditionalTradeActive,
			    EMallActive : seminar.EMallActive,
			    virtualSupplierActive : seminar.virtualSupplierActive,
			    independentMarkets : seminar.independentMarkets,
			    forceNextDecisionsOverwrite : seminar.forceNextDecisionsOverwrite,
				market1ID : seminar.market1ID,
				market2ID : seminar.market2ID,
				category1ID : seminar.category1ID,
				category2ID : seminar.category2ID			
			}

			$http({method:'POST', url:'/initialiseSeminar', data:postData}).then(function(res){
				$scope.isInitializeMessageShown = true;	
				$scope.initializeMessage.push(res.data);								

				//if Initialize seminar successfully, set active of current period into TRUE
				var newData = {
					seminarCode : seminar.seminarCode,
					value : true,
					behaviour:'updateActived'
				}										
				$http({method: 'POST', url: '/updateSeminar',data:newData}).
				  success(function(res) {
				  	$scope.seminar.isInitialise = newData.value;
					$scope.initializeMessage.push('Seminar ' + seminar.seminarCode + ' has been actived!');
					$scope.isActive = true;
				  }).
				  error(function(res) {
					$scope.initializeMessage.push('Active seminar ' + seminar.seminarCode + ' failed.');
					$scope.isActive = true;					  	
				  });						
			},function(res){
				$scope.isInitializeMessageShown = true;	
				$scope.initializeMessage.push(res.data);								
				$scope.isActive = true;				
			})
		}

		$scope.openInitializeModal = function(){
			$scope.isInitializeConfirmInfoShown = true;
		}

		$scope.passiveDecision = function(seminar, selectedPeriod){
			$scope.isKernelMessageShown = false;
			$scope.kernelMessage  = [];
			$scope.isRunConfirmInfoShown = false;
			$scope.isActive = false;

			var postData = {
				seminar : seminar.seminarCode,
				period : selectedPeriod				
			}
			$http({method:'POST', url:'/passiveSeminar', data:postData}).then(function(res){
				$scope.isKernelMessageShown = true;
				$scope.kernelMessage.push(res.data);		
				$scope.isActive = true;
			},function(res){
				$scope.isKernelMessageShown = true;
				$scope.kernelMessage.push(res.data);				
				$scope.isActive = true;				
			})
		}

		$scope.Run =function(seminar, selectedPeriod){
			$scope.isKernelMessageShown = false;
			$scope.kernelMessage  = [];
			$scope.isRunConfirmInfoShown = false;
			$scope.isActive = false;

			var postData = {
				seminar  : seminar.seminarCode,
				period : selectedPeriod,
			}			
			$http({method:'POST', url:'/runSeminar', data:postData}).then(function(res){
				$scope.isKernelMessageShown = true;
				$scope.kernelMessage.push(res.data);			

				//if Run seminar successfully, current period need to be added by 1
				if(selectedPeriod == seminar.currentPeriod){
					var newData = {
						seminarCode : seminar.seminarCode,
						value : seminar.currentPeriod + 1,
						behaviour:'updateCurrentPeriod'
					}					
					$http({method: 'POST', url: '/updateSeminar',data:newData}).
					  success(function(res) {
					  	$scope.seminar.currentPeriod = newData.value;
						$scope.kernelMessage.push('current period has been modified into period ' + newData.value + ' !');
						$scope.isActive = true;
					  }).
					  error(function(res) {
						$scope.kernelMessage.push('current period modified failed ' + + ' !');
						$scope.isActive = true;					  	
					  });						
				}

			},function(res){
				$scope.isKernelMessageShown = true;
				$scope.kernelMessage.push(res.data);				
				$scope.isActive = true;				
			})
		}

		$scope.openRunModal = function(){
			$scope.isRunConfirmInfoShown = true;
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
	 				$scope.bubleClassName = 'alert alert-info'; 
	 				$scope.bubleTitle = 'Info ';
	 				break;	 			
	 			default:
	 			 $scope.bubleClassName = 'alert'; 
	 		}
	 		console.log('infoBuble.show');
	 		$scope.infoBuble = true;
	 	};

	}]);

});
