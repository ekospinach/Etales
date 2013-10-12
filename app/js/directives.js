define(['angular', 'services'], function(angular, services) {
	'use strict';

	angular.module('myApp.directives', ['myApp.services'])
		.directive('appVersion', ['version', function(version) {
			return function(scope, elm, attrs) {
				elm.text(version);
			};
		}])
		.directive('activeNav', ['$location', function(location) {
		    return {
		        restrict: 'A',
		        link: function(scope, element, attrs) {
		            var nestedA = element.find('a')[0];
		            var path = nestedA.href;
		            scope.location = location;
		            scope.$watch('location.absUrl()', function(newPath) {
		                if (path === newPath) {
		                    element.addClass('active');
		                } else {
		                    element.removeClass('active');
		                }
		            });
		        }
		    };
		}]);
	}
);