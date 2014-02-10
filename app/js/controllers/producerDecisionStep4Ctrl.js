define(['app'], function(app) {
		app.controller('producerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase','Label','PlayerInfo', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase,Label,PlayerInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			$rootScope.decisionActive="active";
			$scope.language=Label.getCurrentLanguage();
			$scope.producerID=parseInt(PlayerInfo.getPlayer());
			$scope.period=$rootScope.currentPeriod;
			$scope.category='Elecssories';
			$scope.isCollapsed=true;

			ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getCategoryMoreInfo=getCategoryMoreInfo;
					$scope.closeInfo=closeInfo;
					//check data
					$scope.checkData=checkData;
					d.resolve();
					return showView($scope.producerID,$scope.period,$scope.language);
				return d.promise;
			}


			/*Load Page*/
			var showView=function(producerID,period,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.language=language;
				var categoryID=0,count=0,result=0,eAcMax=0,hAcMax,abMax=0,expend=0,avaiableMax=0;
				//var labelLanguages={},infoLanguages={};
				var fakeName="EName";
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			//abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			avaiableMax=data.data.budgetAvailable;
	      			if($rootScope.currentPeriod<=1){
	      				abMax=data.data.budgetAvailable;
	      			}else{
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}

					eAcMax=data.data.productionCapacity[0];
					hAcMax=data.data.productionCapacity[1];
					url="/producerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+parseInt(PlayerInfo.getPlayer())+'/brandName/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+parseInt(PlayerInfo.getPlayer())+'/'+fakeName+'/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					$scope.eSurplusProduction=eAcMax-data.data.result;
					$scope.ePercentageProduction=(eAcMax-data.data.result)/eAcMax*100;
					fakeName="HName";
	      			url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+parseInt(PlayerInfo.getPlayer())+'/'+fakeName+'/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					$scope.hSurplusProduction=hAcMax-data.data.result;
					$scope.hPercentageProduction=(hAcMax-data.data.result)/hAcMax*100;
					$scope.producerID=producerID,$scope.period=period,$scope.language=language;
		            var categorys=new Array();
		            for(var i=0;i<$scope.pageBase.proCatDecision.length;i++){
		            	categorys.push($scope.pageBase.proCatDecision[i]);
		            	count++;
		            }
		            if(count!=0){
		            	d.resolve();
		            }else{
		            	d.reject(Label.getContent('load categorys fail'));
		            }
		            $scope.categorys=categorys;
				},function(){
					d.reject(Label.getContent('showView fail'));
				});	
	      		return d.promise;		
			}


			var updateProducerDecision=function(categoryID,location,index){
				ProducerDecisionBase.setProducerDecisionCategory(categoryID,location,$scope.categorys[index][location]);
				$scope.$broadcast('producerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var checkData=function(value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}else{
					d.resolve();
				}
				return d.promise;
			}

			var getCategoryMoreInfo=function(categoryID){
				$scope.categoryID = categoryID;
				switch(categoryID){
					case 1: $scope.category = 'Elecssories';
							$scope.isElecssories = true;
							$scope.isHealthBeauty = false;
					break;
					case 2: $scope.category = 'HealthBeauty';
							$scope.isElecssories = false;
							$scope.isHealthBeauty = true;
					break;
				}
				$scope.isCollapsed=false;
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
				$http({method: 'GET', url: url})
				.then(function(data){
					$scope.companyHistory=data.data;
					url="/producerCompanyDecision/"+parseInt(PlayerInfo.getPlayer())+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+categoryID;
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.companyDecisionHistory=data.data[0];
				},function(){
					console.log('read historyInfo fail');
				});
			}	

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
				ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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