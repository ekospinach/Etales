define(['directives', 'services'], function(directives) {

    directives.directive('marketPromotionElecssories', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_promotionElecssories.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadPromotion = function(data, category) {
                        data.variantInfo.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category) {
                                var fullName = singleData.parentBrandName + singleData.variantName;
                                var rural1Length = rural1Depth = urban1Length = urban1Depth = rural2Length = rural2Depth = urban2Length = urban2Depth = 0;

                                //depth=variantInfo[].accountInfo[retailerID-1].promoRate[catrgoryID-1]
                                //length=variantInfo[].accountInfo[retailerID-1].promoFrequency[categoryID-1]
                                //variantInfo[].parentCompanyID decide player num
                                //player 1 2 3 -->supplier
                                //player 5 6 -->retailer

                                if (singleData.accountInfo[StaticValues.player.r1] != undefined) {
                                    if (singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea] != 0) {
                                        rural1Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea] * 100 * 100) / 100);
                                    } else {
                                        rural1Depth = singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.hea];
                                    }
                                    rural1Length = singleData.accountInfo[StaticValues.player.r1].promoFrequency[StaticValues.category.hea];
                                    if (singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele] != 0) {
                                        urban1Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele] * 100 * 100) / 100);
                                    } else {
                                        urban1Depth = singleData.accountInfo[StaticValues.player.r1].promoRate[StaticValues.category.ele];
                                    }
                                    urban1Length = singleData.accountInfo[StaticValues.player.r1].promoFrequency[StaticValues.category.ele];
                                }
                                if (singleData.accountInfo[StaticValues.player.r2] != undefined) {
                                    if (singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea] != 0) {
                                        rural2Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea] * 100 * 100) / 100);
                                    } else {
                                        rural1Depth = singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.hea];
                                    }
                                    rural2Length = singleData.accountInfo[StaticValues.player.r2].promoFrequency[StaticValues.category.hea];
                                    if (singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele] != 0) {
                                        urban2Depth = (Math.floor(singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele] * 100 * 100) / 100);
                                    } else {
                                        urban2Depth = singleData.accountInfo[StaticValues.player.r2].promoRate[StaticValues.category.ele];

                                    }
                                    urban2Length = singleData.accountInfo[StaticValues.player.r2].promoFrequency[StaticValues.category.ele];
                                }
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.player1s.push({
                                            'fullName': fullName,
                                            'rural1Length': rural1Length,
                                            'rural1Depth': rural1Depth,
                                            'urban1Length': urban1Length,
                                            'urban1Depth': urban1Depth,
                                            'rural2Length': rural2Length,
                                            'rural2Depth': rural2Depth,
                                            'urban2Length': urban2Length,
                                            'urban2Depth': urban2Depth
                                        });
                                        break;
                                    case 2:
                                        scope.player2s.push({
                                            'fullName': fullName,
                                            'rural1Length': rural1Length,
                                            'rural1Depth': rural1Depth,
                                            'urban1Length': urban1Length,
                                            'urban1Depth': urban1Depth,
                                            'rural2Length': rural2Length,
                                            'rural2Depth': rural2Depth,
                                            'urban2Length': urban2Length,
                                            'urban2Depth': urban2Depth
                                        });
                                        break;
                                    case 3:
                                        scope.player3s.push({
                                            'fullName': fullName,
                                            'rural1Length': rural1Length,
                                            'rural1Depth': rural1Depth,
                                            'urban1Length': urban1Length,
                                            'urban1Depth': urban1Depth,
                                            'rural2Length': rural2Length,
                                            'rural2Depth': rural2Depth,
                                            'urban2Length': urban2Length,
                                            'urban2Depth': urban2Depth
                                        });
                                        break;
                                    case 5:
                                        scope.player5s.push({
                                            'fullName': fullName,
                                            'rural1Length': rural1Length,
                                            'rural1Depth': rural1Depth,
                                            'urban1Length': urban1Length,
                                            'urban1Depth': urban1Depth,
                                            'rural2Length': rural2Length,
                                            'rural2Depth': rural2Depth,
                                            'urban2Length': urban2Length,
                                            'urban2Depth': urban2Depth
                                        });
                                        break;
                                    case 6:
                                        scope.player6s.push({
                                            'fullName': fullName,
                                            'rural1Length': rural1Length,
                                            'rural1Depth': rural1Depth,
                                            'urban1Length': urban1Length,
                                            'urban1Depth': urban1Depth,
                                            'rural2Length': rural2Length,
                                            'rural2Depth': rural2Depth,
                                            'urban2Length': urban2Length,
                                            'urban2Depth': urban2Depth
                                        });
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/getMR-pricePromotions/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        scope.player1s = [];
                        scope.player2s = [];
                        scope.player3s = [];
                        scope.player5s = [];
                        scope.player6s = [];
                        scope.nameColor = '#DFF0D8'; //绿
                        loadPromotion(data, StaticValues.categoryID.ele);
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