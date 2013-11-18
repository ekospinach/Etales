define(['angular','angularResource','routingConfig'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);
	services.value('version', '0.1');

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
	            console.log('start authorize, role:' + role + ', accessLevel:' + accessLevel);
	            return accessLevel & role;
	        },
	        isLoggedIn: function(user) {
	            if(user === undefined)
	                user = $rootScope.user;
	            return user.role === userRoles.producer 
	            	|| user.role === userRoles.retailer
	            	|| user.role === userRoles.facilitator 
	            	|| user.role === userRoles.admin;
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
			ProducerDecision.get({producerID: $rootScope.rootProducerID,
								  period:$rootScope.rootPeriod,
								  seminar:$rootScope.rootSeminar}, function(producerDecision) {
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
		this.$get = ['ProducerDecision', '$q','$rootScope','$http', function(ProducerDecision, $q, $rootScope,$http){
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
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
						behaviour : 'addProductNewBrand', 
						categoryID : categoryID,
						value : newproducerDecision
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});

				},
				addProductExistedBrand:function(newproducerDecision,categoryID,brandName){
					var queryCondition = {
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
						behaviour : 'addProductExistedBrand', 
						categoryID : categoryID,
						value : newproducerDecision,
						brandName:brandName
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				deleteProduct:function(categoryID,brandName,varName){
					var queryCondition = {
						producerID:$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
						behaviour : 'deleteProduct', 

						categoryID : categoryID,
						varName : varName,
						brandName:brandName
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('producerDecisionBaseChanged', base);
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
		this.$get = ['RetailerDecision', '$q','$rootScope','$http', function(RetailerDecision, $q, $rootScope,$http){
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
						behaviour : 'deleteProduct', 
						categoryID : categoryID,
						varName : varName,
						brandName:brandName
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				addOrder:function(marketID,product){
					var queryCondition = {
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
						behaviour : 'addOrder', 
						marketID:marketID,
						value:product
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						$rootScope.$broadcast('retailerDecisionBaseChanged', base);
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				deleteOrder:function(marketID,categoryID,brandName,varName){
					var queryCondition = {
						retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
						period:$rootScope.currentPeriod,
						seminar:$rootScope.user.seminar,
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