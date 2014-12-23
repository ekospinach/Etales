define(['directives', 'services'], function(directives) {

    directives.directive('generalProductPortfolio', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/GR_productPortfolio.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        //switching('showPerformance');
                        var url = '/productPortfolio/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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

                        scope.playerses = [[],[],[],[],[]];
                        scope.playershs = [[],[],[],[],[]];

                        data.categoryInfo[StaticValues.category.ele].variantInfo.forEach(function(singleData) {
                            switch (singleData.parentBrandName.substring(singleData.parentBrandName.length - 1)) {
                                case '1':
                                    scope.playerses[0].push(singleData);
                                    break;
                                case '2':
                                    scope.playerses[1].push(singleData);
                                    break;
                                case '3':
                                    scope.playerses[2].push(singleData);
                                    break;
                                case '4':
                                    break;
                                case '5':
                                    scope.playerses[3].push(singleData);
                                    break;
                                case '6':
                                    scope.playerses[4].push(singleData);
                                    break;
                                case '7':
                                    break;
                            }
                        })

                        data.categoryInfo[StaticValues.category.hea].variantInfo.forEach(function(singleData) {
                            switch (singleData.parentBrandName.substring(singleData.parentBrandName.length - 1)) {
                                case '1':
                                    scope.playershs[0].push(singleData);
                                    break;
                                case '2':
                                    scope.playershs[1].push(singleData);
                                    break;
                                case '3':
                                    scope.playershs[2].push(singleData);
                                    break;
                                case '4':
                                    break;
                                case '5':
                                    scope.playershs[3].push(singleData);
                                    break;
                                case '6':
                                    scope.playershs[4].push(singleData);
                                    break;
                                case '7':
                                    break;
                            }
                        })

                        /*
                    
                        producer data 
                        the first letter of the variant parentBrandName decide the category e.g 'E' categoryID=1;
                        the last letter of the varinat parentBrandName decide the player  e.g '1' supplier 1
                        
                        player 5 retailer 1
                        player 6 retailer 2

                        */
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