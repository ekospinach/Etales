define(['app'], function(app,underscore) {
		app.controller('producerDecisionStep1Ctrl',
			['$scope','$rootScope','$http','$filter','prodecisions', function($scope,$rootScope,$http,$filter,prodecisions) {
			$rootScope.decisionActive="active";
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

			/*Load Page*/
			var showView=function(user,period,category,language){
				console.log("showView start");
				allProCatDecision=prodecisions.proCatDecision;
				$scope.user=user,$scope.period=period,$scope.category=category,$scope.language=language;
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
				console.log("setAddNewBrand start");
				$scope.parameter=1;/*add new Brand*/
				console.log("setAddNewBrand end");
			}	
			/*set add function is add under a existed brand*/
			var setAddNewProUnderBrand=function(){
				console.log("setAddNewProUnderBrand start");
				$scope.parameter=2;/*add new product under existed Brand*/
				var category=1;
				loadAllBrand(category);
				console.log("setAddNewProUnderBrand end");
				//$scope.alls=[{'BrandID':1,'BrandName':'BrandName1'},{'BrandID':2,'BrandName':'BrandName2'},{'BrandID':3,'BrandName':'BrandName3'}];
			}
			/*LoadSelectCategroy*/
			var loadSelectCategroy=function(category){
				console.log("loadSelectCategroy start");
				return _.filter(allProCatDecision,function(obj){
					if(category=="HealthBeauty"){
						return (obj.categoryID==2);
					}else{
						return (obj.categoryID==1);
					}
	      		});
	      		console.log("loadSelectCategroy end");
			}
			/*LoadAllBrand by category*/
			var loadAllBrand=function(category){
				console.log("loadAllBrand start");
				console.log(category);
				console.log("loadAllBrand end");
				//$scope.alls=[{'BrandID':1,'BrandName':'BrandName1'},{'BrandID':2,'BrandName':'BrandName2'},{'BrandID':3,'BrandName':'BrandName3'}];
				/*if(category==1){
					category="Elecssories";
				}else{
					category="HealthBeauty";
				}
				//console.log(category);
				var allProCatDecision=prodecisions.proCatDecision;
				var allCatProDecisions=loadSelectCategroy(category);
	      		var allbrands=new Array();
	      		for(var i=0;i<allCatProDecisions.length;i++){
	      			for(var j=0;j<allCatProDecisions[i].proBrandsDecision.length;j++){
	      				allbrands.push({'BrandID':allCatProDecisions[i].proBrandsDecision[j].brandID,'BrandName':allCatProDecisions[i].proBrandsDecision[j].brandName});
	      			}	
	      		}
	      		//$scope.allbrands=allbrands;
	      		$scope.allbrands=[{'BrandID':1,'BrandName':'BrandName1'},{'BrandID':2,'BrandName':'BrandName2'},{'BrandID':3,'BrandName':'BrandName3'}];
	      		//$scope.addNewCategory=$scope.allBrands[0].BrandName;*/
			}

			var selectPacks = function(parentBrandName,varName) {
				//console.log($scope.products.length);
				console.log("selectPacks start");
				/*var selected,postion=-1;
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
				}*/
				console.log("selectPacks end");
			};

			var selected=function(category){
				console.log("selected start");
				console.log(category);
				console.log("selected end");
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		
			var addNewProduct=function(parameter){
				console.log(parameter);
			}
			var open = function () {
			    $scope.shouldBeOpen = true;
			    setAddNewBrand();
			};
			var close = function () {
			    $scope.shouldBeOpen = false;
			};

			var language='English',
				user='Producer',
				period=0,
				category='Elecssories';
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.user=user;
			$scope.period=period;
			
			$scope.setAddNewBrand=setAddNewBrand;
			$scope.setAddNewProUnderBrand=setAddNewProUnderBrand;
			$scope.showView=showView;
			$scope.loadSelectCategroy=loadSelectCategroy;
			$scope.loadAllBrand=loadAllBrand;
			$scope.selectPacks=selectPacks;
			$scope.selected=selected;
			$scope.loadNameNum=loadNameNum;
			$scope.addNewProduct=addNewProduct;
			$scope.open=open;
			$scope.close=close;

			$scope.parameter=1;/*default add new Brand*/
			showView($scope.user,$scope.period,$scope.category,$scope.language);
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