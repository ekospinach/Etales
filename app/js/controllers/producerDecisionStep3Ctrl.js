define(['app'], function(app) {
		app.controller('producerDecisionStep3Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";			

			var multilingual=getProducerStep3Info();

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
				//ProducerDecisionBase.setSomething('TprodEST');	
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
					//check data
					$scope.checkData=checkData;
					$scope.showView=showView;
					$scope.loadSelectCategroy=loadSelectCategroy;
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getBrandMoreInfo=getBrandMoreInfo;
					$scope.closeInfo=closeInfo;
				showView($scope.producerID,$scope.period,$scope.category,$scope.language);
				return delay.promise;
			}

			/*Load Page*/
			var showView=function(producerID,period,category,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0;
				var brands=new Array();
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
							var allProCatDecisions=loadSelectCategroy(category);
							for(var i=0;i<allProCatDecisions.length;i++){
				      			for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
				      				if(allProCatDecisions[i].proBrandsDecision[j]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
				      					brands.push(allProCatDecisions[i].proBrandsDecision[j]);
				      					count++;
				      				}
				      			}
				      		}
				      		if(count!=0){
				      			result=1;
				      		}
				      		$scope.brands=brands;
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

			var updateProducerDecision=function(category,brandName,location,tep,index){
				var categoryID;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2
				}
				if(location=="supportTraditionalTrade"||location=="advertisingOffLine"){
					ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,$scope.brands[index][location][tep]);							
				}
				else{
					ProducerDecisionBase.setProducerDecisionBrand(categoryID,brandName,location,tep,$scope.brands[index][location]);													
				}
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var checkData=function(category,brandName,location,tep,index,value){
				var d=$q.defer();
				var categoryID,max,result;
				var filter=/^\d+(\.{0,1}\d+){0,1}$/;
				if(!filter.test(value)){
					d.resolve('Input a Num');
				}

				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			max=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			url="/producerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+location+'/'+tep;
	      			return $http({
	      				method:'GET',
	      				url:url
	      			});
	      		}).then(function(data){
	      			if(parseInt(data.data.result)+parseInt(value)>max){
	      				d.resolve('Input range 0~'+(max-data.data.result));
	      			}else{
	      				d.resolve();
	      			}
	      		},function(data){
	      			d.resolve('fail');
	      		});
	      		return d.promise;
			}

			var getBrandMoreInfo=function(brandID,brandName){
				var d=$q.defer();
				$scope.isCollapsed=false;
				var url='/brandHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+brandName;
				$http({method: 'GET', url: url})
				.then(function(data) {
					$scope.brandHistory=data.data;
					url="/producerBrandDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+brandName;
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.brandDecisionHistory=data.data;
				},function(){
					$scope.brandHistory=new Array();
					$scope.brandDecisionHistory=new Array();
					$scope.showNewHistory={
						brandName:brandName,
					}
					console.log('read historyInfo fail');
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