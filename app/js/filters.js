define(['angular', 'services'], function (angular, services) {
	'use strict';
	
	angular.module('myApp.filters', ['myApp.services'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}])
		.filter('NulltoMinOr1Number',function(){
			return function(item){
				if(item==0||item==-100){
					return '-';
				}else{
					return Math.round(item*10)/10;
				}
			}
		})
		.filter('NulltoMinOr2Number',function(){
			return function(item){
				if(item==0||item==-100){
					return '-';
				}else{
					return Math.round(item*100)/100;
				}
			}
		})

});
