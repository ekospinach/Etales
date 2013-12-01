define(['app'], function(app) {
		app.controller('producerDecisionStep2Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			var multilingual=getProducerStep12Info();
			var language='English',
				producerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				period=$rootScope.currentPeriod,
				category='Elecssories',
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.producerID=producerID;
			$scope.period=period;

			$scope.parameter=1;/*default add new Brand*/
	
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
					//check
					$scope.checkProduction=checkProduction;
					$scope.showView=showView;
					$scope.loadSelectCategroy=loadSelectCategroy;
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
				var result=showView($scope.producerID,$scope.period,$scope.category,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}


			/*Load Page*/
			var showView=function(producerID,period,category,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0;
				var products=new Array();
				var labelLanguages={},infoLanguages={};
				var fakeName="";
				if(category=="Elecssories"){
					categoryID=1;
					fakeName="EName";
				}
				else if(category=="HealthBeauty"){
					categoryID=2;
					fakeName="HName";
				}
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
					acMax=data.data.productionCapacity[categoryID-1];
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
							$scope.surplusProduction=acMax-data.data.result;
							$scope.percentageProduction=(acMax-data.data.result)/acMax*100;
							$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
							if(language=="English"){
								for(var i=0;i<$scope.multilingual.length;i++){
									if(category=="Elecssories"){
										$scope.EleShow="inline";
										$scope.HeaShow="none";
									}
									else if(category=="HealthBeauty"){
										$scope.EleShow="none";
										$scope.HeaShow="inline";
									}
									labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
									infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
								}
							}
							else if(language=="Chinese"){
								for(var i=0;i<$scope.multilingual.length;i++){
									if(category=="Elecssories"){
										$scope.EleShow="inline";
										$scope.HeaShow="none";
									}
									else if(category=="HealthBeauty"){
										$scope.EleShow="none";
										$scope.HeaShow="inline";
									}
									labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
									infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
								}
							}

							var allProCatDecisions=loadSelectCategroy(category);
				      		for(var i=0;i<allProCatDecisions.length;i++){
				      			for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
				      				if(allProCatDecisions[i].proBrandsDecision[j]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
					      				for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
					      					if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0){
					      						products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
						      					products[count].category=category;
						      					products[count].parentBrandName=allProCatDecisions[i].proBrandsDecision[j].brandName;
						      					count++;
					      					}
					      				}
					      			}
				      			}
				      		}
				      		if(count!=0){
				      			result=1;
				      		}
				      		$scope.products=products;
							$scope.labelLanguages=labelLanguages;
							$scope.infoLanguages=infoLanguages;
							return result;
						},function(data){
							console.log('read currentProduction fail');
						});
	      			})
	      		});		
	      		return d.promise;		
			}


			// var showView=function(producerID,period,category,language){
			// 	$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
			// 	var labelLanguages={},infoLanguages={};
			// 	if(language=="English"){
			// 		for(var i=0;i<$scope.multilingual.length;i++){
			// 			if(category=="Elecssories"){
			// 				$scope.EleShow="inline";
			// 				$scope.HeaShow="none";
			// 			}
			// 			else if(category=="HealthBeauty"){
			// 				$scope.EleShow="none";
			// 				$scope.HeaShow="inline";
			// 			}
			// 			labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
			// 			infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
			// 		}
			// 	}
			// 	else if(language=="Chinese"){
			// 		for(var i=0;i<$scope.multilingual.length;i++){
			// 			if(category=="Elecssories"){
			// 				$scope.EleShow="inline";
			// 				$scope.HeaShow="none";
			// 			}
			// 			else if(category=="HealthBeauty"){
			// 				$scope.EleShow="none";
			// 				$scope.HeaShow="inline";
			// 			}
			// 			labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
			// 			infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
			// 		}
			// 	}
			// 	var allProCatDecisions=loadSelectCategroy(category);
	  //     		var count=0,result=0;
	  //     		var products=new Array();
	  //     		for(var i=0;i<allProCatDecisions.length;i++){
	  //     			for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
	  //     				if(allProCatDecisions[i].proBrandsDecision[j]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
		 //      				for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
		 //      					if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0){
		 //      						products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
			//       					products[count].category=category;
			//       					products[count].parentBrandName=allProCatDecisions[i].proBrandsDecision[j].brandName;
			//       					count++;
		 //      					}
		 //      				}
		 //      			}
	  //     			}
	  //     		}
	  //     		if(count!=0){
	  //     			result=1;
	  //     		}
	  //     		$scope.products=products;
			// 	$scope.labelLanguages=labelLanguages;
			// 	$scope.infoLanguages=infoLanguages;
			// 	return result;
			// }
			/*LoadSelectCategroy*/
			var loadSelectCategroy=function(category){
				return _.filter($scope.pageBase.proCatDecision,function(obj){
					if(category=="HealthBeauty"){
						return (obj.categoryID==2);
					}else{
						return (obj.categoryID==1);
					}
	      		});
			}

			var updateProducerDecision=function(category,brandName,varName,location,tep,index){
				var categoryID;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2
				}
				if(location=="composition"){
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,tep,$scope.products[index][location][tep]);							
				}
				else{
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,tep,$scope.products[index][location]);													
				}
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(brandName,varName){
				$scope.isCollapsed=false;
				var url='/variantHistoryInfo/'+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+brandName+'/'+varName;
				$http({method: 'GET', url: url})
				.success(function(data, status, headers, config) {
					$scope.variantHistory=data;
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					$http({method:'GET',url:url})
					.success(function(data,status,headers,config){
						$scope.companyHistory=data;
					})
					.error(function(data,status,headers,config){
						console.log('read companyHistoryInfo fail');
					});
				})
				.error(function(data, status, headers, config) {
					console.log('read variantHistoryInfo fail');
				});
			}
			var checkProduction=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID,max,result;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2;
				}	
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					max=data.data.productionCapacity[categoryID-1];
				},function(data){
					d.resolve('fail');
				}).then(function(){
					url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						if(parseInt(data.data.result)+parseInt(value)>max){
							d.resolve('Input range:0~'+(max-parseInt(data.data.result)));
						}else{
							d.resolve();
						}
					},function(data){
						d.resolve('fail');
					});
				});
				return d.promise;
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