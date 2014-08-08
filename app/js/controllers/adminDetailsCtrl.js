define(['app', 'socketIO'], function(app) {

	app.controller('adminDetailsCtrl', ['$scope', '$http', '$rootScope', 'EditSeminarInfo','$q','Label','$timeout',
		function($scope, $http, $rootScope, EditSeminarInfo,$q,Label,$timeout) {

			var socket = io.connect('http://localhost');
			socket.on('AdminProcessLog', function(data) {
				$scope.isInitializeMessageShown = true;
				if (data.msg != '') {
					if (!$scope.initializeMessage) {
						$scope.initializeMessage = [];
					}
					$scope.initializeMessage.push(data.msg);
				}
			}).on('PassiveProcessLog', function(data) {
				$scope.isKernelMessageShown = true;
				if (data.msg != '') {
					if (!$scope.kernelMessage) {
						$scope.kernelMessage = [];
					}
					console.log(data.msg)
					$scope.kernelMessage.push(data.msg);

				}

			}).on('KernelProcessLog', function(data) {
				$scope.isKernelMessageShown = true;
				if (data.msg != '') {
					$scope.kernelMessage.push(data.msg);
				}
			});

			$scope.seminar = EditSeminarInfo.getSelectedSeminar();
			console.log($scope.seminar);
			$scope.isMessageShown = false;



			$scope.getSeminarStatus = function(value) {
				if (value) {
					return 'Ture';
				} else {
					return 'False (Please set related paramters below and initialise seminar)'
				}
			}

			$scope.updatePortfolioDecisionCommittedChanged = function(producerID, period, value) {
				var queryCondition = {
					producerID: producerID,
					seminar: $scope.seminar.seminarCode,
					period: period,
					value: value
				}

				$http({
					method: 'POST',
					url: '/submitPortfolioDecision',
					data: queryCondition
				}).success(function(data, status, headers, config) {
					console.log('update commit portfolio decision status successfully');
				}).error(function(data, status, headers, config) {
					console.log('update commit portfolio decision status failed.');
				})

			}

			function dealContractDetailShooter(allDetails){
				var deferred = $q.defer();
				(function multipleRequestShooter(details,idx){
					var shooterData={
						detail:details[idx]
					}
					$http({
						method:'POST',
						url:'/dealContractDetail',
						data:shooterData
					}).then(function(data){
						if(idx<details.length-1){
							idx++;
							multipleRequestShooter(details,idx);
						}else{
							deferred.resolve({
                                msg: 'deal details shooter done '
                            });
						}
					},function(data){
						deferred.reject({
							msg:'Err from deal details'
						});
					});
				})(allDetails,0);
				return deferred.promise;
			}

			function finalizedContractDetailShooter(allDetails,value){
				var deferred = $q.defer();
				(function multipleRequestShooter(details,value,idx){
					var shooterData={
						detail:details[idx],
						value:value
					}
					$http({
						method:'POST',
						url:'/finalizedContractDetail',
						data:shooterData
					}).then(function(data){
						if(idx<details.length-1){
							idx++;
							multipleRequestShooter(details,value,idx);
						}else{
							deferred.resolve({
                                msg: 'finalized details shooter done '
                            });
						}
					},function(data){
						deferred.reject({
							msg:'Err from finalized details'
						});
					});
				})(allDetails,value,0);
				return deferred.promise;
			}

			$scope.updateContractDealChanged = function(role, roleID, period, value) {
				var queryCondition = {
					roleID: roleID,
					role: role,
					seminar: $scope.seminar.seminarCode,
					period: period,
					value: value
				}

				/*change the contract from previous period*/
				if(role=='Producer'&&value){
					var url='/getContractUnApprovedDetails/P'+roleID+'andR1_'+$scope.seminar.seminarCode+'_'+period;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						return dealContractDetailShooter(data.data);
					}).then(function(data){
						var url='/getContractUnApprovedDetails/P'+roleID+'andR2_'+$scope.seminar.seminarCode+'_'+period;
						return $http({
							method:'GET',
							url:url
						});
					}).then(function(data){
						return dealContractDetailShooter(data.data);
					}).then(function(data){
						return $http({
							method: 'POST',
							url: '/submitContractDeal',
							data: queryCondition
						})
					}).then(function(data){
						console.log('finish contract deal');
					})
				}else{
					$http({
						method: 'POST',
						url: '/submitContractDeal',
						data: queryCondition
					}).success(function(data, status, headers, config) {
						console.log('update commit Contract Deal status successfully');
					}).error(function(data, status, headers, config) {
						console.log('update commit Contract Deal status failed.');
					})
				}
			}
			$scope.updateContractFinalizedChanged = function(role, roleID, period, value) {
				var queryCondition = {
					roleID: roleID,
					role: role,
					seminar: $scope.seminar.seminarCode,
					period: period,
					value: value
				}

				// if(role=='Producer'){
				// 	var url='/getContractDetails/P'+roleID+'andR1_'+$scope.seminar.seminarCode+'_'+period;
				// 	$http({
				// 		method:'GET',
				// 		url:url
				// 	}).then(function(data){
				// 		return finalizedContractDetailShooter(data.data,value);
				// 	}).then(function(data){
				// 		var url='/getContractDetails/P'+roleID+'andR2_'+$scope.seminar.seminarCode+'_'+period;
				// 		return $http({
				// 			method:'GET',
				// 			url:url
				// 		});
				// 	}).then(function(data){
				// 		return finalizedContractDetailShooter(data.data,value);
				// 	}).then(function(data){
				// 		return $http({
				// 			method: 'POST',
				// 			url: '/submitContractFinalized',
				// 			data: queryCondition
				// 		})
				// 	}).then(function(data){
				// 		console.log('finish contract deal');
				// 	})
				// }else{
					$http({
						method: 'POST',
						url: '/submitContractFinalized',
						data: queryCondition
					}).success(function(data, status, headers, config) {
						console.log('update commit Contract Finalized status successfully');
					}).error(function(data, status, headers, config) {
						console.log('update commit Contract Finalized status failed.');
					})
				//}

			}

			$scope.updateFinalDecisionCommittedChanged = function(role, roleID, period, value) {
				var queryCondition = {
					roleID: roleID,
					role: role,
					seminar: $scope.seminar.seminarCode,
					period: period,
					value: value,
				}

				$http({
					method: 'POST',
					url: '/submitFinalDecision',
					data: queryCondition
				}).success(function(data, status, headers, config) {
					console.log('update commit final decision status successfully');
				}).error(function(data, status, headers, config) {
					console.log('update commit final decision status failed.');
				})

			}


			$scope.updatePassword = function(seminar, location, additionalIdx) {
				var data = {
					seminarCode: seminar.seminarCode,
					location: location,
					additionalIdx: additionalIdx,
					value: seminar[location][additionalIdx].password,
					behaviour: 'updatePassword'
				}

				console.log('update Password post data:' + data);
				$http({
					method: 'POST',
					url: '/updateSeminar',
					data: data
				}).
				success(function(data, status, headers, config) {
					console.log('update success');
				}).
				error(function(data, status, headers, config) {
					console.log('update error');
				});
			}

			$scope.updateCurrentPeriod = function(seminar) {
				var data = {
					seminarCode: seminar.seminarCode,
					value: seminar.currentPeriod,
					behaviour: 'updateCurrentPeriod'
				}
				console.log('update current period, post data:' + data);
				$http({
					method: 'POST',
					url: '/updateSeminar',
					data: data
				}).
				success(function(data, status, headers, config) {
					console.log('update success');
				}).
				error(function(data, status, headers, config) {
					console.log('update error');
				});
			}

			$scope.Initialize = function(seminar, isKeepExistedPeriod1Decision) {
				$scope.isInitializeMessageShown = false;
				$scope.initializeMessage = [];
				$scope.isInitializeConfirmInfoShown = false;
				$scope.isActive = false;
				var postData = {
					seminar: seminar.seminarCode,
					simulationSpan: seminar.simulationSpan,
					traceActive: seminar.traceActive,
					traditionalTradeActive: seminar.traditionalTradeActive,
					EMallActive: seminar.EMallActive,
					virtualSupplierActive: seminar.virtualSupplierActive,
					independentMarkets: seminar.independentMarkets,
					forceNextDecisionsOverwrite: seminar.forceNextDecisionsOverwrite,
					market1ID: seminar.market1ID,
					market2ID: seminar.market2ID,
					category1ID: seminar.category1ID,
					category2ID: seminar.category2ID,
					isKeepExistedPeriod1Decision: isKeepExistedPeriod1Decision
				}
				if (!isKeepExistedPeriod1Decision) {
					isKeepExistedPeriod1Decision = false;
				}

				$http({
					method: 'POST',
					url: '/initialiseSeminar',
					data: postData
				}).then(function(res) {
					$scope.isInitializeMessageShown = true;
					$scope.initializeMessage.push(res.data);

					//if Initialize seminar successfully, set active of current period into TRUE
					var newData = {
						seminarCode: seminar.seminarCode,
						value: true,
						behaviour: 'updateActived'
					}
					$http({
						method: 'POST',
						url: '/updateSeminar',
						data: newData
					}).
					success(function(res) {
						$scope.seminar.isInitialise = newData.value;
						$scope.initializeMessage.push('Seminar ' + seminar.seminarCode + ' has been actived!');
						$scope.isActive = true;
					}).
					error(function(res) {
						$scope.initializeMessage.push('Active seminar ' + seminar.seminarCode + ' failed.');
						$scope.isActive = true;
					});
				}, function(res) {
					$scope.isInitializeMessageShown = true;
					$scope.initializeMessage.push(res.data);
					$scope.isActive = true;
				})
			}


			$scope.openInitializeModal = function() {
				$scope.isInitializeConfirmInfoShown = true;
			}

			$scope.passiveDecision = function(seminar, selectedPeriod) {
				$scope.isKernelMessageShown = false;
				$scope.kernelMessage = [];
				$scope.isRunConfirmInfoShown = false;
				$scope.isActive = false;

				var postData = {
					seminar: seminar.seminarCode,
					period: selectedPeriod
				}
				$http({
					method: 'POST',
					url: '/passiveSeminar',
					data: postData
				}).then(function(res) {
					$scope.isKernelMessageShown = true;
					$scope.kernelMessage.push(res.data);
					$scope.isActive = true;
				}, function(res) {
					$scope.isKernelMessageShown = true;
					$scope.kernelMessage.push(res.data);
					$scope.isActive = true;
				})
			}

			$scope.Run = function(seminar, selectedPeriod, keepExistedNextPeriodDecision) {
				$scope.isKernelMessageShown = false;
				$scope.kernelMessage = [];
				$scope.isRunConfirmInfoShown = false;
				$scope.isActive = false;

				if (!keepExistedNextPeriodDecision) {
					keepExistedNextPeriodDecision = false;
				}

				var postData = {
					seminar: seminar.seminarCode,
					period: selectedPeriod,
					keepExistedNextPeriodDecision: keepExistedNextPeriodDecision
				}

				$http({
					method: 'POST',
					url: '/runSeminar',
					data: postData
				}).then(function(res) {
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
				}, function(res) {
					$scope.isKernelMessageShown = true;
					$scope.kernelMessage.push(res.data);
					$scope.isActive = true;
				})
			}

			$scope.openRunModal = function() {
				$scope.isRunConfirmInfoShown = true;
			}

			var showbubleMsg = function(content, status) {
				$scope.bubleMsg = ' ' + content;
				switch (status) {
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


			$scope.switchTimer=function(value){
				var postData={
					seminarCode:$scope.seminar.seminarCode,
					behaviour:'switchTimer',
					value:value
				};
				$http({
					method:'POST',
					url:'/updateSeminar',
					data:postData
				}).then(function(data){
					if(value){
						drawChart(data);
					}
				},function(){
					console.log('fail');
				})
			}

			$scope.checkTimerSet=function(value){
				var d = $q.defer();
                var filter = /^[0-9]*[1-9][0-9]*$/;
                if (!filter.test(value)) {
                    d.resolve(Label.getContent('Input a Integer'));
                }else{
                	d.resolve();
                }
                return d.promise;
			}

			$scope.updateTimeslotPortfolioDecisionCommitted=function(value){
				var postData={
					seminarCode:$scope.seminar.seminarCode,
					behaviour:'updateTimeslotPortfolioDecisionCommitted',
					value:value
				};
				$http({
					method:'POST',
					url:'/updateSeminar',
					data:postData
				}).then(function(data){
					console.log('success');
				},function(){
					console.log('fail');
				})
			}
			$scope.updateTimeslotContractDeal=function(value){
				var postData={
					seminarCode:$scope.seminar.seminarCode,
					behaviour:'updateTimeslotContractDeal',
					value:value
				};
				$http({
					method:'POST',
					url:'/updateSeminar',
					data:postData
				}).then(function(data){
					console.log('success');
				},function(){
					console.log('fail');
				})
			}
			$scope.updateTimeslotContractFinalized=function(value){
				var postData={
					seminarCode:$scope.seminar.seminarCode,
					behaviour:'updateTimeslotContractFinalized',
					value:value
				};
				console.log(value);
				$http({
					method:'POST',
					url:'/updateSeminar',
					data:postData
				}).then(function(data){
					console.log('success');
				},function(){
					console.log('fail');
				})
			}
			$scope.updateTimeslotDecisionCommitted=function(value){
				var postData={
					seminarCode:$scope.seminar.seminarCode,
					behaviour:'updateTimeslotDecisionCommitted',
					value:value
				};
				$http({
					method:'POST',
					url:'/updateSeminar',
					data:postData
				}).then(function(data){
					console.log('success');
				},function(){
					console.log('fail');
				})
			}

			var drawChart=function(data){
				$timeout(function() {
					$scope.clockTitle='heoooo';
					$scope.chartSeries = [{
						name: Label.getContent('Total Time'),
						data: [{
							'name': Label.getContent('Gone'),
							'y': data.pass
						}, {
							'name': Label.getContent('Product Portfolio'),
							'y': data.portfolio,
						}, {
							'name': Label.getContent('Contract Deal'),
							'y': data.contractDeal,
						}, {
							'name': Label.getContent('Contract Finalize'),
							'y': data.contractFinalized,
						},{
							'name':Label.getContent('Contract Decision Committe'),
							'y': data.contractDecisionCommitted
						}]
					}]
					$scope.myModel=data;
				});
			}

			$scope.startTimer=function(){
				var postData={
                    seminarCode:$scope.seminar.seminarCode,
                    active:'switchOn',
                    portfolio : $scope.seminar.timeslotPortfolioDecisionCommitted, 
                    contractDeal: $scope.seminar.timeslotContractDeal, 
                    contractFinalized : $scope.seminar.timeslotContractFinalized, 
                    contractDecisionCommitted : $scope.seminar.timeslotDecisionCommitted
                }
                $http({
                    method:'POST',
                    url:'/timer',
                    data:postData
                }).then(function(data){
                    console.log(data.data);
                    drawChart(data.data);
                });
			}

			$scope.stopTimer=function(){
				var postData={
                    seminarCode:$scope.seminar.seminarCode,
                    active:'switchOff'
                }
                $http({
                    method:'POST',
                    url:'/timer',
                    data:postData
                }).then(function(data){
                    console.log(data);
                });
			}


			$scope.$on('timerWork', function(event, data) {
				drawChart(data);
			});
			$scope.$on('deadlinePortfolio', function(event, data) {
				drawChart(data);
			});
			$scope.$on('deadlineContractDeal', function(event, data) {
				drawChart(data);
			});
			$scope.$on('deadlineContractFinalized', function(event, data) {
				drawChart(data);
			});
			$scope.$on('deadlineDecisionCommitted', function(event, data) {
				drawChart(data);
			});

			$scope.isActive = true;
			$scope.isKeepExistedPeriod1Decision = true;
			$scope.keepExistedNextPeriodDecision = true;
		}
	]);

});