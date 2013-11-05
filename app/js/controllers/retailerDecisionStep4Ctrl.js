define(['app'], function(app) {
		app.controller('retailerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase,ProducerDecisionBase) {
			$rootScope.decisionActive="active";
			//var calculate='../js/controllers/untils/calculate.js';
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
						'shortName':'UOV',
						'labelENG':'Urban Order Volume',
						'labelRUS':'',
						'labelCHN':'包',
						'label':''					
					},{
						'shortName':'USS',
						'labelENG':'Urban Shelf Space',
						'labelRUS':'',
						'labelCHN':'技术水平',
						'label':''
					},{
						'shortName':'URP',
						'labelENG':'Urban Retail Price',
						'labelRUS':'',
						'labelCHN':'活性剂',
						'label':''
					},{
						'shortName':'UPF',
						'labelENG':'Urban Promotions Frequency',
						'labelRUS':'',
						'labelCHN':'增滑技术',
						'label':''
					},{
						'shortName':'URR',
						'labelENG':'Urban Reduction Rate',
						'labelRUS':'',
						'labelCHN':'估计产量',
						'label':''				
					},{
						'shortName':'ROV',
						'labelENG':'Rrban Order Volume',
						'labelRUS':'',
						'labelCHN':'包',
						'label':''					
					},{
						'shortName':'RSS',
						'labelENG':'Rrban Shelf Space',
						'labelRUS':'',
						'labelCHN':'技术水平',
						'label':''
					},{
						'shortName':'RRP',
						'labelENG':'Rrban Retail Price',
						'labelRUS':'',
						'labelCHN':'活性剂',
						'label':''
					},{
						'shortName':'RPF',
						'labelENG':'Rrban Promotions Frequency',
						'labelRUS':'',
						'labelCHN':'增滑技术',
						'label':''
					},{
						'shortName':'RRR',
						'labelENG':'Rrban Reduction Rate',
						'labelRUS':'',
						'labelCHN':'估计产量',
						'label':''				
					}];
			var language='English',
				retailerID=1,
				period=0,
				category="Elecssories",
				market="Urban",
				shouldShow="",
				shouldHide="none",
				isCollapsed=true;
			$scope.isCollapsed=isCollapsed;
			$scope.multilingual=multilingual;
			$scope.language=language;
			$scope.retailerID=retailerID;
			$scope.period=period;
			$scope.category=category;
			$scope.market=market;
			$scope.shouldShow=shouldShow;
			$scope.shouldHide=shouldHide;

			
			ProducerDecisionBase.startListenChangeFromServer();
			RetailerDecisionBase.reload({retailerID:$rootScope.rootRetailerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}).then(function(base){
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
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.open=open;
					$scope.close=close;
					$scope.addOrder=addOrder;
					$scope.deleteOrder=deleteOrder;
				var result=showView($scope.retailerID,$scope.period,$scope.category,$scope.market,$scope.language);
				delay.resolve(result);
				if (result==1) {
					delay.resolve(result);
				} else {
					delay.reject('showView error,products is null');
				}
				return delay.promise;
			}

			var open = function () {
			    $scope.shouldBeOpen = true;
			};
			var close = function () {
			    $scope.shouldBeOpen = false;
			};

			var loadAllOder=function(){
				ProducerDecisionBase.reload({producerID:1,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}).then(function(base){
					$scope.pageBase = base;	
				}).then(function(){
					ProducerDecisionBase.reload({producerID:1,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar});
				}), function(reason){
					console.log('from ctr: ' + reason);
				}, function(update){
					console.log('from ctr: ' + update);
				};
			}

			/*LoadSelectCategroy*/
			var loadSelectCategroy=function(market,category){
				if(market=="Urban"){
					market=1;
				}
				if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}
				if(category=="HealthBeauty"){
					category=2;
				}
				var retMarketDecisions=_.filter($scope.pageBase.retMarketDecision,function(obj){
					return (obj.marketID==market);
	      		});
	      		return _.filter(retMarketDecisions[0].retMarketAssortmentDecision,function(obj){
	      			return (obj.categoryID==category);
	      		})
			}
			/*Load Page*/
			var showView=function(retailerID,period,category,market,language){
				$scope.retailerID=retailerID,$scope.period=period,$scope.category=category,$scope.market=market,$scope.language=language;
				if(market=="Rural"){
					$scope.shouldHide="";
					$scope.shouldShow="none";
				}
				if(market=="Urban"){
					$scope.shouldShow="";
					$scope.shouldHide="none";
				}
				var shortLanguages={},fullLanguages={};
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
				var allRetCatDecisions=loadSelectCategroy(market,category);
	      		var count=0,result=0;
	      		var products=new Array();
	      		for(var i=0;i<allRetCatDecisions.length;i++){
	      			for(var j=1;j<allRetCatDecisions[i].retVariantDecision.length;j++){
	      				products.push(allRetCatDecisions[i].retVariantDecision[j]);
	      				count++;
	      			}
	      		}
	      		if(count!=0){
	      			result=1;
	      		}
	      		$scope.products=products;
				$scope.shortLanguages=shortLanguages;
				$scope.fullLanguages=fullLanguages;
				if(category=="Elecssories"){
					category=1;
				}
				if(category=="HealthBeauty"){
					category=2;
				}
				var orderProducts=new Array();
				//添加retailer load
				var url='/retailerDecision/'+$rootScope.rootRetailerID+'/'+$rootScope.rootPeriod+'/'+$rootScope.rootSeminar+'/'+category;
				$http.get(url).success(function(data){
					for(var i=0;i<data.length;i++){
						orderProducts.push(data[i]);
					}
					for(var i=1;i<=3;i++){
						url='/producerDecision/'+i+'/'+$rootScope.rootPeriod+'/'+$rootScope.rootSeminar+'/'+category;
						$http.get(url).success(function(data){
							for(var j=0;j<data.length;j++){
								orderProducts.push(data[j]);
							}
							$scope.orderProducts=orderProducts;
						});
					}					
				});
				return result;
			}

			var updateRetailerDecision=function(category,market,brandName,varName,location,postion,addtionalIdx){
				if(market=="Urban"){
					market=1;
				}
				if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}
				if(category=="HealthBeauty"){
					category=2;
				}
				if(location=="pricePromotions"){
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,$scope.products[addtionalIdx][location][postion]);					
				}else{
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,$scope.products[addtionalIdx][location]);					
				}
				//$scope.$broadcast('retailerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(){
				$scope.moreInfo={'categoryID':$scope.retailerID};
				$scope.isCollapsed=false;
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		

			var addOrder=function(market,product){
				product.dateOfBirth=$rootScope.rootPeriod;
				product.dateOfDeath=10;
				product.Order=null;
				product.retailerPrice=null;
				product.shelfSpace=null;
				product.pricePromotions=new Array(null,null);
				if(market=="Urban"){
					RetailerDecisionBase.addOrder(1,product);
				}
				else{
					RetailerDecisionBase.addOrder(2,product);
				}
				close();
			}

			var deleteOrder=function(market,category,brandName,varName){
				if(market=="Urban"){
				market=1;
				}
				if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}
				if(category=="HealthBeauty"){
					category=2;
				}
				RetailerDecisionBase.deleteOrder(market,category,brandName,varName);
				close();
			}

			$scope.$on('producerDecisionBaseChangedFromServer', function(event, newBase){
				console.log('producerDecisionBaseChangedFromServer');
				showView($scope.retailerID,$scope.period,$scope.category,$scope.market,$scope.language);
			}); 	

			$scope.$on('retailerDecisionBaseChangedFromServer', function(event, newBase){
				console.log('retailerDecisionBaseChangedFromServer');
				RetailerDecisionBase.reload({retailerID:$rootScope.rootRetailerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}).then(function(base){
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