define(['directives', 'services'], function(directives) {
    directives.directive('supplierHealthBeautiesConsumer', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    producerShow: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/SCR_supplierHealthBeautiesConsumer.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadConsumer = function(data, category) {
                        scope.rural1s = [];
                        scope.urban1s = [];
                        scope.rural2s = [];
                        scope.urban2s = [];
                        var varName, brandName, marketID, priceShare, priceChange, moneyShare, moneyChange, fashionShare, fashionChange, freaksShare, freaksChange;
                        
                        data.absoluteValue.forEach(function(singleData){
                            if (singleData.parentCategoryID == category) {
                                varName = singleData.variantName;
                                brandName = singleData.parentBrandName;
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
                                priceValueShare = (singleData.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                moneyValueShare = (singleData.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                fashionValueShare = (singleData.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                freaksValueShare = (singleData.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);

                                marketID = singleData.marketID;
                                var ValueChanges = _.find(data.valueChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                if (ValueChanges != undefined) {
                                    priceValueChange = (ValueChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                    moneyValueChange = (ValueChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                    fashionValueChange = (ValueChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                    freaksValueChange = (ValueChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                } else {
                                    priceValueChange = 0;
                                    moneyValueChange = 0;
                                    fashionValueChange = 0;
                                    freaksValueChange = 0;
                                }
                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                var VolumesChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                if (Volumes != undefined) {
                                    priceVolumeShare = (Volumes.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                    moneyVolumeShare = (Volumes.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                    fashionVolumeShare = (Volumes.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                    freaksVolumeShare = (Volumes.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                } else {
                                    priceVolumeShare = 0;
                                    moneyVolumeShare = 0;
                                    fashionVolumeShare = 0;
                                    freaksVolumeShare = 0;
                                }
                                if (VolumesChanges != undefined) {
                                    priceVolumeChange = (VolumesChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                    moneyVolumeChange = (VolumesChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                    fashionVolumeChange = (VolumesChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                    freaksVolumeChange = (VolumesChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                } else {
                                    priceVolumeChange = 0;
                                    moneyVolumeChange = 0;
                                    fashionVolumeChange = 0;
                                    freaksVolumeChange = 0;
                                }
                                switch (marketID) {
                                    case 1:
                                        scope.urban1s.push({
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
                                        scope.urban2s.push({
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
                                        break;
                                    case 2:
                                        scope.rural1s.push({
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
                                        scope.rural2s.push({
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
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/SCR-sharesCrossSegment/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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
                        loadConsumer(data, StaticValues.categoryID.hea);

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
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPlayer', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})