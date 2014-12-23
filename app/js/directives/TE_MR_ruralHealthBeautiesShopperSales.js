define(['directives', 'services'], function(directives) {

    directives.directive('marketRuralHealthBeautiesShopperSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_ruralHealthBeautiesShopperSales.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var loadTotal = function(data, ownerID, category, market) {
                        var Values = _.find(data.owner_absoluteValue, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (Values != undefined) {
                            var bmValue = Values.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value;
                            var onlineValue = Values.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value;
                            var mixedValue = Values.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value;
                        } else {
                            var bmValue = 0;
                            var onlineValue = 0;
                            var mixedValue = 0;
                        }
                        var ValueChanges = _.find(data.owner_valueChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (ValueChanges != undefined) {
                            var bmValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                            var onlineValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                            var mixedValueChange = (ValueChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                        } else {
                            var bmValueChange = 0;
                            var onlineValueChange = 0;
                            var mixedValueChange = 0;
                        }
                        var Volumes = _.find(data.owner_absoluteVolume, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (Volumes != undefined) {
                            var bmVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value;
                            var onlineVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value;
                            var mixedVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value;
                        } else {
                            var bmVolume = 0;
                            var onlineVolume = 0;
                            var mixedVolume = 0;
                        }
                        var VolumeChanges = _.find(data.owner_volumeChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (VolumeChanges != undefined) {
                            var bmVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                            var onlineVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                            var mixedVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                        } else {
                            var bmVolumeChange = 0;
                            var onlineVolumeChange = 0;
                            var mixedVolumeChange = 0;
                        }
                        scope.playerTotals[ownerID - 1].bmValue = bmValue;
                        scope.playerTotals[ownerID - 1].onlineValue = onlineValue;
                        scope.playerTotals[ownerID - 1].mixedValue = mixedValue;
                        scope.playerTotals[ownerID - 1].bmVolume = bmVolume;
                        scope.playerTotals[ownerID - 1].onlineVolume = onlineVolume;
                        scope.playerTotals[ownerID - 1].mixedVolume = mixedVolume;
                        scope.playerTotals[ownerID - 1].bmValueChange = bmValueChange;
                        scope.playerTotals[ownerID - 1].onlineValueChange = onlineValueChange;
                        scope.playerTotals[ownerID - 1].mixedValueChange = mixedValueChange;
                        scope.playerTotals[ownerID - 1].bmVolumeChange = bmVolumeChange;
                        scope.playerTotals[ownerID - 1].onlineVolumeChange = onlineVolumeChange;
                        scope.playerTotals[ownerID - 1].mixedVolumeChange = mixedVolumeChange;
                    }

                    var loadMarketShopper = function(data, category, market) {
                        data.absoluteValue.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var variantName = singleData.variantName;
                                var brandName = singleData.parentBrandName;
                                // bmValue=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value
                                // onlineValue=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value
                                // mixedValue=absoluteValue[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value
                                // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[StaticValues.segment.total].shopperInfo[]
                                // bmVolume=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value
                                // onlineVolume=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value
                                // mixedVolume=absoluteVolume[].segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value
                                // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[StaticValues.segment.total].shopperInfo[]

                                var bmValue = singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value;
                                var onlineValue = singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value;
                                var mixedValue = singleData.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value;
                                var Changes = _.find(data.valueChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Changes != undefined) {
                                    var bmValueChange = (Changes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                    var onlineValueChange = (Changes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                    var mixedValueChange = (Changes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                } else {
                                    var bmValueChange = 0;
                                    var onlineValueChange = 0;
                                    var mixedValueChange = 0;
                                }

                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                var VolumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Volumes != undefined) {
                                    var bmVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value;
                                    var onlineVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value;
                                    var mixedVolume = Volumes.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value;
                                } else {
                                    var bmVolume = 0;
                                    var onlineVolume = 0;
                                    var mixedVolume = 0;
                                }
                                if (VolumeChanges != undefined) {
                                    var bmVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.bm].value * 100);
                                    var onlineVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.online].value * 100);
                                    var mixedVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.total].shopperInfo[StaticValues.shopper.mixed].value * 100);
                                } else {
                                    var bmVolumeChange = 0;
                                    var onlineVolumeChange = 0;
                                    var mixedVolumeChange = 0;
                                }
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.player1s.push({
                                            'fullName': brandName + variantName,
                                            'bmValue': bmValue,
                                            'bmValueChange': bmValueChange,
                                            'bmVolume': bmVolume,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineValue': onlineValue,
                                            'onlineValueChange': onlineValueChange,
                                            'onlineVolume': onlineVolume,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedValue': mixedValue,
                                            'mixedValueChange': mixedValueChange,
                                            'mixedVolume': mixedVolume,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        break;
                                    case 2:
                                        scope.player2s.push({
                                            'fullName': brandName + variantName,
                                            'bmValue': bmValue,
                                            'bmValueChange': bmValueChange,
                                            'bmVolume': bmVolume,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineValue': onlineValue,
                                            'onlineValueChange': onlineValueChange,
                                            'onlineVolume': onlineVolume,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedValue': mixedValue,
                                            'mixedValueChange': mixedValueChange,
                                            'mixedVolume': mixedVolume,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        break;
                                    case 3:
                                        scope.player3s.push({
                                            'fullName': brandName + variantName,
                                            'bmValue': bmValue,
                                            'bmValueChange': bmValueChange,
                                            'bmVolume': bmVolume,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineValue': onlineValue,
                                            'onlineValueChange': onlineValueChange,
                                            'onlineVolume': onlineVolume,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedValue': mixedValue,
                                            'mixedValueChange': mixedValueChange,
                                            'mixedVolume': mixedVolume,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        break;
                                    case 5:
                                        scope.player5s.push({
                                            'fullName': brandName + variantName,
                                            'bmValue': bmValue,
                                            'bmValueChange': bmValueChange,
                                            'bmVolume': bmVolume,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineValue': onlineValue,
                                            'onlineValueChange': onlineValueChange,
                                            'onlineVolume': onlineVolume,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedValue': mixedValue,
                                            'mixedValueChange': mixedValueChange,
                                            'mixedVolume': mixedVolume,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        break;
                                    case 6:
                                        scope.player6s.push({
                                            'fullName': brandName + variantName,
                                            'bmValue': bmValue,
                                            'bmValueChange': bmValueChange,
                                            'bmVolume': bmVolume,
                                            'bmVolumeChange': bmVolumeChange,
                                            'onlineValue': onlineValue,
                                            'onlineValueChange': onlineValueChange,
                                            'onlineVolume': onlineVolume,
                                            'onlineVolumeChange': onlineVolumeChange,
                                            'mixedValue': mixedValue,
                                            'mixedValueChange': mixedValueChange,
                                            'mixedVolume': mixedVolume,
                                            'mixedVolumeChange': mixedVolumeChange
                                        });
                                        break;
                                }
                            }
                        })
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
                        var url = '/getMR-salesCrossSegment/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        scope.shopperShare = false;
                        scope.playerTotals = [[],[],[],[],[],[]];
                        scope.player1s = [];
                        scope.player2s = [];
                        scope.player3s = [];
                        scope.player5s = [];
                        scope.player6s = [];
                        loadTotal(data, StaticValues.playerID.s1, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s2, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s3, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s4, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.r1, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.r2, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        loadMarketShopper(data, StaticValues.categoryID.hea, StaticValues.marketID.rural);
                        scope.nameColor = '#F2DEDE' //红
                        scope.valueColor = '#D9EDF7'; //蓝
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