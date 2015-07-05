var awarenessCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
    function GetRequest() {
        var url = document.location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var loadAwareness = function(data, category, market) {
        var result = {
            'valueRural': [],
            'valueUrban': [],
            'dropRural': [],
            'dropUrban': [],
            'increaseRural': [],
            'increaseUrban': [],
            'brandNames': [],
            'awarenessSeries': {},
            'awarenessConfig': {}
        }
        var count = 0;
        /*
            if latestAwareness>=previousAwareness
            then value =previousAwareness;
            increase=latestAwareness-previousAwareness;
            drop=0;
            else
            then value =latestAwareness;
            drop=previousAwareness-latestAwareness;
            increase=0;
        */
        data.brandInfo.forEach(function(singleData) {
            if (singleData.parentCategoryID == category && singleData.marketID == market) {
                result.brandNames[count] = singleData.brandName;
                switch (market) {
                    case 2:
                        if (singleData.latestAwareness >= singleData.previousAwareness) {
                            result.valueRural[count] = singleData.previousAwareness * 100;
                            result.increaseRural[count] = (singleData.latestAwareness - singleData.previousAwareness) * 100;
                            result.dropRural[count] = 0;
                        } else {
                            result.valueRural[count] = singleData.latestAwareness * 100;
                            result.dropRural[count] = (singleData.previousAwareness - singleData.latestAwareness) * 100;
                            result.increaseRural[count] = 0;
                        };
                        break;
                    case 1:
                        if (singleData.latestAwareness >= singleData.previousAwareness) {
                            result.valueUrban[count] = singleData.previousAwareness * 100;
                            result.increaseUrban[count] = (singleData.latestAwareness - singleData.previousAwareness) * 100;
                            result.dropUrban[count] = 0;
                        } else {
                            result.valueUrban[count] = singleData.latestAwareness * 100;
                            result.dropUrban[count] = (singleData.previousAwareness - singleData.latestAwareness) * 100;
                            result.increaseUrban[count] = 0;
                        };
                        break;

                }
                count++;
            }
        })
        switch (market) {
            case 2:
                result.awarenessSeries = [{
                    name: Label.getContent('Drop'),
                    data: result.dropRural,
                    color: PlayerColor.drop
                }, {
                    name: Label.getContent('Increase'),
                    data: result.increaseRural,
                    color: PlayerColor.increase
                }, {
                    name: Label.getContent('Awareness Value'),
                    data: result.valueRural,
                    color: PlayerColor.awareness
                }];
                result.awarenessConfig = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valueDecimals: 2
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            }
                        },
                        xAxis: {
                            categories: result.brandNames
                        },
                        yAxis: {
                            title: {
                                text: '%'
                            }
                        }
                    },
                    series: result.awarenessSeries,
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: Label.getContent('Rural')
                    }
                };
                break;
            case 1:
                result.awarenessSeries = [{
                    name: Label.getContent('Drop'),
                    data: result.dropUrban,
                    color: PlayerColor.drop
                }, {
                    name: Label.getContent('Increase'),
                    data: result.increaseUrban,
                    color: PlayerColor.increase
                }, {
                    name: Label.getContent('Awareness Value'),
                    data: result.valueUrban,
                    color: PlayerColor.awareness
                }];
                result.awarenessConfig = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valueDecimals: 2
                        },
                        plotOptions: {
                            series: {
                                stacking: 'normal'
                            }
                        },
                        xAxis: {
                            categories: result.brandNames
                        },
                        yAxis: {
                            title: {
                                text: '%'
                            }
                        }
                    },
                    series: result.awarenessSeries,
                    credits: {
                        enabled: false
                    },
                    title: {
                        text: Label.getContent('Urban')
                    }
                };
                break;
        }
        console.log(result);
        return result;
    }

    var initPage = function() {

        var result = {
            'urban_ele': {},
            'urban_hea': {},
            'rural_ele': {},
            'rural_hea': {},
        }

        result.urban_ele = loadAwareness($scope.awareness, StaticValues.categoryID.ele, StaticValues.marketID.urban);
        result.rural_ele = loadAwareness($scope.awareness, StaticValues.categoryID.ele, StaticValues.marketID.rural);
        result.urban_hea = loadAwareness($scope.awareness, StaticValues.categoryID.hea, StaticValues.marketID.urban);
        result.rural_hea = loadAwareness($scope.awareness, StaticValues.categoryID.hea, StaticValues.marketID.rural);
        $scope.awarenessResult = result;
        $scope.myModel = 'awareness';
    }
    $scope.$watch('awareness', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}