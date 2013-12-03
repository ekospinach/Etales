define(['app'], function(app) {
		app.controller('producerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			$rootScope.decisionActive="active";
			var multilingual=getProducerStep4Info();
			var language='English',
				producerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				period=$rootScope.currentPeriod,
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.language=language;
			$scope.producerID=producerID;
			$scope.period=period;

			ProducerDecisionBase.reload({producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
				$scope.pageBase = base;
			}).then(function(){
				return promiseStep1();
			}), function(reason){
				console.log('from ctr: ' + reason);
			}, function(update){
				console.log('from ctr: ' + update);
			};

			var promiseStep1=function(){
				var delay=$q.defer();
				delay.notify('start to show view');

					$scope.showView=showView;
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getCategoryMoreInfo=getCategoryMoreInfo;
					$scope.closeInfo=closeInfo;
					//check data
					$scope.checkData=checkData;
				var result=showView($scope.producerID,$scope.period,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}


			/*Load Page*/
			var showView=function(producerID,period,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.language=language;
				var categoryID=0,count=0,result=0,eAcMax=0,hAcMax,abMax=0,expend=0;
				var labelLanguages={},infoLanguages={};
				var fakeName="EName";
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
					eAcMax=data.data.productionCapacity[0];
					hAcMax=data.data.productionCapacity[1];
	      		},function(data){
					console.log('read companyHistory fail');
	      		}).then(function(){
	      			url="/producerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/brandName/location/1';
	      			$http({
	      				method:'GET',
	      				url:url,
	      			}).then(function(data){
	      				expend=data.data.result;
	      				$scope.surplusExpend=abMax-expend;
	      				$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			},function(data){
	      				console.log('read producerExpend fail');
	      			}).then(function(){
	      				url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+fakeName+'/varName';
						$http({
							method:'GET',
							url:url
						}).then(function(data){
							$scope.eSurplusProduction=eAcMax-data.data.result;
							$scope.ePercentageProduction=(eAcMax-data.data.result)/eAcMax*100;
						},function(data){
							console.log('read E-currentProduction fail');
						}).then(function(){
							fakeName="HName";
	      					url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+fakeName+'/varName';
							$http({
								method:'GET',
								url:url
							}).then(function(data){
								$scope.hSurplusProduction=hAcMax-data.data.result;
								$scope.hPercentageProduction=(hAcMax-data.data.result)/hAcMax*100;
								$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
								if(language=="English"){
									for(var i=0;i<$scope.multilingual.length;i++){
										labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
										infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
									}
								}
								else if(language=="Chinese"){
									for(var i=0;i<$scope.multilingual.length;i++){
										labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelCHN;
										infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoCHN;
									}
								}
		                        var categorys=new Array();
					      		for(var i=0;i<$scope.pageBase.proCatDecision.length;i++){
					      			categorys.push($scope.pageBase.proCatDecision[i]);
					      			count++;
					      		}
					      		if(count!=0){
					      			result=1;
					      		}
					      		$scope.categorys=categorys;
								$scope.labelLanguages=labelLanguages;
								$scope.infoLanguages=infoLanguages;
								return result;
							},function(data){
								console.log('read H-currentProduction fail');
							})
						})
	      			})
	      		});		
	      		return d.promise;		
			}


			// var showView=function(producerID,period,language){
			// 	$scope.producerID=producerID,$scope.period=period,$scope.language=language;
			// 	var labelLanguages={},infoLanguages={};
			// 	if(language=="English"){
			// 		for(var i=0;i<$scope.multilingual.length;i++){
			// 			labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
			// 			infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
			// 		}
			// 	}
			// 	else if(language=="Chinese"){
			// 		for(var i=0;i<$scope.multilingual.length;i++){
			// 			labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelCHN;
			// 			infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoCHN;
			// 		}
			// 	}
	  //     		var count=0,result=0;
	  //     		var categorys=new Array();
	  //     		for(var i=0;i<$scope.pageBase.proCatDecision.length;i++){
	  //     			categorys.push($scope.pageBase.proCatDecision[i]);
	  //     			count++;
	  //     		}
	  //     		if(count!=0){
	  //     			result=1;
	  //     		}
	  //     		$scope.categorys=categorys;
			// 	$scope.labelLanguages=labelLanguages;
			// 	$scope.infoLanguages=infoLanguages;
			// 	return result;
			// }

			var updateProducerDecision=function(categoryID,location,index){
				ProducerDecisionBase.setProducerDecisionCategory(categoryID,location,$scope.categorys[index][location]);
				$scope.$broadcast('producerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var checkData=function(value){
				var d=$q.defer();
				if(value>=0){
					d.resolve();
				}else{
					d.resolve('Input must large 0');
				}
				return d.promise;
			}

			var getCategoryMoreInfo=function(categoryID){
				$scope.isCollapsed=false;
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({method: 'GET', url: url})
				.success(function(data, status, headers, config) {
					$scope.companyHistory=data;
					console.log($scope.companyHistory);
					url="/producerCompanyDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+categoryID;
					 $http({method:'GET',url:url})
					 .success(function(data,status,headers,config){
					 	$scope.companyDecisionHistory=data;
					 	console.log($scope.companyDecisionHistory);
					 })
					 .error(function(data,status,headers,config){
					 	console.log('read companyDecisionHistory fail');
					 });
				})
				.error(function(data, status, headers, config) {
					console.log('read companyHistory fail');
				});
				$scope.categoryID=categoryID;

			}	

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
				ProducerDecisionBase.reload({producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
					$scope.pageBase = base;	
				}).then(function(){
					return promiseStep1();
				}), function(reason){
					console.log('from ctr: ' + reason);
				}, function(update){
					console.log('from ctr: ' + update);
				};
			});	
	}]);
});