define(['app'], function(app) {
		app.controller('producerDecisionStep1Ctrl',
			['$scope','$q','$rootScope','$http','$filter','ProducerDecision','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,ProducerDecision,ProducerDecisionBase) {
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
				producerID=1,
				period=0,
				category='Elecssories',
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.producerID=producerID;
			$scope.period=period;

			$scope.packs = [{
				value: 1, text: 'ECONOMY'
			},{
				value: 2, text: 'STANDARD'
			},{
				value: 3, text: 'PREMIUM'
			}]; 

			//$scope.open=open;
			//$scope.close=close;

			$scope.parameter="NewBrand";/*default add new Brand*/

			/*Angular-ui-bootstrap modal start*/

			$scope.opts = {
			    backdropFade: true,
			    dialogFade:true
			};
			/*Angular-ui-bootstrap modal end*/		
			ProducerDecisionBase.reload({period:'0', seminar:'MAY', producerID:1}).then(function(base){
				$scope.pageBase = base;
				//ProducerDecisionBase.setSomething('TEST');	
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
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
				var result=showView($scope.producerID,$scope.period,$scope.category,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}


			/*Load Page*/
			var showView=function(producerID,period,category,language){
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
	      		var count=0,result=0;
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
				return _.filter($scope.pageBase.proCatDecision,function(obj){
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

			var updateProducerDecision=function(category,brandName,varName,location,addtionalIdx,index){
				var categoryID;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2
				}
				if(location=="composition"){
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,$scope.products[index][location][addtionalIdx]);							
				}
				else{
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,addtionalIdx,$scope.products[index][location]);													
				}
				$scope.$broadcast('producerDecisionBaseChanged');
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
				require(['../js/controllers/untils/calculate'], function (calculate){
					$scope.close=close;
					var newBrand=new ProducerDecision();
					var newproducerDecision=new ProducerDecision();
					newproducerDecision.packFormat="";
					newproducerDecision.dateOfBirth=$scope.period;
					newproducerDecision.parameter=parameter;
					newproducerDecision.dateOfDeath=10;
			        newproducerDecision.composition=new Array();
			        newproducerDecision.production="";
			        newproducerDecision.currentPriceBM="";
			        newproducerDecision.currentPriceEmall="";
			        newproducerDecision.discontinue=false;
			        newproducerDecision.nextPriceBM="";
			        newproducerDecision.nextPriceEmall="";
			        var proBrandsDecision=_.find($scope.pageBase.proCatDecision,function(obj){
						return (obj.categoryID==$scope.lauchNewCategory);
					});
					if(parameter=="NewBrand"){/*lauch new Brand*/
						newBrand.brandID=calculate.calculateBrandID(proBrandsDecision,$scope.producerID);
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
						newproducerDecision.varID=10*newBrand.brandID+1;/*need check*/
						newBrand.proVarDecision.push(newproducerDecision);
						ProducerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
						$scope.$broadcast('producerDecisionBaseChanged');
					}else{/*add new product under existed Brand*/
						newproducerDecision.parentBrandID=$scope.addChooseBrand;
						newproducerDecision.varName=$scope.addNewVarName;/*need check*/
						var proVarDecision=_.find(proBrandsDecision.proBrandsDecision,function(obj){
							return (obj.brandID==newproducerDecision.parentBrandID);
						})
			        	newproducerDecision.varID=calculate.calculateVarID(proVarDecision,newproducerDecision.parentBrandID);//121;/*need check*/
			        	ProducerDecisionBase.addProductExistedBrand(newproducerDecision,$scope.lauchNewCategory);	
						$scope.$broadcast('producerDecisionBaseChanged');
					}
				});
			}

			$scope.$on('closemodal',function(event){
				$scope.shouldBeOpen = false;
			});

			$scope.$on('producerDecisionBaseChanged', function(event){	
				$scope.pageBase=ProducerDecisionBase.getBase();
				showView($scope.producerID,$scope.period,$scope.category,$scope.language);
				$scope.$broadcast('closemodal');
			});  
			
			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
			}); 	

	}]);
});