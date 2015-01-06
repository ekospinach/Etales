define(['angular',
	'angularResource',
	'routingConfig',
	'labelBase'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);

	services.value('version', '0.1');

	services.factory('Page', function(){
	   var title = 'Etales - HCD Learning';
	   return {
	     title: function() { return title; },
	     setTitle: function(newTitle) { title = newTitle }
	   };		
	})
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
						    	//items.push(value);
						    	//add this for debug
						    	console.log(value);
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
				var negotiationItems=[
				'nc_MinimumOrder',
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
				return player;
			},
			setPlayer:function(value){
				player=value;
			}
		}
	})

	services.factory('RoleInfo',function(){
		var role,realRole;
		return{
			getRole:function(){
				return role;
			},
			setRole:function(value){
				role=value;
			}
		}
	})

	services.factory('SeminarInfo', function(){
		var selectedSeminar;
		return {
			getSelectedSeminar : function(){
				return selectedSeminar;
			},
			setSelectedSeminar : function(value){
				selectedSeminar = value;
			}		
		}
	})

	services.factory('EditSeminarInfo', function() {
		var selectedSeminar;
		return {
			getSelectedSeminar: function() {
				return selectedSeminar;
			},
			setSelectedSeminar: function(value) {
				selectedSeminar = value;
			}
		}
	})


	services.factory('PeriodInfo', function($rootScope){
		var currentPeriod,decisionPeriod;
		return {
			getCurrentPeriod:function(){
				return currentPeriod;
			},
			getDecisionPeriod:function(){
				return decisionPeriod;
			},
			setCurrentPeriod:function(value){
				currentPeriod=value;
			},
			setDecisionPeriod:function(value){
				decisionPeriod=value;
			}
		}
	})

	services.factory('PlayerColor', function($rootScope) {
		return {
			's1':'#3257A7',
			's2':'#B11E22',
			's3':'#F6B920',
			's4':'#666666',
			'r1':'#8B288B',
			'r2':'#329444',
			'r3':'#00AFEF',
			'bm':'#B11E22',
			'online':'#3257A7',
			'mixed':'#329444',
			'drop':'#B11E22',
			'increase':'#329444',
			'awareness':'#3257A7',
			'price':'#B11E22',
			'value':'#F6B920',
			'fashion':'#3257A7',
			'freaks':'#329444',
		}
	})

	services.factory('StaticValues', function($rootScope) {
		return {
			'player': {'s1': 0,'s2': 1,'s3': 2,'s4': 3,'r1': 0,'r2': 1,'r3': 2,'r4': 3},
			'playerID': {'s1': 1,'s2': 2,'s3': 3,'s4': 4,'r1': 5,'r2': 6,'r3': 7,'r4': 8},
			'retailerID': {'r1': 1,'r2': 2,'r3': 3,'r4': 4},
			'chartOwner': {'s1': 0,'s2': 1,'s3': 2,'s4': 3,'r1': 4,'r2': 5,'r3': 6,'r4': 7},
			'store': {'r1': 0,'r2': 1,'tt': 2,'s1': 3,'s2': 4,'s3': 5,'s4': 6},
			'shopper': {'bm': 0,'online': 1,'mixed': 2,'all': 3},
			'segment': {'price': 0,'value': 1,'fashion': 2,'freaks': 3,'total': 4},
			'market': {'urban': 0,'rural': 1,'total': 2},
			'marketID': {'urban': 1,'rural': 2,'total': 2},
			'category': {'ele': 0,'hea': 1,'total': 2},
			'categoryID': {'ele': 1,'hea': 2,'total': 3},
			'CandV': {'eleVolume': 0,'eleValue': 1,'heaVolume': 2,'heaValue': 3}, //category and volume or value
			'CandM': {'eleUrban': 0,'eleRural': 1,'heaUrban': 2,'heaRural': 3}, //category and Market
			'perception': {'easy': 0,'quality': 1,'appeal': 2}
		}
	})

	services.factory('Auth', function($http, $rootScope, $cookieStore, SeminarInfo, RoleInfo, PeriodInfo, PlayerInfo, $location){
	    var accessLevels = routingConfig.accessLevels
	        , userRoles = routingConfig.userRoles;

	    $rootScope.accessLevels = accessLevels;
	    $rootScope.userRoles = userRoles;	    
	    return {
	        authorize: function(accessLevel, role) {    
	        //console.log('accessLevel:'+accessLevel+',role:'+role);     	        	
	            var result=0;
	            if(role === undefined) {
	                role = $rootScope.user.role;
	            }
	            return accessLevel&role;
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
	                $cookieStore.put('user', user);
	                success(user);
	            }).error(error);
	        },
	        logout: function(success, error) {
	            $http.post('/logout').success(function() {
	                $rootScope.user.username = '';
	                $rootScope.user.role = userRoles.guest;
	                $cookieStore.remove('user');
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

    		Map.get({seminar: SeminarInfo.getSelectedSeminar().seminarCode,period:PeriodInfo.getCurrentPeriod()}, function(map) {
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
	}]);

	services.factory('StoreManagement',['$resource','$rootScope',function($resource,$rootScope){
		return $resource('storeManagement/:retailerID/:period/:seminar',{},
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
									period:PeriodInfo.getDecisionPeriod(),
									seminar:SeminarInfo.getSelectedSeminar().seminarCode}, function(producerDecision) {
				delay.resolve(producerDecision);
			}, function() {
				delay.reject('Unable to fetch producerDecision '  + $route.current.params.producerID);
			});
			return delay.promise;
		};
	}]);

	services.provider('TimerBase', function(){
		var userRoles = routingConfig.userRoles;

		this.$get = ['$q', '$rootScope','$http','SeminarInfo','PlayerInfo','RoleInfo','PeriodInfo', function($q, $rootScope, $http, SeminarInfo, PlayerInfo, RoleInfo, PeriodInfo){
			return {
				startListenChangeFromServer : function(){
					var socket = io.connect();

					socket.on('socketIO:timerWork', function(data){	
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
							 $rootScope.$broadcast('timerWork',data);
						}
					});	

					socket.on('socketIO:timerStop', function(data){	
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
							 $rootScope.$broadcast('timerStop',data);
						}
					});	

					socket.on('socketIO:timerChanged', function(data){	
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
							 $rootScope.$broadcast('timerChanged',data);
						}
					});	



					// socket.on('socketIO:deadlinePortfolio', function(data){	
					// 	if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
					// 		 $rootScope.$broadcast('deadlinePortfolio',data);
					// 	}
					// });	

					// socket.on('socketIO:deadlineContractDeal', function(data){	
					// 	if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
					// 		 $rootScope.$broadcast('deadlineContractDeal',data);
					// 	}
					// });	

					// socket.on('socketIO:deadlineContractFinalized', function(data){	
					// 	if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
					// 		 $rootScope.$broadcast('deadlineContractFinalized',data);
					// 	}
					// });	

					// socket.on('socketIO:deadlineDecisionCommitted', function(data){	
					// 	if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode){
					// 		 $rootScope.$broadcast('deadlineDecisionCommitted',data);
					// 	}
					// });	



					socket.on('socketIO:committedPortfolio',function(data){
						//result
						console.log(data);
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.period==PeriodInfo.getCurrentPeriod()){
							for(var i=0;i<data.result.length;i++){
								if(data.result[i].producerID==PlayerInfo.getPlayer()){
									$rootScope.$broadcast('committedPortfolio',data);
									break;
								}
							}
						}
					});

					socket.on('socketIO:dealContract',function(data){
						//producerID
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.producerID==PlayerInfo.getPlayer()){
							 $rootScope.$broadcast('producerContractDeal',data);
						}else{
							 $rootScope.$broadcast('dealContract',data);

						}
					});

					socket.on('socketIO:finalizeContract',function(data){
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.role=="Producer"){
							$rootScope.$broadcast('producerContractFinalized',data);
						}else if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.role=="Retailer"){
							$rootScope.$broadcast('retailerContractFinalized',data);
						}else{
							$rootScope.$broadcast('finalizeContract',data);
						}
					});

					socket.on('socketIO:committeDecision',function(data){
						if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.role=="Producer"){
							$rootScope.$broadcast('producerDecisionLocked',data);
						}else if(data.seminar==SeminarInfo.getSelectedSeminar().seminarCode&&data.role=="Retailer"){
							$rootScope.$broadcast('retailerDecisionLocked',data);
						}else{
							$rootScope.$broadcast('committeDecision',data);
						}
					});
				}
			}
		}]
	})

	services.provider('NegotiationBase', function(){
		var userRoles = routingConfig.userRoles;

		this.$get = ['$q', '$rootScope','$http','SeminarInfo','PlayerInfo','RoleInfo','PeriodInfo', function($q, $rootScope, $http, SeminarInfo, PlayerInfo, RoleInfo, PeriodInfo){
			return {
				startListenChangeFromServer : function(){
					var socket = io.connect();

					socket.on('socketIO:contractDetailsUpdated', function(data){	
						//Only deal with current seminar push notifications					
						if(data.seminar == SeminarInfo.getSelectedSeminar().seminarCode){
							//Depends on different userRole, broadcast different info
							switch(parseInt(RoleInfo.getRole())){
								case userRoles.producer:
									if((data.userType == 'P') && (data.producerID == PlayerInfo.getPlayer())){										
										$rootScope.$broadcast('NegotiationBaseChangedSaved',data);
									} else if((data.userType == 'R') && (data.producerID == PlayerInfo.getPlayer())){
										$rootScope.$broadcast('NegotiationBaseChangedByRetailer',data);
									}
									$rootScope.$broadcast('reloadSupplierBudgetMonitor');
									break;
								case userRoles.retailer:
									if((data.userType == 'R') && (data.retailerID == PlayerInfo.getPlayer())){
										$rootScope.$broadcast('NegotiationBaseChangedSaved',data);										
									} else if((data.userType == 'P') && (data.retailerID == PlayerInfo.getPlayer())){
										$rootScope.$broadcast('NegotiationBaseChangedBySupplier',data);
									}
									$rootScope.$broadcast('reloadRetailerBudgetMonitor');
									break;
								case userRoles.facilitator: break;
							}							
						}
					});					
					
					socket.on('socketIO:seminarPeriodChanged', function(data){	
						//Only deal with current seminar push notifications					
						if(data.seminarCode == SeminarInfo.getSelectedSeminar().seminarCode){
							PeriodInfo.setCurrentPeriod(data.period);	
							$rootScope.$broadcast('SeminarPeriodChanged',data);						
						}							
					});	

					// socket.on('socketIO:contractDeal',function(data){
					// 	if(data.seminar == SeminarInfo.getSelectedSeminar().seminarCode){
					// 		$rootScope.$broadcast('ContractDeal',data);
					// 	}
					// })

				}
			}
		}]
	})

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
					console.log('reload actived...');
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

					socket.on('socketIO:producerBaseChanged', function(data){						
						//if changed base is modified by current supplier & seminar, reload decision base and broadcast message...
						if( (data.producerID == PlayerInfo.getPlayer()) && (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode)  ){
							requestPara.producerID = parseInt(PlayerInfo.getPlayer());
							requestPara.period = PeriodInfo.getDecisionPeriod();
							requestPara.seminar = SeminarInfo.getSelectedSeminar().seminarCode;
							console.log('active producer base reload!');
							getLoaderPromise(ProducerDecision, $q).then(function(newBase){
								$rootScope.$broadcast('producerDecisionBaseChangedFromServer', data, newBase);							
							}, function(reason){
								$rootScope.$broadcast('producerDecisionReloadError', data, newBase);							
							});							
						}
					});

					socket.on('socketIO:producerReportPurchaseDecisionChanged', function(data) {
						//if changed base is modified by current supplier & seminar, reload Report Purchase decision base and broadcast message...
						if ((data.producerID == PlayerInfo.getPlayer()) && (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode)) {
							var url = '/seminarInfo/' + SeminarInfo.getSelectedSeminar().seminarCode;
							$http({
								method: 'GET',
								url: url,
							}).then(function(newSeminarData) {
								$rootScope.$broadcast('producerReportPurchaseDecisionChanged', data, newSeminarData);
							}, function() {
								$rootScope.$broadcast('producerReportPurchaseDecisionChangedError', data, newSeminarData);
							});
						}
					});

					//send seminar global message to notify retailer that supplier has commit portfolio decision
					socket.on('socketIO:producerPortfolioDecisionStatusChanged', function(data){
						if(data.seminar == SeminarInfo.getSelectedSeminar().seminarCode && data.producerID == PlayerInfo.getPlayer()){
							$rootScope.$broadcast('producerPortfolioDecisionStatusChanged',data);							
						}
					});

					socket.on('socketIO:supplierMarketResearchOrdersChanged', function(data) {
						if (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode && data.producerID == PlayerInfo.getPlayer()) {
							$rootScope.$broadcast('supplierMarketResearchOrdersChanged', data);
						}
					});

				},				
				setSomething : function(sth){
					//post to server...
					base.seminar = sth;
					
				},
				getAllProduct:function(producerID,categoryID){
					$http({method:'GET',url:''})
				},

				//step1 & step2
				setProducerDecisionValue:function(categoryID,brandName,varName,location,additionalIdx,value,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
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
						value : value,
						page:page
					}

					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step3 var decision
				setOnlineVariant:function(categoryID,brandName,varName,variant,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'setOnlineVariant', 
						categoryID : categoryID,
						brandName : brandName,
						varName : varName,
						value:variant,
						page:page
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					});
				},
				//step3
				setProducerDecisionBrand:function(categoryID,brandName,location,additionalIdx,value,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
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
						value : value,
						page:page
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step4
				setProducerDecisionCategory:function(categoryID,location,value,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateCategory', 
						categoryID : categoryID,
						location : location,
						value : value,
						page:page
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					});
				},
				//setProducerServiceLevel
				setServiceLevel:function(producerID,value,page){
					var queryCondition = {
						producerID:producerID,
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateServiceLevel', 
						value : value,
						page:page
					}
					$http({method:'POST',url:'/producerDecision',data:queryCondition}).then(function(res){
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					})
				},
				//setMarketResearchOrders
				setMarketResearchOrders:function(playerID,additionalIdx,value,page){
					var queryCondition = {
						producerID:playerID,
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateMarketResearchOrders', 
						additionalIdx : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST',url:'/producerDecision',data:queryCondition}).then(function(res){
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					})
				},
				buyAllMarketResearchOrders:function(value,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'buyAllMarketResearchOrders', 
						value:value,
						page:page
					}
					$http({method:'POST',url:'/producerDecision',data:queryCondition}).then(function(res){
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					});
				},
				addProductNewBrand:function(newproducerDecision,categoryID,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'addProductNewBrand', 
						categoryID : categoryID,
						value : newproducerDecision,
						page:page
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	return 1;
					 },function(res){
						return 0;
					});
				},
				addProductExistedBrand:function(newproducerDecision,categoryID,brandName,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'addProductExistedBrand', 
						categoryID : categoryID,
						value : newproducerDecision,
						brandName:brandName,
						page:page
					}
					$http({method:'POST', url:'/producerDecision', data: queryCondition}).then(function(res){
						
					 	return 1;
					 },function(res){
						return 0;
					});
				},
				deleteProduct:function(categoryID,brandName,varName,page){
					var queryCondition = {
						producerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'deleteProduct', 
						categoryID : categoryID,
						varName : varName,
						brandName:brandName,
						page:page
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
							period:PeriodInfo.getDecisionPeriod(),
							seminar:SeminarInfo.getSelectedSeminar().seminarCode
						}
						return $http({
							method:'POST',
							url:'/deleteDetailData',
							data:queryCondition
						})
					 }).then(function(data){
					 	queryCondition={
							period:PeriodInfo.getDecisionPeriod(),
							seminar:SeminarInfo.getSelectedSeminar().seminarCode,
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
					 	
					 },function(err){
					 	console.log('fail'+err);
					 	
					 })
				},
				submitDecision:function(){
					//
					var queryCondition={
						producerID:PlayerInfo.getPlayer(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
					}
					$http({
						method:'POST',
						url:'/submitDecision',
						data:queryCondition
					}).then(function(data){
						
					},function(err){
						
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

			//console.log('active getLoader promise')
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
		this.$get = ['RetailerDecision', 'StoreManagement','$q','$rootScope','$http','PlayerInfo','SeminarInfo','PeriodInfo', function(RetailerDecision, StoreManagement, $q, $rootScope,$http,PlayerInfo,SeminarInfo,PeriodInfo){
			return {
				reload : function(p){ 
					requestPara = p;
					var delay = $q.defer();
					getRetailerPromise(RetailerDecision, $q).then(function(){
						delay.resolve(base);
					}, function(reason){
						delay.reject(reason);
					}, function(update){
						delay.notify('notify...');
					});
					return delay.promise;
				},
				getStore : function(p){
					requestPara = p;
					var delay = $q.defer();
					getStoreManagementPromise(StoreManagement, $q).then(function(){
						delay.resolve(base);
					}, function(reason){
						delay.reject(reason);
					}, function(update){
						delay.notify('notify...');
					});
					return delay.promise;
				},

				startListenChangeFromServer : function(){
					var socket = io.connect();
					socket.on('socketIO:retailerBaseChanged', function(data){	
						console.log('socketIO:retailerBaseChanged:' + JSON.stringify(data));
						//if changed base is modified by current retailer & seminar, reload decision base and broadcast message...
						if(data.page&&data.page!='retailerStoreManagement'){
							if( (data.retailerID ==  PlayerInfo.getPlayer()) && (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode) ){
								requestPara.retailerID = parseInt(PlayerInfo.getPlayer());
								requestPara.period = PeriodInfo.getDecisionPeriod();
								requestPara.seminar = SeminarInfo.getSelectedSeminar().seminarCode;							

								getRetailerPromise(RetailerDecision, $q).then(function(newBase){
									$rootScope.$broadcast('retailerDecisionBaseChangedFromServer', data, newBase);							
								}, function(reason){
									$rootScope.$broadcast('retailerDecisionReloadError', data, newBase);							
								});							
							}
						}else if(data.page=='retailerStoreManagement'){
							if( (data.retailerID ==  PlayerInfo.getPlayer()) && (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode) ){
								requestPara.retailerID = parseInt(PlayerInfo.getPlayer());
								requestPara.period = PeriodInfo.getDecisionPeriod();
								requestPara.seminar = SeminarInfo.getSelectedSeminar().seminarCode;							

								getStoreManagementPromise(StoreManagement, $q).then(function(newBase){
									$rootScope.$broadcast('retailerDecisionBaseChangedFromServer', data, newBase);							
								}, function(reason){
									$rootScope.$broadcast('retailerDecisionReloadError', data, newBase);							
								});							
							}
						}
					});				

					socket.on('socketIO:retailerReportPurchaseDecisionChanged', function(data) {
						//if changed base is modified by current supplier & seminar, reload Report Purchase decision base and broadcast message...
						if ((data.retailerID == PlayerInfo.getPlayer()) && (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode)&&(data.period == PeriodInfo.getDecisionPeriod())) {
							var url = '/seminarInfo/' + SeminarInfo.getSelectedSeminar().seminarCode;
							$http({
								method: 'GET',
								url: url,
							}).then(function(newSeminarData) {
								$rootScope.$broadcast('retailerReportPurchaseDecisionChanged', data, newSeminarData);
							}, function() {
								$rootScope.$broadcast('retailerReportPurchaseDecisionChangedError', data, newSeminarData);
							});
						}
					});

					socket.on('socketIO:retailerMarketResearchOrdersChanged',function(data){
						if (data.seminar == SeminarInfo.getSelectedSeminar().seminarCode && data.period == PeriodInfo.getDecisionPeriod() && data.retailerID == PlayerInfo.getPlayer()) {
							$rootScope.$broadcast('retailerMarketResearchOrdersChanged', data);
						}
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
				setRetailerDecisionBase:function(location,additionalIdx,value,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateGeneralDecision', 
						location : location,
						additionalIdx  : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step2
				setMarketDecisionBase:function(marketID,location,additionalIdx,value,page){
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
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateMarketDecision', 
						marketID : marketID,
						location : location,
						additionalIdx  : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				//step3
				setRetailerDecisionValue:function(categoryID,brandName,varName,location,additionalIdx,value,page){
					if(location=="packFormat"){
						switch(value){
							case 1:value="ECONOMY";break;
							case 2:value="STANDARD";break;
							case 3:value="PREMIUM";break;
						}
					}
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updatePrivateLabel', 
						categoryID : categoryID,
						brandName : brandName,
						varName:varName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
					//
				},
				//saveOrder
				saveOrder:function(categoryID,marketID,product,page){
					var d=$q.defer();

					var queryCondition={
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'saveOrder', 
						categoryID : categoryID,
						marketID : marketID,
						value : product,
						page:page
					}
					$http({
						method:'POST',
						url:'/retailerDecision',
						data:queryCondition
					}).then(function(data){
						requestPara.retailerID = parseInt(PlayerInfo.getPlayer());
						requestPara.period = PeriodInfo.getDecisionPeriod();
						requestPara.seminar = SeminarInfo.getSelectedSeminar().seminarCode;	
						return getStoreManagementPromise(StoreManagement, $q);
					}).then(function(data){
						d.resolve(data);
					},function(data){
						d.reject(data);
					});
					return d.promise;
				},

				//step4
				setRetailerDecision:function(categoryID,marketID,brandName,varName,location,additionalIdx,value,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateOrder', 
						categoryID : categoryID,
						marketID : marketID,
						brandName : brandName,
						varName:varName,
						location : location,
						additionalIdx  : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});

				},
				//setMarketResearchOrders
				setMarketResearchOrders:function(playerID,additionalIdx,value,page){
					var queryCondition = {
						retailerID:playerID,
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'updateMarketResearchOrders', 
						additionalIdx : additionalIdx,
						value : value,
						page:page
					}
					$http({method:'POST',url:'/retailerDecision',data:queryCondition}).then(function(res){
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					})
				},
				buyAllMarketResearchOrders:function(value,page){
					var queryCondition = {
						retailerID:PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'buyAllMarketResearchOrders',
						value:value, 
						page:page
					}
					$http({method:'POST',url:'/retailerDecision',data:queryCondition}).then(function(res){
					 	console.log('Success:' + res);
					},function(res){
						console.log('Failed:' + res);
					})
				},

				setSomething : function(sth){
					//post to server...
					base.seminar = sth;
					
				},				
				addProductNewBrand:function(newproducerDecision,categoryID,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'addProductNewBrand', 
						categoryID : categoryID,
						value : newproducerDecision,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});
				},
				addProductExistedBrand:function(newproducerDecision,categoryID,brandName,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'addProductExistedBrand', 
						categoryID : categoryID,
						brandName : brandName,
						value : newproducerDecision,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
					 	console.log('Success:' + res);
					 },function(res){
						console.log('Failed:' + res);
					});					
				},
				deleteProduct:function(categoryID,brandName,varName,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'deleteProduct', 
						categoryID : categoryID,
						varName : varName,
						brandName:brandName,
						page:page
					}
					$http({
						method:'POST', url:'/retailerDecision', data: queryCondition
					}).then(function(res){
						//
					 	console.log('Success:' + res);
					 	queryCondition={
					 		//retailerID :$rootScope.user.username.substring($rootScope.user.username.length-1),
							//retailerID :PlayerInfo.getPlayer(),
							period:PeriodInfo.getDecisionPeriod(),
							seminar:SeminarInfo.getSelectedSeminar().seminarCode,
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
					 	
					},function(err){
					 	console.log('fail'+err);
					 	
					});
				},
				addOrders:function(marketID,products,page){
					var queryCondition = {};
					(function multipleRequestShooter(myProducts,idx){
						if(idx==myProducts.length-1){
							queryCondition = {
								retailerID :PlayerInfo.getPlayer(),
								period:PeriodInfo.getDecisionPeriod(),
								seminar:SeminarInfo.getSelectedSeminar().seminarCode,
								behaviour : 'addOrder', 
								marketID:marketID,
								value:myProducts[idx],
								page:page
							}
						}else{
							queryCondition = {
								retailerID :PlayerInfo.getPlayer(),
								period:PeriodInfo.getDecisionPeriod(),
								seminar:SeminarInfo.getSelectedSeminar().seminarCode,
								behaviour : 'addOrder', 
								marketID:marketID,
								value:myProducts[idx]
							}
						}

						if(queryCondition.value.retailerPrice==-1||queryCondition.value.retailerPrice==0){
							var postData={
	                            period : PeriodInfo.getDecisionPeriod(),
	                            seminar : SeminarInfo.getSelectedSeminar().seminarCode,
	                            brandName : queryCondition.value.brandName,
	                            varName : queryCondition.value.varName,
	                            catID : parseInt(queryCondition.value.categoryID),
	                            userRole :  4,
	                            userID : PlayerInfo.getPlayer(),
	                        }
	                        $http({
	                            method:'POST',
	                            url:'/getCurrentUnitCost',
	                            data:postData
	                        }).then(function(data){
	                        	queryCondition.value.retailerPrice=data.data.result;
	                        	return $http({
	                        		method:'POST',
	                        		url:'/retailerDecision',
	                        		data:queryCondition
	                        	})
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
								}
							});
						}else{
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
								}
							})
						}
					})(products, 0);
				},
				deleteOrder:function(marketID,categoryID,brandName,varName,page){
					var queryCondition = {
						retailerID :PlayerInfo.getPlayer(),
						period:PeriodInfo.getDecisionPeriod(),
						seminar:SeminarInfo.getSelectedSeminar().seminarCode,
						behaviour : 'deleteOrder', 
						marketID:marketID,
						categoryID:categoryID,
						brandName:brandName,
						varName:varName,
						page:page
					}
					$http({method:'POST', url:'/retailerDecision', data: queryCondition}).then(function(res){
						
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
			//delay.notify('start to get base from server...');
			RetailerDecision.get({retailerID:requestPara.retailerID,
								  period:requestPara.period,
								  seminar:requestPara.seminar},function(retailerDecision){
									base=retailerDecision;
									delay.resolve(base);
								},function(){
									delay.reject('Unable to fetch retailerDecision of seminar:' + requestPara.seminar + ', period:' + requestPara.period + ', retailer:' + requestPara.retailerID);
								});
			return delay.promise;
		};
		var getStoreManagementPromise=function(StoreManagement,q){
			var delay = q.defer();
			StoreManagement.get({
				retailerID: requestPara.retailerID,
				period: requestPara.period,
				seminar: requestPara.seminar
			}, function(retailerDecision) {
				base = retailerDecision;
				delay.resolve(base);
			}, function() {
				delay.reject('Unable to fetch retailerDecision of seminar:' + requestPara.seminar + ', period:' + requestPara.period + ', retailer:' + requestPara.retailerID);
			});
			return delay.promise;
		}
	});
});