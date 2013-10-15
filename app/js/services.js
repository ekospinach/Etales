define(['angular','angularResource'], function (angular,angularResource) {
	'use strict';

	var services=angular.module('myApp.services', ['ngResource']);
	services.value('version', '0.1');

	services.factory('ProducerDecision',['$resource','$rootScope',function($resource,$rootScope){
		return $resource('/producerDecision/:producerID/:period/:seminar', {}, {
        query: {method:'GET', params:{producerID: $rootScope.rootProducerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}, isArray:true}
      });
	}]);

	services.factory('ProducerDecisionLoader', ['ProducerDecision', '$route','$rootScope', '$q',function(ProducerDecision, $route,$rootScope, $q) {		
		return function() {
			var delay = $q.defer();
			ProducerDecision.get({producerID: $rootScope.rootProducerID,period:$rootScope.rootPeriod,seminar:$rootScope.rootSeminar}, function(producerDecision) {
				delay.resolve(producerDecision);
			}, function() {
				delay.reject('Unable to fetch producerDecision '  + $route.current.params.producerID);
			});
			return delay.promise;
		};
	}]);
});