define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter','$location','ContractInfo', function($scope,$q,$rootScope,$http,$filter,$location,ContractInfo) {

			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			var showView=function(contractUserID){
				var url="/contracts/"+$rootScope.user.seminar+'/'+contractUserID;
				$http.get(url).success(function(data){
					$scope.allContracts=data;
					$scope.contractList=$scope.allContracts;
					if(contractUserID==0){
						$scope.producerShow="block";
						$scope.retailerShow="block";
						//filterUser($scope.producerID,$scope.retailerID);
					}else if(contractUserID<5){
						$scope.producerShow="block";
						$scope.retailerShow="none";
					}else{
						$scope.producerShow="none";
						$scope.retailerShow="block";
					}
				});
			}

			var filterUser=function(producerID,retailerID){
				$scope.allContracts=_.filter($scope.contractList,function(obj){
					return (obj.producerID==producerID&&obj.retailerID==retailerID);
				})
				//console.log($scope.allContracts);
			}

			var openDetailModal=function(contract){
				//ContractInfo.setSelectedContract(JSON.stringify(contract));
				ContractInfo.setSelectedContract(contract);
				$location.path('/contractDetails');
			}

			var showbubleMsg = function(content, status){
		 		$scope.bubleMsg = ' ' + content;
		 		switch(status){
		 			case 1: 
		 				$scope.bubleClassName = 'alert alert-danger'; 
		 				$scope.bubleTitle = 'Error!';
		 				break;
		 			case 2: 
		 				$scope.bubleClassName = 'alert alert-success'; 
		 				$scope.bubleTitle = 'Success!';
		 				break;
		 			case 3:
		 				$scope.bubleClassName = 'alert alert-block'; 
		 				$scope.bubleTitle = 'Warning!';
		 				break;	 			
		 			default:
		 			 $scope.bubleClassName = 'alert'; 
		 		}
		 		console.log('infoBuble.show');
		 		$scope.infoBuble = true;
		 	};


			$scope.openInsertModal=function(){
				$scope.contractCodeLastName="_"+$rootScope.user.seminar+'_'+$rootScope.rootPeriod;
				$scope.insertModal=true;
				//console.log($scope.contractCodeLastName);
			}

			var closeInsertModal=function(){
				$scope.insertModal=false;
			}

			$scope.addNewContract=function(){
				var data={
					'contractCode':$scope.newContractCode,
					'seminar':$rootScope.user.seminar,
					'period':$rootScope.currentPeriod,
					'draftedByCompanyID':$rootScope.user.username.substring($rootScope.user.username.length-1),
					'producerID':$rootScope.user.username.substring($rootScope.user.username.length-1),
					'retailerID':$scope.newRetailerID
				}
				$http({method: 'POST', url: '/addContract',data:data}).success(function(data){
					//console.log(data);
					$scope.allContracts.push(data);
					showbubleMsg('Insert success'+data,2);
					closeInsertModal();
				}).error(function(err){
					showbubleMsg('Insert failure, ' + err,1);
					
				})
				//$http
			}

			$scope.duplicate = function(contract){
				
			}

			//$scope.contractUserID=$rootScope.rootContractUserID;
			if($rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==2){
				$scope.contractUserID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				$scope.producerID=$scope.contractUserID;
			}else if($rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==4){
				$scope.contractUserID=parseInt($rootScope.user.username.substring($rootScope.user.username.length-1))+4;
				$scope.retailerID=parseInt($rootScope.user.username.substring($rootScope.user.username.length-1));
			}
			//console.log($scope.contractUserID);

			$scope.filterUser=filterUser;
			$scope.closeInsertModal=closeInsertModal;
			$scope.showbubleMsg=showbubleMsg;
			$scope.openDetailModal=openDetailModal;
			showView($scope.contractUserID);
		}]
	)
});