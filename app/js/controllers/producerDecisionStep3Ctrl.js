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
				//ProducerDecisionBase.setSomething('TEST');	
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
					$scope.loadSelectCategroy=loadSelectCategroy;

					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getBrandMoreInfo=getBrandMoreInfo;
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
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var shortLanguages={},labelLanguages={},infoLanguages={};
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
	      		var count=0,result=0;
	      		var brands=new Array();
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
				$scope.shortLanguages=shortLanguages;
				$scope.labelLanguages=labelLanguages;
				$scope.infoLanguages=infoLanguages;
				return result;
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

			var getBrandMoreInfo=function(brandID,brandName){
				$scope.isCollapsed=false;
				var url='/brandHistoryInfo/'+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+brandName;
				$http({method: 'GET', url: url})
				.success(function(data, status, headers, config) {
					$scope.brandHistory=data;
					console.log($scope.brandHistory);
					url="/producerBrandDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+brandName;
					 $http({method:'GET',url:url})
					 .success(function(data,status,headers,config){
					 	$scope.brandDecisionHistory=data;
					 	console.log($scope.brandDecisionHistory);
					 })
					 .error(function(data,status,headers,config){
					 	console.log('read brandDecisionHistory fail');
					 });
				})
				.error(function(data, status, headers, config) {
					console.log('read producer BrandHistory fail');
				});
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