define(['angularBootstrap'], function(angularBootstrap) {
	return ['$scope', '$http','$filter', function($scope, $http,$filter) {
		// You can access the scope of the controller from here
		$scope.welcomeMessage = 'hey this is DecisionCtrl.js!';
		// because this has happened asynchroneusly we've missed
		// Angular's initial call to $apply after the controller has been loaded
		// hence we need to explicityly call it at the end of our Controller constructor
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
			var shortLanguages={};
			var fullLanguages={};
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

					//shortLanguages[$scope.multilingual[i].label]=$scope.multilingual[i].label;
				}
			}
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
		$scope.pack = {
			packs: 'E'
		};
		$scope.packs = [
		{value: 'E', text: 'ECONOMY'},
		{value: 'S', text: 'STANDARD'},
		{value: 'P', text: 'PREMIUM'}
		]; 
		$scope.showPacks = function() {
			var selected = $filter('filter')($scope.packs, {value: $scope.pack.packs});
    		return ($scope.pack.packs && selected.length) ? selected[0].text : 'Not set';
		};
		$scope.$apply();
	}];
});