define(['app'], function(app) {
		app.controller('retailerDecisionStep3Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecision','RetailerDecisionBase','Label', function($scope,$q,$rootScope,$http,$filter,RetailerDecision,RetailerDecisionBase,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.language=Label.getCurrentLanguage(),
			$scope.retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
			$scope.period=$rootScope.currentPeriod,
			$scope.category='Elecssories',
			$scope.isCollapsed=true;

			$scope.packs = [{
				value: 1, text: Label.getContent('ECONOMY')
			},{
				value: 2, text: Label.getContent('STANDARD')
			},{
				value: 3, text: Label.getContent('PREMIUM')
			}]; 

			$scope.parameter="NewBrand";/*default add new Brand*/

			/*Angular-ui-bootstrap modal start*/

			$scope.productModalOpts = {
			    backdropFade: true,
			    dialogFade:true
			};
			/*Angular-ui-bootstrap modal end*/		
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
					$scope.selectPacks=selectPacks;
					$scope.openProductModal=openProductModal;
					$scope.closeProductModal=closeProductModal;
					$scope.setAddNewBrand=setAddNewBrand;
					$scope.setAddNewProUnderBrand=setAddNewProUnderBrand;
					$scope.showView=showView;
					$scope.loadSelectCategroy=loadSelectCategroy;
					$scope.setBrandName=setBrandName;
					$scope.loadAllBrand=loadAllBrand;
					$scope.showbubleMsg=showbubleMsg;
					//check
					$scope.checkDesign=checkDesign;
					$scope.checkTechnology=checkTechnology;
					$scope.checkRMQ=checkRMQ;

					$scope.addNewProduct=addNewProduct;
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.calculateBrandID=calculateBrandID;
					$scope.calculateVarID=calculateVarID;
					$scope.deleteProduct=deleteProduct;
				showView($scope.retailerID,$scope.period,$scope.category,$scope.language);
				return delay.promise;
			}

			var calculateBrandID=function(retVariantDecision,retailerID){
				var result=0,min=10*(retailerID+4)+1,max=(retailerID+4)*10+4;
				var nums=new Array();
				for(var i=0;i<retVariantDecision.privateLabelDecision.length;i++){
					if(retVariantDecision.privateLabelDecision[i]!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=""){
						nums.push(retVariantDecision.privateLabelDecision[i].brandID);
					}
				}
				nums.sort(function(a,b){return a>b?1:-1});
				//未到最大值
				if(max!=nums[nums.length-1]){
					result=nums[nums.length-1]+1;
				}
				//已经到最大值 最小值删除
				else if(min!=nums[0]){
					result=min;
				}
				else{
					for(var i=0;i<nums.length-1;i++){
						if(nums[i+1]-nums[i]!=1){
							result=nums[i]+1;
							break;
						}
					}
				}
				return result;
		    }

		    var calculateVarID=function(privateLabelDecision,parentBrandID){
		    	var result=0;min=parentBrandID*10+1,max=parentBrandID*10+3;
		    	var nums=new Array();
		    	for(var i=0;i<privateLabelDecision.privateLabelVarDecision.length;i++){
					if(privateLabelDecision.privateLabelVarDecision[i]!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varName!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varName!=""){
						nums.push(privateLabelDecision.privateLabelVarDecision[i].varID);
					}
				}
				nums.sort(function(a,b){return a>b?1:-1});
				//未到最大值
				if(max!=nums[nums.length-1]){
					result=nums[nums.length-1]+1;
				}
				//已经到最大值 最小值删除
				else if(min!=nums[0]){
					result=min;
				}
				else{
					result=min+1;
				}
				return result;
		    }

		    var deleteProduct=function(category,brandName,varName){
		    	if(category=="Elecssories"){
		    		category=1;
		    	}else{
		    		category=2;
		    	}
		    	RetailerDecisionBase.deleteProduct(category,brandName,varName);	
		    }
			/*Load Page*/
			var showView=function(retailerID,period,category,language){
				var d=$q.defer();
				$scope.retailerID=retailerID,$scope.period=period,$scope.category=category,$scope.language=language;
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

							if(category=="Elecssories"){
								$scope.EleShow="inline";
								$scope.HeaShow="none";
							}
							else if(category=="HealthBeauty"){
								$scope.EleShow="none";
								$scope.HeaShow="inline";
							}
							var allRetCatDecisions=loadSelectCategroy(category);
				      		var products=new Array();
				      		for(var i=0;i<allRetCatDecisions.length;i++){
				      			for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
									if(allRetCatDecisions[i].privateLabelDecision[j]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=0){      				
					      				for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
						      				//if varName is null -->var is null
						      				if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=""){
						      				//if varID is 0 -->var is null
						      					products.push(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]);
							      				products[count].category=category;
							      				products[count].parentBrandName=allRetCatDecisions[i].privateLabelDecision[j].brandName;
							      				if(products[count].packFormat=="ECONOMY"){
							   						products[count].packFormat=1;
							   					}
							      				else if(products[count].packFormat=="STANDARD"){
							      					products[count].packFormat=2;
							      				}
							      				else if(products[count].packFormat=="PREMIUM"){
							      					products[count].packFormat=3;
							   					}
							   					count++;
						  					}
					      				}
					      			}
			      				}
				      		}
				      		$scope.products=products;
						},function(){
							console.log('showView fail');
						})
				return d.promise;
			}

			/*set add function is lauch new Brand*/
			var setAddNewBrand=function(){
				$scope.parameter="NewBrand";/*add new Brand*/
				$scope.newBrand="";
				$scope.newVariant="none";
				$scope.lauchNewCategory=1;
				setBrandName($scope.lauchNewCategory);
			}	
			/*set add function is add under a existed brand*/
			var setAddNewProUnderBrand=function(){
				$scope.parameter="ExistedBrand";/*add new product under existed Brand*/
				$scope.newBrand="none";
				$scope.newVariant="";
				$scope.addNewCategory=1;
				loadAllBrand($scope.addNewCategory);
			}
			/*LoadSelectCategroy*/
			var loadSelectCategroy=function(category){
				return _.filter($scope.pageBase.retCatDecision,function(obj){
					if(category=="HealthBeauty"){
						return (obj.categoryID==2);
					}else{
						return (obj.categoryID==1);
					}
	      		});
			}
			/*SetBrand first and last name*/
			var setBrandName=function(category){
				if(category==1){
					category="Elecssories";
					$scope.brandFirstName="E";
				}else{
					category="HealthBeauty";
					$scope.brandFirstName="H";
				}
				$scope.brandLastName=parseInt($rootScope.user.username.substring($rootScope.user.username.length-1))+4;/*need check*/
			}
			/*LoadAllBrand by category*/
			var loadAllBrand=function(category){
				if(category==1){
					category="Elecssories";
				}else{
					category="HealthBeauty";
				}
				var allretCatDecisions=loadSelectCategroy(category);
	      		var allBrands=new Array();
	      		for(var i=0;i<allretCatDecisions.length;i++){
	      			for(var j=0;j<allretCatDecisions[i].privateLabelDecision.length;j++){
	      				if(allretCatDecisions[i].privateLabelDecision[j]!=undefined&&allretCatDecisions[i].privateLabelDecision[j].brandID!=undefined&&allretCatDecisions[i].privateLabelDecision[j].brandID!=0){
	      					allBrands.push({'BrandID':allretCatDecisions[i].privateLabelDecision[j].brandID,'BrandName':allretCatDecisions[i].privateLabelDecision[j].brandName});
	      				}
	      			}	
	      		}
	      		$scope.allBrands=allBrands;
	      		$scope.addChooseBrand=allBrands[0].BrandID;
			}


			var selectPacks = function(parentBrandName,varName) {
				var selected,postion=-1;
				for(var i=0;i<$scope.products.length;i++){
					if($scope.products[i].parentBrandName==parentBrandName&&$scope.products[i].varName==varName){
						selected = $filter('filter')($scope.packs, {value: $scope.products[i].packFormat});
						postion=i;
						break;
					}
				}
				if(postion!=-1){
					return ($scope.products[postion].packFormat && selected.length) ? selected[0].text : 'Not set'; 
				}
				else{
					return 'Not set';	
				}
			};

			var openProductModal = function () {
			    $scope.productModal = true;
			    setAddNewBrand();
			};
			var closeProductModal = function () {
			    $scope.productModal = false;
			};

			//check
			var checkDesign=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}
				if(category=="Elecssories"){
					categoryID=1;
					var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/4';
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						max=data.data.acquiredDesignLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve('Input range:1~'+max);
						}
						url="/retailerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
						return $http({
							method:'GET',
							url:url
						});
					}).then(function(data){	
						if(value>data.data.composition[2]+2||value>data.data.composition[1]+4){
							if(data.data.composition[2]+2>=data.data.composition[1]+4){
								d.resolve('Input range:1~'+(data.data.composition[1]+4)+'(Technology Level+4)');
							}else{
								d.resolve('Input range:1~'+(data.data.composition[2]+2)+'(Raw Materials Quality+2)');
							}
						}else{
							d.resolve();
						}
					},function(data){
						d.resolve('fail');
					});
				}else{
					categoryID=2;
					url="/retailerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						if(value>data.data.composition[1]+2||value<1||value>data.data.composition[2]+2){
							if(data.data.composition[1]>=data.data.composition[2]){
								d.resolve('Input range:1~'+(data.data.composition[2]+2)+'(Smoothener Level+2)');
							}else{
								d.resolve('Input range:1~'+(data.data.composition[1]+2)+'(Technology Level+2)');
							}
						}
						else{
							d.resolve();
						}
					},function(data){
						d.resolve('fail');
					})
				}
				return d.promise;
			}

			var checkTechnology=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}
				if(category=="Elecssories"){
					categoryID=1;
					var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						max=data.data.acquiredTechnologyLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve('Input range:1~'+max);
						}
						url="/retailerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
						return $http({
							method:'GET',
							url:url
						});
					}).then(function(data){
						//T>=Q-2 T>=D-2 T<=Q
						//if D>=Q--> D-2<=T<=Q 
						if(data.data.composition[0]>=data.data.composition[2]){
							if(value>data.data.composition[2]||(value<data.data.composition[0]-2)){
								d.resolve('Input range:'+(data.data.composition[0]-2)+'(Design Level-2)'+'~'+data.data.composition[2]+'(Raw Materials Quality)');
							}else{
								d.resolve();
							}
						}else{// Q-2<=T<=Q
							if(value>data.data.composition[2]||(value<data.data.composition[2]-2)){
								d.resolve('Input range:'+(data.data.composition[2]-2)+'(Raw Materials Quality-2)'+'~'+data.data.composition[2]+'(Raw Materials Quality)');
							}else{
								d.resolve();
							}
						}
					},function(){
						d.resolve('fail');
					});
				}else{
					categoryID=2;
					var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						max=data.data.acquiredTechnologyLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve('Input range:1~'+max);
						}
						url="/retailerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
						return $http({
							method:'GET',
							url:url
						});
					}).then(function(data){
						if(value<(data.data.composition[2]-2)||value<(data.data.composition[0]-4)){
							if((data.data.composition[2]-2)>=(data.data.composition[0]-4)){
								d.resolve('Input range:'+(data.data.composition[2]-2)+'(Smoothener Level-2)'+'~'+max);
							}else{
								d.resolve('Input range:'+(data.data.composition[0]-4)+'(Active agent-4)'+'~'+max);
							}
						}else{
							d.resolve();
						}
					},function(data){
						d.resolve('fail');
					});
				}
				return d.promise;
			}

			var checkRMQ=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve('Input a Integer');
				}
				if(category=="Elecssories"){
					categoryID=1;
				}else{
					catagoryID=2;
				}
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						max=data.data.acquiredTechnologyLevel[categoryID-1]+2;
						if(value<1||value>max){
							d.resolve('Input range:1~'+max);
						}
						url="/retailerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
						return $http({
							method:'GET',
							url:url
						});
					}).then(function(data){
						if(value<(data.data.composition[0]-2)||value>(data.data.composition[1]+2)){
							if(category=="Elecssories"){
								d.resolve('Input range:'+(data.data.composition[0]-2)+'(Design Level-2)'+'~'+(data.data.composition[1]+2)+'(Technology Level+2)');
							}else{
								d.resolve('Input range:'+(data.data.composition[0]-2)+'(Active agent-2)'+'~'+(data.data.composition[1]+2)+'(Technology Level+2)');								
							}
						}else{
							d.resolve();
						}
					},function(){
						d.resolve('fail');
					});
				return d.promise;
			}

			var updateRetailerDecision=function(category,brandName,varName,location,addtionalIdx,index){
				var categoryID;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2
				}
				if(location=="composition"){
					RetailerDecisionBase.setRetailerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,$scope.products[index][location][addtionalIdx]);							
				}
				else{
					RetailerDecisionBase.setRetailerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,$scope.products[index][location]);													
				}
				$scope.$broadcast('retailerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(brandName,varName){
				var catID;
				//deal with composition label show/hide mechanism
				if(brandName.substring(0,1)=="E"){
					$scope.isElecssories=true;
					$scope.isHealthBeauty=false;
					catID = 1;
				}else{
					$scope.isElecssories=false;
					$scope.isHealthBeauty=true;
					catID = 2;
				}
				$scope.currentRetailerIdx = parseInt($rootScope.user.roleID) - 1;			
				$scope.isCollapsed=false;
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/4';
				$http({method:'GET',url:url})
				.then(function(data){					
					$scope.companyHistory=data.data;
					var postData = {
					    period : $rootScope.currentPeriod,
					    seminar : $rootScope.user.seminar,
					    brandName : brandName,
					    varName : varName,
					    catID : catID,
					    userRole :  $rootScope.userRoles.retailer,
					    userID : $rootScope.user.roleID,								
					}
					return $http({method:'POST', url:'/getCurrentUnitCost', data:postData});
				}).then(function(data){
					console.log(data.data);
				   $scope.currentUnitCost = data.data.result;					
					url="/retailerDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar;
					return $http({method:'GET',url:url});
				}).then(function(data){
					$scope.variantDecisionHistory=data;
					url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+brandName+'/'+varName;
					return $http({method:'GET',url:url});
				}).then(function(data){
				    $scope.variantHistory=data.data;
				},function(err){
					$scope.variantHistory=new Array();
					$scope.showNewHistory={
						brandName:brandName,
						varName:varName
					}
					console.log('read historyInfo fail:' + err);
				});
			}
	
			var addNewProduct=function(parameter){
					var newBrand=new RetailerDecision();
					var nullDecision=new RetailerDecision();
					nullDecision.varName="";
					nullDecision.varID=0;
					nullDecision.parentBrandID=0;
					nullDecision.dateOfBirth=0;
					nullDecision.dateOfDeath=0;
					nullDecision.packFormat="ECONOMY";
					nullDecision.composition=new Array(1,1,1);
					nullDecision.discontinue=false;

					var newretailerDecision=new RetailerDecision();
					newretailerDecision.packFormat="ECONOMY";
					newretailerDecision.dateOfBirth=$scope.period;
					newretailerDecision.dateOfDeath=10;
			        newretailerDecision.composition=new Array(1,1,1);
			        newretailerDecision.discontinue=false;
			        var url="";
					if(parameter=="NewBrand"){/*lauch new Brand*/
						var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
							return (obj.categoryID==$scope.lauchNewCategory);
						});
						newBrand.brandID=calculateBrandID(retVariantDecision,$scope.retailerID);
						newBrand.brandName=$scope.brandFirstName+$scope.lauchNewBrandName+$scope.brandLastName;
						newBrand.paranetCompanyID=$scope.retailerID;
						newBrand.dateOfDeath=10;
						newBrand.dateOfBirth=$scope.period;
						newBrand.privateLabelVarDecision=new Array();
						newretailerDecision.parentBrandID=newBrand.brandID;
						newretailerDecision.varName='_'+$scope.lauchNewVarName;/*need check*/
						newretailerDecision.varID=10*newBrand.brandID+1;/*need check*/
						newBrand.privateLabelVarDecision.push(newretailerDecision,nullDecision,nullDecision);
						
						url="/checkRetailerProduct/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$scope.lauchNewCategory+'/brand/'+newBrand.brandName+'/'+newretailerDecision.varName;
						$http({
							method:'GET',
							url:url
						}).then(function(data){
							RetailerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
							showbubleMsg('add new brand successfully',2);
							closeProductModal();
						},function(data){
							showbubleMsg('add new brand failure, ' + data.data.message,1);
						})
					}else{/*add new product under existed Brand*/
						var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
							return (obj.categoryID==$scope.addNewCategory);
						}); 
						newretailerDecision.parentBrandID=$scope.addChooseBrand;
						newretailerDecision.varName='_'+$scope.addNewVarName;/*need check*/
						var privateLabelDecision=_.find(retVariantDecision.privateLabelDecision,function(obj){
							return (obj.brandID==newretailerDecision.parentBrandID);
						});
			        	newretailerDecision.varID=calculateVarID(privateLabelDecision,newretailerDecision.parentBrandID);//121;/*need check*/
			        	var newBrandName="";
			        	for(var i=0;i<$scope.allBrands.length;i++){
			        		if($scope.allBrands[i].BrandID==newretailerDecision.parentBrandID){
			        			newBrandName=$scope.allBrands[i].BrandName;
			        			break;
			        		}
			        	}
			        	url="/checkRetailerProduct/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$scope.lauchNewCategory+'/variant/'+newBrandName+'/'+newretailerDecision.varName;
				       	$http({
							method:'GET',
							url:url
						}).then(function(data){
							RetailerDecisionBase.addProductExistedBrand(newretailerDecision,$scope.addNewCategory,newBrandName);
							showbubleMsg('add new variant successfully',2);
							closeProductModal();
						},function(data){
							showbubleMsg('add new variant failure, ' + data.data.message,1);
						});						
					}
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