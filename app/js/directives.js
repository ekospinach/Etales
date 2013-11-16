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
		}])
		.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
		    return {
		        restrict: 'A',
		        link: function(scope, element, attrs) {
		            var prevDisp = element.css('display');
		            $rootScope.$watch('user.role', function(role) {
		                //console.log('Directive handle, attrs.accessLevel: ' + attrs.accessLevel + ',try to call auth.authorize()...');
		                if(!Auth.authorize(attrs.accessLevel))
		                    element.css('display', 'none');
		                else
		                    element.css('display', prevDisp);

		                //console.log('function Auth.authorize result:' + Auth.authorize(attrs.accessLevel));
		                //console.log('-----------------------');
		            });
		        }
		    };
		}]);

	}
);