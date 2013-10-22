define(['angular','angularResource'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);
	services.value('version', '0.1');

	services.factory('ProducerDecision',['$resource','$rootScope',function($resource,$rootScope){
		return $resource('/producerDecision/:producerID/:period/:seminar',{producerID: $rootScope.rootProducerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar},
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
				seminar : 'TEST',
			}, base;			

		this.setDefaultPara = function(p) { requestPara = p };
		this.$get = ['ProducerDecision', '$q','$rootScope', function(ProducerDecision, $q, $rootScope){
			return {
				reload : function(p){ 
					requestPara = p;
					var delay = $q.defer();
					getLoaderPromise(ProducerDecision, $q).then(function(){
						delay.resolve(base);
						startListenChangeFromServer($rootScope);
					}, function(reason){
						delay.reject(reason);
					}, function(update){
						delay.notify('notify...')
					});
					return delay.promise;
				},
				setSomething : function(sth){
					//post to server...
					base.seminar = sth;
					$rootScope.$broadcast('producerDecisionBaseChanged', base);
				},
				setProducerDecisionValue:function(categoryID,brandName,varName,location,tep,value){
					//startListenChangeFromServer($rootScope);
					for(var i=0;i<base.proCatDecision.length;i++){
						if(base.proCatDecision[i].categoryID==categoryID){
							for(var j=0;j<base.proCatDecision[i].proBrandsDecision.length;j++){
								if(base.proCatDecision[i].proBrandsDecision[j].brandName==brandName){
									for(var k=0;k<base.proCatDecision[i].proBrandsDecision[j].proVarDecision.length;k++){
										if(base.proCatDecision[i].proBrandsDecision[j].proVarDecision[k].varName==varName){
											if(location=="packFormat"){
												if(value==1){
													value="ECONOMY";
												}
												if(value==2){
													value="STANDARD";
												}
												if(value==3){
													value="PREMIUM";
												}
											}
											if(location=="composition"){
												base.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][location][tep]=value;
											}
											else{
												base.proCatDecision[i].proBrandsDecision[j].proVarDecision[k][location]=value;
											}
											break;
										}
									}
									break;
								}
							}
							break;
						}
					}	
					console.log(base);
					//$rootScope.$broadcast('producerDecisionBaseChanged', base);
				},
				setProducerDecisionBrand:function(categoryID,brandID,location,tep,value){
					for(var i=0;i<base.proCatDecision.length;i++){
						if(base.proCatDecision[i].categoryID==categoryID){
							for(var j=0;j<base.proCatDecision[i].proBrandsDecision.length;j++){
								if(base.proCatDecision[i].proBrandsDecision[j].brandID==brandID){
									if(location=="supportTraditionalTrade"||location=="advertisingOffLine"){
										base.proCatDecision[i].proBrandsDecision[j][location][tep]=value;
									}
									else{
										base.proCatDecision[i].proBrandsDecision[j][location]=value;
									}
									break;
								}
							}
							break;
						}
					}
					console.log(base);
				},
				setProducerDecisionCategory:function(categoryID,location,value){
					for(var i=0;i<base.proCatDecision.length;i++){
						if(base.proCatDecision[i].categoryID==categoryID){
							base.proCatDecision[i][location]=value;
						}
						break;
					}
					console.log(base);
				},
				addNewProduct:function(newproducerDecision,categoryID,parameter){
					//startListenChangeFromServer($rootScope);
					if(parameter==1){
						for(var i=0;i<base.proCatDecision.length;i++){
							if(base.proCatDecision[i].categoryID==categoryID){
								base.proCatDecision[i].proBrandsDecision.push(newproducerDecision);
								break;
							}
						}
					}
					else{
						for(var i=0;i<base.proCatDecision.length;i++){
							for(var j=0;j<base.proCatDecision[i].proBrandsDecision.length;j++){
								if(base.proCatDecision[i].proBrandsDecision[j].brandID==newproducerDecision.parentBrandID){
									base.proCatDecision[i].proBrandsDecision[j].proVarDecision.push(newproducerDecision);
								}

							}
						}
					}
					console.log(base);
					//startListenChangeFromServer($rootScope);
					//$rootScope.$broadcast('producerDecisionBaseChanged', base);
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

		var startListenChangeFromServer = function(rootScope){
			var socket = io.connect();
			socket.on('baseChanged', function(data){
				console.log(data);
				rootScope.$broadcast('producerDecisionBaseChangedFromServer', base);
			}).on('connect', function () { 
			    socket.emit('ferret', 'tobi', function (data) {
	      			console.log(data); 
	    		});
	  		});					
		}

	});

});