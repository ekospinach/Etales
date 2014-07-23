define(['app','socketIO','routingConfig'], function(app) {
	app.controller('retailerDecisionCtrl',['$scope', '$http', 'RetailerDecisionBase','$rootScope','Auth','$anchorScroll','$q','PlayerInfo','SeminarInfo','PeriodInfo','Label','RoleInfo','notify', 
                                   function($scope, $http, RetailerDecisionBase,$rootScope,Auth,$anchorScroll,$q,PlayerInfo,SeminarInfo,PeriodInfo,Label,RoleInfo,notify) {
			
		    $scope.$watch('isPageLoading', function(newValue, oldValue){
		    	$scope.isPageLoading = newValue;	    	
		    })

		    var switching=function(type){
		    	$scope.isNegotiationChange=$scope.NegotiationAgreements=$scope.Marketing=$scope.PrivateLabelPortfolioManagement=$scope.StoreManagement=$scope.MarketResearchOrders=$scope.isNegotiation=false;
		    	switch(type){
		    		case 'showNegotiationAgreements':$scope.NegotiationAgreements=true;$scope.isNegotiation=true;break;
		    		case 'showMarketing':$scope.Marketing=true;break;
		    		case 'showPrivateLabelPortfolioManagement':$scope.PrivateLabelPortfolioManagement=true;break;
		    		case 'showStoreManagement':$scope.StoreManagement=true;break;
		    		case 'showMarketResearchOrders':$scope.MarketResearchOrders=true;break;
		    	}
		    }

		    var showView=function(){
                var abMax=0,expend=0,reportExpend=0;
                var url="/companyHistoryInfo/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod()-1)+'/R/'+parseInt(PlayerInfo.getPlayer());
                $http({
                    method:'GET',
                    url:url
                }).then(function(data){
                    abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
                    $scope.abMax=abMax.toFixed(2);
                    url="/retailerExpend/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/location/1';
                    return $http({
                        method:'GET',
                        url:url
                    });
                }).then(function(data){
                    expend=data.data.result;
                    url='/getPlayerReportOrderExpend/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+PeriodInfo.getCurrentPeriod()+'/R/'+PlayerInfo.getPlayer();
                    return $http({
                        method:'GET',
                        url:url
                    });
                }).then(function(data){
                    reportExpend=data.data.result;
                    $scope.surplusExpend=(abMax-expend-reportExpend).toFixed(2);
                    //$scope.percentageExpend=(abMax-expend)/abMax*100;
                    url="/retailerShelfSpace/"+SeminarInfo.getSelectedSeminar().seminarCode+'/'+(PeriodInfo.getCurrentPeriod())+'/'+parseInt(PlayerInfo.getPlayer())+'/-1/0/brandName/varName';
                    return $http({
                        method:'GET',
                        url:url
                    });
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
                    $scope.percentageShelf[0][0]=(1-$scope.surplusShelf[0][0])*100;
                    $scope.percentageShelf[0][1]=(1-$scope.surplusShelf[0][1])*100;
                    $scope.percentageShelf[1][0]=(1-$scope.surplusShelf[1][0])*100;
                    $scope.percentageShelf[1][1]=(1-$scope.surplusShelf[1][1])*100;
                    // $scope.showSurplusShelf=$scope.percentageShelf[market-1][category-1];
                    // $scope.showPercentageShelf=$scope.percentageShelf[market-1][category-1];
                    url = '/checkRetailerDecision/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + PeriodInfo.getCurrentPeriod() + '/' + parseInt(PlayerInfo.getPlayer());
                    return $http({
                        method: 'GET',
                        url: url
                    });
                }).then(function(data){
                    if (data.data == "isReady") {
                        $scope.isRetailerDecisionReady = true;
                    } else {
                        $scope.isRetailerDecisionReady = false;
                    }
                })
		    }

	    	var showNegotiationAgreements=function(){
	    		switching('showNegotiationAgreements');
	    	}

	    	$scope.showMarketing=function(){
	    		switching('showMarketing');
	    	}

	    	$scope.showPrivateLabelPortfolioManagement=function(){
	    		switching('showPrivateLabelPortfolioManagement');
	    	}

	    	$scope.showStoreManagement=function(){
	    		switching('showStoreManagement');
	    	}

	    	$scope.showMarketResearchOrders=function(){
	    		switching('showMarketResearchOrders');
	    	}

	    	$scope.switching=switching;
	    	$scope.showNegotiationAgreements=showNegotiationAgreements;
	    	$scope.showView=showView;

            $scope.myModel = "hello";
            $scope.chartSeries = [{
                "name": "Some data",
                "size": '80%',
                "innerSize": '60%',
                "data": [
                    ['Firefox', 45.0],
                    ['IE', 26.8], 
                    ['Chrome',12.8],
                    ['Safari', 8.5],
                    ['Opera', 6.2],
                    ['Others', 0.7]
                ]
            }];  

	    	showView();
	    	showNegotiationAgreements();

            //handle Retailer Decision module push notification messages
            $scope.$on('retailerDecisionBaseChangedFromServer', function(event, data, newBase) {  
                showView();
                notify('Decision has been saved, Retailer ' + data.retailerID  + ' Period ' + data.period + '.');
            });

            $scope.$on('retailerDecisionReloadError', function(event, data, newBase) {  
                showView();
                notify('Decision reload Error occur, Retailer ' + data.retailerID  + ' Period ' + data.period + '.');
            });

            $scope.$on('retailerMarketResearchOrdersChanged', function(event, data) {  
                showView();
                notify('Decision has been saved, Retailer ' + data.retailerID  + ' Period ' + data.period + '.');
            });            

            $scope.$on('retailerDecisionLocked', function(event, data) {  
                showView();
                notify('Time is up, Lock Decision. Retailer ' + data.roleID  + ' Period ' + data.period + '.');
            });   


	
            $scope.selectedPlayer = PlayerInfo.getPlayer();
            $scope.selectedPeriod = PeriodInfo.getCurrentPeriod();    
	}]);

});
