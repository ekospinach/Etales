define(['app'], function(app) {
	app.controller('contractDetailsCtrl',
		['$scope','$q','$rootScope','$http','$filter','ContractInfo','Label', function($scope,$q,$rootScope,$http,$filter, ContractInfo,Label) {
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			var generateRequestUrls = function(brandList, contract){
				var contractDetailsRequestUrls = new Array;
				var negotiationItems=ContractInfo.getActivedNegotiationItem();
				var userTypes=['P','R'];					
				for(var i=0;i<brandList.length;i++){
					for(var j=0;j<userTypes.length;j++){
						for(var k=0;k<negotiationItems.length;k++){
							url="/contractDetail/"+contract.contractCode+'/'+userTypes[j]+'/'+negotiationItems[k]+'/'+ brandList[i].brandName;
							contractDetailsRequestUrls.push(url);															
						}
					}
				}
				return contractDetailsRequestUrls;				
			}

			var refreshBrandAndContractDetails=function(){
				$scope.refreshingProcess = true;
				$scope.contractInfo = ContractInfo.getSelectedContract();
				if(!$scope.contractInfo){
					console.log('there is no contract selected');
					return;
				}

				//decide Edit mode depends on contract's drafterd user
				if($scope.contractInfo.producerID==$scope.contractInfo.draftedByCompanyID
					&&$rootScope.user.username.substring($rootScope.user.username.length-3,$rootScope.user.username.length-2)==2
					&&$scope.contractInfo.producerID==$rootScope.user.username.substring($rootScope.user.username.length-1)){
					//current user role is producer, drafter, active producer editable mode
					$scope.producerEditable=true;
					$scope.retailerEditable=false;
				}else{
					//current user role is retailer, active retailer editable
					$scope.producerEditable=false;
					$scope.retailerEditable=true;					
				}

				//get current brand name list of this $scope.contractInfo, depends on producerID/seminar/period
				var url='/producerBrands/'+$scope.contractInfo.producerID+'/'+$scope.contractInfo.period+'/'+$scope.contractInfo.seminar;
				//console.log('url:' + url);
				$http({method:'GET',url:url}).then(function(data){
					$scope.brandList=data.data;

					var details = [];
					//get contract details from server, fill into and deal with array "details" 
					(function multipleRequestShooter(urls, idx){
						$http({method:'GET', url:urls[idx]}).then(function(data){

							//console.log('get data:' + data.data[0]);
							if(data.data.length!=0){ details.push(data.data[0]);}
							else{ details.push(data.data); }
						}, function(data){
							//console.log('get contractDetails fail callback');
						}).finally(function(){
							if(idx!=urls.length-1) { 
								idx++;
								multipleRequestShooter(urls, idx);							
							}else{
								$scope.details = details;
								//deal with blank details document, fill some default value into it
								var negotiationItems = ContractInfo.getActivedNegotiationItem();
								var userTypes=['P','R'];					
								if($scope.details.length==$scope.brandList.length*14){
									count=0;
									for(var i=0;i<$scope.brandList.length;i++){
										for(var j=0;j<userTypes.length;j++){
											for(var k=0;k<negotiationItems.length;k++){
												if($scope.details[count].length==0){
													$scope.details.splice(count,1,{
														'contractCode':$scope.contractInfo.contractCode,
														'userType':userTypes[j],
														'negotiationItem':negotiationItems[k],
														'relatedBrandName':$scope.brandList[i].brandName,
														'relatedBrandID':$scope.brandList[i].brandID,
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
									};
									//console.log('load details:' + $scope.details);									
									renderContractDetailsByCategory('Elecssories');
								}																									
							}
						});
					})(generateRequestUrls($scope.brandList, $scope.contractInfo), 0);

				},function(error){
					console.log('get brandList fail callback...');
				});
			}

			var renderContractDetailsByCategory = function(category){
				console.log('renderContractDetailsByCategory:' + category);
				var singleCategoryDetails =_.filter($scope.details,function(obj){
					if(category=="Elecssories"){
						return (obj.relatedBrandName.substring(0,1)=="E");
					}else{
						return (obj.relatedBrandName.substring(0,1)=="H");
					}
				});
				var negotiationItems = ContractInfo.getActivedNegotiationItem();
				var proDetailList = new Array();
				for (var i = 0; i < negotiationItems.length; i++) {
					proDetailList[i]=_.filter(singleCategoryDetails ,function(obj){ return (obj.userType=="P"&&obj.negotiationItem==negotiationItems[i]); });
					//if rate value*100;
					if(negotiationItems[i]=="nc_VolumeDiscountRate"||negotiationItems[i]=="nc_PerformanceBonusRate"){
						for(var j=0;j<proDetailList[i].length;j++){
							proDetailList[i][j].brand_ruralValue*=100;
							proDetailList[i][j].brand_urbanValue*=100;
							proDetailList[i][j].variant_A_ruralValue*=100;
							proDetailList[i][j].variant_A_urbanValue*=100;
							proDetailList[i][j].variant_B_ruralValue*=100;
							proDetailList[i][j].variant_B_urbanValue*=100;
							proDetailList[i][j].variant_C_ruralValue*=100;
							proDetailList[i][j].variant_C_urbanValue*=100;
						}
					}
				};
				//load display value
				for (var i = 0; i < 4; i++) {
					for(var j=0;j<proDetailList[i].length;j++){
						if(i==0){
							proDetailList[i][j].displayValue=proDetailList[i][j].displayValue+'('+proDetailList[4][j].displayValue+')';
						}
						if(i==1){
							if(proDetailList[i][j].amount_or_rate){
								proDetailList[i][j].displayValue=proDetailList[i][j].displayValue+'('+proDetailList[5][j].displayValue+')';
							}else{
								proDetailList[i][j].displayValue=proDetailList[i][j].displayValue+'('+proDetailList[6][j].displayValue+')';
							}
						}
					}
				}
				

				$scope.proDetailList=proDetailList;
				var retDetailList=new Array();
				for (var i = 0; i < negotiationItems.length; i++) {
					retDetailList[i] =_.filter(singleCategoryDetails ,function(obj){ return (obj.userType=="R"&&obj.negotiationItem==negotiationItems[i]);});
					if(negotiationItems[i]=="nc_VolumeDiscountRate"||negotiationItems[i]=="nc_PerformanceBonusRate"){
						//if rate value*100;
						for(var j=0;j<retDetailList[i].length;j++){
							retDetailList[i][j].brand_ruralValue*=100;
							retDetailList[i][j].brand_urbanValue*=100;
							retDetailList[i][j].variant_A_ruralValue*=100;
							retDetailList[i][j].variant_A_urbanValue*=100;
							retDetailList[i][j].variant_B_ruralValue*=100;
							retDetailList[i][j].variant_B_urbanValue*=100;
							retDetailList[i][j].variant_C_ruralValue*=100;
							retDetailList[i][j].variant_C_urbanValue*=100;
						}
					}
				};
				for (var i = 0; i < 4; i++) {
					for(var j=0;j<retDetailList[i].length;j++){
						if(i==0){
							retDetailList[i][j].displayValue=retDetailList[i][j].displayValue+'('+retDetailList[4][j].displayValue+')';
						}
						if(i==1){
							if(retDetailList[i][j].amount_or_rate){
								retDetailList[i][j].displayValue=retDetailList[i][j].displayValue+'('+retDetailList[5][j].displayValue+')';
							}else{
								retDetailList[i][j].displayValue=retDetailList[i][j].displayValue+'('+retDetailList[6][j].displayValue+')';
							}
						}
					}
				}
				$scope.retDetailList=retDetailList;

				var variantListByCategory=new Array();
				var url='/producerProducts/'+$scope.contractInfo.producerID+'/'+$scope.contractInfo.period+'/'+$scope.contractInfo.seminar+'/';
				if(category=="Elecssories"){
					url+='1';
				}else{
					url+='2';
				}
				$scope.isVisiableInputTable = true;
				$http.get(url).success(function(data){
					for(var j=0;j<data.length;j++){
						variantListByCategory.push(data[j]);
					}
					//list all product by categoryID
					$scope.variantListByCategory=variantListByCategory;
					console.log('load variantListByCategory:' + $scope.variantListByCategory);

					$scope.refreshingProcess = false;
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

			var compare=function(contract){
			  $scope.refreshingProcess = true;
			  var postData = {
			  	contractCode : contract.contractCode
			  }
			  $http({method:'POST', url:'/compareContractDetailsAndUpdateIsVerified', data: postData}).then(function(res){
			  	console.log('Compare Success:' + res);
				refreshBrandAndContractDetails();
			  },function(res){
			  	console.log('Compare Failed:' + res);
			  })			
			}

			var copyProposal = function(contract){
			  $scope.refreshingProcess = true;
			  var postData = {
			  	contractCode : contract.contractCode
			  }
			  $http({method:'POST', url:'/copyProposal', data: postData}).then(function(res){
			  	console.log('Compare Success:' + res);
			  	compare(contract);
			  },function(res){
			  	console.log('Compare Failed:' + res);
			  })			
			}				

			var loadModalDate=function(selectedDetail){
				$scope.editDetail=selectedDetail;
				$scope.shouldBeRate="none";
				$scope.shouldBeAmount="none";
				$scope.shouldBeNormal="";
				var count=0;
				switch(selectedDetail.negotiationItem){
					case 'nc_MinimumOrder':
						$scope.showNegotiationItem="Minimum Order & Discount Rate";
						$scope.showTitle="Minimum Order";
						break;
					case 'nc_SalesTargetVolume':
						$scope.showNegotiationItem="Sales Target Volume & Bonus";
						$scope.showTitle="Sales Target";
						break;
					case 'nc_PaymentDays':
						$scope.showNegotiationItem="Payment Days";
						$scope.showTitle="Payment Days";
						break;
					case 'nc_OtherCompensation':
						$scope.showNegotiationItem="Other Compensation";
						$scope.showTitle="Other Compensation";
						break;
				}

				//deal with special details combination : MinimumOrder&DiscountRate / SaleTarget/PerformanceBonus
				if(selectedDetail.negotiationItem=="nc_MinimumOrder"){
					//set default value
					$scope.shouldBeRate="";
					$scope.shouldBeAmount="none";
					$scope.shouldBeNormal="none";
					//read real value
					switch(selectedDetail.userType){
						case 'P':
							//nc_VolumeDiscountRate
							$scope.editDetailDisRate=_.find($scope.proDetailList[4],function(obj){ return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});
							break;
						case 'R':
							$scope.editDetailDisRate=_.find($scope.retDetailList[4],function(obj){return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});	
							break;							
					}
				}
				else if(selectedDetail.negotiationItem=="nc_SalesTargetVolume"){
					//set default value
					$scope.shouldBeRate="none";
					$scope.shouldBeAmount="";
					$scope.shouldBeNormal="none";
					//read real value
					switch(selectedDetail.userType){
						case 'P':
							//nc_PerformanceBnousAmount & nc_PerformanceBnousRate
							$scope.editDetailBonusAmount=_.find($scope.proDetailList[5],function(obj){ return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});
							$scope.editDetailBonusRate=_.find($scope.proDetailList[6],function(obj){ return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});
							break;
						case 'R':
							$scope.editDetailBonusAmount=_.find($scope.retDetailList[5],function(obj){ return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});
							$scope.editDetailBonusRate=_.find($scope.retDetailList[6],function(obj){ return (obj.relatedBrandName==selectedDetail.relatedBrandName&&obj.relatedBrandID==selectedDetail.relatedBrandID);});
							break;
					}
					if(selectedDetail.amount_or_rate){
						$scope.shouldBeBonusAmount="";
						$scope.shouldBeBonusRate="none";
					}else{
						$scope.shouldBeBonusAmount="none";
						$scope.shouldBeBonusRate="";							
					}
				}

				//Render Brand/Variant Details depends on userBrandDetails
				if(selectedDetail.useBrandDetails){
					$scope.shouldShowBrand="block";
					$scope.shouldShowVariant="none";
				}
				else{
					$scope.shouldShowBrand="none";
					$scope.shouldShowVariant="block";
				}

				//Read Varinat(A/B/C) Decision from contractDetails into interface
				$scope.editProductList=_.filter($scope.variantListByCategory,function(obj){
					return (obj.brandName==selectedDetail.relatedBrandName);
				});
				for(i=0;i<$scope.editProductList.length;i++){
					$scope.editProductList[i].contractCode=selectedDetail.contractCode;
					$scope.editProductList[i].userType=selectedDetail.userType;
					$scope.editProductList[i].negotiationItem=selectedDetail.negotiationItem;
					$scope.editProductList[i].relatedBrandName=selectedDetail.relatedBrandName;
					$scope.editProductList[i].relatedBrandID=selectedDetail.relatedBrandID;
					if(i==0){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=selectedDetail.variant_A_urbanValue;
						$scope.editProductList[i].ruralValue=selectedDetail.variant_A_ruralValue;
						if(selectedDetail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_A_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_A_ruralValue;
						}else if(selectedDetail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_A_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_A_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_A_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_A_ruralValue;
						}
					}
					if(i==1){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=selectedDetail.variant_B_urbanValue;
						$scope.editProductList[i].ruralValue=selectedDetail.variant_B_ruralValue;
						if(selectedDetail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_B_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_B_ruralValue;
						}else if(selectedDetail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_B_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_B_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_B_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_B_ruralValue;
						}
					}
					if(i==2){
						$scope.editProductList[i].index=i;
						$scope.editProductList[i].urbanValue=selectedDetail.variant_C_urbanValue;
						$scope.editProductList[i].ruralValue=selectedDetail.variant_C_ruralValue;
						if(selectedDetail.negotiationItem=="nc_MinimumOrder"){
							$scope.editProductList[i].dis_urbanValue=$scope.editDetailDisRate.variant_C_urbanValue;
							$scope.editProductList[i].dis_ruralValue=$scope.editDetailDisRate.variant_C_ruralValue;
						}else if(selectedDetail.negotiationItem=="nc_SalesTargetVolume"){
							$scope.editProductList[i].rate_urbanValue=$scope.editDetailBonusRate.variant_C_urbanValue;
							$scope.editProductList[i].rate_ruralValue=$scope.editDetailBonusRate.variant_C_ruralValue;
							$scope.editProductList[i].amout_urbanValue=$scope.editDetailBonusAmount.variant_C_urbanValue;
							$scope.editProductList[i].amout_ruralValue=$scope.editDetailBonusAmount.variant_C_ruralValue;
						}
					}
					if($scope.editProductList[i].varID!=0){
						$scope.editProductList[i].show=1;
						count++;
					}else{
						$scope.editProductList[i].show=0;
					}
					$scope.count=count;
				}
			}

			var checkData=function(value){
				var d = $q.defer();	
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve('Input a number');
				}else{
					d.resolve();
				}
				return d.promise;
			}

			$scope.openEditModal=function(Detail){
				$scope.editModal=true;
				loadModalDate(Detail);
			}

			$scope.setShowDetailType=function(type,detail){
				var value=true;
				if(type=="brand"){
					$scope.shouldShowBrand="";
					$scope.shouldShowVariant="none";
					value=true;
				}
				else if(type=="variant"){
					$scope.shouldShowBrand="none";
					$scope.shouldShowVariant="";
					value=false;
				}
				var queryCondition={
					contractCode:detail.contractCode,
					negotiationItem:detail.negotiationItem,
					userType:detail.userType,
					relatedBrandName:detail.relatedBrandName,
					relatedBrandID:detail.relatedBrandID,
					type:type,
					location:"useBrandDetails",
					value:value,
					count:$scope.count
				}
				if(detail.negotiationItem=="nc_MinimumOrder"){
					$http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					}).then(function(data){
						queryCondition.negotiationItem="nc_VolumeDiscountRate";
						return $http({
							method:'POST',
							url:'/updateContractDetails',
							data:queryCondition
						});
					}).then(function(data){
						console.log('success');
						//refreshBrandAndContractDetails();
					},function(data){
						console.log('err');
						//refreshBrandAndContractDetails();
					})
				}else if(detail.negotiationItem=="nc_SalesTargetVolume"){
					$http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					}).then(function(data){
						queryCondition.negotiationItem="nc_PerformanceBonusRate";
						return $http({
							method:'POST',
							url:'/updateContractDetails',
							data:queryCondition
						});
					}).then(function(data){
						queryCondition.negotiationItem="nc_PerformanceBonusAmount";
						return $http({
							method:'POST',
							url:'/updateContractDetails',
							data:queryCondition
						});
					}).then(function(data){
						console.log('success');
						//refreshBrandAndContractDetails();
					},function(data){
						console.log('err');
						//refreshBrandAndContractDetails();
					})
				}else{
					$http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					}).then(function(data){
						console.log('success');
						//refreshBrandAndContractDetails();
					},function(data){
						console.log('err');
						//refreshBrandAndContractDetails();
					})
				}
			}

			$scope.setShowBonusType=function(type,detail){
				var value=true;
				if(type=="Amout"){
					$scope.shouldBeBonusAmount="";
					$scope.shouldBeBonusRate="none";
					value=true;
				}else if(type=="Rate"){
					$scope.shouldBeBonusAmount="none";
					$scope.shouldBeBonusRate="";	
					value=false;			
				}
				var queryCondition={
					contractCode:detail.contractCode,
					negotiationItem:detail.negotiationItem,
					userType:detail.userType,
					relatedBrandName:detail.relatedBrandName,
					relatedBrandID:detail.relatedBrandID,
					type:type,
					location:"amount_or_rate",
					value:value,
					count:$scope.count
				}
				$http({
					method:'POST',
					url:'/updateContractDetails',
					data:queryCondition
				}).then(function(data){
					queryCondition.negotiationItem="nc_PerformanceBonusRate";
					return $http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					});
				}).then(function(data){
					queryCondition.negotiationItem="nc_PerformanceBonusAmount";
					return $http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					});
				}).then(function(data){
					console.log('success');
					//refreshBrandAndContractDetails();
				},function(data){
					console.log('err');
					//refreshBrandAndContractDetails();
				});
			}

			$scope.closeEditModal=function(){
				$scope.editModal=false;
				refreshBrandAndContractDetails();
			}

			$scope.openViewModal=function(Detail){
				$scope.viewModal=true;
				loadModalDate(Detail);
			}

			$scope.closeViewModal=function(){
				$scope.viewModal=false;
			}

			$scope.updateContractDetails=function(detail,item,location,index,type){
				var value;
				if(type=="brand"){
					if(location=="rural"){
						value=detail.brand_ruralValue;
						if(item=="nc_VolumeDiscountRate"||item=="nc_PerformanceBonusRate"){
							value=detail.brand_ruralValue/100;
						}
					}else{
						value=detail.brand_urbanValue;
						if(item=="nc_VolumeDiscountRate"||item=="nc_PerformanceBonusRate"){
							value=detail.brand_urbanValue/100;
						}
					}
				}
				else{
					if(location=="rural"){
						if(item=="nc_VolumeDiscountRate"){
							value=detail.dis_ruralValue/100;
						}else if(item=="nc_PerformanceBonusRate"){
							value=detail.rate_ruralValue/100;
						}else if(item=="nc_PerformanceBonusAmount"){
							value=detail.amout_ruralValue;
						}else{
							value=detail.ruralValue;
						}
					}else{
						if(item=="nc_VolumeDiscountRate"){
							value=detail.dis_urbanValue/100;
						}else if(item=="nc_PerformanceBonusRate"){
							value=detail.rate_urbanValue/100;
						}else if(item=="nc_PerformanceBonusAmount"){
							value=detail.amout_urbanValue;
						}else{
							value=detail.urbanValue;
						}
					}
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
					value:value,
					count:$scope.count
				};
				$http({
					method:'POST',
					url:'/updateContractDetails',
					data:queryCondition
				}).success(function(data){
					console.log('success');
					//refreshBrandAndContractDetails();
				}).error(function(data){
					console.log('err');
					
				})
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
			$scope.language=Label.getCurrentLanguage();
			$scope.renderContractDetailsByCategory = renderContractDetailsByCategory;
			$scope.loadModalDate=loadModalDate;
			$scope.showbubleMsg=showbubleMsg;
			$scope.compare=compare;
			$scope.copyProposal = copyProposal;
			$scope.checkData=checkData;
			refreshBrandAndContractDetails();
		}]
	)
});