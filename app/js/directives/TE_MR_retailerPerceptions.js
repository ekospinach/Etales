define(['directives', 'services'], function(directives) {

    directives.directive('marketRetailerPerceptions', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_retailerPerceptions.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        scope.latestPlayer1urban = [];
                        scope.latestPlayer2urban = [];
                        scope.latestPlayer3urban = [];
                        scope.latestPlayer4urban = [];
                        scope.latestPlayer5urban = [];
                        scope.latestPlayer6urban = [];
                        scope.latestPlayer1rural = [];
                        scope.latestPlayer2rural = [];
                        scope.latestPlayer3rural = [];
                        scope.latestPlayer4rural = [];
                        scope.latestPlayer5rural = [];
                        scope.latestPlayer6rural = [];
                        scope.previousInfo = Label.getContent('Previous period');
                        scope.ruralTitle = Label.getContent('Rural');
                        scope.urbanTitle = Label.getContent('Urban');
                        var url = '/getMR-retailerPerceptionEvolution/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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

                    var loadValue = function(data, store, market) {
                        var array = _.find(data, function(obj) {
                            return (obj.storeID == store && obj.marketID == market)
                        });
                        return array;
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        data.storeInfo.forEach(function(singleData) {
                            if (singleData.marketID == 1) {
                                switch (singleData.storeID) {
                                    // player's urban/rural data include 2 parts
                                    // part1 : latestPerception value  point:(x,y,z,)==>z is the size of the circle e.g (previousPerception[StaticValues.perception.quality],previousPerception[StaticValues.perception.easy],size)
                                    // part2 : previousPerception value ......

                                    //function loadValue ==>find the rural value of this player

                                    case 1:
                                        scope.latestPlayer1urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer1rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer1urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer1rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 2:
                                        scope.latestPlayer2urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer2rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer2urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer2rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 3:
                                        scope.latestPlayer3urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer3rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer3urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer3rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 4:
                                        scope.latestPlayer4urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer4rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer4urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer4rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 5:
                                        scope.latestPlayer5urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer5rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer5urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer5rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 6:
                                        scope.latestPlayer6urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer6rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                                        scope.latestPlayer6urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                                        scope.latestPlayer6rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                                        break;
                                    case 7:
                                        break;
                                }
                            }
                        })
                        scope.retailerPerceptionsSeries1 = [{
                            name: Label.getContent('Retailer') + ' 1',
                            data: scope.latestPlayer1rural,
                            color: PlayerColor.r1
                        }, {
                            name: Label.getContent('Retailer') + ' 2',
                            data: scope.latestPlayer2rural,
                            color: PlayerColor.r2
                        }, {
                            name: Label.getContent('Traditional Trade'),
                            data: scope.latestPlayer3rural,
                            color: PlayerColor.r3
                        }, {
                            name: Label.getContent('Supplier 1 Online'),
                            data: scope.latestPlayer4rural,
                            color: PlayerColor.s1
                        }, {
                            name: Label.getContent('Supplier 2 Online'),
                            data: scope.latestPlayer5rural,
                            color: PlayerColor.s2
                        }, {
                            name: Label.getContent('Supplier 3 Online'),
                            data: scope.latestPlayer6rural,
                            color: PlayerColor.s3
                        }];
                        scope.retailerPerceptionsSeries2 = [{
                            name: Label.getContent('Retailer') + ' 1',
                            data: scope.latestPlayer1urban,
                            color: PlayerColor.r1
                        }, {
                            name: Label.getContent('Retailer') + ' 2',
                            data: scope.latestPlayer2urban,
                            color: PlayerColor.r2
                        }, {
                            name: Label.getContent('Traditional Trade'),
                            data: scope.latestPlayer3urban,
                            color: PlayerColor.r3
                        }, {
                            name: Label.getContent('Supplier 1 Online'),
                            data: scope.latestPlayer4urban,
                            color: PlayerColor.s1
                        }, {
                            name: Label.getContent('Supplier 2 Online'),
                            data: scope.latestPlayer5urban,
                            color: PlayerColor.s2
                        }, {
                            name: Label.getContent('Supplier 3 Online'),
                            data: scope.latestPlayer6urban,
                            color: PlayerColor.s3
                        }];
                        scope.xTitle3 = Label.getContent('Convenience');
                        scope.yTitle3 = Label.getContent('Price Appeal');
                        scope.myModel = "RetailerPerceptions" + scope.selectedPeriod;

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