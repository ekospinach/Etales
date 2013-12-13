define(['app'], function(app) {
		app.controller('retailerDecisionStep2Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase','Label', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.packs = [{
				value: 1, text: 'SL_BASE'
			},{
				value: 2, text: 'SL_FAIR'
			},{
				value: 3, text: 'SL_MEDIUM'
			},{
				value: 4, text: 'SL_ENHANCED'
			},{
				value: 5, text: 'SL_PREMIUM'
			}]; 
			$scope.language=Label.getCurrentLanguage(),
			$scope.retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
			$scope.period=$rootScope.currentPeriod,
			$scope.category='Elecssories',
			$scope.isCollapsed=true;

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
					$scope.updateMarketDecision=updateMarketDecision;
					$scope.getMarketMoreInfo=getMarketMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.selectPacks=selectPacks;
					//check
					$scope.checkSurface=checkSurface;
					$scope.checkBudget=checkBudget;
				showView($scope.retailerID,$scope.period,$scope.language);
				return delay.promise;
			}

			var selectPacks = function(marketID) {
				//console.log('testSelectPacks');
				var selected,postion=-1;
				for(var i=0;i<$scope.markets.length;i++){
					if($scope.markets[i].marketID==marketID){
						selected = $filter('filter')($scope.packs, {value: $scope.markets[i].serviceLevel});
						postion=i;
						break;
					}
				}
				if(postion!=-1){
					return ($scope.markets[postion].serviceLevel && selected.length) ? selected[0].text : 'Not set'; 
				}
				else{
					return 'Not set';	
				}
			};

			/*Load Page*/
			var showView=function(retailerID,period,language){
				var d=$q.defer();
				$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
				var categoryID=0,count=0,result=0,expend=0;
				var fakeName="EName",max=100;
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/R/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			$scope.abMax=abMax;
	      			url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      		// 	url="/retailerShelfSpace/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/0/brandName/varName';
	      		// 	return $http({
	      		// 		method:'GET',
	      		// 		url:url
	      		// 	});
	      		// }).then(function(data){
	      		// 			$scope.surplusShelf=new Array();
	      		// 			$scope.percentageShelf=new Array();
	      		// 			$scope.surplusShelf[0]=new Array();
	      		// 			$scope.surplusShelf[1]=new Array();
	      		// 			$scope.percentageShelf[0]=new Array();
	      		// 			$scope.percentageShelf[1]=new Array();
	      		// 			$scope.surplusShelf[0][0]=data.data.result[0][0];
	      		// 			$scope.surplusShelf[0][1]=data.data.result[0][1];
	      		// 			$scope.surplusShelf[1][0]=data.data.result[1][0];
	      		// 			$scope.surplusShelf[1][1]=data.data.result[1][1];
	      		// 			$scope.percentageShelf[0][0]=(100-$scope.surplusShelf[0][0]);
	      		// 			$scope.percentageShelf[0][1]=(100-$scope.surplusShelf[0][1]);
	      		// 			$scope.percentageShelf[1][0]=(100-$scope.surplusShelf[1][0]);
	      		// 			$scope.percentageShelf[1][1]=(100-$scope.surplusShelf[1][1]);	
	      					$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
							var markets=new Array();
							// if(language=="English"){
							// 	for(var i=0;i<$scope.multilingual.length;i++){
							// 		labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
							// 		infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
							// 	}
							// }
							// else if(language=="Chinese"){
							// 	for(var i=0;i<$scope.multilingual.length;i++){
							// 		labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelCHN;
							// 		infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoCHN;						
							// 	}
							// }
							for(var i=0;i<$scope.pageBase.retMarketDecision.length;i++){
				      			if($scope.pageBase.retMarketDecision[i].marketID==1){
				      				$scope.pageBase.retMarketDecision[i].marketName="Urban";			
				      			}else if($scope.pageBase.retMarketDecision[i].marketID==2){
				      				$scope.pageBase.retMarketDecision[i].marketName="Rural";
				      			}
				      			if($scope.pageBase.retMarketDecision[i].serviceLevel=="SL_BASE"){
				      				$scope.pageBase.retMarketDecision[i].serviceLevel=1;
				      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="SL_FAIR"){
				      				$scope.pageBase.retMarketDecision[i].serviceLevel=2;
				      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="SL_MEDIUM"){
				      				$scope.pageBase.retMarketDecision[i].serviceLevel=3;
				      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="SL_ENHANCED"){
				      				$scope.pageBase.retMarketDecision[i].serviceLevel=4;
				      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="SL_PREMIUM"){
				      				$scope.pageBase.retMarketDecision[i].serviceLevel=5;
				      			}
				      			if($scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]>=0&&$scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]<=1){
				      				$scope.pageBase.retMarketDecision[i].categorySurfaceShare[0]*=100;
				      			}
				      			if($scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]>=0&&$scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]<=1){
				      				$scope.pageBase.retMarketDecision[i].categorySurfaceShare[1]*=100;
				      			}				      			
				      			markets.push($scope.pageBase.retMarketDecision[i]);
				      		}
				      		result=1;
				      		$scope.markets=markets;
	      		},function(){
	      			console.log('showView fail');
	      		});	
	      		return d.promise;
			}

			//check

			var checkSurface=function(value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve('Input a number');
				}
				if(parseInt(value)>65||parseInt(value)<35){
					d.resolve('Input range:35~65');
				}else{
					d.resolve();
				}
				return d.promise;
			}

			var checkBudget=function(marketID,location,postion,additionalIdx,index,value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve('Input a number');
				}
				var url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+marketID+'/'+location+'/'+additionalIdx;
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

			var updateMarketDecision=function(marketID,location,postion,additionalIdx,index){
				if(location=="localAdvertising"){
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,additionalIdx,$scope.markets[index][location][additionalIdx]);					
				}else if(location=="categorySurfaceShare"){
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,additionalIdx,($scope.markets[index][location][additionalIdx])/100);					
				}else{
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,postion,$scope.markets[index][location]);										
				}
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMarketMoreInfo=function(marketID){
				switch(marketID){
					case 1: $scope.marketName = 'Urban'; break;
					case 2: $scope.marketName = 'Rural'; break;				
				}
				$scope.isCollapsed=false;
				var url="/retailerDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar;
				$http({method:'GET',url:url})
				.success(function(data){
					$scope.retailerDecisionHistory=_.filter(data.retMarketDecision,function(obj){
						return (obj.marketID==marketID);
					});
					console.log($scope.retailerDecisionHistory);
				})
				.error(function(data){
					console.log('read retailerDecisionHistory fail');
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