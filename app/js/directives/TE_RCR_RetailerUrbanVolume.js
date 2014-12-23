define(['directives', 'services'], function(directives) {

    directives.directive('retailerUrbanVolume', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    retailerShow: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/RCR_retailerUrbanVolume.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadVariantValue = function(data, brandName, variantName, market) {
                        var array = _.find(data, function(obj) {
                            return (obj.variantName == variantName && obj.parentBrandName == brandName && obj.marketID == market);
                        });
                        return array.value;
                    }

                    var loadretailerVolume = function(data, category, market) {
                        data.rcrviv_Initial.forEach(function(singleData){
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var varName        = singleData.variantName;
                                var brandName      = singleData.parentBrandName;
                                var initial        = singleData.value;
                                var production     = loadVariantValue(data.rcrviv_Purchase, brandName, varName, market);
                                var sales          = loadVariantValue(data.rcrviv_Sales, brandName, varName, market);
                                var discontinued   = loadVariantValue(data.rcrviv_Discontinued, brandName, varName, market);
                                var closing        = loadVariantValue(data.rcrviv_Closing, brandName, varName, market);
                                var netRetailPrice = loadVariantValue(data.rcrviv_NetRetailPrice, brandName, varName, market);
                                //data.parentCompany 1 2 3 ==>(supplier 1 2 3)'s product
                                //data.parentCompany 5/6 ==>retailer's Private Label
                                switch (singleData.parentCompany) {
                                    case 1:
                                        if (category == 1) {
                                            scope.product1es.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        } else {
                                            scope.product1hs.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        }
                                        break;
                                    case 2:
                                        if (category == 1) {
                                            scope.product2es.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        } else {
                                            scope.product2hs.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        }
                                        break;
                                    case 3:
                                        if (category == 1) {
                                            scope.product3es.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        } else {
                                            scope.product3hs.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        }
                                        break;
                                    case 4:
                                        break;
                                        //case 5 without break will automatic turn to case 6
                                    case 5:
                                    case 6:
                                        if (category == 1) {
                                            scope.product4es.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        } else {
                                            scope.product4hs.push({
                                                'fullName': brandName + varName,
                                                'initial': initial,
                                                'production': production,
                                                'sales': sales,
                                                'discontinued': discontinued,
                                                'closing': closing,
                                                'netRetailPrice': netRetailPrice
                                            });
                                        }
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        scope.product1es = [];
                        scope.product1hs = [];
                        scope.product2es = [];
                        scope.product2hs = [];
                        scope.product3es = [];
                        scope.product3hs = [];
                        scope.product4es = [];
                        scope.product4hs = [];
                        var url = '/RCR-inventoryVolumes/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        loadretailerVolume(data, StaticValues.categoryID.ele, StaticValues.marketID.urban);
                        loadretailerVolume(data, StaticValues.categoryID.hea, StaticValues.marketID.urban);

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
                        if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPlayer', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.retailerShow) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})