define(['angular','angularResource'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);
	services.value('version', '0.1');
	
	services.factory('ProducerDecision', ['$resource','$rootScope',function($resource, $rootScope){
		return $resource('/producerDecision/:producerID/:period/:seminar', {}, {
        query: {method:'GET', params:{producerID: $rootScope.rootProducerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}, isArray:true}
      });
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