define(['angular',
	'angularResource',
	'routingConfig',
	'labelBase'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);

	services.value('version', '0.1');
	//multiple language translate, you should use the Provider recipe only when you want to 
	//expose an API for application-wide configuration that must be made before the application starts. 
	//This is usually interesting only for reusable services whose behavior might need to vary slightly between applications.
	services.provider('Label', function(){
		var currentLanguage,
			labelBase; 

		//configure default languge during angular bootstraping
		this.initialiseLanguage = function(value){
			this.currentLanguage = value;
			this.labelBase = getLabelBase();
		};

		this.$get = function(){
			var self = this, item;
			var items=new Array();
			return {
				getContent : function(value){
					switch(self.currentLanguage){
						case 'ENG': 
						    item = _.find(self.labelBase, function(singleItem){ return singleItem.id == value});
						    if(item){ return item.ENG;}
						    else{
						    	items.push(value);
						    	//console.log(items);
						    	return '**NotFound**';
						    }
						    break;
						case 'CHN':
						    item = _.find(self.labelBase, function(singleItem){ return singleItem.id == value})
						    if(item){ return item.CHN;}
						    else return '**NotFound**';
						    break;
						case 'RUS':
						    item = _.find(self.labelBase, function(singleItem){ return singleItem.id == value})
						    if(item){ return item.RUS;}					    
						    else return '**NotFound**';		
						    break;
						default:
							return '**NotFound**'		
					}
				},
				changeLanguage : function(value){
					self.currentLanguage = value;
				},
				getCurrentLanguage : function() {
					return self.currentLanguage;
				}			
			}
		}
	})	

	services.factory('ContractInfo', function(){
		var selectedContract;
		return {
			getSelectedContract : function(){
				console.log('services get:' + selectedContract);
				return selectedContract;
			},
			setSelectedContract : function(value){
				selectedContract = value;
				console.log('services set value: '+ selectedContract);

			},
			getActivedNegotiationItem : function(){
				var negotiationItems=['nc_MinimumOrder',
				'nc_SalesTargetVolume',
				'nc_PaymentDays',
				'nc_OtherCompensation',				
				'nc_VolumeDiscountRate',
				'nc_PerformanceBonusAmount',
				'nc_PerformanceBonusRate'];
				return negotiationItems;
			}
		}
	})

	services.factory('PlayerInfo',function(){
		var player;
		return {
			getPlayer:function(){
				console.log('get player:' + player);
				return player;
			},
			setPlayer:function(value){
				player=value;
				console.log('set player:'+player)
			}
		}
	})

	services.factory('RoleInfo',function(){
		var role;
		return{
			getRole:function(){
				console.log('get role:'+role);
				return role;
			},
			setRole:function(value){
				role=value;
				console.log('set role:'+role);
			}
		}
	})

	services.factory('SeminarInfo', function(){
		var selectedSeminar;
		return {
			getSelectedSeminar : function(){
				console.log('services get:' + selectedSeminar);
				return selectedSeminar;
			},
			setSelectedSeminar : function(value){
				selectedSeminar = value;
				console.log('services set seminar: ' + selectedSeminar);
			}		
		}
	})

	services.factory('PeriodInfo', function(){
		var currentPeriod;
		return {
			getCurrentPeriod:function(){
				console.log('services get period:'+currentPeriod);
				return currentPeriod;
			},
			getPreviousPeriod:function(){
				currentPeriod=currentPeriod-1;
				console.log('services get period:'+currentPeriod);
				return currentPeriod;
			},
			getNextPeriod:function(){
				currentPeriod=currentPeriod+1;
				console.log('services get period:'+currentPeriod);
				return currentPeriod;
			},
			setCurrentPeriod:function(value){
				currentPeriod=value;
				console.log('services set period:'+currentPeriod);
			}	
		}
	})


	services.factory('Auth', function($http, $rootScope, $cookieStore){
	    var accessLevels = routingConfig.accessLevels
	        , userRoles = routingConfig.userRoles;

	    $rootScope.user = $cookieStore.get('user') || { username: '', role: userRoles.guest };
	    $cookieStore.remove('user');

	    $rootScope.accessLevels = accessLevels;
	    $rootScope.userRoles = userRoles;

	    return {
	        authorize: function(accessLevel, role) {         
	            if(role === undefined) {
	                role = $rootScope.user.role;
	            }
	           // console.log('start authorize, role:' + role + ', accessLevel:' + accessLevel);
	            return accessLevel & role;
	        },
	        isLoggedIn: function(user) {
	            if(user === undefined)
	                user = $rootScope.user;
	            return parseInt(user.role) === userRoles.producer 
	            	|| parseInt(user.role) === userRoles.retailer
	            	|| parseInt(user.role) === userRoles.facilitator 
	            	|| parseInt(user.role) === userRoles.admin;
	        },
	        login: function(user, success, error) {
	            $http.post('/login', user).success(function(user){
	                $rootScope.user = user;
	                success(user);
	            }).error(error);
	        },
	        logout: function(success, error) {
	            $http.post('/logout').success(function() {
	                $rootScope.user.username = '';
	                $rootScope.user.role = userRoles.guest;
	                success();
	            }).error(error);
	        },
	        accessLevels: accessLevels,
	        userRoles: userRoles
	    };
	});

	services.factory('Map',['$resource',function($resource){
    	return $resource('/perceptionMaps/:seminar/:period',{seminar:'@seminar',period:'@period'});
	}]);

	services.factory('MapLoader', ['Map', '$route','$rootScope', '$q','SeminarInfo','PeriodInfo',function(Map, $route,$rootScope, $q,SeminarInfo,PeriodInfo) {
    	return function() {
    		var delay = $q.defer();

    		Map.get({seminar: SeminarInfo.getSelectedSeminar(),period:PeriodInfo.getCurrentPeriod()}, function(map) {
    			delay.resolve(map);
    		}, function() {
    			delay.reject('Unable to fetch file '  + $route.current.params.id);
    		});
    		return delay.promise;
  		};
	}]);

	services.factory('ContractDetail',['$resource',function($resource){
		return $resource('/contractDetail/:contractCode/:userType/:negotiationItem/:brandName',{
			contractCode:'@contractCode',
			userType:'@userType',
			negotiationItem:'@negotiationItem',
			brandName:'@brandName'
		});
	}]);

	services.factory('ContractDetailLoader', ['ContractDetail', '$route','$rootScope', '$q',function(ContractDetail, $route,$rootScope, $q) {
    	return function() {
    // 		var delay = $q.defer();
    // 		ContractDetail.get({
    // 			contractCode:$rootScope.rootContractCode,
    // 			userType:$rootScope.rootUserType,
    // 			negotiationItem:$rootScope.rootNegotiationItem,
    // 			brandName:$rootScope.rootBrandName
    // 		}, function(detail) {
    // 			delay.resolve(detail);
    // 		}, function() {
    // 			delay.reject('Unable to fetch file ');
    // 		});
    // 		return delay.promise;
  		 };
	}]);

	//services.factory('ContractListen')

	services.factory('ProducerDecision',['$resource','$rootScope', function($resource,$rootScope){
		return $resource('/producerDecision/:producerID/:period/:seminar',{},
			{
				save:{
					method: "POST",
					params: {
						producerID: "@producerID",
						period:"@period",
						seminar:"@seminar"
					}
				}
			})

	}]);
	services.factory('VariantHistoryInfo', ['$resource', function($resource){
		return $resource('/variantHistoryInfo/:seminar/:period/:parentBrandName/:varName', {});
	}]);
	services.factory('BrandHistoryInfo', ['$resource', function($resource){
		return $resource('/brandHistoryInfo/:seminar/:period/:brandName', {});
	}]);
	services.factory('CompanyHistoryInfo', ['$resource', function($resource){
		return $resource('/companyHistoryInfo/:seminar/:period/:companyID', {});
	}]);
	services.factory('quarterHistoryInfo', ['$resource', function($resource){
		return $resource('/quarterHistoryInfo/:seminar/:period',{});
	}])

	services.factory('RetailerDecision',['$resource','$rootScope',function($resource,$rootScope){
		return $resource('retailerDecision/:retailerID/:period/:seminar',{},
		{
			save:{
				method:"POST",
				params:{
						retailerID: "@retailerID",
						period:"@period",
						seminar:"@seminar"					
				}
			}
		})
	}]);

	services.factory('ProducerDecisionLoader', ['ProducerDecision', '$route','$rootScope','$q',function(ProducerDecision, $route, $rootScope, $q) {
		return function() {
			var delay = $q.defer();
			ProducerDecision.get({producerID :PlayerInfo.getPlayer(),
									period:PeriodInfo.getCurrentPeriod(),
									seminar:SeminarInfo.getSelectedSeminar()}, function(producerDecision) {
				delay.resolve(producerDecision);
			}, function() {
				delay.reject('Unable to fetch producerDecision '  + $route.current.params.producerID);
			});
			return delay.promise;
		};
	}]);

	services.provider('ProducerDecisionBase', function(){
		var requestPara = {
				period : 0,
				producerID : 1,
				seminar : 'Hello',
			}, base;			

		this.setDefaultPara = function(p) { requestPara = p };
		this.$get = ['ProducerDecision', '$q','$rootScope','$http','PlayerInfo','SeminarInfo','PeriodInfo', function(ProducerDecision, $q, $rootScope,$http,PlayerInfo,SeminarInfo,PeriodInfo){
			return {
				reload : function(p){ 
					requestPara = p;
					var delay = $q.defer();
					getLoaderPromise(ProducerDecision, $q).then(function(){
						delay.resolve(base);
					}, function(reason){
						delay.reject(reason);
					}, function(update){
						delay.notify('notify...')
					});
					return delay.promise;
				},
				startListenChangeFromServer : function(){
					var socket = io.connect();
					socket.on('producerBaseChanged', function(data){
						//console.log(data);
						$rootScope.$broadcast('producerDecisionBaseChangedFromServer', base);
					});					
				},				
				setSomething : function(sth){
					//post to server...
					base.seminar = sth;
					$rootScope.$broadcast('producerDecisionBaseChanged', base);
				},
				getAllProduct:function(producerID,categoryID){
					$http({method:'GET',url:''})
				},
				//step1 & step2
				setProducerDecisionValue:function(categoryID,brandName,varName,location,additionalIdx,value){

					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateVariant', 
							    /* 
							    switch(behaviour) case...
							    addProductNewBrand : categoryID
							    addProdcutExistedBrand : categoryID,brandName
							    deleteProduct : categoryID,brandName,varName
							    deleteBrand : categoryID,brandName
							    updateVariant : categoryID,brandName,varName,location,value[,addtionalIdx]
							    updateBrand : categoryID,brandName,location,value[,addtionalIdx]
							    updateCategory : category,location,value
							    */
						categoryID : categoryID,
						brandName : brandName,
						varName : varName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step3
				setProducerDecisionBrand:function(categoryID,brandName,location,additionalIdx,value){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateBrand', 
							    /* 
							    switch(behaviour) case...
							    addProductNewBrand : categoryID
							    addProdcutExistedBrand : categoryID,brandName
							    deleteProduct : categoryID,brandName,varName
							    deleteBrand : categoryID,brandName
							    updateVariant : categoryID,brandName,varName,location,value[,addtionalIdx]
							    updateBrand : categoryID,brandName,varName,location,value[,addtionalIdx]
							    updateCategory : category,location,value
							    */
						categoryID : categoryID,
						brandName : brandName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step4
				setProducerDecisionCategory:function(categoryID,location,value){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateCategory', 
						categoryID : categoryID,
						location : location,
						value : value
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				addProductNewBrand:function(newproducerDecision,categoryID){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'addProductNewBrand', 
						categoryID : categoryID,
						value : newproducerDecision
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	return 1;
					 },function(res){
						return 0;
					});
				},
				addProductExistedBrand:function(newproducerDecision,categoryID,brandName){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'addProductExistedBrand', 
						categoryID : categoryID,
						value : newproducerDecision,
						brandName:brandName
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	return 1;
					 },function(res){
						return 0;
					});
				},
				deleteProduct:function(categoryID,brandName,varName){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'deleteProduct', 
						categoryID : categoryID,
						varName : varName,
						brandName:brandName
					}
					$http({
						method:'POST', 
						url:'/producerDecision', 
						data: queryCondition
					}).then(function(data){
						var deleteType="";
						if(data.data.index==-1){
							deleteType="brand";
						}else{
							deleteType="variant";
						}
						queryCondition={
							relatedBrandName:brandName,
							deleteType:deleteType,
							index:data.data.index,
							producerID:PlayerInfo.getPlayer(),
							period:PeriodInfo.getCurrentPeriod(),
							seminar:SeminarInfo.getSelectedSeminar()
						}
						return $http({
							method:'POST',
							url:'/deleteDetailData',
							data:queryCondition
						})
					 }).then(function(data){
					 	queryCondition={
							period:PeriodInfo.getCurrentPeriod(),
							seminar:SeminarInfo.getSelectedSeminar(),
					 		brandName:brandName,
					 		varName:varName,
					 		categoryID:categoryID,
					 	}
					 	return $http({
					 		method:'POST',
					 		url:'/deleteOrderData',
					 		data:queryCondition
					 	})
					 }).then(function(data){
					 	console.log('success');
					 	$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 },function(err){
					 	console.log('fail'+err);
					 	$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 })
				},
				submitDecision:function(){
					//$rootScope.$broadcast('producerDecisionBaseChanged', base);
					var queryCondition={
						producerID:PlayerInfo.getPlayer(),
						seminar:SeminarInfo.getSelectedSeminar(),
					}
					$http({
						method:'POST',
						url:'/submitDecision',
						data:queryCondition
					}).then(function(data){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					},function(err){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					})
				},
				getBase : function(){
					return base;
				},
				getPara : function(){
					return requestPara;
				}
			}
		}];

		var getLoaderPromise = function(ProducerDecision, q){
			var delay = q.defer();
			delay.notify('start to get base from server....')
			ProducerDecision.get({producerID: requestPara.producerID,
								  period: requestPara.period,
								  seminar: requestPara.seminar}, function(producerDecision) {
				base = producerDecision; 
				delay.resolve(base);
			}, function() {
				delay.reject('Unable to fetch producerDecision of seminar:' + requestPara.seminar + ', period:' + requestPara.period + ', producer:' + requestPara.producerID);
			});
			return delay.promise;			
		}
	});

	services.provider('RetailerDecisionBase', function(){
		var requestPara = {
				period : 0,
				retailerID : 1,
				seminar : 'TEST',
			}, base;			

		this.setDefaultPara = function(p) { requestPara = p };
		this.$get = ['RetailerDecision', '$q','$rootScope','$http','PlayerInfo','SeminarInfo','PeriodInfo', function(RetailerDecision, $q, $rootScope,$http,PlayerInfo,SeminarInfo,PeriodInfo){
			return {
				reload : function(p){ 
					requestPara = p;
					var delay = $q.defer();
					getRetailerPromise(RetailerDecision, $q).then(function(){
						delay.resolve(base);
					}, function(reason){
						delay.reject(reason);
					}, function(update){
						delay.notify('notify...')
					});
					return delay.promise;
				},
				startListenChangeFromServer : function(){
					var socket = io.connect();
					socket.on('retailerBaseChanged', function(data){
						//console.log(data);
						$rootScope.$broadcast('retailerDecisionBaseChangedFromServer', base);
					});				
				},
				//step1
								/* 
							    switch(behaviour) case...
					            - step 1
					            updateGeneralDecision

					            - step 2
					            updateMarketDecision            

					            - step 3
					            addProductNewBrand
					            addProductExistedBrand
					            deleteProduct
					            deleteBrand
					            updatePrivateLabel

					            - step 4
					            updateOrder
					            addOrder
					            deleteOrder
							    */
				//step1
				setRetailerDecisionBase:function(location,additionalIdx,value){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateGeneralDecision', 
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step2
				setMarketDecisionBase:function(marketID,location,additionalIdx,value){
					if(location=="serviceLevel"){
						switch(value){
							case 1: value="SL_BASE";break;
							case 2: value="SL_FAIR";break;
							case 3: value="SL_MEDIUM";break;
							case 4: value="SL_ENHANCED";break;
							case 5: value="SL_PREMIUM";break;
						}
					}
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateMarketDecision', 
						marketID : marketID,
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step3
				setRetailerDecisionValue:function(categoryID,brandName,varName,location,additionalIdx,value){
					if(location=="packFormat"){
						switch(value){
							case 1:value="ECONOMY";break;
							case 2:value="STANDARD";break;
							case 3:value="PREMIUM";break;
						}
					}
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updatePrivateLabel', 
						categoryID : categoryID,
						brandName : brandName,
						varName:varName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
					//$rootScope.$broadcast('producerDecisionBaseChanged', base);
				},
				//step4
				setRetailerDecision:function(categoryID,marketID,brandName,varName,location,additionalIdx,value){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'updateOrder', 
						categoryID : categoryID,
						marketID : marketID,
						brandName : brandName,
						varName:varName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});

				},
				setSomething : function(sth){
					//post to server...
					base.seminar = sth;
					$rootScope.$broadcast('retailerDecisionBaseChanged', base);
				},				
				addProductNewBrand:function(newproducerDecision,categoryID){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'addProductNewBrand', 
						categoryID : categoryID,
						value : newproducerDecision
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				addProductExistedBrand:function(newproducerDecision,categoryID,brandName){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'addProductExistedBrand', 
						categoryID : categoryID,
						brandName : brandName,
						value : newproducerDecision
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});					
				},
				deleteProduct:function(categoryID,brandName,varName){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'deleteProduct', 
						categoryID : categoryID,
						varName : varName,
						brandName:brandName
					}
					$http({
						method:'POST', url:'/retailerDecision', data: queryCondition
					}).then(function(res){
						//$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 	queryCondition={
					 		//retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
							//retailerID :PlayerInfo.getPlayer(),
							period:PeriodInfo.getCurrentPeriod(),
							seminar:SeminarInfo.getSelectedSeminar(),
							categoryID : categoryID,
							varName : varName,
							brandName:brandName
					 	}
					 	return $http({
					 		method:'POST',
					 		url:'/deleteOrderData',
					 		data:queryCondition
					 	})
					}).then(function(data){
						console.log('success');
					 	$rootScope.$broadcast('producerDecisionBaseChanged', base);
					},function(err){
					 	console.log('fail'+err);
					 	$rootScope.$broadcast('producerDecisionBaseChanged', base);
					});
				},
				// addOrder:function(marketID,product){
				// 	var queryCondition = {
				// 		retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
				// 		period:$rootScope.currentPeriod,
				// 		seminar:$rootScope.user.seminar,
				// 		behaviour : 'addOrder', 
				// 		marketID:marketID,
				// 		value:product
				// 	}
				// 	$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
				// 	 	console.log('Success:' + res);
				// 	 	$rootScope.$broadcast('retailerDecisionBaseChanged', base);
				// 	},function(res){
				// 		console.log('Failed:' + res);
				// 	});
				// },
				addOrders:function(marketID,products){
					var queryCondition = {};
					(function multipleRequestShooter(myProducts,idx){
						queryCondition = {
							retailerID :PlayerInfo.getPlayer(),
							period:PeriodInfo.getCurrentPeriod(),
							seminar:SeminarInfo.getSelectedSeminar(),
							behaviour : 'addOrder', 
							marketID:marketID,
							value:myProducts[idx]
						}
						$http({
							method:'POST',
							url:'/retailerDecision',
							data:queryCondition
						}).then(function(data){
							console.log("success");
						},function(data){
							console.log('fail');
						}).finally(function(){
							if(idx!=myProducts.length-1){
								idx++;
								multipleRequestShooter(myProducts,idx);
							}else{
								console.log('finish');
								//$rootScope.$broadcast('retailerDecisionBaseChanged', base);
							}
						})
					})(products, 0);
				},
				deleteOrder:function(marketID,categoryID,brandName,varName){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getCurrentPeriod(),
						seminar:SeminarInfo.getSelectedSeminar(),
						behaviour : 'deleteOrder', 
						marketID:marketID,
						categoryID:categoryID,
						brandName:brandName,
						varName:varName
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});					
				},
				getBase : function(){
					return base;
				},
				getPara : function(){
					return requestPara;
				}
			}
		}];
		var getRetailerPromise=function(RetailerDecision,q){
			var delay=q.defer();
			delay.notify('start to get base from server...');
			RetailerDecision.get({retailerID:requestPara.retailerID,period:requestPara.period,seminar:requestPara.seminar},function(retailerDecision){
									base=retailerDecision;
									delay.resolve(base);
								},function(){
									delay.reject('Unable to fetch retailerDecision of seminar:' + requestPara.seminar + ', period:' + requestPara.period + ', retailer:' + requestPara.retailerID);
								});
			return delay.promise;
		}
	});
});