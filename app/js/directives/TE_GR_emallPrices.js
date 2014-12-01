define(['directives', 'services'], function(directives) {

    directives.directive('generalEmallPrices', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_emallPrices.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/emallPrices/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                        $http({
                            method: 'GET',
                            url: url,
                            //tracker: scope.loadingTracker
                        }).then(function(data) {
                            return organiseArray(data.data[0]);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();

                        scope.producerses = [
                            [],
                            [],
                            []
                        ];
                        scope.producershs = [
                            [],
                            [],
                            []
                        ];

                        /*
                    
                        producer data 
                        the first letter of the variant parentBrandName decide the category e.g 'E' categoryID=1;
                        the last letter of the varinat parentBrandName decide the player  e.g '1' supplier 1

                        */
                        data.categoryInfo[StaticValues.category.ele].variantInfo.forEach(function(singleData) {
                            if (singleData.parentBrandName.substring(0, 1) == "E") {
                                if (singleData.parentBrandName.substring(singleData.parentBrandName.length - 1) < 4) {
                                    scope.producerses[singleData.parentBrandName.substring(singleData.parentBrandName.length - 1) - 1].push(singleData);
                                }
                            }
                        })

                        data.categoryInfo[StaticValues.category.hea].variantInfo.forEach(function(singleData) {
                            if (singleData.parentBrandName.substring(0, 1) == "H") {
                                if (singleData.parentBrandName.substring(singleData.parentBrandName.length - 1) < 4) {
                                    scope.producershs[singleData.parentBrandName.substring(singleData.parentBrandName.length - 1) - 1].push(singleData);
                                }
                            }
                        })


                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }


                    scope.$watch('isPageShown', function(newValue, oldValue) {
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