define(['directives', 'services'], function(directives) {

    directives.directive('marketRuralElecssoriesSalesByChannel', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_ruralElecssoriesSalesByChannel.html',
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
                            var retailer1Value = Values.value[StaticValues.player.r1];
                            var retailer2Value = Values.value[StaticValues.player.r2];
                            var retailer3Value = Values.value[StaticValues.player.r3];
                            var retailer4Value = Values.value[StaticValues.player.r4];
                        } else {
                            var retailer1Value = 0;
                            var retailer2Value = 0;
                            var retailer3Value = 0;
                            var retailer4Value = 0;
                        }
                        var Changes = _.find(data.owner_valueChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (Changes != undefined) {
                            var retailer1ValueChange = (Changes.value[StaticValues.player.r1] * 100);
                            var retailer2ValueChange = (Changes.value[StaticValues.player.r2] * 100);
                            var retailer3ValueChange = (Changes.value[StaticValues.player.r3] * 100);
                            var retailer4ValueChange = (Changes.value[StaticValues.player.r4] * 100);
                        } else {
                            var retailer1ValueChange = 0;
                            var retailer2ValueChange = 0;
                            var retailer3ValueChange = 0;
                            var retailer4ValueChange = 0;
                        }
                        var Volumes = _.find(data.owner_absoluteVolume, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (Volumes != undefined) {
                            var retailer1Volume = Volumes.value[StaticValues.player.r1];
                            var retailer2Volume = Volumes.value[StaticValues.player.r2];
                            var retailer3Volume = Volumes.value[StaticValues.player.r3];
                            var retailer4Volume = Volumes.value[StaticValues.player.r4];
                        } else {
                            var retailer1Volume = 0;
                            var retailer2Volume = 0;
                            var retailer3Volume = 0;
                            var retailer4Volume = 0;
                        }
                        var VolumeChanges = _.find(data.owner_volumeChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (VolumeChanges != undefined) {
                            var retailer1VolumeChange = (VolumeChanges.value[StaticValues.player.r1] * 100);
                            var retailer2VolumeChange = (VolumeChanges.value[StaticValues.player.r2] * 100);
                            var retailer3VolumeChange = (VolumeChanges.value[StaticValues.player.r3] * 100);
                            var retailer4VolumeChange = (VolumeChanges.value[StaticValues.player.r4] * 100);
                        } else {
                            var retailer1VolumeChange = 0;
                            var retailer2VolumeChange = 0;
                            var retailer3VolumeChange = 0;
                            var retailer4VolumeChange = 0;
                        }
                        scope.playerTotals[ownerID - 1].retailer1Value        = retailer1Value;
                        scope.playerTotals[ownerID - 1].retailer1ValueChange  = retailer1ValueChange;
                        scope.playerTotals[ownerID - 1].retailer1Volume       = retailer1Volume;
                        scope.playerTotals[ownerID - 1].retailer1VolumeChange = retailer1VolumeChange;
                        scope.playerTotals[ownerID - 1].retailer2Value        = retailer2Value;
                        scope.playerTotals[ownerID - 1].retailer2ValueChange  = retailer2ValueChange;
                        scope.playerTotals[ownerID - 1].retailer2Volume       = retailer2Volume;
                        scope.playerTotals[ownerID - 1].retailer2VolumeChange = retailer2VolumeChange;
                        scope.playerTotals[ownerID - 1].retailer3Value        = retailer3Value;
                        scope.playerTotals[ownerID - 1].retailer3ValueChange  = retailer3ValueChange;
                        scope.playerTotals[ownerID - 1].retailer3Volume       = retailer3Volume;
                        scope.playerTotals[ownerID - 1].retailer3VolumeChange = retailer3VolumeChange;
                        scope.playerTotals[ownerID - 1].retailer4Value        = retailer4Value;
                        scope.playerTotals[ownerID - 1].retailer4ValueChange  = retailer4ValueChange;
                        scope.playerTotals[ownerID - 1].retailer4Volume       = retailer4Volume;
                        scope.playerTotals[ownerID - 1].retailer4VolumeChange = retailer4VolumeChange;
                    }

                    var loadChannelSales = function(data, category, market) {
                        data.absoluteValue.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var variantName = singleData.variantName;
                                var brandName = singleData.parentBrandName;
                                // retailer1Value=absoluteValue[].value[StaticValues.player.r1]
                                // retailer2Value=absoluteValue[].value[StaticValues.player.r2]
                                // retailer3Value=absoluteValue[].value[StaticValues.player.r3]
                                // retailer4Value=absoluteValue[].value[StaticValues.player.r4]
                                // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).value[StaticValues.player.r]
                                // retailer1Volume=absoluteVolume[].value[StaticValues.player.r1]
                                // retailer2Volume=absoluteVolume[].value[StaticValues.player.r2]
                                // retailer3Volume=absoluteVolume[].value[StaticValues.player.r3]
                                // retailer4Volume=absoluteVolume[].value[StaticValues.player.r4]
                                // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).value[StaticValues.player.r]
                                var retailer1Value = singleData.value[StaticValues.player.r1];
                                var retailer2Value = singleData.value[StaticValues.player.r2];
                                var retailer3Value = singleData.value[StaticValues.player.r3];
                                var retailer4Value = singleData.value[StaticValues.player.r4];
                                var Changes = _.find(data.valueChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Changes != undefined) {
                                    var retailer1ValueChange = (Changes.value[StaticValues.player.r1] * 100);
                                    var retailer2ValueChange = (Changes.value[StaticValues.player.r2] * 100);
                                    var retailer3ValueChange = (Changes.value[StaticValues.player.r3] * 100);
                                    var retailer4ValueChange = (Changes.value[StaticValues.player.r4] * 100);
                                } else {
                                    var retailer1ValueChange = 0;
                                    var retailer2ValueChange = 0;
                                    var retailer3ValueChange = 0;
                                    var retailer4ValueChange = 0;
                                }

                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                var VolumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Volumes != undefined) {
                                    var retailer1Volume = Volumes.value[StaticValues.player.r1];
                                    var retailer2Volume = Volumes.value[StaticValues.player.r2];
                                    var retailer3Volume = Volumes.value[StaticValues.player.r3];
                                    var retailer4Volume = Volumes.value[StaticValues.player.r4];
                                } else {
                                    var retailer1Volume = 0;
                                    var retailer2Volume = 0;
                                    var retailer3Volume = 0;
                                    var retailer4Volume = 0;
                                }
                                if (VolumeChanges != undefined) {
                                    var retailer1VolumeChange = (VolumeChanges.value[StaticValues.player.r1] * 100);
                                    var retailer2VolumeChange = (VolumeChanges.value[StaticValues.player.r2] * 100);
                                    var retailer3VolumeChange = (VolumeChanges.value[StaticValues.player.r3] * 100);
                                    var retailer4VolumeChange = (VolumeChanges.value[StaticValues.player.r4] * 100);
                                } else {
                                    var retailer1VolumeChange = 0;
                                    var retailer2VolumeChange = 0;
                                    var retailer3VolumeChange = 0;
                                    var retailer4VolumeChange = 0;
                                }
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.player1s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                    case 2:
                                        scope.player2s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                    case 3:
                                        scope.player3s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                    case 4:
                                        scope.player4s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                    case 5:
                                        scope.player5s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                    case 6:
                                        scope.player6s.push({
                                            'fullName': brandName + variantName,
                                            'retailer1Value': retailer1Value,
                                            'retailer1ValueChange': retailer1ValueChange,
                                            'retailer1Volume': retailer1Volume,
                                            'retailer1VolumeChange': retailer1VolumeChange,
                                            'retailer2Value': retailer2Value,
                                            'retailer2ValueChange': retailer2ValueChange,
                                            'retailer2Volume': retailer2Volume,
                                            'retailer2VolumeChange': retailer2VolumeChange,
                                            'retailer3Value': retailer3Value,
                                            'retailer3ValueChange': retailer3ValueChange,
                                            'retailer3Volume': retailer3Volume,
                                            'retailer3VolumeChange': retailer3VolumeChange,
                                            'retailer4Value': retailer4Value,
                                            'retailer4ValueChange': retailer4ValueChange,
                                            'retailer4Volume': retailer4Volume,
                                            'retailer4VolumeChange': retailer4VolumeChange
                                        });
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        var url = '/getMR-salesByChannel/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                        $http({
                            method: 'GET',
                            url: url
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
                        scope.playerTotals = [[],[],[],[],[],[]];
                        scope.player1s     = [];
                        scope.player2s     = [];
                        scope.player3s     = [];
                        scope.player5s     = [];
                        scope.player6s     = [];
                        loadTotal(data, StaticValues.playerID.s1, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s2, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s3, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.s4, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.r1, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadTotal(data, StaticValues.playerID.r2, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        loadChannelSales(data, StaticValues.categoryID.ele, StaticValues.marketID.rural);
                        scope.nameColor = '#DFF0D8'; //绿
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