define(['app', 'socketIO'], function(app) {

	app.controller('adminDetailsCtrl', ['$scope', '$http', '$rootScope', 'EditSeminarInfo','$q','Label','$timeout','PeriodInfo', 'ProducerDecisionBase', 'RetailerDecisionBase',
		function($scope, $http, $rootScope, EditSeminarInfo,$q,Label,$timeout, PeriodInfo, ProducerDecisionBase, RetailerDecisionBase) {

			var socket = io.connect();
			socket.on('AdminProcessLog', function(data) {
				$scope.isInitializeMessageShown = true;
				if (data.msg != '') {
					// if (!$scope.initializeMessage) {
					// 	$scope.initializeMessage = [];
					// }
					$scope.initializeMessage = '';
					$scope.initializeMessage = data.msg;
				}
			}).on('PassiveProcessLog', function(data) {
				$scope.isKernelMessageShown = true;
				if (data.msg != '') {
					// if (!$scope.kernelMessage) {
					// 	$scope.kernelMessage = [];
					// }
					$scope.kernelMessage = [];
					$scope.kernelMessage.push(data.msg);

				}

			}).on('KernelProcessLog', function(data) {
				$scope.isKernelMessageShown = true;
				if (data.msg != '') {
					$scope.kernelMessage = [];
					$scope.kernelMessage.push(data.msg);
				}
			});

			$scope.seminar = EditSeminarInfo.getSelectedSeminar();
			$scope.isMessageShown = false;

			var showView = function(){
				$scope.budget={
					producers:{},
					retailers:{}
				}
				$scope.exceptionalCost={
					producers:{},
					retailers:{}
				}
				if($scope.seminar){
					$http({
						method: 'GET',
						url: '/budgetExtensionAndExceptionalCost/' + $scope.seminar.seminarCode
					}).then(function(data){
						$scope.budget.producers=data.data.producerBudget;
						$scope.budget.retailers=data.data.retailerBudget;
						$scope.exceptionalCost.producers=data.data.producerExceptionalCost;
						$scope.exceptionalCost.retailers=data.data.retailerExceptionalCost;
					});
				}
				
			}
			$scope.showView=showView;
			showView();

			$scope.updatBudget = function(period, playerID, userRole, location, value) {
				if (userRole == "Producer") {
					ProducerDecisionBase.updateBudgetExtension($scope.seminar.seminarCode, period, playerID, location, value);
				} else {
					RetailerDecisionBase.updateBudgetExtension($scope.seminar.seminarCode, period, playerID, location, value);
				}
			}

			$scope.updateExceptionalCost = function(period, playerID, userRole, cateOrMarket, location, additionalIdx, value) {
				if (userRole == "Producer") {
					ProducerDecisionBase.updateExceptionalCost($scope.seminar.seminarCode, period, cateOrMarket, playerID, location, additionalIdx, value);
				} else {
					RetailerDecisionBase.updateExceptionalCost($scope.seminar.seminarCode, period, cateOrMarket, playerID, location, additionalIdx, value);
				}
			}


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
				}).then(function(data){
					console.log('update commit portfolio decision status successfully');
				},function(){
					console.log('update commit portfolio decision status failed.');
				});
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
						//console.log('finish contract deal');
						data.period=period;
						$rootScope.$broadcast('ContractDeal',data);
					})
				}else{
					$http({
						method: 'POST',
						url: '/submitContractDeal',
						data: queryCondition
					}).then(function(data){
						console.log('update commit Contract Deal status successfully');
					},function(){
						console.log('update commit Contract Deal status failed.');
					});
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

				$http({
					method: 'POST',
					url: '/submitContractFinalized',
					data: queryCondition
				}).then(function(data){
					console.log('update commit Contract Finalized status successfully');
				},function(){
					console.log('update commit Contract Finalized status failed.');
				});

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
				}).then(function(data){
					console.log('update commit final decision status successfully');
				},function(){
					console.log('update commit final decision status failed.');
				});
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
					PeriodInfo.setCurrentPeriod(seminar.currentPeriod);
					$rootScope.$broadcast('SeminarPeriodChanged', seminar);
				}).
				error(function(data, status, headers, config) {
					console.log('update error');
				});
			}

			$scope.Initialize = function(seminar, overwriteNextDecision) {
				$scope.isInitializeMessageShown = false;
				$scope.initializeMessage = '';
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
					isKeepExistedPeriod1Decision: !overwriteNextDecision
				}

				if (overwriteNextDecision) {
					overwriteNextDecision = false;
				}

				$http({
					method: 'POST',
					url: '/initialiseSeminar',
					//url: '/initialiseExtendedFeedbackSlides',
					data: postData
				}).then(function(res) {
					$scope.isInitializeMessageShown = true;
					$scope.initializeMessage = res.data;

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
						$scope.initializeMessage = 'Seminar ' + seminar.seminarCode + ' has been actived!';
						$scope.isActive = true;
					}).
					error(function(res) {
						$scope.initializeMessage = 'Active seminar ' + seminar.seminarCode + ' failed.';
						$scope.isActive = true;
					});
				}, function(res) {
					$scope.isInitializeMessageShown = true;
					$scope.initializeMessage = res.data;
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

			$scope.Run = function(seminar, selectedPeriod, overwriteNextDecisionForRunKernel) {
				$scope.isKernelMessageShown = false;
				$scope.kernelMessage = [];
				$scope.isRunConfirmInfoShown = false;
				$scope.isActive = false;

				if (!overwriteNextDecisionForRunKernel) {
					overwriteNextDecisionForRunKernel = false;
				}

				var postData = {
					seminar: seminar.seminarCode,
					period: selectedPeriod,
					keepExistedNextPeriodDecision: !overwriteNextDecisionForRunKernel
				}

				$http({
					method: 'POST',
					url: '/runSeminar',
					data: postData
				}).then(function(res) {
					$scope.isKernelMessageShown = true;
					$scope.kernelMessage.push(res.data);
					$scope.kernelMessage.push('Complete, please reset current period manually!');
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

			$scope.updateSimulationSpan = function(seminar,value){
				var postData={
					behaviour:'updateSimulationSpan',
					seminarCode:seminar,
					value:value
				};
				$http({
					url:'/updateSeminar',
					method:'POST',
					data:postData
				}).then(function(data){
					console.log('update success');	
				},function(){
					console.log('update fail');
				})
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
					if(data.portfolio>0){
						$scope.supplierClockTitle=Label.getContent('Product Portfolio')+'Left Time:'+data.portfolio;
					}else if(data.contractDeal>0){
						$scope.supplierClockTitle=Label.getContent('Contract Deal')+'Left Time:'+data.contractDeal;
					}else if(data.contractFinalized>0){
						$scope.supplierClockTitle=Label.getContent('Contract Finalize')+'Left Time:'+data.contractFinalized;
					}else if(data.contractDecisionCommitted>0){
						$scope.supplierClockTitle=Label.getContent('Contract Decision Committe')+'Left Time:'+data.contractDecisionCommitted;
					}else{
						$scope.supplierClockTitle='Time up';
					}

					$scope.supplierChartSeries = [{
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
					$scope.supplierModel=data;
					if(parseInt(data.portfolio)+parseInt(data.contractDeal)>0){
						$scope.retailerClockTitle=Label.getContent('Contract Deal')+'Left Time:'+parseInt(data.portfolio)+parseInt(data.contractDeal);
					}else if(data.contractFinalized>0){
						$scope.retailerClockTitle=Label.getContent('Contract Finalize')+'Left Time:'+data.contractFinalized;
					}else if(data.contractDecisionCommitted>0){
						$scope.retailerClockTitle=Label.getContent('Contract Decision Committe')+'Left Time:'+data.contractDecisionCommitted;
					}else{
						$scope.retailerClockTitle='Time up';
					}
					$scope.retailerChartSeries = [{
						name: Label.getContent('Total Time'),
						data: [{
							'name': Label.getContent('Gone'),
							'y': data.pass
						},{
							'name': Label.getContent('Contract Deal'),
							'y': parseInt(data.portfolio)+parseInt(data.contractDeal),
						}, {
							'name': Label.getContent('Contract Finalize'),
							'y': data.contractFinalized,
						},{
							'name':Label.getContent('Contract Decision Committe'),
							'y': data.contractDecisionCommitted
						}]
					}]
					$scope.retailerModel=data;
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

			$scope.$on('committedPortfolio', function(event, data) {

			});

			$scope.isActive = true;
			$scope.gameProgress = true;

			$scope.overwriteNextDecision = false;
			$scope.overwriteNextDecisionForRunKernel = false;
		}
	]);

});