define(['directives', 'services'], function(directives) {
    directives.directive('supplierHealthBeautiesShopper', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
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
                templateUrl: '../../partials/singleReportTemplate/SCR_supplierHealthBeautiesShopper.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadShooper = function(data, category) {
                        scope.rural1s = [];
                        scope.urban1s = [];
                        scope.rural2s = [];
                        scope.urban2s = [];
                        var varName, brandName, marketID, bmShare, bmChange, onlineShare, onlineChange, mixedShare, mixedChange;
                        data.absoluteValue.forEach(function(singleData){
                            if (singleData.parentCategoryID == category) {
                                varName = singleData.variantName;
                                brandName = singleData.parentBrandName;
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
                                bmValueShare = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                onlineValueShare = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                mixedValueShare = (singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                marketID = singleData.marketID;
                                var ValueChanges = _.find(data.valueChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                if (ValueChanges != undefined) {
                                    bmValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                    onlineValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                    mixedValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                } else {
                                    bmValueChange = 0;
                                    onlineValueChange = 0;
                                    mixedValueChange = 0;
                                }

                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                var VolumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.variantName == varName && obj.parentBrandName == brandName && obj.marketID == marketID);
                                });
                                if (Volumes != undefined) {
                                    bmVolumeShare = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                    onlineVolumeShare = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                    mixedVolumeShare = (Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                } else {
                                    bmVolumeShare = 0;
                                    onlineVolumeShare = 0;
                                    mixedVolumeShare = 0;
                                }
                                if (VolumeChanges != undefined) {
                                    bmVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                    onlineVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                    mixedVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                } else {
                                    bmVolumeChange = 0;
                                    onlineVolumeChange = 0;
                                    mixedVolumeChange = 0;
                                }
                                switch (marketID) {
                                    case 1:
                                        scope.urban1s.push({
                                            'fullName': brandName + varName,
                                            'bmVolumeShare': bmVolumeShare,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineVolumeShare': onlineVolumeShare,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedVolumeShare': mixedVolumeShare,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        scope.urban2s.push({
                                            'fullName': brandName + varName,
                                            'bmValueShare': bmValueShare,
                                            'bmValueChange': bmValueChange,
                                            'onlineValueShare': onlineValueShare,
                                            'onlineValueChange': onlineValueChange,
                                            'mixedValueShare': mixedValueShare,
                                            'mixedValueChange': mixedValueChange
                                        });
                                        break;
                                    case 2:
                                        scope.rural1s.push({
                                            'fullName': brandName + varName,
                                            'bmVolumeShare': bmVolumeShare,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineVolumeShare': onlineVolumeShare,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedVolumeShare': mixedVolumeShare,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        scope.rural2s.push({
                                            'fullName': brandName + varName,
                                            'bmValueShare': bmValueShare,
                                            'bmValueChange': bmValueChange,
                                            'onlineValueShare': onlineValueShare,
                                            'onlineValueChange': onlineValueChange,
                                            'mixedValueShare': mixedValueShare,
                                            'mixedValueChange': mixedValueChange
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
                        loadShooper(data, StaticValues.categoryID.hea);

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