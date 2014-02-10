define(['app'], function(app) {
		app.controller('retailerDecisionStep1Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase','Label','PlayerInfo', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase,Label,PlayerInfo) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			//var multilingual=getRetailerStep1Info();
			$scope.language=Label.getCurrentLanguage();
			$scope.retailerID=parseInt(PlayerInfo.getPlayer());
			$scope.period=$rootScope.currentPeriod;
			$scope.category='Elecssories';
			$scope.isCollapsed=true;
		
			RetailerDecisionBase.startListenChangeFromServer();
			RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
				$scope.pageBase = base;
			}).then(function(){
				return promiseStep1();
			}), function(reason){
				console.log('from ctr: ' + reason);
			}, function(update){
				console.log('from ctr: ' + update);
			};

			var promiseStep1=function(){
				var d=$q.defer();
				d.notify(Label.getContent('start to show view'));
					$scope.showView=showView;
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.checkBudget=checkBudget;
					d.resolve();
					return showView($scope.retailerID,$scope.period,$scope.language);
				return d.promise;
			}

			/*Load Page*/
			var showView=function(retailerID,period,language){
				var d=$q.defer();
				$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
				var categoryID=0,count=0,result=0,expend=0;
				var labelLanguages={},infoLanguages={};
				var fakeName="EName",max=100;
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			if($rootScope.currentPeriod>=2){
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}else{
	      				abMax=data.data.budgetAvailable;
	      			}
	      			$scope.abMax=abMax;
	      			url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
	      			d.resolve();
	      		},function(){
	      			d.reject(Label.getContent('showView fail'));
	      		});	
	      		return d.promise;		
			}

			//check
			var checkBudget=function(location,additionalIdx,value){
				var d=$q.defer();
				var max=0;
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			max=data.data.budgetAvailable;
	      			url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+parseInt(PlayerInfo.getPlayer())+'/0/'+location+'/'+additionalIdx;
	      			return $http({
	      				method:'GET',
	      				url:url
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			if(value>max-expend){
	      				d.resolve(Label.getContent('Input range')+':0~'+(max-expend));
	      			}else{
	      				d.resolve();
	    			}
	      		},function(){
	      			d.resolve(Label.getContent('fail'));
	      		});
	      		return d.promise;
			}

			var updateRetailerDecision=function(location,additionalIdx){
				RetailerDecisionBase.setRetailerDecisionBase(location,additionalIdx,$scope.pageBase[location][additionalIdx]);
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(){
				//$scope.moreInfo={'categoryID':$scope.retailerID};
				$scope.isCollapsed=false;
				var url="/quarterHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1);
				$http({method:'GET',url:url})
				.then(function(data){
					$scope.quarterHistory=data.data;
					url="/retailerDecision/"+parseInt(PlayerInfo.getPlayer())+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar;
					return $http({method:'GET',url:url})	
				}).then(function(data){
					$scope.retailerDecisionHistory=data.data;
				},function(){
					console.log('read historyInfo fail');
				});
			}

			$scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
				RetailerDecisionBase.reload({retailerID:parseInt(PlayerInfo.getPlayer()),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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