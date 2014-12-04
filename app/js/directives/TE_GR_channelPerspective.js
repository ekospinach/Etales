define(['directives', 'services'], function(directives) {

    directives.directive('generalChannelPerspective', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q',
        function(Label, SeminarInfo, $http, PeriodInfo, $q) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    data: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_channelPerspective.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/grChannelPerspective/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            return organiseArray(data.data.result);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function(data) {
                            console.log('fail');
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();

                        //if(data.data[0] == "XXXXX"){ deferred.reject({msg:'XXXXX'}); }
                        if (data) {
                            
                            scope.players = data.players;
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