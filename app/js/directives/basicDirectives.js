define(['directives'], function(directives) {
    directives.directive('appVersion', ['version',
        function(version) {
            return function(scope, elm, attrs) {
                elm.text(version);
            };
        }
    ])
    .directive('btnLoading', function() {
        return {
            link: function(scope, element, attrs) {
                scope.$watch(
                    function() {
                        return scope.$eval(attrs.btnLoading);
                    },
                    function(value) {
                        //console.log('directive, btnLoading:' + value);
                        if (value) {
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
    .directive('loadEnd', function() {
        return function(scope, elm, attrs) {
            pageloader = document.getElementById('pageloader');
            pageloader.style.display = "none";
        }
    })
    .directive('activeNav', ['$location',
        function(location) {
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
        }
    ])
    .directive('navBootstrap', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $('.bs-sidenav li').click(function() {
                    $(".bs-sidenav li").removeClass("active");
                    $(this).addClass('active');
                    //$(this).firstChild.addClass('active');
                });
                $('.second-sidenav li').click(function() {
                    $('.second-sidenav li').removeClass("active");
                    $(".bs-sidenav li").removeClass("active");
                    $($($(this).parent()).parent()).addClass("active");
                    $(this).addClass('active');
                })
            }

        }
    })
    .directive('angularBootstrap', function() {
        return function(scope, elm, attrs) {
            $(".bs-docs-sidenav>li>a").click(function() {
                $(".bs-docs-sidenav li").removeClass("active");
                $(this).parent().addClass("active");
                if ($($($(this).parent()).children()[1]).children()[0] != undefined) {
                    $($($($(this).parent()).children()[1]).children()[0]).addClass('active');
                }
            });
            $(".second-sidenav>li>a").click(function() {
                $(".second-sidenav li").removeClass("active");
                $(this).parent().addClass("active");
            });
        }
    })
    .directive('angularWizard', function() {
        return function(scope, elm, attrs) {
            $(".steps-indicator>li>a").click(function() {
                $(".steps-indicator li").removeClass("editing");
                $(this).parent().addClass("editing");
            });
        }
    })
    .directive('accessLevel', ['$rootScope', 'Auth',
        function($rootScope, Auth) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var prevDisp = element.css('display');
                    $rootScope.$watch('user.role', function(role) {
                        if (!Auth.authorize(attrs.accessLevel)) {
                            element.css('display', 'none');
                        } else {
                            element.css('display', prevDisp);
                        }
                    });
                }
            };
        }
    ])
    .directive('jqxTree', function() {
        return function(scope, elm, attrs) {
            $('.listTree').listTree(scope.tree, {
                "startCollapsed": true
            });
            scope.$watch(attrs.ngModel, function(v) {
                $('.listTree').listTree('update', scope.tree, {
                    "startCollapsed": true
                });
                $(document).on('click', '.jqx-btn-success', function(e) {
                    $('.listTree').listTree('selectAll');
                }).on('click', '.jqx-btn-danger', function(e) {
                    $('.listTree').listTree('deselectAll');
                }).on('click', '.jqx-btn-primary', function(e) {
                    var data = "?period=" + scope.period + "&cat=" + scope.cat + "&market=" + scope.market + "&language=" + scope.language + "&data=" + JSON.stringify($('.listTree').data('listTree').selected);
                    scope.params = data;
                });
            })
        }
    })
    .directive('scrollSpy', function($timeout) {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                var offset = parseInt(attr.scrollOffset, 10)
                if (!offset) offset = 10;
                console.log("offset:  " + offset);
                $(elem).scrollspy({
                    "offset": offset
                });
                scope.$watch(attr.scrollSpy, function(value) {
                    $timeout(function() {
                        $(elem).scrollspy('refresh', {
                            "offset": offset
                        })
                    }, 1);
                }, true);
            }
        }
    })
    .directive('preventDefault', function() {
        return function(scope, element, attrs) {
            jQuery(element).click(function(event) {
                event.preventDefault();
            });
        }
    })
    .directive('scrollTo', ["$window",
        function($window) {
            return {
                restrict: "AC",
                compile: function() {

                    function scrollInto(elementId) {
                        if (!elementId) $window.scrollTo(0, 0);
                        //check if an element can be found with id attribute
                        var el = document.getElementById(elementId);
                        if (el) el.scrollIntoView();
                    }

                    return function(scope, element, attr) {
                        element.bind("click", function(event) {
                            scrollInto(attr.scrollTo);
                        });
                    };
                }
            };
        }
    ])
    .directive('affix', ['$window', '$document', '$parse',
        function($window, $document, $parse) {
            return {
                scope: {
                    affix: '@'
                },
                link: function(scope, element, attrs) {
                    var win = angular.element($window),
                        affixed;

                    // Obviously, whenever a scroll occurs, we need to check and possibly 
                    // adjust the position of the affixed element.
                    win.bind('scroll', checkPosition);

                    // Less obviously, when a link is clicked (in theory changing the current
                    // scroll position), we need to check and possibly adjsut the position. We,
                    // however, can't do this instantly as the page may not be in the right
                    // position yet.
                    win.bind('click', function() {
                        setTimeout(checkPosition, 1);
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
        }
    ])
    .directive('fixedHeader', ['$timeout','$compile',
        function($timeout,$compile) {
            return {
                restrict: 'A',
                scope: {
                    tableHeight: '@'
                },
                link: function($scope, $elem, $attrs, $ctrl) {
                    function isVisible(el) {
                        var style = window.getComputedStyle(el);
                        return (style.display != 'none' && el.offsetWidth != 0);
                    }

                    function isTableReady() {
                        return isVisible(elem.querySelector("tbody")) && elem.querySelector('tbody tr:first-child') != null;
                    }

                    var elem = $elem[0];
                    // wait for content to load into table and to have at least one row, tdElems could be empty at the time of execution if td are created asynchronously (eg ng-repeat with promise)
                    var unbindWatch = $scope.$watch(isTableReady,
                        function(newValue, oldValue) {
                            if (newValue === true && oldValue === false) {
                                // reset display styles so column widths are correct when measured below
                                angular.element(elem.querySelectorAll('thead, tbody, tfoot')).css('display', '')

                                // wrap in $timeout to give table a chance to finish rendering
                                $timeout(function() {
                                    // set widths of columns
                                    angular.forEach(elem.querySelectorAll('tr:first-child th'), function(thElem, i) {

                                        var tdElems = elem.querySelector('tbody tr:first-child td:nth-child(' + (i + 1) + ')');
                                        var tfElems = elem.querySelector('tfoot tr:first-child td:nth-child(' + (i + 1) + ')');


                                        var columnWidth = tdElems ? tdElems.offsetWidth : thElem.offsetWidth;
                                        if (tdElems) {
                                            tdElems.style.width = columnWidth + 'px';
                                        }
                                        if (thElem) {
                                            thElem.style.width = columnWidth + 'px';
                                        }
                                        if (tfElems) {
                                            tfElems.style.width = columnWidth + 'px';
                                        }
                                    });

                                    // set css styles on thead and tbody
                                    angular.element(elem.querySelectorAll('thead, tfoot')).css('display', 'block')

                                    angular.element(elem.querySelectorAll('tbody')).css({
                                        'display': 'block',
                                        'height': $scope.tableHeight || 'inherit',
                                        //'overflow': 'auto'
                                    });

                                    // reduce width of last column by width of scrollbar
                                    var tbody = elem.querySelector('tbody');
                                    var scrollBarWidth = tbody.offsetWidth - tbody.clientWidth;
                                    if (scrollBarWidth > 0) {
                                        // for some reason trimming the width by 2px lines everything up better
                                        scrollBarWidth -= 2;
                                        var lastColumn = elem.querySelector('tbody tr:first-child td:last-child');
                                        lastColumn.style.width = (lastColumn.offsetWidth - scrollBarWidth) + 'px';
                                    }
                                });

                                //we only need to watch once
                                //unbindWatch();
                            }
                        }
                    );
                }
            };
        }
    ])
    .directive('scrollBind',function(){
        return function(scope,elem,attrs){
            $($(elem).find('.firstTbody')).scroll(function(){
                $($(elem).find('.secondTbody')).scrollTop($($(elem).find('.firstTbody')).scrollTop());
            });
            $($(elem).find('.secondTbody')).scroll(function(){
                $($(elem).find('.firstTbody')).scrollTop($($(elem).find('.secondTbody')).scrollTop());
            });
            $($(elem).find('.thirdTbody')).scroll(function(){
                $($(elem).find('.fourthTbody')).scrollTop($($(elem).find('.thirdTbody')).scrollTop());
            });
            $($(elem).find('.fourthTbody')).scroll(function(){
                $($(elem).find('.thirdTbody')).scrollTop($($(elem).find('.fourthTbody')).scrollTop());
            });
        }
    })
})