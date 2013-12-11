define(['app'], function(app) {
		app.controller('producerDecisionStep2Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase','Label', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.language=Label.getCurrentLanguage(),
			$scope.producerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
			$scope.period=$rootScope.currentPeriod,
			$scope.category='Elecssories',
			$scope.isCollapsed=true;

	
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
					$scope.checkNextPriceBM=checkNextPriceBM;
					$scope.checknextPriceEmall=checknextPriceEmall;

					$scope.showView=showView;
					$scope.loadSelectCategroy=loadSelectCategroy;
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					showView($scope.producerID,$scope.period,$scope.category,$scope.language);
				return delay.promise;
			}


			/*Load Page*/
			var showView=function(producerID,period,category,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
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
	      			avaiableMax=data.data.budgetAvailable;
	      			if($rootScope.currentPeriod<=1){
	      				abMax=data.data.budgetAvailable;
	      			}else{
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}
					acMax=data.data.productionCapacity[categoryID-1];
					url="/producerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/brandName/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+fakeName+'/varName';
					return $http({
							method:'GET',
							url:url
						});
				}).then(function(data){
					$scope.surplusProduction=acMax-data.data.result;
					$scope.percentageProduction=(acMax-data.data.result)/acMax*100;
					$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
					if(category=="Elecssories"){
						$scope.EleShow="inline";
						$scope.HeaShow="none";
					}
					else if(category=="HealthBeauty"){
						$scope.EleShow="none";
						$scope.HeaShow="inline";
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
				    $scope.products=products;
					$scope.labelLanguages=labelLanguages;
					$scope.infoLanguages=infoLanguages;
				},function(){
					console.log('showView fail');
				});
	      		return d.promise;		
			}

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
				if($scope.category=="Elecssories"){
					$scope.isElecssories = true;
					$scope.isHealthBeauty = false;
				}
				else{
					$scope.isElecssories = false;
					$scope.isHealthBeauty = true
				}
				$scope.isCollapsed=false;
				var url='/variantHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+brandName+'/'+varName;
				$http({method: 'GET', url: url})
				.then(function(data) {
					$scope.variantHistory=data.data;
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.companyHistory=data.data;
				},function(){
					$scope.variantHistory=new Array();
					$scope.companyHistory=new Array();
					$scope.showNewHistory={
						brandName:brandName,
						varName:varName
					}
					console.log('read history info fail');
				});
			}

			var checkNextPriceBM=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID,max,result;
				var filter=/^\d+$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}else{
					d.resolve();
				}
				return d.promise;
			}

			var checknextPriceEmall=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID,max,result;
				var filter=/^\d+$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}else{
					d.resolve();
				}
				return d.promise;
			}

			var checkProduction=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID,max,result;
				var filter=/^\d+$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}
				if(category=="Elecssories"){
					categoryID=1;
				}else{
					categoryID=2;
				}	
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					max=data.data.productionCapacity[categoryID-1];
					url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					if(parseInt(data.data.result)+parseInt(value)>max){
						d.resolve('Input range:0~'+(max-parseInt(data.data.result)));
					}else{
						d.resolve();
					}
				},function(){
					d.resolve('fail');
				})
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