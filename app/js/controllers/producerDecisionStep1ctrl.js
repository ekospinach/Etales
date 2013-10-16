define(['app'], function(app,underscore) {

		app.controller('producerDecisionStep1Ctrl',
			['$scope','$rootScope','$http','$filter','prodecisions', function($scope,$rootScope,$http,$filter,prodecisions) {
			
			//console.log(prodecisions.proCatDecision);
			$rootScope.decisionActive="active";
			var allProCatDecision=prodecisions.proCatDecision;
			/*var allproducts=[{
				'Category':'Elecssories',
				'Brand':'ELAND1',
				'Variant':'_A',
				'PF':'ECONOMY',
				'TL':5,
				'DI':5,
				'RMQ':5,
				'EPV':70,
				'DTP':false
			},{
				'Category':'Elecssories',
				'Brand':'ELAND1',
				'Variant':'_A',
				'PF':'ECONOMY',
				'TL':5,
				'DI':5,
				'RMQ':5,
				'EPV':70,
				'DTP':false
			},{
				'Category':'Elecssories',
				'Brand':'ELAND1',
				'Variant':'_A',
				'PF':'ECONOMY',
				'TL':5,
				'DI':5,
				'RMQ':5,
				'EPV':70,
				'DTP':false
			},{
				'Category':'Elecssories',
				'Brand':'ELAND1',
				'Variant':'_A',
				'PF':'ECONOMY',
				'TL':5,
				'DI':5,
				'RMQ':5,
				'EPV':70,
				'DTP':false
			},{
				'Category':'HealthBeauty',
				'Brand':'HOLAY1',
				'Variant':'_A',
				'PF':'PREMIUM',
				'TL':7,
				'AA':7,
				'SL':7,
				'EPV':6,
				'DTP':false
			},{
				'Category':'HealthBeauty',
				'Brand':'HOLAY1',
				'Variant':'_A',
				'PF':'PREMIUM',
				'TL':7,
				'AA':7,
				'SL':7,
				'EPV':6,
				'DTP':false
			},{
				'Category':'HealthBeauty',
				'Brand':'HOLAY1',
				'Variant':'_A',
				'PF':'PREMIUM',
				'TL':7,
				'AA':7,
				'SL':7,
				'EPV':6,
				'DTP':false
			},{
				'Category':'HealthBeauty',
				'Brand':'HOLAY1',
				'Variant':'_A',
				'PF':'PREMIUM',
				'TL':7,
				'AA':7,
				'SL':7,
				'EPV':6,
				'DTP':false
			}];*/
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

			var showView=function(user,period,category,language){
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
						//shortLanguages[$scope.multilingual[i].label]=$scope.multilingual[i].label;
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
				var allCatProDecisions=_.filter(allProCatDecision,function(obj){
					if(category=="HealthBeauty"){
						return (obj.categoryID==2);
					}else{
						return (obj.categoryID==1);
					}
	      		});
	      		//$scope.products=allCatProDecisions[0].proBrandsDecision;
	      		var count=0;
	      		var products=new Array();
	      		for(var i=0;i<allCatProDecisions.length;i++){
	      			for(var j=0;j<allCatProDecisions[i].proBrandsDecision.length;j++){
	      				for(var k=0;k<allCatProDecisions[i].proBrandsDecision[j].proVarDecision.length;k++){
	      					products.push(allCatProDecisions[i].proBrandsDecision[j].proVarDecision[k]);
	      					products[count].category=category;
	      					console.log(allCatProDecisions[i].proBrandsDecision[j].brandName);
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
	      		//count=0;
	      		$scope.products=products;
				$scope.shortLanguages=shortLanguages;
				$scope.fullLanguages=fullLanguages;
			}


			var language='English',
				user='Producer',
				period=0,
				category='Elecssories';
			$scope.multilingual=multilingual;
			$scope.category=category;
			$scope.language=language;
			$scope.user=user;
			$scope.period=period;
			$scope.showView=showView;
			showView($scope.user,$scope.period,$scope.category,$scope.language); 
			$scope.packs = [
			{value: 1, text: 'ECONOMY'},
			{value: 2, text: 'STANDARD'},
			{value: 3, text: 'PREMIUM'}
			]; 
			$scope.showPacks = function(parentBrandName,varName) {
				/*var pro=_.find($scope.products,function(obj){
					return (obj.parentBrandName==parentBrandName&&obj.varName==varName);
				});
				var selected = $filter('filter')($scope.packs, {value: pro.packFormat});
				var ducts=_.reject($scope.products,function(obj){
					return (obj.parentBrandName==parentBrandName&&obj.varName==varName);
				});*/
				var selected;
				var postion=-1;
				console.log('done');
				for(var i=0;i<$scope.products.length;i++){
					if($scope.products[i].parentBrandName==parentBrandName&&$scope.products[i].varName==varName){
						//$scope.products[i].packFormat
						selected = $filter('filter')($scope.packs, {value: $scope.products[i].packFormat});
						postion=i;
						break;
						//return (pro.packFormat && selected.length) ? selected[0].text : 'Not set';
					}
				}
				if(postion!=-1)
					return ($scope.products[postion].packFormat && selected.length) ? selected[0].text : 'Not set'; 
				else
					return 'Not set';
			};
			$scope.open = function () {
				console.log("1");
			    $scope.shouldBeOpen = true;
			};

			$scope.close = function () {
				console.log("2");
			    //$scope.closeMsg = 'I was closed at: ' + new Date();
			    $scope.shouldBeOpen = false;
			};

			$scope.opts = {
			    backdropFade: true,
			    dialogFade:true
			};
	}]);
});