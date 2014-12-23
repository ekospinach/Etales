define(['directives', 'services'], function(directives) {

    directives.directive('marketUrbanElecssoriesBrand', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_urbanElecssoriesBrand.html',
                //templateUrl : 'singleReportTemplate/MR_brand.html',            
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadBrandPerceptions = function(data, category, market) {
                        data.variantInfo.forEach(function(singleData) {
                            if (category == singleData.parentCategoryID && market == singleData.marketID) {
                                //variantInfo[].parentCompanyID decide the player
                                //quality data (variantInfo[].latestPerception[StaticValues.perception.quality],variantInfo[].latestPerception[StaticValues.perception.easy],fullName)--> use fullName to pop the info of this circle
                                //prices data (1,latestPerception[StaticValues.perception.appeal],fullName) -->use num '1' to posit all the circle in line . and use fullName to pop the info of this circle
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.quality1s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                                        scope.price1s.push([1, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                                        break;
                                    case 2:
                                        scope.quality2s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                                        scope.price2s.push([2, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                                        break;
                                    case 3:
                                        scope.quality3s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                                        scope.price3s.push([3, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                                        break;
                                    case 5:
                                        scope.quality5s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                                        scope.price5s.push([4, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                                        break;
                                    case 6:
                                        scope.quality6s.push([singleData.latestPerception[StaticValues.perception.easy], singleData.latestPerception[StaticValues.perception.quality], singleData.parentBrandName + singleData.variantName]);
                                        scope.price6s.push([5, singleData.latestPerception[StaticValues.perception.appeal], singleData.parentBrandName + singleData.variantName]);
                                        break;
                                }
                            }
                        })

                        scope.mySeries1 = [{
                            name: Label.getContent('Supplier') + ' 1',
                            data: scope.quality1s,
                            color: PlayerColor.s1
                        }, {
                            name: Label.getContent('Supplier') + ' 2',
                            data: scope.quality2s,
                            color: PlayerColor.s2
                        }, {
                            name: Label.getContent('Supplier') + ' 3',
                            data: scope.quality3s,
                            color: PlayerColor.s3
                        }, {
                            name: Label.getContent('Retailer') + ' 1',
                            data: scope.quality5s,
                            color: PlayerColor.r1
                        }, {
                            name: Label.getContent('Retailer') + ' 2',
                            data: scope.quality6s,
                            color: PlayerColor.r2
                        }];
                        scope.mySeries2 = [{
                            name: Label.getContent('Supplier') + ' 1',
                            data: scope.price1s,
                            color: PlayerColor.s1
                        }, {
                            name: Label.getContent('Supplier') + ' 2',
                            data: scope.price2s,
                            color: PlayerColor.s2
                        }, {
                            name: Label.getContent('Supplier') + ' 3',
                            data: scope.price3s,
                            color: PlayerColor.s3
                        }, {
                            name: Label.getContent('Retailer') + ' 1',
                            data: scope.price5s,
                            color: PlayerColor.r1
                        }, {
                            name: Label.getContent('Retailer') + ' 2',
                            data: scope.price6s,
                            color: PlayerColor.r2
                        }];
                        scope.myModel = category + "_" + market + '_' + scope.selectedPeriod;
                    }

                    var getResult = function() {
                        scope.quality1s = [];
                        scope.quality2s = [];
                        scope.quality3s = [];
                        scope.quality5s = [];
                        scope.quality6s = [];
                        scope.price1s   = [];
                        scope.price2s   = [];
                        scope.price3s   = [];
                        scope.price5s   = [];
                        scope.price6s   = [];
                        var url = '/getMR-variantPerceptionEvolution/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        scope.xTitle1 = Label.getContent("Ease of Use");
                        scope.yTitle1 = Label.getContent("Quality");
                        scope.yTitle2 = Label.getContent("Price Appeal");
                        loadBrandPerceptions(data, StaticValues.categoryID.ele, StaticValues.marketID.urban);
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