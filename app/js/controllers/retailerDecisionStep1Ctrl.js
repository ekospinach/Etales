define(['app'], function(app) {
		app.controller('retailerDecisionStep1Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
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
					$scope.checkBudget=checkBudget;
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
				var d=$q.defer();
				$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
				var categoryID=0,count=0,result=0,expend=0;
				var labelLanguages={},infoLanguages={};
				var fakeName="EName",max=100;
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/R/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			$scope.abMax=abMax;
	      		},function(data){
					console.log('read companyHistory fail');
	      		}).then(function(){
	      			url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/location/1';
	      			$http({
	      				method:'GET',
	      				url:url,
	      			}).then(function(data){
	      				expend=data.data.result;
	      				$scope.surplusExpend=abMax-expend;
	      				$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			},function(data){
	      				console.log('read retailerShelfSpace fail');
	      			}).then(function(){
	      				url="/retailerShelfSpace/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/0/brandName/varName';
	      				$http({
	      					method:'GET',
	      					url:url
	      				}).then(function(data){
	      					$scope.surplusShelf=new Array();
	      					$scope.percentageShelf=new Array();
	      					$scope.surplusShelf[0]=new Array();
	      					$scope.surplusShelf[1]=new Array();
	      					$scope.percentageShelf[0]=new Array();
	      					$scope.percentageShelf[1]=new Array();
	      					$scope.surplusShelf[0][0]=data.data.result[0][0];
	      					$scope.surplusShelf[0][1]=data.data.result[0][1];
	      					$scope.surplusShelf[1][0]=data.data.result[1][0];
	      					$scope.surplusShelf[1][1]=data.data.result[1][1];
	      					$scope.percentageShelf[0][0]=(100-$scope.surplusShelf[0][0]);
	      					$scope.percentageShelf[0][1]=(100-$scope.surplusShelf[0][1]);
	      					$scope.percentageShelf[1][0]=(100-$scope.surplusShelf[1][0]);
	      					$scope.percentageShelf[1][1]=(100-$scope.surplusShelf[1][1]);	
	      					$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
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
							result=1;
							$scope.infoLanguages=infoLanguages;
							$scope.labelLanguages=labelLanguages;
							return result;      					
	      				},function(data){
	      					console.log('read retailerShelfSpace fail');
	      				});
	      			});
	      		});		
	      		return d.promise;		
			}

			//check
			var checkBudget=function(location,additionalIdx,value){
				var d=$q.defer();
				var url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/0/'+location+'/'+additionalIdx;
	      		$http({
	      			method:'GET',
	      			url:url,
	     		}).then(function(data){
	      			expend=data.data.result;
	      			if(expend+parseInt(value)>$scope.abMax||parseInt(value)<0){
	      				d.resolve('Input range:0~'+($scope.abMax-expend));
	      			}else{
	      				d.resolve();
	    			}
	      		},function(data){
	      			console.log('read retailerShelfSpace fail');
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