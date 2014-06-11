define(['app'], function(app) {
		app.controller('producerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase','Label','PlayerInfo','SeminarInfo','PeriodInfo', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase,Label,PlayerInfo,SeminarInfo,PeriodInfo) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			$rootScope.decisionActive="active";
			$scope.language=Label.getCurrentLanguage();
			$scope.producerID=parseInt(PlayerInfo.getPlayer());
			$scope.period=PeriodInfo.getCurrentPeriod();
			$scope.category='Elecssories';
			$scope.isCollapsed=true;

			ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
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
					$scope.getPrevious=getPrevious;
					$scope.getNext=getNext;
					//check data
					$scope.checkData=checkData;

					if($rootScope.user.role==8){
						//Facilitator
						$scope.facilitatorShow=true;
						var url="/currentPeriod/"+SeminarInfo.getSelectedSeminar().seminarCode;
						$http({
							method:'GET',
							url:url
						}).then(function(data){
							if(PeriodInfo.getCurrentPeriod()<data.data.currentPeriod){
								$scope.nextBtn=true;
							}else{
								$scope.nextBtn=false;
							}
							if(PeriodInfo.getCurrentPeriod()<=data.data.currentPeriod&&PeriodInfo.getCurrentPeriod()>=2){
								$scope.previousBtn=true;
							}else{
								$scope.previousBtn=false;
							}
						})
					}else{
						$scope.facilitatorShow=false;
					}

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
	      		var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			//abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			avaiableMax=data.data.budgetAvailable;
	      			if(PeriodInfo.getCurrentPeriod()<=1){
	      				abMax=data.data.budgetAvailable;
	      			}else{
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}

					eAcMax=data.data.productionCapacity[0];
					hAcMax=data.data.productionCapacity[1];
					url="/producerExpend/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/brandName/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			url="/productionResult/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+fakeName+'/varName';
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					$scope.eSurplusProduction=eAcMax-data.data.result;
					$scope.ePercentageProduction=(eAcMax-data.data.result)/eAcMax*100;
					fakeName="HName";
	      			url="/productionResult/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/'+parseInt(PlayerInfo.getPlayer())+'/'+fakeName+'/varName';
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
				var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/P/'+parseInt(PlayerInfo.getPlayer());
				$http({method: 'GET', url: url})
				.then(function(data){
					$scope.companyHistory=data.data;
					url="/producerCompanyDecision/"+parseInt(PlayerInfo.getPlayer())+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+categoryID;
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.companyDecisionHistory=data.data[0];
				},function(){
					console.log('read historyInfo fail');
				});
			}	

			var getPrevious=function(){
				ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getPreviousPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
					$scope.pageBase = base;	
				}).then(function(){
					return promiseStep1();
				}), function(reason){
					console.log('from ctr: ' + reason);
				}, function(update){
					console.log('from ctr: ' + update);
				};
			}

			var getNext=function(){
				ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getNextPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
					$scope.pageBase = base;	
				}).then(function(){
					return promiseStep1();
				}), function(reason){
					console.log('from ctr: ' + reason);
				}, function(update){
					console.log('from ctr: ' + update);
				};
			}

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
				ProducerDecisionBase.reload({producerID:parseInt(PlayerInfo.getPlayer()),period:PeriodInfo.getCurrentPeriod(),seminar:SeminarInfo.getSelectedSeminar().seminarCode}).then(function(base){
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