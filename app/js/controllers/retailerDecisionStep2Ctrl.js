define(['app'], function(app) {
		app.controller('retailerDecisionStep2Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase) {
			$rootScope.decisionActive="active";
			//var calculate='../js/controllers/untils/calculate.js';
			//var calculate=require('');
			var multilingual=[{
						'shortName':'MN',
						'labelENG':'MarketName',
						'labelRUS':'',
						'labelCHN':'产品组合管理',
						'label':''
					},{
						'shortName':'ISL',
						'labelENG':'In-Store service Level',
						'labelRUS':'',
						'labelCHN':'品类',
						'label':''
					},{
						'shortName':'HSSA',
						'labelENG':'HealthBeauty Selling surface allocation (%)',
						'labelRUS':'',
						'labelCHN':'包',
						'label':''					
					},{
						'shortName':'ESSA',
						'labelENG':'Elecssories Selling surface allocation (%)',
						'labelRUS':'',
						'labelCHN':'技术水平',
						'label':''
					},{
						'shortName':'LCA',
						'labelENG':'Local Convenience Advertising',
						'labelRUS':'',
						'labelCHN':'活性剂',
						'label':''
					},{
						'shortName':'LAA',
						'labelENG':'Local Assortment Advertising',
						'labelRUS':'',
						'labelCHN':'增滑技术',
						'label':''
					},{
						'shortName':'LPA',
						'labelENG':'Local Price Advertising',
						'labelRUS':'',
						'labelCHN':'下一步',
						'label':''
					},{
						'shortName':'AEP',
						'labelENG':'Allocate Empty Place',
						'labelRUS':'',
						'labelCHN':'下一步',
						'label':''
					}];
			$scope.packs = [{
				value: 1, text: 'BASE'
			},{
				value: 2, text: 'FAIR'
			},{
				value: 3, text: 'MEDIUM'
			},{
				value: 4, text: 'ENHANCED'
			},{
				value: 5, text: 'PREMIUM'
			}]; 
			var language='English',
				retailerID=1,
				period=0,
				isCollapsed=true;
				$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.language=language;
			$scope.retailerID=retailerID;
			$scope.period=period;

			RetailerDecisionBase.reload({period:'0',seminar:'MAY',retailerID:1}).then(function(base){
			//ProducerDecisionBase.reload({period:'0', seminar:'MAY', retailerID:1}).then(function(base){
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

					$scope.showView=showView;
					$scope.updateMarketDecision=updateMarketDecision;
					$scope.getMarketMoreInfo=getMarketMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.selectPacks=selectPacks;
				var result=showView($scope.retailerID,$scope.period,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}

			var selectPacks = function(marketID) {
				//console.log('testSelectPacks');
				var selected,postion=-1;
				for(var i=0;i<$scope.markets.length;i++){
					if($scope.markets[i].marketID==marketID){
						selected = $filter('filter')($scope.packs, {value: $scope.markets[i].serviceLevel});
						postion=i;
						break;
					}
				}
				if(postion!=-1){
					return ($scope.markets[postion].serviceLevel && selected.length) ? selected[0].text : 'Not set'; 
				}
				else{
					return 'Not set';	
				}
			};

			/*Load Page*/
			var showView=function(retailerID,period,language){
				$scope.retailerID=retailerID,$scope.period=period,$scope.language=language;
				var shortLanguages={},fullLanguages={};
				var markets=new Array();
				if(language=="English"){
					for(var i=0;i<$scope.multilingual.length;i++){
						$scope.multilingual[i].label=$scope.multilingual[i].labelENG;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						fullLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
					}
				}
				else if(language=="Chinese"){
					for(var i=0;i<$scope.multilingual.length;i++){
						$scope.multilingual[i].label=$scope.multilingual[i].labelCHN;
						shortLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].shortName;
						fullLanguages[$scope.multilingual[i].shortName]=$scope.multilingual[i].label;
					}
				}
	      		var count=0,result=0;
	      		result=1;
	      		for(var i=0;i<$scope.pageBase.retMarketDecision.length;i++){
	      			if($scope.pageBase.retMarketDecision[i].marketID==1){
	      				$scope.pageBase.retMarketDecision[i].marketName="Urban";			
	      			}else if($scope.pageBase.retMarketDecision[i].marketID==2){
	      				$scope.pageBase.retMarketDecision[i].marketName="Rural";
	      			}
	      			if($scope.pageBase.retMarketDecision[i].serviceLevel=="BASE"){
	      				$scope.pageBase.retMarketDecision[i].serviceLevel=1;
	      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="FAIR"){
	      				$scope.pageBase.retMarketDecision[i].serviceLevel=2;
	      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="MEDIUM"){
	      				$scope.pageBase.retMarketDecision[i].serviceLevel=3;
	      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="ENHANCED"){
	      				$scope.pageBase.retMarketDecision[i].serviceLevel=4;
	      			}else if($scope.pageBase.retMarketDecision[i].serviceLevel=="PREMIUM"){
	      				$scope.pageBase.retMarketDecision[i].serviceLevel=5;
	      			}
	      			markets.push($scope.pageBase.retMarketDecision[i]);
	      		}
	      		$scope.markets=markets;
	      		console.log(markets);
				$scope.shortLanguages=shortLanguages;
				$scope.fullLanguages=fullLanguages;
				return result;
			}

			var updateMarketDecision=function(marketID,location,postion,tep,index){
				//RetailerDecisionBase.setDetailerDecisionBase(location,postion,$scope.pageBase[location][postion]);
				//ProducerDecisionBase.setProducerDecisionCategory(location,postion,$scope.categorys[index][location]);
				if(location=="categorySurfaceShare"){
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,tep,$scope.markets[index][location][tep]);					
				}
				else if(location=="localAdvertising"){
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,postion,$scope.markets[index][location][postion]);					
				}
				else{
					RetailerDecisionBase.setMarketDecisionBase(marketID,location,postion,$scope.markets[index][location]);										
				}
				$scope.$broadcast('retailerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMarketMoreInfo=function(marketID){
				$scope.moreInfo={'marketID':marketID};
				$scope.isCollapsed=false;
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		

			$scope.$on('retailerDecisionBaseChanged', function(event){	
				$scope.pageBase=RetailerDecisionBase.getBase();
				showView($scope.retailerID,$scope.period,$scope.language);
				$scope.$broadcast('closemodal');

			});  
			$scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
			}); 	

	}]);
});