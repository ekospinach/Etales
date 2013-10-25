define(['app'], function(app) {
		app.controller('retailerDecisionStep3Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecision','RetailerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecision,RetailerDecisionBase) {
			$rootScope.decisionActive="active";
			var calculate='../js/controllers/untils/calculate.js';
			//var calculate=require('');
			var multilingual=[{
						'shortName':'Products_Portfolio_Management',
						'labelENG':'Products Portfolio Management',
						'labelRUS':'',
						'labelCHN':'产品组合管理',
						'label':''
					},{
						'shortName':'Next',
						'labelENG':'Next',
						'labelRUS':'',
						'labelCHN':'下一步',
						'label':''
					},{
						'shortName':'Category',
						'labelENG':'Category',
						'labelRUS':'',
						'labelCHN':'品类',
						'label':''
					},{
						'shortName':'Brand',
						'labelENG':'Brand',
						'labelRUS':'',
						'labelCHN':'品牌',
						'label':''
					},{
						'shortName':'Variant',
						'labelENG':'Variant',
						'labelRUS':'',
						'labelCHN':'单品',
						'label':''					
					},{
						'shortName':'PF',
						'labelENG':'Pack Format',
						'labelRUS':'',
						'labelCHN':'包',
						'label':''					
					},{
						'shortName':'TL',
						'labelENG':'Technology Level',
						'labelRUS':'',
						'labelCHN':'技术水平',
						'label':''
					},{
						'shortName':'AA',
						'labelENG':'Active agent',
						'labelRUS':'',
						'labelCHN':'活性剂',
						'label':''
					},{
						'shortName':'SL',
						'labelENG':'Smoothener Level',
						'labelRUS':'',
						'labelCHN':'增滑技术',
						'label':''
					},{
						'shortName':'EPV',
						'labelENG':'Estimated Production Volume',
						'labelRUS':'',
						'labelCHN':'估计产量',
						'label':''				
					},{
						'shortName':'DTP',
						'labelENG':'Discontinue this product',
						'labelRUS':'',
						'labelCHN':'停止生产',
						'label':''						
					}];

			var language='English',
				retailerID=1,
				period=0,
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

			$scope.opts = {
			    backdropFade: true,
			    dialogFade:true
			};
			/*Angular-ui-bootstrap modal end*/		
			RetailerDecisionBase.reload({period:'0',seminar:'MAY',retailerID:1}).then(function(base){
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
					$scope.open=open;
					$scope.close=close;
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
				for(var i=0;i<retVariantDecision.retVariantDecision.length;i++){
					if(retVariantDecision.retVariantDecision[i].brandID!=undefined){
						nums.push(retVariantDecision.retVariantDecision[i].brandID);
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

		    var calculateVarID=function(retVariantDecision,parentBrandID){
		    	var result=0;min=parentBrandID*10+1,max=parentBrandID*10+3;
		    	var nums=new Array();
		    	for(var i=0;i<retVariantDecision.privateLabelVarDecision.length;i++){
					if(retVariantDecision.privateLabelVarDecision[i].varID!=undefined){
						nums.push(retVariantDecision.privateLabelVarDecision[i].varID);
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


			/*Load Page*/
			var showView=function(retailerID,period,category,language){
				$scope.retailerID=retailerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var shortLanguages={},fullLanguages={};
				if(language=="English"){
					for(var i=0;i<$scope.multilingual.length;i++){
						if(category=="Elecssories"){
							if($scope.multilingual[i].shortName=="Active"){
								$scope.multilingual[i].labelENG="Design Index";
								$scope.multilingual[i].labelCHN="设计指数";
							}
							if($scope.multilingual[i].shortName=="Smootener"){
								$scope.multilingual[i].labelENG="Raw Materrials Quality";
								$scope.multilingual[i].labelCHN="原始材料质量";
							}
						}
						else if(category=="HealthBeauty"){
							if($scope.multilingual[i].shortName=="Active"){
								$scope.multilingual[i].labelENG="Active agent";
								$scope.multilingual[i].labelCHN="活性剂";
							}
							if($scope.multilingual[i].shortName=="Smootener"){
								$scope.multilingual[i].labelENG="Smoothener Level";
								$scope.multilingual[i].labelCHN="增滑技术";
							}
						}
						$scope.multilingual[i].label=$scope.multilingual[i].labelENG;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						fullLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
					}
				}
				else if(language=="Chinese"){
					for(var i=0;i<$scope.multilingual.length;i++){
						if(category=="Elecssories"){
							if($scope.multilingual[i].shortName=="Active"){
								$scope.multilingual[i].labelENG="Design Index";
								$scope.multilingual[i].labelCHN="设计指数";
							}
							if($scope.multilingual[i].shortName=="Smootener"){
								$scope.multilingual[i].labelENG="Raw Materrials Quality";
								$scope.multilingual[i].labelCHN="原始材料质量";
							}
						}
						else if(category=="HealthBeauty"){
							if($scope.multilingual[i].shortName=="Active"){
								$scope.multilingual[i].labelENG="Active agent";
								$scope.multilingual[i].labelCHN="活性剂";
							}
							if($scope.multilingual[i].shortName=="Smootener"){
								$scope.multilingual[i].labelENG="Smoothener Level";
								$scope.multilingual[i].labelCHN="增滑技术";
							}
						}
						$scope.multilingual[i].label=$scope.multilingual[i].labelCHN;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						fullLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
					}
				}
				var allretCatDecisions=loadSelectCategroy(category);
	      		var count=0,result=0;
	      		var products=new Array();
	      		for(var i=0;i<allretCatDecisions.length;i++){
	      			for(var j=0;j<allretCatDecisions[i].retVariantDecision.length;j++){
	      				for(var k=0;k<allretCatDecisions[i].retVariantDecision[j].privateLabelVarDecision.length;k++){
	      					products.push(allretCatDecisions[i].retVariantDecision[j].privateLabelVarDecision[k]);
	      					products[count].category=category;
	      					products[count].parentBrandName=allretCatDecisions[i].retVariantDecision[j].brandName;
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
	      		if(count!=0){
	      			result=1;
	      		}
	      		$scope.products=products;
				$scope.shortLanguages=shortLanguages;
				$scope.fullLanguages=fullLanguages;
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
				$scope.brandLastName=1;/*need check*/
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
	      			for(var j=0;j<allretCatDecisions[i].retVariantDecision.length;j++){
	      				allBrands.push({'BrandID':allretCatDecisions[i].retVariantDecision[j].brandID,'BrandName':allretCatDecisions[i].retVariantDecision[j].brandName});
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

			var open = function () {
				console.log("1");
			    $scope.shouldBeOpen = true;
			    setAddNewBrand();
			};
			var close = function () {
				//console.log('111');
			    $scope.shouldBeOpen = false;
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

			var getMoreInfo=function(brandID,varName){
				$scope.moreInfo={'parentBrandID':brandID,'varName':varName};
				$scope.isCollapsed=false;
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		
			var addNewProduct=function(parameter){
				//require(['../js/controllers/untils/calculate'], function (calculate){
					$scope.close=close;
					var newBrand=new RetailerDecision();
					var newretailerDecision=new RetailerDecision();
					newretailerDecision.packFormat="";
					newretailerDecision.dateOfBirth=$scope.period;
					//newretailerDecision.parameter=parameter;
					newretailerDecision.dateOfDeath=10;
			        newretailerDecision.composition=new Array();
			        //newretailerDecision.production="";
			        //newretailerDecision.currentPriceBM="";
			        //newretailerDecision.currentPriceEmall="";
			        newretailerDecision.discontinue=false;
			        //newretailerDecision.nextPriceBM="";
			        //newretailerDecision.nextPriceEmall="";

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
						newBrand.privateLabelVarDecision.push(newretailerDecision);
						RetailerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
					}else{/*add new product under existed Brand*/
						var retVariantDecision=_.find($scope.pageBase.retCatDecision,function(obj){
							return (obj.categoryID==$scope.addNewCategory);
						}); 
						newretailerDecision.parentBrandID=$scope.addChooseBrand;
						newretailerDecision.varName=$scope.addNewVarName;/*need check*/
						var privateLabelVarDecision=_.find(retVariantDecision.retVariantDecision,function(obj){
							return (obj.brandID==newretailerDecision.parentBrandID);
						})
			        	newretailerDecision.varID=calculateVarID(privateLabelVarDecision,newretailerDecision.parentBrandID);//121;/*need check*/
			        	RetailerDecisionBase.addProductExistedBrand(newretailerDecision,$scope.addNewCategory);							
					}
					close();
					$scope.$broadcast('retailerDecisionBaseChanged');
				//});
			}


			$scope.$on('retailerDecisionBaseChanged', function(event){	
				$scope.pageBase=RetailerDecisionBase.getBase();
				showView($scope.retailerID,$scope.period,$scope.category,$scope.language);
				//$scope.$broadcast('closemodal');
			});  
			$scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
			}); 	

	}]);
});