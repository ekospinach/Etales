define(['app'], function(app) {
		app.controller('retailerDecisionStep1Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			//var calculate='../js/controllers/untils/calculate.js';
			//var calculate=require('');
			var multilingual=getRetailerStep1Info();
			var language='English',
				retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				period=$rootScope.currentPeriod,
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.language=language;
			$scope.retailerID=retailerID;
			$scope.period=period;
			RetailerDecisionBase.startListenChangeFromServer();
			RetailerDecisionBase.reload({retailerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
			//ProducerDecisionBase.reload({period:'0', seminar:'MAY', retailerID:1}).then(function(base){
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
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
				var result=showView($scope.retailerID,$scope.period,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}


			/*Load Page*/
			var showView=function(retailerID,period,language){
				$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
				var labelLanguages={},infoLanguages={};
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
	      		var count=0,result=0;
	      		result=1;
				$scope.infoLanguages=infoLanguages;
				$scope.labelLanguages=labelLanguages;
				return result;
			}

			var updateRetailerDecision=function(location,postion){
				RetailerDecisionBase.setRetailerDecisionBase(location,postion,$scope.pageBase[location][postion]);
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(){
				//$scope.moreInfo={'categoryID':$scope.retailerID};
				$scope.isCollapsed=false;
				var url="/quarterHistoryInfo/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod;
				$http({method:'GET',url:url})
				.success(function(data,status,headers,config){
					$scope.quarterHistory=data;
					console.log($scope.quarterHistory);
					url="/retailerDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar;
					$http({method:'GET',url:url})
					.success(function(data){
						$scope.retailerDecisionHistory=data;
					})
					.error(function(data){
						console.log('read retailerDecisionHistory fail');
					})
				})
				.error(function(data,status,headers,config){
					console.log('read quarterHistory fail');
				});
			}

			$scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
				RetailerDecisionBase.reload({retailerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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