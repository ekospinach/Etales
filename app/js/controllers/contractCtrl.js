define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter','$location','ContractInfo','Label', function($scope,$q,$rootScope,$http,$filter,$location,ContractInfo,Label) {

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
						//$scope.producerShow="block";
						//$scope.retailerShow="block";
						//filterUser($scope.producerID,$scope.retailerID);
					}else if(contractUserID<5){
						$scope.producerShow=true;
						$scope.retailerShow=false;

					}else{
						$scope.producerShow=false;
						$scope.retailerShow=true;
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
		 				$scope.insertBubleClassName = 'alert alert-danger'; 
		 				$scope.insertBubleTitle = 'Error!';
		 				$scope.insertMessage=content;
		 				break;
		 			case 2: 
		 				$scope.insertBubleClassName = 'alert alert-success'; 
		 				$scope.insertBubleTitle = 'Success!';
		 				$scope.insertMessage=content;
		 				break;
		 			case 3:
		 				$scope.insertBubleClassName = 'alert alert-block'; 
		 				$scope.insertBubleTitle = 'Warning!';
		 				$scope.insertMessage=content;
		 				break;
		 			case 4: 
		 				$scope.duplicateBubleClassName = 'alert alert-danger'; 
		 				$scope.duplicateBubleTitle = 'Error!';
		 				$scope.duplicateMessage=content;
		 				break;
		 			case 5: 
		 				$scope.duplicateBubleClassName = 'alert alert-success'; 
		 				$scope.duplicateBubleTitle = 'Success!';
		 				$scope.duplicateMessage=content;
		 				break;
		 			case 6:
		 				$scope.duplicateBubleClassName = 'alert alert-block'; 
		 				$scope.duplicateBubleTitle = 'Warning!';
		 				$scope.duplicateMessage=content;
		 				break;	 			
		 			default:
		 			 $scope.insertBubleClassName = 'alert'; 
		 			 $scope.insertBubleClassName = 'alert';
		 		}
		 		console.log('infoBuble.show');
		 		$scope.infoBuble = true;
		 	};


			$scope.openInsertModal=function(){
				$scope.newRetailerID=1;
				//$scope.contractCodeLastName="_"+$rootScope.user.seminar+'_'+$rootScope.rootPeriod;
				$scope.insertModal=true;
				//console.log($scope.contractCodeLastName);
			}

			var closeInsertModal=function(){
				$scope.insertModal=false;
			}

			$scope.addNewContract=function(){
				if($scope.newContractCode.length>0&&$scope.newContractCode.length<10){
					var data={
						'contractCode':$scope.newContractCode+'_'+$rootScope.user.seminar+'_'+$rootScope.currentPeriod,
						'seminar':$rootScope.user.seminar,
						'period':$rootScope.currentPeriod,
						'draftedByCompanyID':$rootScope.user.username.substring($rootScope.user.username.length-1),
						'producerID':$rootScope.user.username.substring($rootScope.user.username.length-1),
						'retailerID':$scope.newRetailerID
					}
					$http({method: 'POST', url: '/addContract',data:data}).success(function(data){
						//console.log(data);
						$scope.allContracts.push(data);
						showbubleMsg('Insert success',2);
						closeInsertModal();
					}).error(function(err){
						showbubleMsg('Insert fail, ' + err,1);
					})
				}else{
					showbubleMsg('Insert fail',1);
				}
				
				//$http
			}

			$scope.openDuplicateModal=function(contract){
				$scope.contract=contract;
				if(contract.retailerID==1){
					$scope.dupRetailerID=2;
				}else{
					$scope.dupRetailerID=1;
				}
				$scope.duplicateModal=true;
			}

			var closeDuplicateModal=function(){
				$scope.duplicateModal=false;
			}

			$scope.duplicate = function(contract){
				var retailerID=0;
				if(contract.retailerID==1){
					retailerID=2;
				}else{
					retailerID=1;
				}
				if($scope.duplicateContractCode.length>0&&$scope.duplicateContractCode.length<10){
					var data={
						'contractCode':$scope.duplicateContractCode+'_'+$rootScope.user.seminar+'_'+$rootScope.currentPeriod,
						'seminar':$rootScope.user.seminar,
						'period':$rootScope.currentPeriod,
						'draftedByCompanyID':$rootScope.user.username.substring($rootScope.user.username.length-1),
						'producerID':$rootScope.user.username.substring($rootScope.user.username.length-1),
						'retailerID':retailerID,
						'duplicateCode':contract.contractCode
					}
					$http({method: 'POST', url: '/duplicateContract',data:data}).success(function(data){
						$scope.allContracts.push(data);
						showbubleMsg('Insert success',5);
						closeDuplicateModal();
					}).error(function(err){
						showbubleMsg('Insert fail, ' + err,4);
					})
				}else{
					showbubleMsg('Inser fail',4);
				}

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
			$scope.language=Label.getCurrentLanguage();
			$scope.filterUser=filterUser;
			$scope.closeInsertModal=closeInsertModal;
			$scope.showbubleMsg=showbubleMsg;
			$scope.openDetailModal=openDetailModal;
			$scope.closeDuplicateModal=closeDuplicateModal;
			showView($scope.contractUserID);
		}]
	)
});