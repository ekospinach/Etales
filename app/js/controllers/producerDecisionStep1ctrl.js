define(['app'], function(app) {
		app.controller('producerDecisionStep1Ctrl',
			['$scope','$rootScope','$http','$filter','prodecisions','ProducerDecision', function($scope,$rootScope,$http,$filter,prodecisions,ProducerDecision) {
			$rootScope.decisionActive="active";
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
			//read addProCatDecision;
			$scope.allProCatDecision=prodecisions.proCatDecision;
			/*Load Page*/
			var showView=function(producerID,period,category,language){
				console.log("showView start");
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
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
				var allCatProDecisions=loadSelectCategroy(category);
	      		var count=0;
	      		var products=new Array();
	      		for(var i=0;i<allCatProDecisions.length;i++){
	      			for(var j=0;j<allCatProDecisions[i].proBrandsDecision.length;j++){
	      				for(var k=0;k<allCatProDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
	      					products.push(allCatProDecisions[i].proBrandsDecision[j].proVarDecision[k]);
	      					products[count].category=category;
	      					products[count].parentBrandName=allCatProDecisions[i].proBrandsDecision[j].brandName;
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
	      		$scope.products=products;
				$scope.shortLanguages=shortLanguages;
				$scope.fullLanguages=fullLanguages;
				console.log("showView end");
			}
			/*set add function is lauch new Brand*/
			var setAddNewBrand=function(){
				$scope.parameter=1;/*add new Brand*/
				$scope.lauchNewCategory=1;
				setBrandName($scope.lauchNewCategory);
			}	
			/*set add function is add under a existed brand*/
			var setAddNewProUnderBrand=function(){
				$scope.parameter=2;/*add new product under existed Brand*/
				$scope.addNewCategory=1;
				loadAllBrand($scope.addNewCategory);
			}
			/*LoadSelectCategroy*/
			var loadSelectCategroy=function(category){
				return _.filter($scope.allProCatDecision,function(obj){
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
				var allCatProDecisions=loadSelectCategroy(category);
	      		var allBrands=new Array();
	      		for(var i=0;i<allCatProDecisions.length;i++){
	      			for(var j=0;j<allCatProDecisions[i].proBrandsDecision.length;j++){
	      				allBrands.push({'BrandID':allCatProDecisions[i].proBrandsDecision[j].brandID,'BrandName':allCatProDecisions[i].proBrandsDecision[j].brandName});
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

			var selected=function(category){
				console.log(category);
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		
			var addNewProduct=function(parameter){
				var newBrand=new ProducerDecision();
				var newproducerDecision=new ProducerDecision();
					newproducerDecision.packFormat="";
					newproducerDecision.dateOfBirth=$scope.period;
					newproducerDecision.parameter=parameter;
					newproducerDecision.dateOfDeath="";
			        newproducerDecision.composition=new Array();
			        newproducerDecision.production="";
			        newproducerDecision.currentPriceBM="";
			        newproducerDecision.currentPriceEmall="";
			        newproducerDecision.discontinue=false;
			        newproducerDecision.nextPriceBM="";
			        newproducerDecision.nextPriceEmall="";
				if(parameter==1){/*lauch new Brand*/
					newBrand.brandID=15;/*need check*/
					//newBrandID=
					var proBrandsDecision=_.find($scope.allProCatDecision,function(obj){
						return (obj.categoryID==$scope.lauchNewCategory);
					});
					require(['../js/controllers/untils/calculate'], function (calculate){
　　　　                 //$scope.calculateBrandID=
						newproducerDecision.brandID=calculate.calculateBrandID(proBrandsDecision,$scope.producerID);
						console.log(newproducerDecision.brandID);
						newBrand.brandName=$scope.brandFirstName+$scope.lauchNewBrandName+$scope.brandLastName;
						newBrand.paranetCompanyID=$scope.producerID;
						newBrand.dateOfDeath="";
						newBrand.dateOfBirth=$scope.period;
						newBrand.advertisingOffLine=new Array();
						newBrand.advertisingOnLine="";
						newBrand.supportEmall="";
						newBrand.supportTraditionalTrade=new Array();
						newBrand.proVarDecision=new Array();

						newproducerDecision.parentBrandID=newBrand.brandID;
						newproducerDecision.varName=$scope.lauchNewVarName;/*need check*/
						newproducerDecision.varID=121;/*need check*/
						newBrand.proVarDecision.push(newproducerDecision);
						//$scope.allProCatDecision[$scope.lauchNewCategory-1].proBrandsDecision.push(newBrand);
						for(var i=0;i<$scope.allProCatDecision.length;i++){
							if($scope.allProCatDecision[i].categoryID=$scope.categoryID){
								$scope.allProCatDecision[i].proBrandsDecision.push(newBrand);
								break;
							}
						}
						//console.log($scope.allProCatDecision);
			    		//close();
			    		//showView($scope.producerID,$scope.period,$scope.category,$scope.language);	
　　　　             });
					//var newBrandID=
					//newproducerDecision.brandID=calculateBrandID(proBrandsDecision,$scope.producerID);
					
				}else{/*add new product under existed Brand*/
					newproducerDecision.parentBrandID=$scope.addChooseBrand;
					newproducerDecision.varName=$scope.addNewVarName;/*need check*/
			        newproducerDecision.varID=121;/*need check*/

			        for(var i=0;i<$scope.allProCatDecision.length;i++){
			        	for(var j=0;j<$scope.allProCatDecision[i].proBrandsDecision.length;j++){
			        		if($scope.allProCatDecision[i].proBrandsDecision[j].brandID==newproducerDecision.parentBrandID){
			        			$scope.allProCatDecision[i].proBrandsDecision[j].proVarDecision.push(newproducerDecision);
			        			break;
			        		}
			        	}
			        }
				}
				console.log($scope.allProCatDecision);
			    close();
			    showView($scope.producerID,$scope.period,$scope.category,$scope.language);
			}
			var open = function () {
			    $scope.shouldBeOpen = true;
			    setAddNewBrand();
			};
			var close = function () {
			    $scope.shouldBeOpen = false;
			};

			var language='English',
				producerID=1,
				period=0,
				category='Elecssories';
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.producerID=producerID;
			$scope.period=period;
			
			$scope.setAddNewBrand=setAddNewBrand;
			$scope.setAddNewProUnderBrand=setAddNewProUnderBrand;
			$scope.showView=showView;
			$scope.loadSelectCategroy=loadSelectCategroy;
			$scope.setBrandName=setBrandName;
			$scope.loadAllBrand=loadAllBrand;
			$scope.selectPacks=selectPacks;
			$scope.selected=selected;
			$scope.loadNameNum=loadNameNum;
			$scope.addNewProduct=addNewProduct;
			//console.log("111");
			/*require(['../js/functions/addNewProduct'], function (addNewProduct){
　　　　			$scope.addNewProduct=addNewProduct.addNewProduct;
　　　　		});*/
			//$scope.addNewProduct=addProduct.addNewProduct;
			$scope.open=open;
			$scope.close=close;

			$scope.parameter=1;/*default add new Brand*/
			showView($scope.producerID,$scope.period,$scope.category,$scope.language);
			$scope.packs = [
			{value: 1, text: 'ECONOMY'},
			{value: 2, text: 'STANDARD'},
			{value: 3, text: 'PREMIUM'}
			]; 
			/*Angular-ui-bootstrap modal start*/

			$scope.opts = {
			    backdropFade: true,
			    dialogFade:true
			};
			/*Angular-ui-bootstrap modal end*/

     	

	}]);
});