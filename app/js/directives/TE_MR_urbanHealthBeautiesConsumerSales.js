define(['directives', 'services'], function(directives) {

    directives.directive('marketUrbanHealthBeautiesConsumerSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_urbanHealthBeautiesConsumerSales.html',
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
                            var priceValue = Values.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value;
                            var moneyValue = Values.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value;
                            var fashionValue = Values.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value;
                            var freaksValue = Values.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value;
                        } else {
                            var priceValue = 0;
                            var moneyValue = 0;
                            var fashionValue = 0;
                            var freaksValue = 0;
                        }
                        var ValueChanges = _.find(data.owner_valueChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (ValueChanges != undefined) {
                            var priceValueChange = (ValueChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                            var moneyValueChange = (ValueChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                            var fashionValueChange = (ValueChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                            var freaksValueChange = (ValueChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                        } else {
                            var priceValueChange = 0;
                            var moneyValueChange = 0;
                            var fashionValueChange = 0;
                            var freaksValueChange = 0;
                        }
                        var Volumes = _.find(data.owner_absoluteVolume, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (Volumes != undefined) {
                            var priceVolume = Volumes.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value;
                            var moneyVolume = Volumes.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value;
                            var fashionVolume = Volumes.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value;
                            var freaksVolume = Volumes.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value;
                        } else {
                            var priceVolume = 0;
                            var moneyVolume = 0;
                            var fashionVolume = 0;
                            var freaksVolume = 0;
                        }
                        var VolumeChanges = _.find(data.owner_volumeChange, function(obj) {
                            return (obj.ownerID == ownerID && obj.categoryID == category && obj.marketID == market);
                        });
                        if (VolumeChanges != undefined) {
                            var priceVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                            var moneyVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                            var fashionVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                            var freaksVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                        } else {
                            var priceVolumeChange = 0;
                            var moneyVolumeChange = 0;
                            var fashionVolumeChange = 0;
                            var freaksVolumeChange = 0;
                        }
                        scope.playerTotals[ownerID - 1].priceValue = priceValue;
                        scope.playerTotals[ownerID - 1].moneyValue = moneyValue;
                        scope.playerTotals[ownerID - 1].fashionValue = fashionValue;
                        scope.playerTotals[ownerID - 1].freaksValue = freaksValue;
                        scope.playerTotals[ownerID - 1].priceVolume = priceVolume;
                        scope.playerTotals[ownerID - 1].moneyVolume = moneyVolume;
                        scope.playerTotals[ownerID - 1].fashionVolume = fashionVolume;
                        scope.playerTotals[ownerID - 1].freaksVolume = freaksVolume;
                        scope.playerTotals[ownerID - 1].priceValueChange = priceValueChange;
                        scope.playerTotals[ownerID - 1].moneyValueChange = moneyValueChange;
                        scope.playerTotals[ownerID - 1].fashionValueChange = fashionValueChange;
                        scope.playerTotals[ownerID - 1].freaksValueChange = freaksValueChange;
                        scope.playerTotals[ownerID - 1].priceVolumeChange = priceVolumeChange;
                        scope.playerTotals[ownerID - 1].moneyVolumeChange = moneyVolumeChange;
                        scope.playerTotals[ownerID - 1].fashionVolumeChange = fashionVolumeChange;
                        scope.playerTotals[ownerID - 1].freaksVolumeChange = freaksVolumeChange;
                    }

                    var loadMarketConsumer = function(data, category, market) {
                        data.absoluteValue.forEach(function(singleData) {
                            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                                var variantName = singleData.variantName;
                                var brandName = singleData.parentBrandName;
                                // priceValue=absoluteValue[].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value
                                // moneyValue=absoluteValue[].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value
                                // fashionValue=absoluteValue[].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value
                                // freaksValue=absoluteValue[].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value
                                // xxxChange=Changes(find from valueChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[StaticValues.shopper.all]
                                // priceVolume=absoluteVolume[].segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value
                                // moneyVolume=absoluteVolume[].segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value
                                // fashionVolume=absoluteVolume[].segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value
                                // freaksVolume=absoluteVolume[].segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value
                                // xxxVolumeChange=Changes(find from volumeChange by variantName and parentBrandName and marketID).segmentInfo[].shopperInfo[StaticValues.shopper.all]

                                var priceValue = singleData.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value;
                                var moneyValue = singleData.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value;
                                var fashionValue = singleData.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value;
                                var freaksValue = singleData.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value;
                                var Changes = _.find(data.valueChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Changes != undefined) {
                                    var priceValueChange = (Changes.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var moneyValueChange = (Changes.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var fashionValueChange = (Changes.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var freaksValueChange = (Changes.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                } else {
                                    var priceValueChange = 0;
                                    var moneyValueChange = 0;
                                    var fashionValueChange = 0;
                                    var freaksValueChange = 0;
                                }
                                var Volumes = _.find(data.absoluteVolume, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                var VolumeChanges = _.find(data.volumeChange, function(obj) {
                                    return (obj.parentBrandName == brandName && obj.variantName == variantName && obj.marketID == market);
                                });
                                if (Volumes != undefined) {
                                    var priceVolume = Volumes.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value;
                                    var moneyVolume = Volumes.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value;
                                    var fashionVolume = Volumes.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value;
                                    var freaksVolume = Volumes.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value;
                                } else {
                                    var priceVolume = 0;
                                    var moneyVolume = 0;
                                    var fashionVolume = 0;
                                    var freaksVolume = 0;
                                }
                                if (VolumeChanges != undefined) {
                                    var priceVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.price].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var moneyVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.value].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var fashionVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.fashion].shopperInfo[StaticValues.shopper.all].value * 100);
                                    var freaksVolumeChange = (VolumeChanges.segmentInfo[StaticValues.segment.freaks].shopperInfo[StaticValues.shopper.all].value * 100);
                                } else {
                                    var priceVolumeChange = 0;
                                    var moneyVolumeChange = 0;
                                    var fashionVolumeChange = 0;
                                    var freaksVolumeChange = 0;
                                }
                                switch (singleData.parentCompanyID) {
                                    case 1:
                                        scope.player1s.push({
                                            'fullName': brandName + variantName,
                                            'priceValue': priceValue,
                                            'priceValueChange': priceValueChange,
                                            'priceVolume': priceVolume,
                                            'priceVolumeChange': priceVolumeChange,
                                            'moneyValue': moneyValue,
                                            'moneyValueChange': moneyValueChange,
                                            'moneyVolume': moneyVolume,
                                            'moneyVolumeChange': moneyVolumeChange,
                                            'fashionValue': fashionValue,
                                            'fashionValueChange': fashionValueChange,
                                            'fashionVolume': fashionVolume,
                                            'fashionVolumeChange': fashionVolumeChange,
                                            'freaksValue': freaksValue,
                                            'freaksValueChange': freaksValueChange,
                                            'freaksVolume': freaksVolume,
                                            'freaksVolumeChange': freaksVolumeChange
                                        });
                                        break;
                                    case 2:
                                        scope.player2s.push({
                                            'fullName': brandName + variantName,
                                            'priceValue': priceValue,
                                            'priceValueChange': priceValueChange,
                                            'priceVolume': priceVolume,
                                            'priceVolumeChange': priceVolumeChange,
                                            'moneyValue': moneyValue,
                                            'moneyValueChange': moneyValueChange,
                                            'moneyVolume': moneyVolume,
                                            'moneyVolumeChange': moneyVolumeChange,
                                            'fashionValue': fashionValue,
                                            'fashionValueChange': fashionValueChange,
                                            'fashionVolume': fashionVolume,
                                            'fashionVolumeChange': fashionVolumeChange,
                                            'freaksValue': freaksValue,
                                            'freaksValueChange': freaksValueChange,
                                            'freaksVolume': freaksVolume,
                                            'freaksVolumeChange': freaksVolumeChange
                                        });
                                        break;
                                    case 3:
                                        scope.player3s.push({
                                            'fullName': brandName + variantName,
                                            'priceValue': priceValue,
                                            'priceValueChange': priceValueChange,
                                            'priceVolume': priceVolume,
                                            'priceVolumeChange': priceVolumeChange,
                                            'moneyValue': moneyValue,
                                            'moneyValueChange': moneyValueChange,
                                            'moneyVolume': moneyVolume,
                                            'moneyVolumeChange': moneyVolumeChange,
                                            'fashionValue': fashionValue,
                                            'fashionValueChange': fashionValueChange,
                                            'fashionVolume': fashionVolume,
                                            'fashionVolumeChange': fashionVolumeChange,
                                            'freaksValue': freaksValue,
                                            'freaksValueChange': freaksValueChange,
                                            'freaksVolume': freaksVolume,
                                            'freaksVolumeChange': freaksVolumeChange
                                        });
                                        break;
                                    case 5:
                                        scope.player5s.push({
                                            'fullName': brandName + variantName,
                                            'priceValue': priceValue,
                                            'priceValueChange': priceValueChange,
                                            'priceVolume': priceVolume,
                                            'priceVolumeChange': priceVolumeChange,
                                            'moneyValue': moneyValue,
                                            'moneyValueChange': moneyValueChange,
                                            'moneyVolume': moneyVolume,
                                            'moneyVolumeChange': moneyVolumeChange,
                                            'fashionValue': fashionValue,
                                            'fashionValueChange': fashionValueChange,
                                            'fashionVolume': fashionVolume,
                                            'fashionVolumeChange': fashionVolumeChange,
                                            'freaksValue': freaksValue,
                                            'freaksValueChange': freaksValueChange,
                                            'freaksVolume': freaksVolume,
                                            'freaksVolumeChange': freaksVolumeChange
                                        });
                                        break;
                                    case 6:
                                        scope.player6s.push({
                                            'fullName': brandName + variantName,
                                            'priceValue': priceValue,
                                            'priceValueChange': priceValueChange,
                                            'priceVolume': priceVolume,
                                            'priceVolumeChange': priceVolumeChange,
                                            'moneyValue': moneyValue,
                                            'moneyValueChange': moneyValueChange,
                                            'moneyVolume': moneyVolume,
                                            'moneyVolumeChange': moneyVolumeChange,
                                            'fashionValue': fashionValue,
                                            'fashionValueChange': fashionValueChange,
                                            'fashionVolume': fashionVolume,
                                            'fashionVolumeChange': fashionVolumeChange,
                                            'freaksValue': freaksValue,
                                            'freaksValueChange': freaksValueChange,
                                            'freaksVolume': freaksVolume,
                                            'freaksVolumeChange': freaksVolumeChange
                                        });
                                        break;
                                }
                            }
                        })
                    }

                    var getResult = function() {
                        scope.quality1s = new Array();
                        scope.quality2s = new Array();
                        scope.quality3s = new Array();
                        scope.quality5s = new Array();
                        scope.quality6s = new Array();
                        scope.price1s = new Array();
                        scope.price2s = new Array();
                        scope.price3s = new Array();
                        scope.price5s = new Array();
                        scope.price6s = new Array();
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
                        var deferred        = $q.defer();
                        scope.consumerShare = false;
                        scope.playerTotals  = [[],[],[],[],[],[]];
                        scope.player1s      = [];
                        scope.player2s      = [];
                        scope.player3s      = [];
                        scope.player5s      = [];
                        scope.player6s      = [];
                        loadTotal(data, StaticValues.playerID.s1, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadTotal(data, StaticValues.playerID.s2, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadTotal(data, StaticValues.playerID.s3, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadTotal(data, StaticValues.playerID.s4, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadTotal(data, StaticValues.playerID.r1, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadTotal(data, StaticValues.playerID.r2, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        loadMarketConsumer(data, StaticValues.categoryID.hea, StaticValues.marketID.urban);
                        scope.nameColor = '#F2DEDE' //红
                        scope.valueColor = '#FCF8E3'; //黄
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