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
				if(item==0||item==-100||item==undefined){
					return '-';
				}else if(item<0.1&&item>0){
					return '< 0.1';
				}else{
					return item.toFixed(1);
				}
			}
		})
		.filter('NulltoMinOr2Number',function(){
			return function(item){
				if(item==0||item==-100||item==undefined){
					return '-';
				}else{
					return item.toFixed(2);
				}
			}
		})

});
