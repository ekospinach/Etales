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
					
					$scope.showView=showView;
					$scope.loadSelectCategroy=loadSelectCategroy;
					$scope.loadNameNum=loadNameNum;
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
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var shortLanguages={},labelLanguages={},infoLanguages={};
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
						$scope.multilingual[i].label=$scope.multilingual[i].labelENG;
						$scope.multilingual[i].info=$scope.multilingual[i].infoENG;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].info;
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
						$scope.multilingual[i].label=$scope.multilingual[i].labelENG;
						$scope.multilingual[i].info=$scope.multilingual[i].infoENG;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].info;
					}
				}
				var allProCatDecisions=loadSelectCategroy(category);
	      		var count=0,result=0;
	      		var products=new Array();
	      		for(var i=0;i<allProCatDecisions.length;i++){
	      			for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
	      				if(allProCatDecisions[i].proBrandsDecision[j]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
		      				for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
		      					if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0){
		      						products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
			      					products[count].category=category;
			      					products[count].parentBrandName=allProCatDecisions[i].proBrandsDecision[j].brandName;
			      					if(products[count].packFormat=="ECONOMY"){
			      						products[count].packFormat=1;
			      					}
			      					else if(products[count].packFormat=="STANDARD"){
			      						products[count].packFormat=2;
			      					}
			      					else if(products[count].packFormat=="PREMIUM"){
			      						products[count].packFormat=3;
			      					}
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

			var loadNameNum=function(){//load the sort
				/*importantt*/
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