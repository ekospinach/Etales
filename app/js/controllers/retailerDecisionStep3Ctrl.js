define(['app'], function(app) {
		app.controller('retailerDecisionStep3Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecision','RetailerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecision,RetailerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
			var calculate='../js/controllers/untils/calculate.js';
			//var calculate=require('');
			var multilingual=getRetailerStep3Info();

			var language='English',
				retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				period=$rootScope.currentPeriod,
				category='Elecssories',
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.retailerID=retailerID;
			$scope.period=period;

			$scope.packs = [{
				value: 1, text: 'ECONOMY'
			},{
				value: 2, text: 'STANDARD'
			},{
				value: 3, text: 'PREMIUM'
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
					$scope.selected=selected;
					$scope.loadNameNum=loadNameNum;
					$scope.addNewProduct=addNewProduct;
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.calculateBrandID=calculateBrandID;
					$scope.calculateVarID=calculateVarID;
					$scope.deleteProduct=deleteProduct;
				var result=showView($scope.retailerID,$scope.period,$scope.category,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}

			var calculateBrandID=function(retVariantDecision,retailerID){
				var result=0,min=10*(retailerID+4)+1,max=(retailerID+4)*10+4;
				var nums=new Array();
				for(var i=0;i<retVariantDecision.privateLabelDecision.length;i++){
					if(retVariantDecision.privateLabelDecision[i]!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=undefined&&retVariantDecision.privateLabelDecision[i].brandName!=""){
					//if(retVariantDecision.privateLabelDecision[i]!=undefined&&retVariantDecision.privateLabelDecision[i].brandID!=undefined&&retVariantDecision.privateLabelDecision[i].brandID!=0){
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
					//if(privateLabelDecision.privateLabelVarDecision[i]!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varID!=undefined&&privateLabelDecision.privateLabelVarDecision[i].varID!=0){
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
				$scope.retailerID=retailerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var infoLanguages={},labelLanguages={};
				if(language=="English"){
					for(var i=0;i<$scope.multilingual.length;i++){
						if(category=="Elecssories"){
							$scope.EleShow="inline";
							$scope.HeaShow="none";
						}
						else if(category=="HealthBeauty"){
							$scope.EleShow="none";
							$scope.HeaShow="inline";
						}
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelENG;
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoENG;
					}
				}
				else if(language=="Chinese"){
					for(var i=0;i<$scope.multilingual.length;i++){
						if(category=="Elecssories"){
							$scope.EleShow="inline";
							$scope.HeaShow="none";
						}
						else if(category=="HealthBeauty"){
							$scope.EleShow="none";
							$scope.HeaShow="inline";
						}
						infoLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].infoCHN;
						labelLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].labelCHN;
					}
				}
				var allRetCatDecisions=loadSelectCategroy(category);
	      		var count=0,result=0;
	      		var products=new Array();
	      		for(var i=0;i<allRetCatDecisions.length;i++){
	      			for(var j=0;j<allRetCatDecisions[i].privateLabelDecision.length;j++){
						if(allRetCatDecisions[i].privateLabelDecision[j]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].brandID!=0){      				
		      				for(var k=0;k<allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision.length;k++){
			      				//if varName is null -->var is null
			      				if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varName!=""){
			      				//if varID is 0 -->var is null
			      				//if(allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k]!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=undefined&&allRetCatDecisions[i].privateLabelDecision[j].privateLabelVarDecision[k].varID!=0){
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
	      		if(count!=0){
	      			result=1;
	      		}
	      		console.log('products:' + products);
	      		$scope.products=products;
				$scope.infoLanguages=infoLanguages;
				$scope.labelLanguages=labelLanguages;
				return result;
			}

			/*set add function is lauch new Brand*/
			var setAddNewBrand=function(){
				$scope.parameter="NewBrand";/*add new Brand*/
				$scope.lauchNewCategory=1;
				setBrandName($scope.lauchNewCategory);
			}	
			/*set add function is add under a existed brand*/
			var setAddNewProUnderBrand=function(){
				$scope.parameter="ExistedBrand";/*add new product under existed Brand*/
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

			var selected=function(category){
				console.log(category);
			}

			var selectPacks = function(parentBrandName,varName) {
				console.log('testSelectPacks');
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
				//$scope.moreInfo={'parentBrandID':brandID,'varName':varName};
				$scope.isCollapsed=false;
				//var url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+brandName+'/'+varName;
				var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/4';
				$http({method:'GET',url:url})
				.success(function(data){
					$scope.companyHistory=data;
					console.log($scope.companyHistory);
					url="/retailerDecision/"+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar;
					$http({method:'GET',url:url})
					.success(function(data){
						$scope.variantDecisionHistory=data;
						console.log($scope.variantDecisionHistory);
						// url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+brandName+'/'+varName;
						// $http({method:'GET',url:url})
						// .success(function(data){
						// 	$scope.variantHistory=data;
						// 	console.log($scope.variantHistory);
						// })
						// .error(function(data){
						// 	console.log("read variantHistory fail");
						// })
					})
					.error(function(data){
						console.log('read retailerDecision fail');
					})
				})
				.error(function(data){
					console.log('read companyHistory fail');
				})
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		
			var addNewProduct=function(parameter){
				//require(['../js/controllers/untils/calculate'], function (calculate){
					var newBrand=new RetailerDecision();
					var nullDecision=new RetailerDecision();
					nullDecision.varName="";
					nullDecision.varID=0;
					nullDecision.parentBrandID=0;
					nullDecision.dateOfBirth=0;
					nullDecision.dateOfDeath=0;
					nullDecision.packFormat="";
					nullDecision.composition=[0,0,0];
					nullDecision.discontinue=false;

					var newretailerDecision=new RetailerDecision();
					newretailerDecision.packFormat="";
					newretailerDecision.dateOfBirth=$scope.period;
					newretailerDecision.dateOfDeath=10;
			        newretailerDecision.composition=new Array();
			        newretailerDecision.discontinue=false;
					if(parameter=="NewBrand"){/*lauch new Brand*/
						var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
							return (obj.categoryID==$scope.lauchNewCategory);
						});
						newBrand.brandID=calculateBrandID(retVariantDecision,$scope.retailerID);
						newBrand.brandName=$scope.brandFirstName+$scope.lauchNewBrandName+$scope.brandLastName;
						newBrand.paranetCompanyID=$scope.retailerID;
						newBrand.dateOfDeath=10;
						newBrand.dateOfBirth=$scope.period;
						//newBrand.advertisingOffLine=new Array();
						//newBrand.advertisingOnLine="";
						//newBrand.supportEmall="";
						//newBrand.supportTraditionalTrade=new Array();
						newBrand.privateLabelVarDecision=new Array();
						newretailerDecision.parentBrandID=newBrand.brandID;
						newretailerDecision.varName=$scope.lauchNewVarName;/*need check*/
						newretailerDecision.varID=10*newBrand.brandID+1;/*need check*/
						newBrand.privateLabelVarDecision.push(newretailerDecision,nullDecision,nullDecision);
						RetailerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
					}else{/*add new product under existed Brand*/
						var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
							return (obj.categoryID==$scope.addNewCategory);
						}); 
						newretailerDecision.parentBrandID=$scope.addChooseBrand;
						newretailerDecision.varName=$scope.addNewVarName;/*need check*/
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
			        	RetailerDecisionBase.addProductExistedBrand(newretailerDecision,$scope.addNewCategory,newBrandName);							
					}
					closeProductModal();
			}

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