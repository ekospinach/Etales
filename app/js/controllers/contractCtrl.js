define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter', function($scope,$q,$rootScope,$http,$filter) {

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
				$scope.Detail=contract;
				var category="Elecssories";
				if(contract.producerID==contract.draftedByCompanyID&&$rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==2&&contract.producerID==$rootScope.user.username.substring($rootScope.user.username.length-1)){
					$scope.shouldBeEdit="inline";
					$scope.shouldBeView="none";
				}else{
					$scope.shouldBeEdit="none";
					$scope.shouldBeView="inline";					
				}
				//获取数据->修改成读取producerDecision 列表
				// var url="/contractDetails/"+contract.contractCode;
				// $http.get(url).success(function(data){
				// 	$scope.contractDetailList=data;
				// 	showDetailModal(category);//显示数据			
				// });
				var count=0;
				var url='/producerBrands/'+contract.producerID+'/'+contract.period+'/'+contract.seminar;
				$http({method:'GET',url:url}).then(function(data){
					$scope.brandList=data.data;
					var details=new Array();
					var count=0;
					var negotiationItems=['nc_MinimumOrder','nc_VolumeDiscountRate','nc_PaymentDays','nc_SalesTargetVolume','nc_PerformanceBonusAmount','nc_PerformanceBonusRate','nc_OtherCompensation'];
					var userTypes=['P','R'];
					for(var i=0;i<$scope.brandList.length;i++){
						for(var j=0;j<userTypes.length;j++){
							for(var k=0;k<negotiationItems.length;k++){

								url="/contractDetail/"+contract.contractCode+'/'+userTypes[j]+'/'+negotiationItems[k]+'/'+$scope.brandList[i].brandName;
								$http({method:'GET',url:url}).then(function(data){
									if(data.data.length!=0){
										details.push(data.data[0]);
									}else{
										details.push(data.data);
									}
									$scope.details=details;
								},function(data){
									console.log('fail');
								}).then(function(){
									if($scope.details.length==$scope.brandList.length*14){
										//console.log($scope.details);
										count=0;
										for(var i=0;i<$scope.brandList.length;i++){
											for(var j=0;j<userTypes.length;j++){
												for(var k=0;k<negotiationItems.length;k++){
													if($scope.details[count].length==0){
														$scope.details.splice(count,1,{
															'contractCode':contract.contractCode,
															'userType':userTypes[j],
															'negotiationItem':negotiationItems[k],
															'relatedBrandName':$scope.brandList[i].brandName,
															'brandID':$scope.brandList[i].brandID,
															'useBrandDetails':true,
															'useVariantDetails':false,
															'displayValue':0,
															'brand_urbanValue' : 0,
															'brand_ruralValue' : 0,
															'variant_A_urbanValue' : 0,
															'variant_A_ruralValue' : 0,
															'variant_B_urbanValue' : 0,
															'variant_B_ruralValue' : 0,
															'variant_C_urbanValue' : 0,
															'variant_C_ruralValue' : 0,
															'isVerified' : false,
															'amount_or_rate' : true
														})
													}
													count++;
												}
											}
										}
										$scope.contractDetailList=$scope.details;
										$scope.detailModal=true;
										showDetailModal(category);
									}
								})
							}
						}
					}
				},function(data){
					console.log('fail');
				});
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

			var showDetailModal=function(category){
				$scope.allDetails=_.filter($scope.contractDetailList,function(obj){
					if(category=="Elecssories"){
						return (obj.relatedBrandName.substring(0,1)=="E");
					}else{
						return (obj.relatedBrandName.substring(0,1)=="H");
					}
				});
				var proDetailList=new Array();
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_MinimumOrder");
					});
				proDetailList[0]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_SalesTargetVolume");
					});
				proDetailList[1]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_PaymentDays");
					});
				proDetailList[2]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_OtherCompensation");
					});
				proDetailList[3]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_VolumeDiscountRate");
					});
				proDetailList[4]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_PerformanceBonusAmount");
					});
				proDetailList[5]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="P"&&obj.negotiationItem=="nc_PerformanceBonusRate");
					});
				proDetailList[6]=nc_detail;
				$scope.proDetailList=proDetailList;

				var retDetailList=new Array();
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_MinimumOrder");
					});
				retDetailList[0]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_SalesTargetVolume");
					});
				retDetailList[1]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_PaymentDays");
					});
				retDetailList[2]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_OtherCompensation");
					});
				retDetailList[3]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_VolumeDiscountRate");
					});
				retDetailList[4]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_PerformanceBonusAmount");
					});
				retDetailList[5]=nc_detail;
				var nc_detail=_.filter($scope.allDetails,function(obj){
						return (obj.userType=="R"&&obj.negotiationItem=="nc_PerformanceBonusRate");
					});
				retDetailList[6]=nc_detail;
				$scope.retDetailList=retDetailList;

				var newProductList=new Array();
				var url='/producerProducts/'+$scope.Detail.producerID+'/'+$scope.Detail.period+'/'+$scope.Detail.seminar+'/';
				if(category=="Elecssories"){
					url+='1';
				}else{
					url+='2';
				}
				$http.get(url).success(function(data){
					for(var j=0;j<data.length;j++){
						newProductList.push(data[j]);
					}
					//list all product by categoryID
					$scope.newProductList=newProductList;
				});
				//console.log(proDetailList);
			}

			$scope.closeDetailModal=function(){
				$scope.detailModal=false;
			}

			var compare=function(Detail){
				openDetailModal(Detail);
			}

			var loadModalDate=function(Detail){
				$scope.editDetail=Detail;
				$scope.shouldBeRate="none";
				$scope.shouldBeAmount="none";
				$scope.shouldBeNormal="";
				if(Detail.userType=="P"){
					if(Detail.negotiationItem=="nc_MinimumOrder"){
						$scope.shouldBeRate="";
						$scope.shouldBeAmount="none";
						$scope.shouldBeNormal="none";
						$scope.editDetailDisRate=_.find($scope.proDetailList[4],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
					}
					else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
						$scope.shouldBeRate="none";
						$scope.shouldBeAmount="";
						$scope.shouldBeNormal="none";
						$scope.editDetailBonusAmount=_.find($scope.proDetailList[5],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
						$scope.editDetailBonusRate=_.find($scope.proDetailList[6],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
						if(Detail.amount_or_rate){
							$scope.shouldBeBonusAmount="";
							$scope.shouldBeBonusRate="none";
						}else{
							$scope.shouldBeBonusAmount="none";
							$scope.shouldBeBonusRate="";							
						}
					}
				}else{
					if(Detail.negotiationItem=="nc_MinimumOrder"){
						$scope.shouldBeRate="";
						$scope.shouldBeAmount="none";
						$scope.shouldBeNormal="none";
						$scope.editDetailDisRate=_.find($scope.retDetailList[4],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
					}
					else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
						$scope.shouldBeRate="none";
						$scope.shouldBeAmount="";
						$scope.shouldBeNormal="none";
						$scope.editDetailBonusAmount=_.find($scope.retDetailList[5],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
						$scope.editDetailBonusRate=_.find($scope.retDetailList[6],function(obj){
							return (obj.relatedBrandName==Detail.relatedBrandName&&obj.relatedBrandID==Detail.relatedBrandID);
						});
						if(Detail.amount_or_rate){
							$scope.shouldBeBonusAmount="";
							$scope.shouldBeBonusRate="none";
						}else{
							$scope.shouldBeBonusAmount="none";
							$scope.shouldBeBonusRate="";							
						}
					}					
				}
				if(Detail.useBrandDetails){
					$scope.shouldShowBrand="block";
					$scope.shouldShowVariant="none";
				}
				else{
					$scope.shouldShowBrand="none";
					$scope.shouldShowVariant="block";
				}
				//find the product of brand
				$scope.editProductList=_.filter($scope.newProductList,function(obj){
					return (obj.brandName==Detail.relatedBrandName);
				});
				for(i=0;i<$scope.editProductList.length;i++){
					$scope.editProductList[i].contractCode=Detail.contractCode;
					$scope.editProductList[i].userType=Detail.userType;
					$scope.editProductList[i].negotiationItem=Detail.negotiationItem;
					$scope.editProductList[i].relatedBrandName=Detail.relatedBrandName;
					$scope.editProductList[i].relatedBrandID=Detail.relatedBrandID;
					if(i==0){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=Detail.variant_A_urbanValue;
						$scope.editProductList[i].ruralValue=Detail.variant_A_ruralValue;
						if(Detail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_A_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_A_ruralValue;
						}else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_A_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_A_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_A_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_A_ruralValue;
						}
					}
					if(i==1){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=Detail.variant_B_urbanValue;
						$scope.editProductList[i].ruralValue=Detail.variant_B_ruralValue;
						if(Detail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_B_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_B_ruralValue;
						}else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_B_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_B_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_B_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_B_ruralValue;
						}
					}
					if(i==2){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=Detail.variant_C_urbanValue;
						$scope.editProductList[i].ruralValue=Detail.variant_C_ruralValue;
						if(Detail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_C_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_C_ruralValue;
						}else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_C_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_C_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_C_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_C_ruralValue;
						}
					}
				}
			}

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

			$scope.openEditModal=function(Detail){
				$scope.editModal=true;
				loadModalDate(Detail);
			}

			$scope.setShowDetailType=function(type,style){
				if(type=="Brand"){
					$scope.shouldShowBrand="";
					$scope.shouldShowVariant="none";
				}
				if(type=="Variant"){
					$scope.shouldShowBrand="none";
					$scope.shouldShowVariant="";
				}
			}

			$scope.setShowBonusType=function(type){
				if(type=="Amout"){
					$scope.shouldBeBonusAmount="";
					$scope.shouldBeBonusRate="none";
				}
				else{
					$scope.shouldBeBonusAmount="none";
					$scope.shouldBeBonusRate="";				
				}
			}

			$scope.closeEditModal=function(){
				$scope.editModal=false;
				//$scope.detailModal=true;
			}

			$scope.openViewModal=function(Detail){
				$scope.viewModal=true;
				loadModalDate(Detail);
			}

			$scope.closeViewModal=function(){
				$scope.viewModal=false;
			}

			$scope.updateContractDetails=function(detail,item,location,index,type){
				console.log(detail);
				var value;
				if(type=="brand"){
					if(location=="rural"){
						value=detail.brand_ruralValue;
					}else{
						value=detail.brand_urbanValue;
					}
				}
				else{
					if(location=="rural"){
						if(item=="nc_VolumeDiscountRate"){
							value=detail.dis_ruralValue;
						}else if(item=="nc_PerformanceBonusRate"){
							value=detail.rate_ruralValue;
						}else if(item=="nc_PerformanceBonusAmount"){
							value=detail.amout_ruralValue;
						}else{
							value=detail.ruralValue;
						}
					}else{
						if(item=="nc_VolumeDiscountRate"){
							value=detail.dis_urbanValue;
						}else if(item=="nc_PerformanceBonusRate"){
							value=detail.rate_urbanValue;
						}else if(item=="nc_PerformanceBonusAmount"){
							value=detail.amout_urbanValue;
						}else{
							value=detail.urbanValue;
						}
					}
					//value=detail.brand_ruralValue;
				}
				var queryCondition={
					contractCode:detail.contractCode,
					negotiationItem:item,
					userType:detail.userType,
					relatedBrandName:detail.relatedBrandName,
					relatedBrandID:detail.relatedBrandID,
					type:type,
					location:location,
					index:index,
					value:value
				};
				$http.post('/updateContractDetails',queryCondition).success(function(data){
					console.log(data);
				});
			}

			$scope.detailOpts = {
			    backdropFade: true,
			    dialogFade:true
			};

			$scope.eidtOpts = {
			    backdropFade: true,
			    dialogFade:true
			};

			$scope.viewOpts = {
			    backdropFade: true,
			    dialogFade:true
			};

			//$scope.contractUserID=$rootScope.rootContractUserID;
			if($rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==2){
				$scope.contractUserID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				$scope.producerID=$scope.contractUserID;
			}else if($rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==4){
				$scope.contractUserID=parseInt($rootScope.user.username.substring($rootScope.user.username.length-1))+4;
				$scope.retailerID=parseInt($rootScope.user.username.substring($rootScope.user.username.length-1));
			}
			//console.log($scope.contractUserID);

			$scope.showView=showView;
			$scope.showDetailModal=showDetailModal;
			$scope.loadModalDate=loadModalDate;
			$scope.filterUser=filterUser;
			$scope.closeInsertModal=closeInsertModal;
			$scope.showbubleMsg=showbubleMsg;
			$scope.compare=compare;
			$scope.openDetailModal=openDetailModal;
			showView($scope.contractUserID);
		}]
	)
});