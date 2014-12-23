define(['directives', 'services'], function(directives) {

    directives.directive('retailerRuralConsumer', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
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
                templateUrl: 'singleReportTemplate/RCR_retailerRuralConsumer.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadRetailerConsumer = function(data, category, market) {
                        data.absoluteValue.forEach(function(singleData){
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var varName = singleData.variantName;
                                var brandName = singleData.parentBrandName;
                                /*
                                priceValueShare=absoluteValue[].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all]
                                moneyValueShare=absoluteValue[].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all]
                                fashionValueShare=absoluteValue[].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all]
                                freaksValueShare=absoluteValue[].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all]
                                xxxValueChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[StaticValues.shopper.all]
                                priceVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all]
                                moneyVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all]
                                fashionVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all]
                                freaksVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all]
                                xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[StaticValues.shopper.all]
                                */
                                var priceValueShare   = (singleData.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                var moneyValueShare   = (singleData.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                var fashionValueShare = (singleData.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                var freaksValueShare  = (singleData.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                var valueChanges = _.find(data.valueChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                var priceValueChange   = (valueChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                var moneyValueChange   = (valueChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                var fashionValueChange = (valueChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                var freaksValueChange  = (valueChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                var volumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                priceVolumeShare    = (Volumes.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                moneyVolumeShare    = (Volumes.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                fashionVolumeShare  = (Volumes.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                freaksVolumeShare   = (Volumes.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                priceVolumeChange   = (volumeChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                moneyVolumeChange   = (volumeChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                fashionVolumeChange = (volumeChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                freaksVolumeChange  = (volumeChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);

                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        if (category == 1) {
                                            scope.eleValue1s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.eleVolume1s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        } else {
                                            scope.heaValue1s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.heaVolume1s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        }
                                        break;
                                    case 2:
                                        if (category == 1) {
                                            scope.eleValue2s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.eleVolume2s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        } else {
                                            scope.heaValue2s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.heaVolume2s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        }
                                        break;
                                    case 3:
                                        if (category == 1) {
                                            scope.eleValue3s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.eleVolume3s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        } else {
                                            scope.heaValue3s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.heaVolume3s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        }
                                        break;
                                    case 4:
                                        break;
                                    case 5:
                                    case 6:
                                        if (category == 1) {
                                            scope.eleValue4s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.eleVolume4s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        } else {
                                            scope.heaValue4s.push({
                                                'fullName': brandName + varName,
                                                'priceValueShare': priceValueShare,
                                                'priceValueChange': priceValueChange,
                                                'moneyValueShare': moneyValueShare,
                                                'moneyValueChange': moneyValueChange,
                                                'fashionValueShare': fashionValueShare,
                                                'fashionValueChange': fashionValueChange,
                                                'freaksValueShare': freaksValueShare,
                                                'freaksValueChange': freaksValueChange
                                            });
                                            scope.heaVolume4s.push({
                                                'fullName': brandName + varName,
                                                'priceVolumeShare': priceVolumeShare,
                                                'priceVolumeChange': priceVolumeChange,
                                                'moneyVolumeShare': moneyVolumeShare,
                                                'moneyVolumeChange': moneyVolumeChange,
                                                'fashionVolumeShare': fashionVolumeShare,
                                                'fashionVolumeChange': fashionVolumeChange,
                                                'freaksVolumeShare': freaksVolumeShare,
                                                'freaksVolumeChange': freaksVolumeChange
                                            });
                                        }
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/RCR-sharesCrossSegment/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        scope.eleValue1s  = [];
                        scope.heaValue1s  = [];
                        scope.eleValue2s  = [];
                        scope.heaValue2s  = [];
                        scope.eleValue3s  = [];
                        scope.heaValue3s  = [];
                        scope.eleValue4s  = [];
                        scope.heaValue4s  = [];
                        scope.eleVolume1s = [];
                        scope.heaVolume1s = [];
                        scope.eleVolume2s = [];
                        scope.heaVolume2s = [];
                        scope.eleVolume3s = [];
                        scope.heaVolume3s = [];
                        scope.eleVolume4s = [];
                        scope.heaVolume4s = [];

                        loadRetailerConsumer(data,StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadRetailerConsumer(data,StaticValues.categoryID.hea, StaticValues.marketID.rural);

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