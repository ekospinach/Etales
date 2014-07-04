define(['app','socketIO'], function(app) {

	app.controller('adminDetailsCtrl',['$scope', '$http','$rootScope','EditSeminarInfo', function($scope, $http,$rootScope, EditSeminarInfo) {

		var socket = io.connect('http://localhost');
		socket.on('AdminProcessLog', function(data){
			$scope.isInitializeMessageShown = true;			
			if(data.msg != ''){ 
				if(!$scope.initializeMessage){
					$scope.initializeMessage = [];
				}
				$scope.initializeMessage.push(data.msg); 					
			}			
		}).on('PassiveProcessLog', function(data){
			$scope.isKernelMessageShown = true;
			if(data.msg != ''){ 
				if(!$scope.kernelMessage){
					$scope.kernelMessage = [];
				}
				console.log(data.msg)
				$scope.kernelMessage.push(data.msg); 					

			}			

		}).on('KernelProcessLog', function(data){
			$scope.isKernelMessageShown = true;
			if(data.msg != ''){ $scope.kernelMessage.push(data.msg); }
		});	        

		$scope.seminar = EditSeminarInfo.getSelectedSeminar();
		$scope.isMessageShown = false;


		

		$scope.getSeminarStatus = function(value){
			if(value){
				return 'Ture';
			} else {
				return 'False (Please set related paramters below and initialise seminar)'
			}
		}

		$scope.updatePortfolioDecisionCommittedChanged = function(producerID, period, value) {
            var queryCondition={
                producerID : producerID,
                seminar    : $scope.seminar.seminarCode,
                period     : period,
                value      : value
            }

            $http({
                method :'POST',
                url    :'/submitPortfolioDecision',
                data   :queryCondition
            }).success(function(data, status, headers, config){
            	console.log('update commit portfolio decision status successfully');
            }).error(function(data, status, headers, config){
            	console.log('update commit portfolio decision status failed.');
            })

		}		

		$scope.updateFinalDecisionCommittedChanged = function(role, roleID, period, value) {
            var queryCondition={
				roleID  : roleID,
				role    : role,
				seminar : $scope.seminar.seminarCode,
				period  : period,
				value   : value,
            }

            $http({
                method :'POST',
                url    :'/submitFinalDecision',
                data   :queryCondition
            }).success(function(data, status, headers, config){
            	console.log('update commit final decision status successfully');
            }).error(function(data, status, headers, config){
            	console.log('update commit final decision status failed.');
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

			console.log('update Password post data:' + data);
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
			console.log('update current period, post data:' + data);
			$http({method: 'POST', url: '/updateSeminar',data:data}).
			  success(function(data, status, headers, config) {
			  	console.log('update success');
			  }).
			  error(function(data, status, headers, config) {
			  	console.log('update error');
			  });			
		}

		$scope.Initialize =function(seminar, isKeepExistedPeriod1Decision){
			$scope.isInitializeMessageShown = false;
			$scope.initializeMessage = [];
			$scope.isInitializeConfirmInfoShown = false;
			$scope.isActive = false;
			var postData = {
				seminar                    : seminar.seminarCode,
			    simulationSpan             : seminar.simulationSpan,
			    traceActive                : seminar.traceActive,
			    traditionalTradeActive     : seminar.traditionalTradeActive,
			    EMallActive                : seminar.EMallActive,
			    virtualSupplierActive      : seminar.virtualSupplierActive,
			    independentMarkets         : seminar.independentMarkets,
			    forceNextDecisionsOverwrite: seminar.forceNextDecisionsOverwrite,
				market1ID                  : seminar.market1ID,
				market2ID                  : seminar.market2ID,
				category1ID                : seminar.category1ID,
				category2ID                : seminar.category2ID,
				isKeepExistedPeriod1Decision : isKeepExistedPeriod1Decision
			}
			if(!isKeepExistedPeriod1Decision){
				isKeepExistedPeriod1Decision = false;
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

		$scope.Run =function(seminar, selectedPeriod, keepExistedNextPeriodDecision){
			$scope.isKernelMessageShown = false;
			$scope.kernelMessage  = [];
			$scope.isRunConfirmInfoShown = false;
			$scope.isActive = false;

			if(!keepExistedNextPeriodDecision){
				keepExistedNextPeriodDecision = false;
			}

			var postData = {
				seminar  : seminar.seminarCode,
				period : selectedPeriod,
				keepExistedNextPeriodDecision : keepExistedNextPeriodDecision
			}	
			console.log(postData);		

			$http({method:'POST', url:'/runSeminar', data:postData}).then(function(res){
				$scope.isKernelMessageShown = true;
				$scope.kernelMessage.push(res.data);			
				$scope.kernelMessage.push('Complete, please reset current period manually!');
				//if Run seminar successfully, current period need to be added by 1
				// if(selectedPeriod == seminar.currentPeriod){
				// 	var newData = {
				// 		seminarCode : seminar.seminarCode,
				// 		value : seminar.currentPeriod + 1,
				// 		behaviour:'updateCurrentPeriod'
				// 	}					
				// 	$http({method: 'POST', url: '/updateSeminar',data:newData}).
				// 	  success(function(res) {
				// 	  	$scope.seminar.currentPeriod = newData.value;
				// 		$scope.kernelMessage.push('current period has been modified into period ' + newData.value + ' !');
				// 		$scope.isActive = true;
				// 	  }).
				// 	  error(function(res) {
				// 		$scope.kernelMessage.push('current period modified failed ' + + ' !');
				// 		$scope.isActive = true;					  	
				// 	  });						
				// }
				$scope.isActive = true;	
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

	 	$scope.isActive = true;	
	 	$scope.isKeepExistedPeriod1Decision = true;
	 	$scope.keepExistedNextPeriodDecision = true;
	}]);

});
