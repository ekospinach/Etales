define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter', function($scope,$q,$rootScope,$http,$filter) {
			console.log("Producer1");

			var showView=function(contractUserID){
				var url="/contract/"+$rootScope.rootSeminar+'/'+contractUserID;
				$http.get(url).success(function(data){
					$scope.allContracts=data;
					$scope.ContractLists=$scope.allContracts;
					if(contractUserID==0){
						$scope.shouldShow="block";
						filterUser($scope.producerID,$scope.retailerID);
					}else{
						$scope.shouldShow="none";
					}
				});
			}

			var filterUser=function(producerID,retailerID){
				$scope.allContracts=_.filter($scope.ContractLists,function(obj){
					return (obj.producerID==producerID&&obj.retailerID==retailerID);
				})
				console.log($scope.allContracts);
			}

			$scope.contractUserID=$rootScope.rootContractUserID;
			$scope.producerID=1;
			$scope.retailerID=1;
			$scope.showView=showView;
			$scope.filterUser=filterUser;
			showView($scope.contractUserID);
		}]
	)
});