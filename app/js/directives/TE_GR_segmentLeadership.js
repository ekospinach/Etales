define(['directives', 'services'], function(directives) {

    directives.directive('generalSegmentLeadership', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/GR_segmentLeadership.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        //switching('showPerformance');
                        var url = '/segmentLeadership/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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

                        scope.priceSensitives = [];
                        scope.valueForMoneies = [];
                        scope.fashions        = [];
                        scope.freakses        = [];
                        scope.bms             = [];
                        scope.onlines         = [];
                        scope.mixeds          = [];
                        //data.categoryInfo[2].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].grsl_ValueLeaders
                        scope.priceSensitives.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all]);
                        scope.valueForMoneies.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all]);
                        scope.fashions.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all]);
                        scope.freakses.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all]);
                        scope.bms.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm]);
                        scope.onlines.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online]);
                        scope.mixeds.push(data.categoryInfo[StaticValues.category.ele].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed], data.categoryInfo[StaticValues.category.hea].marketInfo[StaticValues.market.total].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed]);

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