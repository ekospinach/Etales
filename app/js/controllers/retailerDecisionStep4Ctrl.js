define(['app'], function(app) {
		app.controller('retailerDecisionStep4Ctrl',
			['$scope','$q','$rootScope','$http','$filter','RetailerDecisionBase','ProducerDecisionBase','Label', function($scope,$q,$rootScope,$http,$filter,RetailerDecisionBase,ProducerDecisionBase,Label) {
			$rootScope.decisionActive="active";
			$rootScope.loginCss="";
		    $rootScope.loginFooter="bs-footer";
		    $rootScope.loginLink="footer-links";
		    $rootScope.loginDiv="container";

			$scope.language=Label.getCurrentLanguage(),
			$scope.retailerID=$rootScope.user.username.substring($rootScope.user.username.length-1);
			$scope.period=$rootScope.currentPeriod,
			$scope.category='Elecssories',
			$scope.isCollapsed=true;
			$scope.market="Urban",
			$scope.shouldShow="",
			$scope.shouldHide="none",

			ProducerDecisionBase.startListenChangeFromServer();
			RetailerDecisionBase.reload({retailerID:$rootScope.user.username.substring($rootScope.user.username.length-1),period:$rootScope.currentPeriod,seminar:$rootScope.user.seminar}).then(function(base){
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
					//check
					$scope.checkOrderVolume=checkOrderVolume;
					$scope.checkShelfSpace=checkShelfSpace;
					$scope.checkRetailerPrice=checkRetailerPrice;
					$scope.checkPromototionFrequency=checkPromototionFrequency;
					$scope.checkReductionRate=checkReductionRate;
					$scope.updateRetailerDecision=updateRetailerDecision;
					$scope.getMoreInfo=getMoreInfo;
					$scope.closeInfo=closeInfo;
					$scope.open=open;
					$scope.close=close;
					$scope.addOrders=addOrders;
					$scope.deleteOrder=deleteOrder;
				showView($scope.retailerID,$scope.period,$scope.category,$scope.market,$scope.language);
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
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
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
				var d=$q.defer();
				$scope.retailerID=retailerID,$scope.period=period,$scope.category=category,$scope.market=market,$scope.language=language;
				var categoryID=0,count=0,result=0,expend=0,categoryID=0,marketID=0;
				var fakeName="EName",max=100;
				var orderProducts=new Array();
				if(market=="Urban"){
					market=1;
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
					category=2;
				}
	      		var url="/companyHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/R/'+$rootScope.user.username.substring($rootScope.user.username.length-1);
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			if($rootScope.currentPeriod>=2){
	      				abMax=data.data.budgetAvailable+data.data.budgetSpentToDate;
	      			}else{
	      				abMax=data.data.budgetAvailable;
	      			}
	      			$scope.abMax=abMax;
	      			url="/retailerExpend/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/location/1';
	      			return $http({
	      				method:'GET',
	      				url:url,
	      			});
	      		}).then(function(data){
	      			expend=data.data.result;
	      			$scope.surplusExpend=abMax-expend;
	      			$scope.percentageExpend=(abMax-expend)/abMax*100;
	      		 	url="/retailerShelfSpace/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/-1/0/brandName/varName';
	      			return $http({
	      				method:'GET',
	      				url:url
	      			});
	      		}).then(function(data){
	      					$scope.surplusShelf=new Array();
	      					$scope.percentageShelf=new Array();
	      					$scope.surplusShelf[0]=new Array();
	      					$scope.surplusShelf[1]=new Array();
	      					$scope.percentageShelf[0]=new Array();
	      					$scope.percentageShelf[1]=new Array();
	      					$scope.surplusShelf[0][0]=data.data.result[0][0];
	      					$scope.surplusShelf[0][1]=data.data.result[0][1];
	      					$scope.surplusShelf[1][0]=data.data.result[1][0];
	      					$scope.surplusShelf[1][1]=data.data.result[1][1];
	      					$scope.percentageShelf[0][0]=(1-$scope.surplusShelf[0][0])*100;
	      					$scope.percentageShelf[0][1]=(1-$scope.surplusShelf[0][1])*100;
	      					$scope.percentageShelf[1][0]=(1-$scope.surplusShelf[1][0])*100;
	      					$scope.percentageShelf[1][1]=(1-$scope.surplusShelf[1][1])*100;
	      					$scope.showSurplusShelf=$scope.percentageShelf[market-1][category-1];
	      					$scope.showPercentageShelf=$scope.percentageShelf[market-1][category-1];

							var allRetCatDecisions=loadSelectCategroy(market,category);
							var products=new Array();
				      		for(var i=0;i<allRetCatDecisions.length;i++){
				      			for(var j=0;j<allRetCatDecisions[i].retVariantDecision.length;j++){
				      				if(allRetCatDecisions[i].retVariantDecision[j].brandID!=0&&allRetCatDecisions[i].retVariantDecision[j].variantID!=0){
				      					if(allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate>=0&&allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate<1){
				      						allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate*=100;
				      						//allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate=parseFloat(allRetCatDecisions[i].retVariantDecision[j].pricePromotions.promo_Rate).toFixed(2);
				      					}
				      					if(allRetCatDecisions[i].retVariantDecision[j].shelfSpace>=0&&allRetCatDecisions[i].retVariantDecision[j].shelfSpace<1){
				      						allRetCatDecisions[i].retVariantDecision[j].shelfSpace*=100;
				      						allRetCatDecisions[i].retVariantDecision[j].shelfSpace=parseFloat(allRetCatDecisions[i].retVariantDecision[j].shelfSpace).toFixed(2);
				      					}
				      					allRetCatDecisions[i].retVariantDecision[j].retailerPrice=parseFloat(allRetCatDecisions[i].retVariantDecision[j].retailerPrice).toFixed(2);
				      					products.push(allRetCatDecisions[i].retVariantDecision[j]);
				      					count++;
				      				}
				      			}
				      		}
				      		$scope.products=products;
							if(category=="Elecssories"){
								category=1;
							}
							if(category=="HealthBeauty"){
								category=2;
							}
							//添加retailer load
							url='/retailerProducts/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.seminar+'/'+category;
							return $http({
								method:'GET',
								url:url
							});
				}).then(function(data){
					for(var i=0;i<data.data.length;i++){
						if(data.data[i].brandID!=0&&data.data[i].varID!=0){
							data.data[i].variantID=data.data[i].varID;
							data.data[i].select=false;
							orderProducts.push(data.data[i]);
						}
					}
					var urls=new Array();
					var checkurls=new Array();
					for(i=0;i<3;i++){
						urls[i]='/producerProducts/'+(i+1)+'/'+$rootScope.currentPeriod+'/'+$rootScope.user.seminar+'/'+category;
						checkurls[i]='/checkProducerDecision/'+$rootScope.user.seminar+'/'+(i+1);
					}
					(function multipleRequestShooter(checkurls,urls,idx){
						$http({
							method:'GET',
							url:checkurls[idx]
						}).then(function(data){
							if(data.data=="isReady"){
								urls[idx]="/";
							}
							return $http({
								method:'GET',
								url:urls[idx]
							});
						}).then(function(data){
							if(data.data.length<100){
								for(var j=0;j<data.data.length;j++){
									if(data.data[j].brandID!=undefined&&data.data[j].brandID!=0&&data.data[j].varID!=0){
										data.data[j].variantID=data.data[j].varID;
										data.data[j].select=false;
										orderProducts.push(data.data[j]);
									}
								}
							}
						},function(data){

						}).finally(function(){
							if(idx!=2){
								idx++;
								multipleRequestShooter(checkurls,urls,idx);
							}else{
								$scope.orderProducts=orderProducts;
								var indexs=new Array();
								for(i=0;i<$scope.orderProducts.length;i++){
									for(j=0;j<$scope.products.length;j++){
										if($scope.orderProducts[i].brandName==$scope.products[j].brandName&&$scope.orderProducts[i].varName==$scope.products[j].varName){
											indexs.push(i);
										}
									}
								}
								for(i=indexs.length-1;i>=0;i--){
									$scope.orderProducts.splice(indexs[i],1);
								}
							}
						})
					})(checkurls,urls,0);
				},function(){
					console.log('showView fail');
				});
				return d.promise;
			}

			/*
			1. Order Volume：0~当前市场的Market Size(市场大小），
			Market Size =  quarterHistoryInfoSchema({seminar, period}).categoryview[当前产品的category-1].categoryMarketView[当前market-1].segmentsVolumes[4] (4 = Total, 0,1,2,3分别为该市场的4个细分市场）
			*/
			var checkOrderVolume=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				var max=0;
					if(market=="Urban"){
					market=1;
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
					category=2;
				}
				var url='/quarterHistoryInfo/'+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1);
				$http({method:'GET',url:url}).then(function(data){
					max=data.data.categoryView[category-1].categoryMarketView[market-1].segmentsVolumes[4];
					if(value>max||value<0){
						d.resolve(Label.getContent('Input range')+':0~'+max);
					}else{
						d.resolve();
					}
				},function(){
					d.resolve(Label.getContent('fail'));
				})
				return d.promise;
			}
			/*Shelf space : 0~剩余的货架份额。总货架份额（每个市场，每个阶段）= 100%，每次给某一个市场内的某个产品分配份额或者减少份额，右上角的该市场的货架进度条 Avaiable Shelf space必须进行进行相应的减少或者增加。该市场内所有产品的份额相加不能大于100%。
			Retailer这里的两个进度条跟Producer有不同，Producer为Avaiable budeget和Avaiable capacity（根据不同category有两个不同的capacity进度条，label也要相应变化）分别是Avaiable budget和Avaiable Shelf space （根据不同市场显示两个不同的shelf space进度条，label也要相应变换）
			*/
			var checkShelfSpace=function(category,market,brandName,varName,location,postion,addtionalIdx,value){
				var d=$q.defer(),max=0;
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				if(market=="Urban"){
					market=1;
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
					category=2;
				}
				var url="/retailerShelfSpace/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+market+'/'+category+'/'+brandName+'/'+varName;
	      		$http({
	      			method:'GET',
	      			url:url
	      		}).then(function(data){
	      			max=100-data.data.exclude*100;
	      			if(value>max||value<0){
	      				d.resolve(Label.getContent('Input range')+':0~'+max);
	      			}else{
	      				d.resolve();
	      			}
	      		})
				return d.promise;
			}

			/*
			3.Retailer Price:  暂定为 0.5*listPrice ~ 3*listPrice。该产品listPrice获取方式（最后搞一个单独的函数）：
			if 该产品为Producer生产的普通老产品，则listPrice=varianthistory 该产品最近历史数据里的pv_NextPriceBM
			if 该产品为Producer当前阶段退出的新产品，则listPrice = 该产品生产商Step1中决定的Current BM Price
			if 该产品为Retailer自己生产的private label，则listPrice= 该产品的UnitCost（当前产品的Unitcost计算方法请求路由app.get('/productionCost’)获取，该服务还没完成）
			*/
			var checkRetailerPrice=function(category,market,brandName,varName,location,postion,addtionalIdx,dateOfBirth,value){
				var d=$q.defer();
				var url="",max=0;
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
					category=2;
				}
				if(brandName.substring(brandName.length-1)<4){
					//producer
					if(dateOfBirth<$rootScope.currentPeriod){//old variant
						url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+brandName+'/'+varName;
						$http({method:'GET',url:url}).then(function(data){
							max=data.data.supplierView[0].nextPriceBM;
							if(value>max*3||value<0.5*max){
								d.resolve(Label.getContent('Input range')+':'+0.5*max+'~'+3*max);
							}else{
								d.resolve();
							}
						},function(){
							d.resolve(Label.getContent('fail'));
						})
					}else{//new variant
						url='/producerVariantBM/'+$rootScope.user.seminar+'/'+$rootScope.currentPeriod+'/'+brandName.substring(brandName.length-1)+'/'+category+'/'+brandName+'/'+varName;
						$http({
							method:'GET',
							url:url
						}).then(function(data){
							max=data.data.result;
							if(value>max*3||value<0.5*max){
								d.resolve(Label.getContent('Input range')+':'+0.5*max+'~'+3*max);
							}else{
								d.resolve();
							}
						});
					}
				}else{
					//retailer variant
					var postData = {
					    period : $rootScope.currentPeriod,
					    seminar : $rootScope.user.seminar,
					    brandName : brandName,
					    varName : varName,
					    catID : category,
					    userRole :  $rootScope.userRoles.retailer,						
					    userID : $rootScope.user.roleID,
					}	
					$http({
						method:'POST',
						url:'/getCurrentUnitCost',
						data:postData
					}).then(function(data){
						currentUnitCost=data.data.result;
						if(value>3*currentUnitCost||value<0.5*currentUnitCost){
							d.resolve(Label.getContent('Input range')+':'+0.5*currentUnitCost+'~'+3*currentUnitCost);
						}else{
							d.resolve();
						}
					},function(){
						d.resolve(Label.getContent('fail'));
					})
				}
				return d.promise;
					
			}
			/*0-26*/
			var checkPromototionFrequency=function(value){
				var d=$q.defer();
				var filter=/^\d+$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a Integer'));
				}
				if(value>26||value<0){
					d.resolve(Label.getContent('Input range')+':0~26');
				}else{
					d.resolve();
				}
				return d.promise;
			}
			/*1-100%*/
			var checkReductionRate=function(value){
				var d=$q.defer();
				var filter=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
				if(!filter.test(value)){
					d.resolve(Label.getContent('Input a number'));
				}
				if(value>100||value<0){
					d.resolve(Label.getContent('Input range')+':0~100');
				}else{
					d.resolve();
				}
				return d.promise;				
			}

			var updateRetailerDecision=function(category,market,brandName,varName,location,postion,addtionalIdx){
				if(market=="Urban"){
					market=1;
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
					category=2;
				}
				if(location=="pricePromotions"&&postion=="promo_Frequency"){
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,$scope.products[addtionalIdx][location][postion]);					
				}else if(location=="pricePromotions"&&postion=="promo_Rate"){
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,($scope.products[addtionalIdx][location][postion])/100);
				}else if(location=="shelfSpace"){
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,($scope.products[addtionalIdx][location])/100);					
				}else{
					RetailerDecisionBase.setRetailerDecision(category,market,brandName,varName,location,postion,$scope.products[addtionalIdx][location]);					
				}
				//$scope.$broadcast('retailerDecisionBaseChanged');
			}

			var closeInfo=function(){
				$scope.isCollapsed=true;
			}

			var getMoreInfo=function(product){
				var catID;
				$scope.isCollapsed=false;
				$scope.currentRetailerIdx = parseInt($rootScope.user.roleID) - 1;			
				//deal with List price show/hide mechanism
				if(product.brandName.substring(product.brandName.length-1)<=3){
					$scope.isPrivateLabel = false;
					if(product.dateOfBirth == $rootScope.currentPeriod){
					//new product made by prodcuer
						$scope.isNewProducerProduct = true;
						$scope.isHistoryProduct = false;	
					}else{
					//old product made by producer
						$scope.isNewProducerProduct = false;
						$scope.isHistoryProduct = true;	
					}
				} else {
					//Priviate label made by retailer
					$scope.isPrivateLabel = true;
					$scope.isHistoryProduct = false;
					$scope.isNewProducerProduct = false;
				}

				//deal with composition label show/hide mechanism
				if(product.brandName.substring(0,1)=="E"){
					$scope.ElecssoriesVar="";
					$scope.HealthBeautyVar="none";
					catID = 1;
				}else{
					$scope.ElecssoriesVar="none";
					$scope.HealthBeautyVar="";
					catID = 2;
				}

				var url="";
				if(!$scope.isPrivateLabel){ url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;}
				else{ url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;}
				$http({
					method:'GET',
					url:url
				//get current decision for this product
				}).then(function(data){
					$scope.decisionCurrent = data.data[0];
					if(!$scope.isPrivateLabel){
						url='/getProducerDecisionByVar/'+product.brandName.substring(product.brandName.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
					}else{//retailer variant
						url='/getRetailerDecisionByVar/'+$rootScope.user.username.substring($rootScope.user.username.length-1)+'/'+($rootScope.currentPeriod-1)+'/'+$rootScope.user.seminar+'/'+product.brandName+'/'+product.varName;
					}
					return $http({
						method:'GET',
						url:url
					});
				//get history decision for this product
				}).then(function(data){
					$scope.decisionHistory =data.data[0];
					url="/variantHistoryInfo/"+$rootScope.user.seminar+'/'+($rootScope.currentPeriod-1)+'/'+product.brandName+'/'+product.varName;
					return $http({method:'GET',url:url});
				//get variantHistory				
				}).then(function(data){
					$scope.variantHistory=data.data;
				},function(err){
					//console.log(err);
					$scope.variantHistory=new Array();
					$scope.showNewHistory={
						brandName:product.brandName,
						varName:product.varName
					}
					console.log('read history info fail:' + err.data);
				});

				if($scope.isPrivateLabel){
					var postData = {
					    period : $rootScope.currentPeriod,
					    seminar : $rootScope.user.seminar,
					    brandName : product.brandName,
					    varName : product.varName,
					    catID : catID,
					    userRole :  $rootScope.userRoles.retailer,
					   	//this part need to be remake later to adjust Ficiltator View.								
					    userID : $rootScope.user.roleID,
					}					
					$http({method:'POST', url:'/getCurrentUnitCost', data:postData}).then(function(data){
						$scope.currentUnitCost = data.data.result;
					}, function(err){
						$scope.currentUnitCost = '/';
					})
				}
			}

			var addOrders=function(market){
				var ordersProducts=new Array();
				for(var i=0;i<$scope.orderProducts.length;i++){
					if($scope.orderProducts[i].select){
						ordersProducts.push($scope.orderProducts[i]);
					}
				}
				for(i=0;i<ordersProducts.length;i++){
					ordersProducts[i].order=0,
					ordersProducts[i].retailerPrice=0,
					ordersProducts[i].shelfSpace=0,
					ordersProducts[i].pricePromotions={
						promo_Frequency:0,
						promo_Rate:0
					}
				}
				if(market=="Urban"){
					RetailerDecisionBase.addOrders(1,ordersProducts);
				}
				else{
					RetailerDecisionBase.addOrders(2,ordersProducts);
				}
				close();
			}

			var deleteOrder=function(market,category,brandName,varName){
				if(market=="Urban"){
					market=1;
				}else if(market=="Rural"){
					market=2;
				}
				if(category=="Elecssories"){
					category=1;
				}else if(category=="HealthBeauty"){
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