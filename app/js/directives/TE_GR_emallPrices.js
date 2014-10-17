define(['directives', 'services'], function(directives) {

    directives.directive('generalEmallPrices', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q',
        function(Label, SeminarInfo, $http, PeriodInfo, $q) {
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
                        scope.Label         = Label;
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

                        scope.producer1es = new Array();
                        scope.producer1hs = new Array();
                        scope.producer2es = new Array();
                        scope.producer2hs = new Array();
                        scope.producer3es = new Array();
                        scope.producer3hs = new Array();

                        /*
                    
                        producer data 
                        the first letter of the variant parentBrandName decide the category e.g 'E' categoryID=1;
                        the last letter of the varinat parentBrandName decide the player  e.g '1' supplier 1

                    */

                        for (var i = 0; i < data.categoryInfo[0].variantInfo.length; i++) {
                            if (data.categoryInfo[0].variantInfo[i].parentBrandName.substring(0, 1) == "E") {
                                switch (data.categoryInfo[0].variantInfo[i].parentBrandName.substring(data.categoryInfo[0].variantInfo[i].parentBrandName.length - 1)) {
                                    case '1':
                                        scope.producer1es.push(data.categoryInfo[0].variantInfo[i]);
                                        break;
                                    case '2':
                                        scope.producer2es.push(data.categoryInfo[0].variantInfo[i]);
                                        break;
                                    case '3':
                                        scope.producer3es.push(data.categoryInfo[0].variantInfo[i]);
                                        break;
                                    case '4':
                                        break;
                                }
                            }
                        }
                        for (var i = 0; i < data.categoryInfo[1].variantInfo.length; i++) {
                            if (data.categoryInfo[1].variantInfo[i].parentBrandName.substring(0, 1) == "H") {

                                switch (data.categoryInfo[1].variantInfo[i].parentBrandName.substring(data.categoryInfo[1].variantInfo[i].parentBrandName.length - 1)) {
                                    case '1':
                                        scope.producer1hs.push(data.categoryInfo[1].variantInfo[i]);
                                        break;
                                    case '2':
                                        scope.producer2hs.push(data.categoryInfo[1].variantInfo[i]);
                                        break;
                                    case '3':
                                        scope.producer3hs.push(data.categoryInfo[1].variantInfo[i]);
                                        break;
                                    case '4':
                                        break;
                                }
                            }
                        }


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