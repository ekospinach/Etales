define(['directives', 'services'], function(directives) {

    directives.directive('marketRetailerIntelligence', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_retailerIntelligence.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        scope.data      = [];
                        scope.variants  = [];
                        scope.player1es = [];
                        scope.player2es = [];
                        scope.player3es = [];
                        scope.player5es = [];
                        scope.player6es = [];
                        scope.player1hs = [];
                        scope.player2hs = [];
                        scope.player3hs = [];
                        scope.player5hs = [];
                        scope.player6hs = [];
                        var url = '/getMR-retailersIntelligence/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        //urban/rural + 2 is for ng-repeat ,means retailer2's urban / rural 
                        //put retailerInfo[StaticValues.player.r2]'s values into retailerInfo[StaticValues.player.r1] 
                        data.retailerInfo[StaticValues.player.r1].storeServiceLevel[StaticValues.market.urban + 2] = data.retailerInfo[StaticValues.player.r2].storeServiceLevel[StaticValues.market.urban];
                        data.retailerInfo[StaticValues.player.r1].storeServiceLevel[StaticValues.market.rural + 2] = data.retailerInfo[StaticValues.player.r2].storeServiceLevel[StaticValues.market.rural];
                        data.retailerInfo[StaticValues.player.r1].onlineAdvertising[StaticValues.market.urban + 2] = data.retailerInfo[StaticValues.player.r2].onlineAdvertising[StaticValues.market.urban];
                        data.retailerInfo[StaticValues.player.r1].onlineAdvertising[StaticValues.market.rural + 2] = data.retailerInfo[StaticValues.player.r2].onlineAdvertising[StaticValues.market.rural];
                        data.retailerInfo[StaticValues.player.r1].offlineAdvertising[StaticValues.market.urban + 2] = data.retailerInfo[StaticValues.player.r2].offlineAdvertising[StaticValues.market.urban];
                        data.retailerInfo[StaticValues.player.r1].offlineAdvertising[StaticValues.market.rural + 2] = data.retailerInfo[StaticValues.player.r2].offlineAdvertising[StaticValues.market.rural];
                        data.retailerInfo[StaticValues.player.r1].localAdvertising[StaticValues.market.urban + 2] = data.retailerInfo[StaticValues.player.r2].localAdvertising[StaticValues.market.urban];
                        data.retailerInfo[StaticValues.player.r1].localAdvertising[StaticValues.market.rural + 2] = data.retailerInfo[StaticValues.player.r2].localAdvertising[StaticValues.market.rural];
                        scope.data.push({
                            'storeServiceLevel': data.retailerInfo[StaticValues.player.r1].storeServiceLevel,
                            'onlineAdvertising': data.retailerInfo[StaticValues.player.r1].onlineAdvertising,
                            'offlineAdvertising': data.retailerInfo[StaticValues.player.r1].offlineAdvertising,
                            'localAdvertising': data.retailerInfo[StaticValues.player.r1].localAdvertising
                        });

                        data.retailerInfo[StaticValues.player.r1].variantInfo.forEach(function(singleData) {
                            var variant = _.find(data.retailerInfo[StaticValues.player.r2].variantInfo, function(obj) {
                                    return (obj.variantName == singleData.variantName && obj.parentBrandName == singleData.parentBrandName);
                                })
                                //if retailer buy the variant  put retailerInfo[StaticValues.player.r2]'s values into retailerInfo[StaticValues.player.r1] 
                            if (variant != undefined) {
                                singleData.shelfSpace[StaticValues.market.urban + 2] = variant.shelfSpace[StaticValues.market.urban];
                                singleData.shelfSpace[StaticValues.market.rural + 2] = variant.shelfSpace[StaticValues.market.rural];
                            } else {
                                //else set retailer2's value = 0
                                singleData.shelfSpace[StaticValues.market.urban + 2] = 0;
                                singleData.shelfSpace[StaticValues.market.rural + 2] = 0;
                            }
                            scope.variants.push(singleData);
                        })

                        data.retailerInfo[StaticValues.player.r2].variantInfo.forEach(function(singleData) {
                            var variant = _.find(scope.variants, function(obj) {
                                return (obj.variantName == singleData.variantName && obj.parentBrandName == singleData.parentBrandName);
                            });
                            //if scope.variants haven't the variant set retailer1's values =0  
                            if (variant == undefined) {
                                singleData.shelfSpace[StaticValues.market.urban + 2] = singleData.shelfSpace[StaticValues.market.urban];
                                singleData.shelfSpace[StaticValues.market.rural + 2] = singleData.shelfSpace[StaticValues.market.rural];
                                singleData.shelfSpace[StaticValues.market.urban] = 0;
                                singleData.shelfSpace[StaticValues.market.rural] = 0;
                                scope.variants.push(singleData);
                            }
                        })

                        scope.variants.forEach(function(singleData) {
                            switch (singleData.parentCompanyID) {
                                case 1:
                                    if (singleData.parentCategoryID == 1) {
                                        scope.player1es.push(singleData);
                                    } else {
                                        scope.player1hs.push(singleData);
                                    }
                                    break;
                                case 2:
                                    if (singleData.parentCategoryID == 1) {
                                        scope.player2es.push(singleData);
                                    } else {
                                        scope.player2hs.push(singleData);
                                    }
                                    break;
                                case 3:
                                    if (singleData.parentCategoryID == 1) {
                                        scope.player3es.push(singleData);
                                    } else {
                                        scope.player3hs.push(singleData);
                                    }
                                    break;
                                case 5:
                                    if (singleData.parentCategoryID == 1) {
                                        scope.player5es.push(singleData);
                                    } else {
                                        scope.player5hs.push(singleData);
                                    }
                                    break;
                                case 6:
                                    if (singleData.parentCategoryID == 1) {
                                        scope.player6es.push(singleData);
                                    } else {
                                        scope.player6hs.push(singleData);
                                    }
                                    break;
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