define(['directives'], function(directives){
    directives.directive('appVersion', ['version', function(version) {
                        return function(scope, elm, attrs) {
                                elm.text(version);
                        };
                }])        
                .directive('btnLoading',function () {        
                        return {
                            link:function (scope, element, attrs) {
                                scope.$watch(
                                    function () {
                                        return scope.$eval(attrs.btnLoading);
                                    },
                                    function (value) {
                                            //console.log('directive, btnLoading:' + value);
                                        if(value) {
                                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                                element.addClass('disabled').attr('disabled', 'disabled');
                                            }
                                            element.data('resetText', element.html());
                                            element.html(element.data('loading-text'));
                                        } else {
                                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                                element.removeClass('disabled').removeAttr('disabled');
                                            }
                                            element.html(element.data('resetText'));
                                        }
                                    }
                                );
                            }
                        };

                })
                .directive('loadEnd',function(){
                    return function(scope,elm,attrs){
                       pageloader=document.getElementById('pageloader');
                       pageloader.style.display="none";
                    }
                })
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
                .directive('navBootstrap',function(){
                    return {
                        restrict:'A',
                        link:function(scope,element,attrs){
                            $('.bs-sidenav li').click(function(){
                                $(".bs-sidenav li").removeClass("active");
                                $(this).addClass('active');
                                //$(this).firstChild.addClass('active');
                            });
                            $('.second-sidenav li').click(function(){
                                $('.second-sidenav li').removeClass("active");
                                $(".bs-sidenav li").removeClass("active");
                                $($($(this).parent()).parent()).addClass("active");
                                $(this).addClass('active');
                            })
                        }

                    }
                })
                .directive('angularBootstrap',function(){
                    return function(scope,elm,attrs){
                        $(".bs-docs-sidenav>li>a").click(function(){
                            $(".bs-docs-sidenav li").removeClass("active");
                            $(this).parent().addClass("active");
                            if($($($(this).parent()).children()[1]).children()[0]!=undefined){
                                $($($($(this).parent()).children()[1]).children()[0]).addClass('active');
                            }
                        });
                        $(".second-sidenav>li>a").click(function(){
                            $(".second-sidenav li").removeClass("active");
                            $(this).parent().addClass("active");
                        });
                    }
                })
                .directive('angularWizard',function(){
                    return function(scope,elm,attrs){
                        $(".steps-indicator>li>a").click(function(){
                            $(".steps-indicator li").removeClass("editing");
                            $(this).parent().addClass("editing");
                        });
                    }
                })
                .directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
                    return {
                        restrict: 'A',
                        link: function(scope, element, attrs) {
                            var prevDisp = element.css('display');
                            $rootScope.$watch('user.role', function(role) {
                                console.log('Directive handle, attrs.accessLevel: ' + attrs.accessLevel + ',try to call auth.authorize()...');
                                if(!Auth.authorize(attrs.accessLevel))
                                    element.css('display', 'none');
                                else
                                    element.css('display', prevDisp);
                            });
                        }
                    };
                }])
                .directive('jqxTree',function(){
                    return function(scope,elm,attrs){
                        $('.listTree').listTree(scope.tree, { "startCollapsed": true });
                        scope.$watch(attrs.ngModel,function(v){
                            $('.listTree').listTree('update', scope.tree,{"startCollapsed": true});
                            $(document).on('click', '.jqx-btn-success', function(e) {
                                $('.listTree').listTree('selectAll');
                            }).on('click', '.jqx-btn-danger', function(e) {
                                $('.listTree').listTree('deselectAll');
                            }).on('click', '.jqx-btn-primary', function(e) {
                                var data="?period="+scope.period+"&cat="+scope.cat+"&market="+scope.market+"&language="+scope.language+"&data="+JSON.stringify($('.listTree').data('listTree').selected);
                                scope.params=data;
                            });
                        })
                    }
                })
                .directive('scrollSpy', function($timeout){
                    return {
                        restrict: 'A',
                        link: function(scope, elem, attr) {
                            var offset = parseInt(attr.scrollOffset, 10)
                            if(!offset) offset = 10;
                            console.log("offset:  " + offset);
                            $(elem).scrollspy({ "offset" : offset});
                            scope.$watch(attr.scrollSpy, function(value) {
                                $timeout(function() { 
                                  $(elem).scrollspy('refresh', { "offset" : offset})
                                }, 1);
                            }, true);
                        }
                    }
                })
                .directive('preventDefault',function(){
                    return function(scope, element, attrs) {
                        jQuery(element).click(function(event) {
                            event.preventDefault();
                        });
                    }
                })
                .directive('scrollTo',["$window", function($window){
                    return {
                        restrict : "AC",
                        compile : function(){

                            function scrollInto(elementId) {
                                if(!elementId) $window.scrollTo(0, 0);
                                //check if an element can be found with id attribute
                                var el = document.getElementById(elementId);
                                if(el) el.scrollIntoView();
                            }

                            return function(scope, element, attr) {
                                element.bind("click", function(event){
                                    scrollInto(attr.scrollTo);
                                });
                            };
                        }
                    };
                }])
                .directive('affix', [ '$window', '$document', '$parse', function ( $window, $document, $parse ) {
                  return {
                    scope: { affix: '@' },
                    link: function ( scope, element, attrs ) {
                      var win = angular.element ( $window ),
                        affixed;
                                    
                      // Obviously, whenever a scroll occurs, we need to check and possibly 
                      // adjust the position of the affixed element.
                      win.bind( 'scroll', checkPosition );
                      
                      // Less obviously, when a link is clicked (in theory changing the current
                      // scroll position), we need to check and possibly adjsut the position. We,
                      // however, can't do this instantly as the page may not be in the right
                      // position yet.
                      win.bind( 'click', function () {
                        setTimeout( checkPosition, 1 );
                      });
                      
                      function checkPosition() {
                        var offset = $parse(scope.affix)(scope); 
                        var affix = win.prop('pageYOffset') <= offset ? 'top' : false;
                        if (affixed === affix) return;
                          
                        affixed = affix;
                          
                        element.removeClass('affix affix-top').addClass('affix' + (affix ? '-' + affix : ''));
                      }
                    }
                  };
                }])
})