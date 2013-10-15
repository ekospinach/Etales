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
	      					products[count].brandName=allCatProDecisions[i].proBrandsDecision[j].brandName;
	      					count++;
	      					/*if(products[count].packFormat=="ECONOMY"){
	      						products[count].packFormat=1;
	      					}
	      					else if(products[count].packFormat=="STANDARD"){
	      						products[count].packFormat=2;
	      					}
	      					else if(products[count].packFormat=="PREMIUM"){
	      						products[count].packFormat=3;
	      					}*/
	      					//count++;
	      				}
	      			}
	      		}
	      		$scope.products=products;
	      		//console.log($scope.brands);
				console.log($scope.products);
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
			$scope.user = {
				name: 'awesome user'
			};  
			/*$scope.pack = {
				packs: 'E'
			};*/
			$scope.packs = [
			{value: 1, text: 'ECONOMY'},
			{value: 2, text: 'STANDARD'},
			{value: 3, text: 'PREMIUM'}
			]; 
			$scope.showPacks = function() {
				//console.log($scope.products.packFormat);
				console.log('do');
				var selected = $filter('filter')($scope.packs, {value: 1});
	    		return (1 && selected.length) ? selected[0].text : 'Not set';
			};

			$scope.random = function() {
		    var value = Math.floor((Math.random()*100)+1);
		    var type;

		    if (value < 25) {
		      type = 'success';
		    } else if (value < 50) {
		      type = 'info';
		    } else if (value < 75) {
		      type = 'warning';
		    } else {
		      type = 'danger';
		    }

		    $scope.dynamic = value;
		    $scope.dynamicObject = {
		      value: value,
		      type: type
		    };
		  };
		  $scope.random();


		  var types = ['success', 'info', 'warning', 'danger'];
		  $scope.randomStacked = function() {
		    $scope.stackedArray = [];
		    $scope.stacked = [];
		    
		    var n = Math.floor((Math.random()*4)+1);

		    for (var i=0; i < n; i++) {
		        var value = Math.floor((Math.random()*30)+1);
		        $scope.stackedArray.push(value);
		        
		        var index = Math.floor((Math.random()*4));
		        $scope.stacked.push({
		          value: value,
		          type: types[index]
		        });
		    }
		  };
		  $scope.randomStacked();

	   // $scope.$apply();
	}]);


});