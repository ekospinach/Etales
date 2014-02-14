define(['app'], function(app) {
	app.controller('contractDetailsCtrl',
		['$scope','$q','$rootScope','$http','$filter','ContractInfo','Label','PlayerInfo', function($scope,$q,$rootScope,$http,$filter, ContractInfo,Label,PlayerInfo) {
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
					&&parseInt(PlayerInfo.getPlayer())<5
					&&$scope.contractInfo.producerID==parseInt(PlayerInfo.getPlayer())){
					//current user role is producer, drafter, active producer editable mode
					$scope.producerEditable=true;
					$scope.retailerEditable=false;
				}else{
					//current user role is retailer, active retailer editable
					$scope.producerEditable=false;
					$scope.retailerEditable=true;					
				}


				var url="/checkContractLock/"+$scope.contractInfo.contractCode;
				$http({method:'GET',url:url}).then(function(data){
					if(data.data=="isLocked"){
						$scope.isLock=true;
					}else{
						$scope.isLock=false;
					}
					url='/producerBrands/'+$scope.contractInfo.producerID+'/'+$scope.contractInfo.period+'/'+$scope.contractInfo.seminar;
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.brandList=data.data;
					var details = [];
					//get contract details from server, fill into and deal with array "details" 
					(function multipleRequestShooter(urls, idx){
						$http({method:'GET', url:urls[idx]}).then(function(data){

							//console.log('get data:' + data.data[0]);
							$scope.refreshingProcessLabel = (idx/urls.length)*100;
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
				},function(err){
					console.log('get brandList fail callback...');
				});
				// //get current brand name list of this $scope.contractInfo, depends on producerID/seminar/period
				// var url='/producerBrands/'+$scope.contractInfo.producerID+'/'+$scope.contractInfo.period+'/'+$scope.contractInfo.seminar;
				// //console.log('url:' + url);
				// $http({method:'GET',url:url}).then(function(data){
					
				// },function(error){
				// 	console.log('get brandList fail callback...');
				// });
			}

			var renderContractDetailsByCategory = function(category){
				//console.log('renderContractDetailsByCategory:' + category);
				$scope.category=category;
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
				};				

				$scope.proDetailList=proDetailList;
				var retDetailList=new Array();
				for (var i = 0; i < negotiationItems.length; i++) {
					retDetailList[i] =_.filter(singleCategoryDetails ,function(obj){ return (obj.userType=="R"&&obj.negotiationItem==negotiationItems[i]);});
				};
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

			var compare=function(contract){
				$scope.refreshingProcess = true;
				var url="/checkContractLock/"+contract.contractCode;
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isLocked"){
						$scope.isLock=true;
						url='/';
					}else{
						$scope.isLock=false;
						url='/compareContractDetailsAndUpdateIsVerified';
					}
					var postData = {
						contractCode : contract.contractCode
					}
					return $http({
						method:'POST',
						url:url,
						data:postData
					})
				}).then(function(res){
					refreshBrandAndContractDetails();
				},function(res){
					console.log('Compare Failed:' + res);
					$scope.refreshingProcess = false;
				})
			}

			var copyProposal = function(contract){
				$scope.refreshingProcess = true;
			  	var url="/checkContractLock/"+contract.contractCode;
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isLocked"){
						$scope.isLock=true;
						url='/';
					}else{
						$scope.isLock=false;
						url='/copyProposal';
					}
					var postData = {
						contractCode : contract.contractCode
					}
					return $http({
						method:'POST',
						url:url,
						data:postData
					})
				}).then(function(res){
					compare(contract);
				},function(res){
					console.log('Compare Failed:' + res);
					$scope.refreshingProcess = false;
				})		
			}				

			var loadModalDate=function(selectedDetail){
				$scope.editDetail=selectedDetail;
				$scope.shouldBeRate=false;
				$scope.shouldBeAmount=false;
				$scope.shouldBeNormal=true;
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
					$scope.shouldBeRate=true;
					$scope.shouldBeAmount=false;
					$scope.shouldBeNormal=false;
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
					if($scope.editDetailDisRate.brand_ruralValue>0&&$scope.editDetailDisRate.brand_ruralValue<=1){
						$scope.editDetailDisRate.brand_ruralValue*=100;
						$scope.editDetailDisRate.brand_ruralValue=$scope.editDetailDisRate.brand_ruralValue.toFixed(2);
					}
					if($scope.editDetailDisRate.brand_urbanValue>0&&$scope.editDetailDisRate.brand_urbanValue<=1){
						$scope.editDetailDisRate.brand_urbanValue*=100;
						$scope.editDetailDisRate.brand_urbanValue=$scope.editDetailDisRate.brand_urbanValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_A_ruralValue>0&&$scope.editDetailDisRate.variant_A_ruralValue<=1){
						$scope.editDetailDisRate.variant_A_ruralValue*=100;
						$scope.editDetailDisRate.variant_A_ruralValue=$scope.editDetailDisRate.variant_A_ruralValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_A_urbanValue>0&&$scope.editDetailDisRate.variant_A_urbanValue<=1){
						$scope.editDetailDisRate.variant_A_urbanValue*=100;
						$scope.editDetailDisRate.variant_A_urbanValue=$scope.editDetailDisRate.variant_A_urbanValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_B_ruralValue>0&&$scope.editDetailDisRate.variant_B_ruralValue<=1){
						$scope.editDetailDisRate.variant_B_ruralValue*=100;
						$scope.editDetailDisRate.variant_B_ruralValue=$scope.editDetailDisRate.variant_B_ruralValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_B_urbanValue>0&&$scope.editDetailDisRate.variant_B_urbanValue<=1){
						$scope.editDetailDisRate.variant_B_urbanValue*=100;
						$scope.editDetailDisRate.variant_B_urbanValue=$scope.editDetailDisRate.variant_B_urbanValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_C_ruralValue>0&&$scope.editDetailDisRate.variant_C_ruralValue<=1){
						$scope.editDetailDisRate.variant_C_ruralValue*=100;
						$scope.editDetailDisRate.variant_C_ruralValue=$scope.editDetailDisRate.variant_C_ruralValue.toFixed(2);
					}
					if($scope.editDetailDisRate.variant_C_urbanValue>0&&$scope.editDetailDisRate.variant_C_urbanValue<=1){
						$scope.editDetailDisRate.variant_C_urbanValue*=100;
						$scope.editDetailDisRate.variant_C_urbanValue=$scope.editDetailDisRate.variant_C_urbanValue.toFixed(2);
					}
				}
				else if(selectedDetail.negotiationItem=="nc_SalesTargetVolume"){
					//set default value
					$scope.shouldBeRate=false;
					$scope.shouldBeAmount=true;
					$scope.shouldBeNormal=false;
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
						$scope.shouldBeBonusAmount=true;
						$scope.shouldBeBonusRate=false;
					}else{
						$scope.shouldBeBonusAmount=false;
						$scope.shouldBeBonusRate=true;							
					}
					if($scope.editDetailBonusRate.brand_ruralValue>0&&$scope.editDetailBonusRate.brand_ruralValue<=1){
						$scope.editDetailBonusRate.brand_ruralValue*=100;
						$scope.editDetailBonusRate.brand_ruralValue=$scope.editDetailBonusRate.brand_ruralValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.brand_urbanValue>0&&$scope.editDetailBonusRate.brand_urbanValue<=1){
						$scope.editDetailBonusRate.brand_urbanValue*=100;
						$scope.editDetailBonusRate.brand_urbanValue=$scope.editDetailBonusRate.brand_urbanValue.toFixed(2);

					}
					if($scope.editDetailBonusRate.variant_A_ruralValue>0&&$scope.editDetailBonusRate.variant_A_ruralValue<=1){
						$scope.editDetailBonusRate.variant_A_ruralValue*=100;
						$scope.editDetailBonusRate.variant_A_ruralValue=$scope.editDetailBonusRate.variant_A_ruralValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.variant_A_urbanValue>0&&$scope.editDetailBonusRate.variant_A_urbanValue<=1){
						$scope.editDetailBonusRate.variant_A_urbanValue*=100;
						$scope.editDetailBonusRate.variant_A_urbanValue=$scope.editDetailBonusRate.variant_A_urbanValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.variant_B_ruralValue>0&&$scope.editDetailBonusRate.variant_B_ruralValue<=1){
						$scope.editDetailBonusRate.variant_B_ruralValue*=100;
						$scope.editDetailBonusRate.variant_B_ruralValue=$scope.editDetailBonusRate.variant_B_ruralValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.variant_B_urbanValue>0&&$scope.editDetailBonusRate.variant_B_urbanValue<=1){
						$scope.editDetailBonusRate.variant_B_urbanValue*=100;
						$scope.editDetailBonusRate.variant_B_urbanValue=$scope.editDetailBonusRate.variant_B_urbanValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.variant_C_ruralValue>0&&$scope.editDetailBonusRate.variant_C_ruralValue<=1){
						$scope.editDetailBonusRate.variant_C_ruralValue*=100;
						$scope.editDetailBonusRate.variant_C_ruralValue=$scope.editDetailBonusRate.variant_C_ruralValue.toFixed(2);
					}
					if($scope.editDetailBonusRate.variant_C_urbanValue>0&&$scope.editDetailBonusRate.variant_C_urbanValue<=1){
						$scope.editDetailBonusRate.variant_C_urbanValue*=100;
						$scope.editDetailBonusRate.variant_C_urbanValue=$scope.editDetailBonusRate.variant_C_urbanValue.toFixed(2);
					}
				}

				//Render Brand/Variant Details depends on userBrandDetails
				if(selectedDetail.useBrandDetails){
					$scope.shouldShowBrand=true;
					$scope.shouldShowVariant=false;
				}
				else{
					$scope.shouldShowBrand=false;
					$scope.shouldShowVariant=true;
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

			var checkData=function(contractCode,item,value){
				var d = $q.defer();	
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}else{
					var url="/checkContractLock/"+contractCode;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						if(data.data=="isLocked"){
							d.resolve(Label.getContent('Check Warning'));
							$scope.isLock=true;
						}else{
							$scope.isLock=false;
							if(item=="nc_VolumeDiscountRate"||item=="nc_PerformanceBonusRate"){
								if(value>100){
									d.resolve(Label.getContent('Input range')+':0~100');
								}else{
									d.resolve();
								}
							}else if(item=="nc_PaymentDays"){
								if(value>180){
									d.resolve(Label.getContent('Input range')+':0~180');
								}else{
									d.resolve();
								}
							}else{
								d.resolve();
							}
						}
					},function(){
						d.resolve(Label.getContent('fail'));
					})
				}
				return d.promise;
			}

			var checkAmount=function(contractCode,detail,item,location,index,type,value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				var seminar=$rootScope.user.seminar,
				period=$rootScope.currentPeriod,
				producerID=detail.relatedBrandName.substring(detail.relatedBrandName.length-1);
				//producerID=detail.producerID;
				var url="/checkContractLock/"+contractCode;
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isLocked"){
						d.resolve(Label.getContent('Check Warning'));
						$scope.isLock=true;
					}else{
						$scope.isLock=false;
					}
					url="/getProductInfo/"+producerID+'/'+period+'/'+seminar+'/'+detail.relatedBrandName;
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					var variants=data.data,urls=new Array(),results=new Array(),url="",categoryID;
					for(i=0;i<variants.length;i++){
						if(variants[i].varID!=0&&variants[i].varName!=""){
							if(variants[i].dateOfBirth<$rootScope.currentPeriod){
								url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+detail.relatedBrandName+'/'+variants[i].varName;
								urls.push(url);
							}else{
								if(detail.relatedBrandName.substring(0,1)=="E"){
					                categoryID=1;
					            }else{
						            categoryID=2;
						        }
								url='/producerVariantBM/'+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+producerID+'/'+categoryID+'/'+detail.relatedBrandName+'/'+variants[i].varName;
								urls.push(url);
							}
						}else{
							urls.push("");
						}
					}
					(function multipleRequestShooter(urls, idx){
						$http({method:'GET', url:urls[idx]}).then(function(data){
							if(data.data.supplierView!=undefined){
								results.push(data.data.supplierView[0].nextPriceBM)
							}else if(data.data.result!=undefined){
								results.push(data.data.result);
							}else{
								results.push(0);
							}
						}, function(data){
							//console.log('get contractDetails fail callback');
						}).finally(function(){
							if(idx!=urls.length-1) { 
								idx++;
								multipleRequestShooter(urls, idx);							
							}else{
								var max=0,saleTarget=0;
								if(type=="brand"){
									if(location=="urban"){
										saleTarget=$scope.editDetail.brand_urbanValue;
									}else{
										saleTarget=$scope.editDetail.brand_ruralValue;
									}
									price=(results[0]+results[1]+results[2])/$scope.count;
								}else{
									price=results[index];
									if(location=="urban"){
										saleTarget=detail.urbanValue;
									}else{
										saleTarget=detail.ruralValue;
									}
								}
								max=saleTarget*price;
								if(value>max){
									d.resolve(Label.getContent('Input range')+':0~'+max.toFixed(2));
								}else{
									d.resolve();
								}										
							}
						});
					})(urls, 0);
				},function(){
					d.resolve('fail');
				})
				return d.promise;
			}

			$scope.openEditModal=function(Detail,index){
				$scope.editModal=true;
				$scope.index=index;
				loadModalDate(Detail);
			}

			$scope.setShowDetailType=function(type,detail){
				var value=true;
				if(type=="brand"){
					$scope.shouldShowBrand=true;
					$scope.shouldShowVariant=false;
					value=true;
				}
				else if(type=="variant"){
					$scope.shouldShowBrand=false;
					$scope.shouldShowVariant=true;
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
					},function(data){
						console.log('err');
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
					},function(data){
						console.log('err');
					})
				}else{
					$http({
						method:'POST',
						url:'/updateContractDetails',
						data:queryCondition
					}).then(function(data){
						console.log('success');
					},function(data){
						console.log('err');
					})
				}
			}

			$scope.setShowBonusType=function(type,detail){
				var value=true;
				if(type=="Amout"){
					$scope.shouldBeBonusAmount=true;
					$scope.shouldBeBonusRate=false;
					value=true;
				}else if(type=="Rate"){
					$scope.shouldBeBonusAmount=false;
					$scope.shouldBeBonusRate=true;	
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
				},function(data){
					console.log('err');
				});
			}

			$scope.closeEditModal=function(Detail,index){
				$scope.editModal=false;
				var newDetail=new Array();
				var url='/contractDetail/'+Detail.contractCode+'/'+Detail.userType+'/'+Detail.negotiationItem+'/'+Detail.relatedBrandName;
				if(Detail.negotiationItem=="nc_MinimumOrder"){
					//load 2 item
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						newDetail=data.data[0];
						if(newDetail!=undefined){
							if(Detail.userType=="P"){
								$scope.proDetailList[0].splice(index,1,newDetail);
							}else{
								$scope.retDetailList[0].splice(index,1,newDetail);
							}
						}
						url='/contractDetail/'+Detail.contractCode+'/'+Detail.userType+'/nc_VolumeDiscountRate/'+Detail.relatedBrandName;
						return $http({
							method:'GET',
							url:url
						})
					}).then(function(data){
						newDetail=data.data[0];
						if(newDetail!=undefined){
							if(Detail.userType=="P"){
								$scope.proDetailList[4].splice(index,1,newDetail);
							}else{
								$scope.retDetailList[4].splice(index,1,newDetail);
							}
						}
					},function(){
						console.log('refreshing fail');
					})
				}else if(Detail.negotiationItem=="nc_SalesTargetVolume"){
					//load 3 item
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						newDetail=data.data[0];
						if(newDetail!=undefined){
							if(Detail.userType=="P"){
								$scope.proDetailList[1].splice(index,1,newDetail);
							}else{
								$scope.retDetailList[1].splice(index,1,newDetail);
							}
						}
						url='/contractDetail/'+Detail.contractCode+'/'+Detail.userType+'/nc_PerformanceBonusAmount/'+Detail.relatedBrandName;
						return $http({
							method:'GET',
							url:url
						})
					}).then(function(data){
						newDetail=data.data[0];
						if(newDetail!=undefined){
							if(Detail.userType=="P"){
								$scope.proDetailList[5].splice(index,1,newDetail);
							}else{
								$scope.retDetailList[5].splice(index,1,newDetail);
							}
						}
						url='/contractDetail/'+Detail.contractCode+'/'+Detail.userType+'/nc_PerformanceBonusRate/'+Detail.relatedBrandName;
						return $http({
							method:'GET',
							url:url
						})
					}).then(function(data){
						newDetail=data.data[0];
						if(newDetail!=undefined){
							if(Detail.userType=="P"){
								$scope.proDetailList[6].splice(index,1,newDetail);
							}else{
								$scope.retDetailList[6].splice(index,1,newDetail);
							}
						}
					},function(){
						console.log('refreshing fail');
					});
				}else{
					//load 1 item
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						newDetail=data.data[0];
						if(Detail.negotiationItem=="nc_PaymentDays"){
							if(newDetail!=undefined){
								if(Detail.userType=="P"){
									$scope.proDetailList[2].splice(index,1,newDetail);
								}else{
									$scope.retDetailList[2].splice(index,1,newDetail);
								}
							}
						}else{
							if(newDetail!=undefined){
								if(Detail.userType=="P"){
									$scope.proDetailList[3].splice(index,1,newDetail);
								}else{
									$scope.retDetailList[3].splice(index,1,newDetail);
								}
							}
						}
					},function(){
						console.log('refreshing fail');
					})
				}
			}

			$scope.openViewModal=function(Detail){
				$scope.viewModal=true;
				loadModalDate(Detail);
			}

			$scope.closeViewModal=function(){
				$scope.viewModal=false;
			}

			$scope.updateContractDetails=function(detail,item,location,index,type){
				var value,othervalue=0,price=0,otherItem="";
				$scope.results=new Array(0,0,0);
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
				if(item!="nc_SalesTargetVolume"&&item!="nc_PerformanceBonusAmount"&&item!="nc_PerformanceBonusRate"){
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
					}).error(function(data){
						console.log('err');
					})
				}else{
					var seminar=$rootScope.user.seminar,
					period=$rootScope.currentPeriod,
					producerID=detail.relatedBrandName.substring(detail.relatedBrandName.length-1);
					var url="/getProductInfo/"+producerID+'/'+period+'/'+seminar+'/'+detail.relatedBrandName;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						var variants=data.data,urls=new Array(),url="",categoryID,results=new Array();
						console.log(variants);
						for(i=0;i<variants.length;i++){
							if(variants[i].varID!=0&&variants[i].varName!=""){
								if(variants[i].dateOfBirth<$rootScope.currentPeriod){
									url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+detail.relatedBrandName+'/'+variants[i].varName;
									urls.push(url);
								}else{
									if(detail.relatedBrandName.substring(0,1)=="E"){
						                categoryID=1;
						            }else{
						                categoryID=2;
						            }
									url='/producerVariantBM/'+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+producerID+'/'+categoryID+'/'+detail.relatedBrandName+'/'+variants[i].varName;
									urls.push(url);
								}
							}else{
								urls.push("");
							}
						}
						(function multipleRequestShooter(urls, idx){
							$http({method:'GET', url:urls[idx]}).then(function(data){
								if(data.data.supplierView!=undefined){
									results.push(data.data.supplierView[0].nextPriceBM)
								}else if(data.data.result!=undefined){
									results.push(data.data.result);
								}else{
									results.push(0);
								}
							}, function(data){
								//console.log('get contractDetails fail callback');
							}).finally(function(){
								if(idx!=urls.length-1) { 
									idx++;
									multipleRequestShooter(urls, idx);							
								}else{
									var saleTarget=0,rate=0;
									if(type=="brand"){
										if(location=="urban"){
											saleTarget=$scope.editDetail.brand_urbanValue;
											rate=$scope.editDetailBonusRate.brand_urbanValue;
										}else{
											saleTarget=$scope.editDetail.brand_ruralValue;
											rate=$scope.editDetailBonusRate.brand_ruralValue;
										}
										price=(results[0]+results[1]+results[2])/$scope.count;
										if(item=="nc_PerformanceBonusRate"){
											otherItem="nc_PerformanceBonusAmount";
											othervalue=saleTarget*price*value;
											othervalue=othervalue.toFixed(2);
											if(location=="urban"){
												$scope.editDetailBonusAmount.brand_urbanValue=othervalue;
											}else{
												$scope.editDetailBonusAmount.brand_ruralValue=othervalue;
											}
										}else if(item=="nc_PerformanceBonusAmount"){
											otherItem="nc_PerformanceBonusRate";
											othervalue=value*100/(saleTarget*price);
											othervalue=othervalue.toFixed(2);
											if(location=="urban"){
												$scope.editDetailBonusRate.brand_urbanValue=othervalue;
											}else{
												$scope.editDetailBonusRate.brand_ruralValue=othervalue;
											}
										}else{
											if(item=="nc_SalesTargetVolume"){
												otherItem="nc_PerformanceBonusAmount";
												othervalue=rate*value*price/100;
												othervalue=othervalue.toFixed(2);
												if(value==0){
													if(location=="urban"){
														$scope.editDetailBonusAmount.brand_urbanValue=0;
														$scope.editDetailBonusRate.brand_urbanValue=0;
													}else{
														$scope.editDetailBonusAmount.brand_ruralValue=0;
														$scope.editDetailBonusRate.brand_ruralValue=0;
													}
												}else{
													if(location=="urban"){
														$scope.editDetailBonusAmount.brand_urbanValue=othervalue;
													}else{
														$scope.editDetailBonusAmount.brand_ruralValue=othervalue;
													}
												}
											}
										}
									}else{
										price=results[index];
										if(location=="urban"){
											saleTarget=detail.urbanValue;
											rate=detail.rate_urbanValue;
										}else{
											saleTarget=detail.ruralValue;
											rate=detail.rate_ruralValue;
										}
										if(item=="nc_PerformanceBonusRate"){
											otherItem="nc_PerformanceBonusAmount";
											othervalue=saleTarget*price*value;
											othervalue=othervalue.toFixed(2);
											if(location=="urban"){
												$scope.editProductList[index].amout_urbanValue=othervalue;
											}else{
												$scope.editProductList[index].amout_ruralValue=othervalue;
											}
										}else if(item=="nc_PerformanceBonusAmount"){
											otherItem="nc_PerformanceBonusRate";
											othervalue=value*100/(saleTarget*price);
											othervalue=othervalue.toFixed(2);
											if(location=="urban"){
												$scope.editProductList[index].rate_urbanValue=othervalue;
											}else{
												$scope.editProductList[index].rate_ruralValue=othervalue;
											}
										}else{
											otherItem="nc_PerformanceBonusAmount";
											othervalue=value*price*rate/100;
											othervalue=othervalue.toFixed(2);
											if(value==0){
												if(location=="urban"){
													$scope.editProductList[index].amout_urbanValue=0;
													$scope.editProductList[index].rate_urbanValue=0;
												}else{
													$scope.editProductList[index].amout_ruralValue=0;
													$scope.editProductList[index].rate_ruralValue=0;
												}
											}else{
												if(location=="urban"){
													$scope.editProductList[index].amout_urbanValue=othervalue;
												}else{
													$scope.editProductList[index].amout_ruralValue=othervalue;
												}
											}
										}
									}
									if(item=="nc_SalesTargetVolume"&&value==0){
										var queryCondition={
											contractCode:detail.contractCode,
											negotiationItem:'nc_SalesTargetVolume',
											userType:detail.userType,
											relatedBrandName:detail.relatedBrandName,
											relatedBrandID:detail.relatedBrandID,
											type:type,
											location:location,
											index:index,
											value:0,
											count:$scope.count
										};
										$http({
											method:'POST',
											url:'/updateContractDetails',
											data:queryCondition
										}).then(function(data){
											queryCondition={
												contractCode:detail.contractCode,
												negotiationItem:'nc_PerformanceBonusAmount',
												userType:detail.userType,
												relatedBrandName:detail.relatedBrandName,
												relatedBrandID:detail.relatedBrandID,
												type:type,
												location:location,
												index:index,
												value:0,
												count:$scope.count
											};
											return $http({
												method:'POST',
												url:'/updateContractDetails',
												data:queryCondition
											});
										}).then(function(data){
											queryCondition={
												contractCode:detail.contractCode,
												negotiationItem:'nc_PerformanceBonusRate',
												userType:detail.userType,
												relatedBrandName:detail.relatedBrandName,
												relatedBrandID:detail.relatedBrandID,
												type:type,
												location:location,
												index:index,
												value:0,
												count:$scope.count
											};
											return $http({
												method:'POST',
												url:'/updateContractDetails',
												data:queryCondition
											});
										}).then(function(data){
											console.log('success');
										},function(){
											console.log('fail');
										})
									}else{
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
										}).then(function(data){
											if(otherItem=="nc_PerformanceBonusRate"){
												othervalue=othervalue/100;
											}
											queryCondition={
												contractCode:detail.contractCode,
												negotiationItem:otherItem,
												userType:detail.userType,
												relatedBrandName:detail.relatedBrandName,
												relatedBrandID:detail.relatedBrandID,
												type:type,
												location:location,
												index:index,
												value:othervalue,
												count:$scope.count
											};
											return $http({
												method:'POST',
												url:'/updateContractDetails',
												data:queryCondition
											});
										}).then(function(data){
											console.log('update success');
										},function(){
											console.log('update fail');
										})		
									}		
								}
							});
						})(urls, 0);
					},function(err){
						console.log(err);
					})
				}
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
			
			$scope.category="Elecssories";
			$scope.language=Label.getCurrentLanguage();
			$scope.renderContractDetailsByCategory = renderContractDetailsByCategory;
			$scope.loadModalDate=loadModalDate;
			//$scope.showbubleMsg=showbubleMsg;
			$scope.isLock=false;
			$scope.compare=compare;
			$scope.copyProposal = copyProposal;
			$scope.checkData=checkData;
			$scope.checkAmount=checkAmount;
			refreshBrandAndContractDetails();
		}]
	)
});