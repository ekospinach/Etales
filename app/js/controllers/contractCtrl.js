define(['app'], function(app) {
	app.controller('contractCtrl',
		['$scope','$q','$rootScope','$http','$filter', function($scope,$q,$rootScope,$http,$filter) {

			var showView=function(contractUserID){
				var url="/contracts/"+$rootScope.rootSeminar+'/'+contractUserID;
				$http.get(url).success(function(data){
					$scope.allContracts=data;
					$scope.contractList=$scope.allContracts;
					if(contractUserID==0){
						$scope.shouldShow="block";
						filterUser($scope.producerID,$scope.retailerID);
					}else{
						$scope.shouldShow="none";
					}
				});
			}

			var filterUser=function(producerID,retailerID){
				$scope.allContracts=_.filter($scope.contractList,function(obj){
					return (obj.producerID==producerID&&obj.retailerID==retailerID);
				})
				//console.log($scope.allContracts);
			}

			$scope.openDetailModal=function(contract){
				$scope.detailModal=true;
				$scope.Detail=contract;
				var category="Elecssories";
				if(contract.producerID==contract.draftedByCompanyID){
					$scope.shouldBeEdit="inline";
					$scope.shouldBeView="none";
				}else{
					$scope.shouldBeEdit="none";
					$scope.shouldBeView="inline";					
				}
				var url="/contractDetails/"+contract.contractCode;
				$http.get(url).success(function(data){
					$scope.contractDetailList=data;
					showDetailModal(category);					
				});
			}

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
					/*if(location=="rural"){
						//if(item=="nc_VolumeDiscountRate"){
						//	value=detail.brand_ruralValue;
						//}else if(item=="nc_PerformanceBonusRate"){
						//	value=detail.rate_ruralValue;
						//}else if(item=="nc_PerformanceBonusAmount"){
						//	value=detail.amout_ruralValue;
						//}else{
							value=detail.brand_ruralValue;
						}
					}else{
						if(item=="nc_VolumeDiscountRate"){
							value=detail.brand_urbanValue;
						}else if(item=="nc_PerformanceBonusRate"){
							value=detail.rate_urbanValue;
						}else if(item=="nc_PerformanceBonusAmount"){
							value=detail.amout_urbanValue;
						}else{
							value=detail.brand_urbanValue;
						}
					}*/
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

			$scope.contractUserID=$rootScope.rootContractUserID;
			$scope.producerID=1;
			$scope.retailerID=1;
			$scope.showView=showView;
			$scope.showDetailModal=showDetailModal;
			$scope.loadModalDate=loadModalDate;
			$scope.filterUser=filterUser;
			showView($scope.contractUserID);
		}]
	)
});