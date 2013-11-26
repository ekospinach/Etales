define(['app'], function(app) {
		app.controller('producerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			$rootScope.decisionActive="active";
			var calculate='../js/controllers/untils/calculate.js';
			//var calculate=require('');
			 var multilingual=getProducerStep4Info();
			//[{
			// 			'shortName':'Products_Portfolio_Management',
			// 			'labelENG':'Products Portfolio Management',
			// 			'labelRUS':'',
			// 			'labelCHN':'产品组合管理',
			// 			'label':''
			// 		},{
			// 			'shortName':'Next',
			// 			'labelENG':'Next',
			// 			'labelRUS':'',
			// 			'labelCHN':'下一步',
			// 			'label':''
			// 		},{
			// 			'shortName':'Category',
			// 			'labelENG':'Category',
			// 			'labelRUS':'',
			// 			'labelCHN':'品类',
			// 			'label':''
			// 		},{
			// 			'shortName':'IICC',
			// 			'labelENG':'Investment in Capacity Change',
			// 			'labelRUS':'',
			// 			'labelCHN':'包',
			// 			'label':''					
			// 		},{
			// 			'shortName':'ITIAT',
			// 			'labelENG':'Investment to imorove Available Technology',
			// 			'labelRUS':'',
			// 			'labelCHN':'技术水平',
			// 			'label':''
			// 		},{
			// 			'shortName':'ITIF',
			// 			'labelENG':'Investment to improve Flexibility',
			// 			'labelRUS':'',
			// 			'labelCHN':'活性剂',
			// 			'label':''
			// 		},{
			// 			'shortName':'ITIDK',
			// 			'labelENG':'Investment to improve Design Know-How',
			// 			'labelRUS':'',
			// 			'labelCHN':'增滑技术',
			// 			'label':''
			// 		}];
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
				$scope.producerID=producerID,$scope.period=period,$scope.language=language;
				var shortLanguages={},labelLanguages={},infoLanguages={};
				if(language=="English"){
					for(var i=0;i<$scope.multilingual.length;i++){
						$scope.multilingual[i].label=$scope.multilingual[i].labelENG;
						$scope.multilingual[i].info=$scope.multilingual[i].infoENG;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].info;
					}
				}
				else if(language=="Chinese"){
					for(var i=0;i<$scope.multilingual.length;i++){
						$scope.multilingual[i].label=$scope.multilingual[i].labelCHN;
						$scope.multilingual[i].info=$scope.multilingual[i].infoCHN;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].info;
					}
				}
	      		var count=0,result=0;
	      		var categorys=new Array();
	      		for(var i=0;i<$scope.pageBase.proCatDecision.length;i++){
	      			categorys.push($scope.pageBase.proCatDecision[i]);
	      			count++;
	      		}
	      		if(count!=0){
	      			result=1;
	      		}
	      		$scope.categorys=categorys;
				$scope.shortLanguages=shortLanguages;
				$scope.labelLanguages=labelLanguages;
				$scope.infoLanguages=infoLanguages;
				return result;
			}

			var updateProducerDecision=function(categoryID,location,index){
				ProducerDecisionBase.setProducerDecisionCategory(categoryID,location,$scope.categorys[index][location]);
				$scope.$broadcast('producerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
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