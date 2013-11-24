define(['app'], function(app) {
		app.controller('retailerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase','ProducerDecisionBase', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase,ProducerDecisionBase) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";
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
				retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
				period=$rootScope.currentPeriod,
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
			RetailerDecisionBase.reload({retailerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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
					$scope.moreInfo=moreInfo;
					$scope.closeInfo=closeInfo;
					$scope.open=open;
					$scope.close=close;
					$scope.addOrders=addOrders;
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
	      				if(allRetCatDecisions[i].retVariantDecision[j].brandID!=0&&allRetCatDecisions[i].retVariantDecision[j].varID!=0){
	      					products.push(allRetCatDecisions[i].retVariantDecision[j]);
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
				if(category=="Elecssories"){
					category=1;
				}
				if(category=="HealthBeauty"){
					category=2;
				}
				var orderProducts=new Array();
				//添加retailer load
				var url='/retailerProducts/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.seminar+'/'+category;
				$http.get(url).success(function(data){
					for(var i=0;i<data.length;i++){
						if(data[i].brandID!=0&&data[i].varID!=0){
							data[i].variantID=data[i].varID;
							data[i].select=false;
							orderProducts.push(data[i]);
						}
					}
					for(var i=1;i<=3;i++){
						url='/producerProducts/'+i+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.seminar+'/'+category;
						$http.get(url).success(function(data){
							for(var j=0;j<data.length;j++){
								if(data[j].brandID!=0&&data[j].varID!=0){
									data[j].variantID=data[j].varID;
									data[j].select=false;
									orderProducts.push(data[j]);
								}
							}
						});
					}		
					$scope.orderProducts=orderProducts;			
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

			var getMoreInfo=function(product){
				//$scope.moreInfo={'categoryID':$scope.retailerID};
				$scope.isCollapsed=false;
				var url="";
				if(product.dateOfBirth==$rootScope.currentPeriod){
					//new product
					$scope.currentVar="";
					$scope.historyVar="none";
				}else{
					$scope.currentVar="none";
					$scope.historyVar="";					
				}
				if(product.brandName.substring(0,1)=="E"){
					$scope.ElecssoriesVar="";
					$scope.HealthBeautyVar="none";
				}else{
					$scope.ElecssoriesVar="none";
					$scope.HealthBeautyVar="";
				}
				if(product.brandName.substring(product.brandName.length-1)<=3){//producer variant
					url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
				}else{//retailer variant
					url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar;
				}
				//bug no retailer variant historyInfo
				$http({method:'GET',url:url})
				.success(function(data){
					if(product.dateOfBirth==$rootScope.currentPeriod){//new product
						data[0].NextPriceBM=data[0].CurrentPriceBM;
					}
					$scope.decisionCurrent=data;
					console.log($scope.decisionCurrent);

					if(product.brandName.substring(product.brandName.length-1)<=3){//producer variant
						url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
					}else{//retailer variant
						url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar;
					}
					$http({method:'GET',url:url})
					.success(function(data){
						if(product.dateOfBirth==$rootScope.currentPeriod){
							data[0].NextPriceBM=data[0].CurrentPriceBM;
						}
						$scope.decisionHistory=data;
						console.log($scope.decisionHistory);
						url='/quarterHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1);
						$http({method:'GET',url:url})
						.success(function(data){
							$scope.quarterHistory=data;
							console.log($scope.quarterHistory);
							url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+product.brandName+'/'+product.varName;
							$http({method:'GET',url:url})
							.success(function(data){
								$scope.variantHistory=data;
								console.log($scope.variantHistory);
							})
							.error(function(data){
								console.log("read variantHistory fail");
							})
						})
						.error(function(data){
							console.log('read quarterHistoryInfo fail');
						})
					})
					.error(function(data){
						console.log('read decisionHistory fail');
					})
				})
				.error(function(data){
					console.log('read decisionCurrent fail')
				})
			}

			var moreInfo=function(product){
				var url="";
				if(product.dateOfBirth==$rootScope.currentPeriod){
					//new product
					$scope.modalCurrentVar="";
					$scope.modalHistoryVar="none";
				}else{
					$scope.modalCurrentVar="none";
					$scope.modalHistoryVar="";					
				}
				if(product.brandName.substring(0,1)=="E"){
					$scope.modalElecssoriesVar="";
					$scope.modalHealthBeautyVar="none";
				}else{
					$scope.modalElecssoriesVar="none";
					$scope.modalHealthBeautyVar="";
				}
				if(product.brandName.substring(product.brandName.length-1)<=3){//producer variant
					url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
				}else{//retailer variant
					url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar;
				}
				//bug no retailer variant historyInfo
				$http({method:'GET',url:url})
				.success(function(data){
					if(product.dateOfBirth==$rootScope.currentPeriod){//new product
						data[0].nextPriceBM=data[0].currentPriceBM;
					}
					$scope.modalDecisionCurrent=data;
					console.log($scope.modelDecisionCurrent);

					if(product.brandName.substring(product.brandName.length-1)<=3){//producer variant
						url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
					}else{//retailer variant
						url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar;
					}
					$http({method:'GET',url:url})
					.success(function(data){
						if(product.dateOfBirth==$rootScope.currentPeriod){
							data[0].nextPriceBM=data[0].currentPriceBM;
						}
						$scope.modalDecisionHistory=data;
						console.log($scope.modalDecisionHistory);
						url='/quarterHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1);
						$http({method:'GET',url:url})
						.success(function(data){
							$scope.modalQuarterHistory=data;
							console.log($scope.modalQuarterHistory);
							url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+product.brandName+'/'+product.varName;
							$http({method:'GET',url:url})
							.success(function(data){
								$scope.modalVariantHistory=data;
								console.log($scope.modalVariantHistory);
							})
							.error(function(data){
								console.log("read variantHistory fail");
							})
						})
						.error(function(data){
							console.log('read quarterHistoryInfo fail');
						})
					})
					.error(function(data){
						console.log('read decisionHistory fail');
					})
				})
				.error(function(data){
					console.log('read decisionCurrent fail')
				})
			}

			var loadNameNum=function(){//load the sort
				/*importantt*/
			}		

			var addOrders=function(market){
				var max=0;
				for(var i=0;i<$scope.orderProducts.length;i++){
					if($scope.orderProducts[i].select){
						max=i;
					}
				}
				for(var i=0;i<$scope.orderProducts.length;i++){
					if($scope.orderProducts[i].select){
						if(i==max){
							addOrder(market,$scope.orderProducts[i],"last");
							//setTimeout(function(){addOrder(market,$scope.orderProducts[i],"last");},1000);
						}else{
							addOrder(market,$scope.orderProducts[i],"none");
							//setTimeout(function(){addOrder(market,$scope.orderProducts[i],"none");},1000);
						}
					}
				}
				close();
			}


			var addOrder=function(market,product,last){
				product.dateOfBirth=$rootScope.currentPeriod;
				product.dateOfDeath=10;
				product.order=0;
				product.retailerPrice=0;
				product.shelfSpace=0;
				product.pricePromotions={
					promo_Frequency:0,
					promo_Rate:0
				};
				console.log(product);
				if(market=="Urban"){
					//setTimeout('RetailerDecisionBase.addOrder(1,product,last)',1000);
					RetailerDecisionBase.addOrder(1,product,last);
				}
				else{
					//setTimeout('RetailerDecisionBase.addOrder(2,product,last)',1000);
					RetailerDecisionBase.addOrder(2,product,last);
					//setTimeout(function(){RetailerDecisionBase.addOrder(2,product,last);},1000);
				}
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
				RetailerDecisionBase.reload({retailerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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