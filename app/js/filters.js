define(['angular', 'services'], function (angular, services) {
	'use strict';
	
	angular.module('myApp.filters', ['myApp.services'])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}])

		.filter('number2',function(){
		    return function(item){
		        return Math.round(item*10)/10;
		    }
		})
		.filter('NulltoMinOrNumber1',function(){
			return function(item){
				if(item==0||item==-100){
					return '-';
				}else{
					return Math.round(item*10)/10;
				}
			}
		});
		.filter('NulltoMinOrNumber2',function(num){
			return function(item){
				if(item==0||item==-100){
					return '-';
				}else{
					return Math.round(item*100)/100;
				}
			}
		})

});
