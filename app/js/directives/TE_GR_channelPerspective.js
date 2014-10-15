define(['directives', 'services'], function(directives) {

    directives.directive('generalChannelPerspective', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q',
        function(Label, SeminarInfo, $http, PeriodInfo, $q) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_channelPerspective.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label         = Label;
                        getResult();
                    }

                    var getResult = function() {

                        //switching('showPerformance');
                        var url = '/performanceHighlights/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;

                        $http({
                            method: 'GET',
                            url: url,
                            //tracker: scope.loadingTracker
                        }).then(function(data) {
                            return organiseArray(data);
                        }).then(function(data) {                                          

                            scope.isResultShown = true;
                            scope.isPageLoading = false;

                        }, function(data) {
                            // if(!scope.logs){scope.logs = [];}
                            // scope.logs.push(data.msg);                                            
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();

                        //if(data.data[0] == "XXXXX"){ deferred.reject({msg:'XXXXX'}); }
                        if (data.data[0]) {

                        	$scope.Sales = new Array();
                        	$scope.Total = new Array();

                        	var retailer1 = 1,retailer2 = 2, retailer3 = 3, supplier1 = 4, supplier2 = 5, supplier3 = 6;


                            deferred.resolve({
                                msg: 'Array is ready.'
                            });
                        } else {
                            deferred.reject({
                                msg: 'data.data[0] is undefined'
                            });
                        }
                        return deferred.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        console.log('watch is actived');
                        if (newValue == true) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPeriod', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown) {
                            initializePage();
                        }
                    })
                }
            }
        }
    ])
})