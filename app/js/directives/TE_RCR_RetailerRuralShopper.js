define(['directives', 'services'], function(directives) {

    directives.directive('retailerRuralShopper', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
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
                templateUrl: 'singleReportTemplate/RCR_retailerRuralShopper.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadRetailerShooper = function(data, category, market) {
                        data.absoluteValue.forEach(function(singleData){
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var varName = singleData.variantName;
                                var brandName = singleData.parentBrandName;
                                /*
                                bmValueShare=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm]
                                onlineValueShare=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online]
                                mixedValueShare=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed]
                                xxxValueChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[StaticValues.segment.total].shopperInfo[]
                                bmVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm]
                                onlineVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online]
                                mixedVolumeShare=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed]
                                xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[StaticValues.segment.total].shopperInfo[]
                                */
                                var bmValueShare     = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                var onlineValueShare = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                var mixedValueShare  = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                var valueChanges = _.find(data.valueChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                var bmValueChange     = (valueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                var onlineValueChange = (valueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                var mixedValueChange  = (valueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                var volumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == market);
                                });
                                var bmVolumeShare      = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                var onlineVolumeShare  = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                var mixedVolumeShare   = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                var bmVolumeChange     = (volumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                var onlineVolumeChange = (volumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                var mixedVolumeChange  = (volumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        if (category == 1) {
                                            scope.eleValue1s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.eleVolume1s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        } else {
                                            scope.heaValue1s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.heaVolume1s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        }
                                        break;
                                    case 2:
                                        if (category == 1) {
                                            scope.eleValue2s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.eleVolume2s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        } else {
                                            scope.heaValue2s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.heaVolume2s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        }
                                        break;
                                    case 3:
                                        if (category == 1) {
                                            scope.eleValue3s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.eleVolume3s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        } else {
                                            scope.heaValue3s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.heaVolume3s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
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
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.eleVolume4s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        } else {
                                            scope.heaValue4s.push({
                                                'fullName': brandName + varName,
                                                'bmValueShare': bmValueShare,
                                                'bmValueChange': bmValueChange,
                                                'onlineValueShare': onlineValueShare,
                                                'onlineValueChange': onlineValueChange,
                                                'mixedValueShare': mixedValueShare,
                                                'mixedValueChange': mixedValueChange
                                            });
                                            scope.heaVolume4s.push({
                                                'fullName': brandName + varName,
                                                'bmVolumeShare': bmVolumeShare,
                                                'bmVolumeChange': bmVolumeChange,
                                                'onlineVolumeShare': onlineVolumeShare,
                                                'onlineVolumeChange': onlineVolumeChange,
                                                'mixedVolumeShare': mixedVolumeShare,
                                                'mixedVolumeChange': mixedVolumeChange
                                            });
                                        }
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        scope.eleValue1s = [];
                        scope.heaValue1s = [];
                        scope.eleValue2s = [];
                        scope.heaValue2s = [];
                        scope.eleValue3s = [];
                        scope.heaValue3s = [];
                        scope.eleValue4s = [];
                        scope.heaValue4s = [];
                        scope.eleVolume1s = [];
                        scope.heaVolume1s = [];
                        scope.eleVolume2s = [];
                        scope.heaVolume2s = [];
                        scope.eleVolume3s = [];
                        scope.heaVolume3s = [];
                        scope.eleVolume4s = [];
                        scope.heaVolume4s = [];
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
                        loadRetailerShooper(data, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadRetailerShooper(data, StaticValues.categoryID.hea, StaticValues.marketID.rural);

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