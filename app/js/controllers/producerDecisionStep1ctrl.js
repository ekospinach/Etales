define(['app'], function(app) {
		app.controller('producerDecisionStep1Ctrl',
			['$scope','$q','$rootScope','$location','$http','$filter','ProducerDecision','ProducerDecisionBase','Label', function($scope,$q,$rootScope,$location,$http,$filter,ProducerDecision,ProducerDecisionBase,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.language=Label.getCurrentLanguage(),
			$scope.producerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
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
			ProducerDecisionBase.startListenChangeFromServer();
			ProducerDecisionBase.reload({producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
				$scope.pageBase = base;	
			}).then(function(){
				return promiseStep1();
			}), function(reason){
				console.log('from ctr: ' + reason);
			}, function(update){
				console.log('from ctr: ' + update);
			};

			var promiseStep1=function(){
				var d=$q.defer();
				d.notify('start to show view');
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
					$scope.checkProduction=checkProduction;
					$scope.checkDesign=checkDesign;
					$scope.checkTechnology=checkTechnology;
					$scope.checkRMQ=checkRMQ;
					$scope.checkCurrentBM=checkCurrentBM;
					$scope.checkCurrentEMall=checkCurrentEMall;
					$scope.addNewProduct=addNewProduct;
					$scope.updateProducerDecision=updateProducerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.calculateBrandID=calculateBrandID;
					$scope.calculateVarID=calculateVarID;
					$scope.deleteProduct=deleteProduct;
					$scope.submitDecision=submitDecision;
					var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						if(data.data=="isReady"){
							$scope.isReady=true;
						}else{
							$scope.isReady=false;
						}
						return showView($scope.producerID,$scope.period,$scope.category,$scope.language);
					},function(){
						d.reject('Check ProducersDecision status fail');
					})
				return d.promise;
			}

			var calculateBrandID=function(proBrandsDecision,producerID){
				var result=0,min=10*producerID+1,max=producerID*10+5;
				var nums=new Array();
				for(var i=0;i<proBrandsDecision.proBrandsDecision.length;i++){
					if(proBrandsDecision.proBrandsDecision[i]!=undefined&&proBrandsDecision.proBrandsDecision[i].brandID!=undefined&&proBrandsDecision.proBrandsDecision[i].brandID!=0){
						nums.push(proBrandsDecision.proBrandsDecision[i].brandID);						
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

		    var calculateVarID=function(proVarDecision,parentBrandID){
		    	var result=0;min=parentBrandID*10+1,max=parentBrandID*10+3;
		    	var nums=new Array();
		    	for(var i=0;i<proVarDecision.proVarDecision.length;i++){
					if(proVarDecision.proVarDecision[i]!=undefined&&proVarDecision.proVarDecision[i].varID!=0){
						nums.push(proVarDecision.proVarDecision[i].varID);
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
		    	ProducerDecisionBase.deleteProduct(category,brandName,varName);	
		    }
			/*Load Page*/

			var showView=function(producerID,period,category,language){
				var d=$q.defer();
				$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
				var categoryID=0,count=0,result=0,acMax=0,abMax=0,expend=0,avaiableMax=0;
				var products=new Array();
				var fakeName="";
				if(category=="Elecssories"){
					categoryID=1;
					fakeName="EName";
				}
				else if(category=="HealthBeauty"){
					categoryID=2;
					fakeName="HName";
				}
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			avaiableMax=data.data.budgetAvailable;
	      			if($rootScope.currentPeriod<=1){
	      				abMax=data.data.budgetAvailable;
	      			}else{
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}
					acMax=data.data.productionCapacity[categoryID-1];
	      			url="/producerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/brandName/location/1';
	      			return  $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	       			$scope.surplusExpend=abMax-expend;
	       			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      			url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+fakeName+'/varName';
	      			return $http({
	      				method:'GET',
	      				url:url
	      			});
	      		}).then(function(data){
	      			$scope.surplusProduction=acMax-data.data.result;
					$scope.percentageProduction=(acMax-data.data.result)/acMax*100;

					$scope.producerID=producerID,$scope.period=period,$scope.category=category,$scope.language=language;
					
					if(category=="Elecssories"){
						$scope.EleShow=true;
						$scope.HeaShow=false;
					}
					else if(category=="HealthBeauty"){
						$scope.EleShow=false;
						$scope.HeaShow=true;
	                }
	                var allProCatDecisions=loadSelectCategroy(category);
	                for(var i=0;i<allProCatDecisions.length;i++){
	                	for(var j=0;j<allProCatDecisions[i].proBrandsDecision.length;j++){
	                		if(allProCatDecisions[i].proBrandsDecision[j].brandID!=undefined&&allProCatDecisions[i].proBrandsDecision[j].brandID!=0){
	                			for(var k=0;k<allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
	                				if(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=0&&allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].varID!=undefined){
	                					products.push(allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k]);
	                					products[count].category=category;
	                					products[count].parentBrandName=allProCatDecisions[i].proBrandsDecision[j].brandName;
	                					if(products[count].packFormat=="ECONOMY"){
	                						products[count].packFormat=1;
	                					}
	                					else if(products[count].packFormat=="STANDARD"){
	                						products[count].packFormat=2;
	                					}
	                					else if(products[count].packFormat=="PREMIUM"){
	                						products[count].packFormat=3;
	                					}
	                					products[count].currentPriceBM=parseFloat(products[count].currentPriceBM).toFixed(2);
	                					products[count].currentPriceEmall=parseFloat(products[count].currentPriceEmall).toFixed(2);
	                					count++;
	                				}
	                			}
	                		}
	                	}
	                }
	                if(count==0){
	                	d.reject('load products fail');
	                }
	                $scope.products=products;
	                d.resolve($scope.products);
	      		},function(data){
	      			d.reject('show showView fail');
	      		});	
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
				$scope.brandLastName=$rootScope.user.username.substring($rootScope.user.username.length-1);/*need check*/
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
	      				if(allCatProDecisions[i].proBrandsDecision[j]!=undefined&&allCatProDecisions[i].proBrandsDecision[j].brandID!=undefined&&allCatProDecisions[i].proBrandsDecision[j].brandID!=0){
		      				allBrands.push({'BrandID':allCatProDecisions[i].proBrandsDecision[j].brandID,'BrandName':allCatProDecisions[i].proBrandsDecision[j].brandName});	      					
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
					return ($scope.products[postion].packFormat && selected.length) ? selected[0].text : Label.getContent('Not set'); 
				}
				else{
					return Label.getContent('Not set');	
				}
			};

			var openProductModal = function () {
			    $scope.productModal = true;
			    setAddNewBrand();
			};
			var closeProductModal = function () {
			    $scope.productModal = false;
			    ProducerDecisionBase.reload({producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
					$scope.pageBase = base;	
				}).then(function(){
					return promiseStep1();
				}), function(reason){
					console.log('from ctr: ' + reason);
				}, function(update){
					console.log('from ctr: ' + update);
				};
			};

			var checkProduction=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				var categoryID,max,result;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2;
				}	
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					max=data.data.productionCapacity[categoryID-1];
					url="/productionResult/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					if(parseInt(data.data.result)+parseInt(value)>max){
						d.resolve(Label.getContent('Input range')+':0~'+(max-parseInt(data.data.result)));
					}else{
						d.resolve();
					}
				},function(data){
					d.resolve(Label.getContent('fail'));
				});
				return d.promise;
			}


			var checkDesign=function(category,brandName,varName,location,additionalIdx,index,value){
				var d = $q.defer();	
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a Integer'));
				}
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					if(category=="Elecssories"){
						categoryID=1;
						max=data.data.acquiredDesignLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve(Label.getContent('Input range')+':1~'+max);
						}else{
							d.resolve();
						}
					}else{
						categoryID=2;
						max=data.data.acquiredTechnologyLevel[categoryID-1]+2;
						if(value<1||value>max){
							d.resolve(Label.getContent('Input range')+':1~'+max);
						}else{
							d.resolve();
						}
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				});
				return d.promise;
			}

			var checkTechnology=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a Integer'));
				}
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					if(category=="Elecssories"){
						categoryID=1;
						max=data.data.acquiredTechnologyLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve(Label.getContent('Input range')+':1~'+max);
						}
					}else{
						categoryID=2;
						max=data.data.acquiredTechnologyLevel[categoryID-1];
						if(value<1||value>max){
							d.resolve(Label.getContent('Input range')+':1~'+max);
						}else{
							d.resolve();
						}
					}
					url="/producerCurrentDecision/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+brandName+'/'+varName;
					return $http({
							method:'GET',
							url:url
					});
				}).then(function(data){
					if(data.data.composition[2]>data.data.composition[0]-2){
						if(value>data.data.composition[2]||(value<data.data.composition[0]-2)){
							d.resolve(Label.getContent('Input range')+(data.data.composition[0]-2)+'('+Label.getContent('Design Level')+'-2)'+'~'+data.data.composition[2]+'('+Label.getContent('Quality-of-Raw-Materials')+')');
						}else{
							d.resolve();
						}
					}else{
						if(value>data.data.composition[0]-2||(value<data.data.composition[2])){
							d.resolve(Label.getContent('Input range')+data.data.composition[2]+'('+Label.getContent('Quality-of-Raw-Materials')+')'+'~'+(data.data.composition[0]-2)+'('+Label.getContent('Design Level')+'-2)');
						}else{
							d.resolve();
						}
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				});
				return d.promise;
			}

			var checkRMQ=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0;
				var filter=/^[0-9]*[1-9][0-9]*$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a Integer'));
				}
				if(category=="Elecssories"){
					categoryID=1;
				}else{
					categoryID=2;
				}
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}
					url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
					return $http({
						method:'GET',
						url:url
					});
				}).then(function(data){
					max=data.data.acquiredTechnologyLevel[categoryID-1]+2;
					if(value<1||value>max){
						d.resolve(Label.getContent('Input range')+':1~'+max);
					}else{
						d.resolve();
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				});
				return d.promise;
			}

			var checkCurrentBM=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0,currentUnitCost=0;
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				if(category=="Elecssories"){
					categoryID=1;
				}else{
					categoryID=2;
				}
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}

					var postData = {
						period : $rootScope.currentPeriod,
						seminar : $rootScope.user.seminar,
						brandName : brandName,
						varName : varName,
						catID : categoryID,
						userRole :  $rootScope.userRoles.producer,
						userID : $rootScope.user.roleID,								
					}
					return $http({
						method:'POST',
						url:'/getCurrentUnitCost',
						data:postData
					});
				}).then(function(data){
					currentUnitCost=data.data.result;
					if(value>4*currentUnitCost||value<0.5*currentUnitCost){
						d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+4*currentUnitCost);
					}else{
						d.resolve();
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				})
				return d.promise;
			}

			var checkCurrentEMall=function(category,brandName,varName,location,additionalIdx,index,value){
				var d=$q.defer();
				var categoryID=0,max=0,currentUnitCost=0;
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				if(category=="Elecssories"){
					categoryID=1;
				}else{
					categoryID=2;
				}
				var url='/checkProducerDecision/'+$rootScope.user.seminar+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({
					method:'GET',
					url:url
				}).then(function(data){
					if(data.data=="isReady"){
						d.resolve(Label.getContent('Check Error'));
					}
					var postData = {
						period : $rootScope.currentPeriod,
						seminar : $rootScope.user.seminar,
						brandName : brandName,
						varName : varName,
						catID : categoryID,
						userRole :  $rootScope.userRoles.producer,
						userID : $rootScope.user.roleID,								
					}
					return $http({
						method:'POST',
						url:'/getCurrentUnitCost',
						data:postData
					});
				}).then(function(data){
					currentUnitCost=data.data.result;
					if(value>6*currentUnitCost||value<0.5*currentUnitCost){
						d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+6*currentUnitCost);
					}else{
						d.resolve();
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				})
				return d.promise;
			}

			var updateProducerDecision=function(category,brandName,varName,location,additionalIdx,index){
				var categoryID;
				if(category=="Elecssories"){
					categoryID=1;
				}
				else{
					categoryID=2
				}
				if(location=="composition"){
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,$scope.products[index][location][additionalIdx]);							
				}
				else{
					ProducerDecisionBase.setProducerDecisionValue(categoryID,brandName,varName,location,additionalIdx,$scope.products[index][location]);													
				}
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(brandName,varName){
				var catID;
				if($scope.category=="Elecssories"){
					$scope.isElecssories = true;
					$scope.isHealthBeauty = false;
					catID = 1;
				}
				else{
					$scope.isElecssories = false;
					$scope.isHealthBeauty = true;
					catID = 2;
				}				
				$scope.isCollapsed=false;
				url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/P/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
				$http({method: 'GET', url: url})
				.then(function(data) {
					//console.log($scope.variantHistory);
					$scope.companyHistory=data.data;
					var postData = {
					    period : $rootScope.currentPeriod,
					    seminar : $rootScope.user.seminar,
					    brandName : brandName,
					    varName : varName,
					    catID : catID,
					    userRole :  $rootScope.userRoles.producer,
					    userID : $rootScope.user.roleID,								
					}
					return $http({method:'POST', url:'/getCurrentUnitCost', data:postData});
				}).then(function(data){
				   $scope.currentUnitCost = data.data.result;
				   var url='/variantHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+brandName+'/'+varName;
				   return $http({method: 'GET', url: url});
				}).then(function(data){
					$scope.variantHistory=data.data;
				},function(err){
					$scope.variantHistory=new Array();
					$scope.showNewHistory={
						brandName:brandName,
						varName:varName
					}
					console.log('read history info fail:' + err.data);
				});
			}

			var submitDecision=function(){
				var queryCondition={
					producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
					seminar:$rootScope.user.seminar
				}
				$http({
					method:'POST',
					url:'/submitDecision',
					data:queryCondition
				}).then(function(data){
					$location.path('/producerDecisionStep2');
				},function(err){
					console.log('fail');
				})
			}

			var addNewProduct=function(parameter){
				var newBrand=new ProducerDecision();
				var nullDecision=new ProducerDecision();
				nullDecision.packFormat="ECONOMY";
				nullDecision.dateOfBirth=0;
				nullDecision.dateOfDeath=0;
		        nullDecision.composition=new Array(1,1,1);
		        nullDecision.production=0;
		        nullDecision.currentPriceBM=0;
		        nullDecision.currentPriceEmall=0;
		        nullDecision.discontinue=false;
			    nullDecision.nextPriceBM=0;
			    nullDecision.nextPriceEmall=0;
			    nullDecision.parentBrandID=0;
				nullDecision.varName="";/*need check*/
				nullDecision.varID=0;/*need check*/

				var newproducerDecision=new ProducerDecision();
				newproducerDecision.packFormat="ECONOMY";
				newproducerDecision.dateOfBirth=$scope.period;
				newproducerDecision.dateOfDeath=10;
		        newproducerDecision.composition=new Array(1,1,1);
		        newproducerDecision.production=0;
		        newproducerDecision.currentPriceBM=0;
		        newproducerDecision.currentPriceEmall=0;
		        newproducerDecision.discontinue=false;
			    newproducerDecision.nextPriceBM=0;
			    newproducerDecision.nextPriceEmall=0;
			    var url="";
				if(parameter=="NewBrand"){/*lauch new Brand*/
					var proBrandsDecision=_.find($scope.pageBase.proCatDecision,function(obj){
						return (obj.categoryID==$scope.lauchNewCategory);
					});
					newBrand.brandID=calculateBrandID(proBrandsDecision,$scope.producerID);
					newBrand.brandName=$scope.brandFirstName+$scope.lauchNewBrandName+$rootScope.user.username.substring($rootScope.user.username.length-1);
					newBrand.paranetCompanyID=$scope.producerID;
					newBrand.dateOfDeath=10;
					newBrand.dateOfBirth=$scope.period;
					newBrand.advertisingOffLine=new Array(0,0);
					newBrand.advertisingOnLine=0;
					newBrand.supportEmall=0;
					newBrand.supportTraditionalTrade=new Array(0,0);
					newBrand.proVarDecision=new Array();
					newproducerDecision.parentBrandID=newBrand.brandID;
					newproducerDecision.varName='_'+$scope.lauchNewVarName;/*need check*/
					newproducerDecision.varID=10*newBrand.brandID+1;/*need check*/
					//need add 2 null vars
					newBrand.proVarDecision.push(newproducerDecision,nullDecision,nullDecision);

					url="/checkProducerProduct/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$scope.lauchNewCategory+'/brand/'+newBrand.brandName+'/'+newproducerDecision.varName;
					$http({
						method:'GET',
						url:url
					}).then(function(data){
						ProducerDecisionBase.addProductNewBrand(newBrand,$scope.lauchNewCategory);
						showbubleMsg(Label.getContent('Add new brand successful'),2);
						closeProductModal();
					},function(data){
						showbubleMsg(Label.getContent('Add new brand fail')+','+Label.getContent(data.data.message),1);
					})
				}else{/*add new product under existed Brand*/
					var proBrandsDecision=_.find($scope.pageBase.proCatDecision,function(obj){
						return (obj.categoryID==$scope.addNewCategory);
					});
					newproducerDecision.parentBrandID=$scope.addChooseBrand;
					newproducerDecision.varName='_'+$scope.addNewVarName;/*need check*/
					var proVarDecision=_.find(proBrandsDecision.proBrandsDecision,function(obj){
						return (obj.brandID==newproducerDecision.parentBrandID);
					});
			       	newproducerDecision.varID=calculateVarID(proVarDecision,newproducerDecision.parentBrandID);//121;/*need check*/
			        var newBrandName=""; 
			       	for(var i=0;i<$scope.allBrands.length;i++){
			       		if($scope.allBrands[i].BrandID==newproducerDecision.parentBrandID){
			       			newBrandName=$scope.allBrands[i].BrandName;
			       			break;
			       		}
			       	}
			       	url="/checkProducerProduct/"+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$scope.lauchNewCategory+'/variant/'+newBrandName+'/'+newproducerDecision.varName;
			       	
			       	$http({
						method:'GET',
						url:url
					}).then(function(data){
						ProducerDecisionBase.addProductExistedBrand(newproducerDecision,$scope.addNewCategory,newBrandName);
						showbubleMsg(Label.getContent('Add new variant successful'),2);
						closeProductModal();
					},function(data){
						showbubleMsg(Label.getContent('Add new variant fail')+','+Label.getContent(data.data.message),1);
					})
				}
			}
 
	 		var showbubleMsg = function(content, status){
		 		$scope.bubleMsg = ' ' + content;
		 		switch(status){
		 			case 1: 
		 				$scope.bubleClassName = 'alert alert-danger'; 
		 				$scope.bubleTitle = Label.getContent('Error')+'!';
		 				break;
		 			case 2: 
		 				$scope.bubleClassName = 'alert alert-success'; 
		 				$scope.bubleTitle = Label.getContent('Success')+'!';
		 				break;
		 			case 3:
		 				$scope.bubleClassName = 'alert alert-block'; 
		 				$scope.bubleTitle = Label.getContent('Warning')+'!';
		 				break;	 			
		 			default:
		 			 $scope.bubleClassName = 'alert'; 
		 		}
		 		console.log('infoBuble.show');
		 		$scope.infoBuble = true;
		 	};
			
			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
				ProducerDecisionBase.reload({producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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