var retailerPerceptionsCtrl = function($scope, $http, PlayerColor, Label , StaticValues) {
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

    var loadValue = function(data, store, market) {
        var array = _.find(data, function(obj) {
            return (obj.storeID == store && obj.marketID == market)
        });
        return array;
    }

    var organiseArray = function(data,period) {
        var result = {
            'latestPlayer1urban': [],
            'latestPlayer2urban': [],
            'latestPlayer3urban': [],
            'latestPlayer4urban': [],
            'latestPlayer5urban': [],
            'latestPlayer6urban': [],
            'latestPlayer1rural': [],
            'latestPlayer2rural': [],
            'latestPlayer3rural': [],
            'latestPlayer4rural': [],
            'latestPlayer5rural': [],
            'latestPlayer6rural': [],
            'retailerPerceptionsSeries1':{},
            'retailerPerceptionsSeries2':{}
        }

        data.storeInfo.forEach(function(singleData) {
            if (singleData.marketID == 1) {
                switch (singleData.storeID) {
                    // player's urban/rural data include 2 parts
                    // part1 : latestPerception value  point:(x,y,z,)==>z is the size of the circle e.g (previousPerception[StaticValues.perception.quality],previousPerception[StaticValues.perception.easy],size)
                    // part2 : previousPerception value ......

                    //function loadValue ==>find the rural value of this player

                    case 1:
                        result.latestPlayer1urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer1rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer1urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer1rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 2:
                        result.latestPlayer2urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer2rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer2urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer2rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 3:
                        result.latestPlayer3urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer3rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer3urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer3rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 4:
                        result.latestPlayer4urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer4rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer4urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer4rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 5:
                        result.latestPlayer5urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer5rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer5urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer5rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 6:
                        result.latestPlayer6urban.push([singleData.latestPerception[StaticValues.perception.quality], singleData.latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer6rural.push([loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).latestPerception[StaticValues.perception.easy], 10]);
                        result.latestPlayer6urban.push([singleData.previousPerception[StaticValues.perception.quality], singleData.previousPerception[StaticValues.perception.easy], 5]);
                        result.latestPlayer6rural.push([loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.quality], loadValue(data.storeInfo, singleData.storeID, 2).previousPerception[StaticValues.perception.easy], 5]);
                        break;
                    case 7:
                        break;
                }
            }
        })
        result.retailerPerceptionsSeries1 = [{
            name: Label.getContent('Retailer') + ' 1',
            data: result.latestPlayer1rural,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: result.latestPlayer2rural,
            color: PlayerColor.r2
        }, {
            name: Label.getContent('Traditional Trade'),
            data: result.latestPlayer3rural,
            color: PlayerColor.r3
        }, {
            name: Label.getContent('Supplier 1 Online'),
            data: result.latestPlayer4rural,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier 2 Online'),
            data: result.latestPlayer5rural,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier 3 Online'),
            data: result.latestPlayer6rural,
            color: PlayerColor.s3
        }];
        result.retailerPerceptionsSeries2 = [{
            name: Label.getContent('Retailer') + ' 1',
            data: result.latestPlayer1urban,
            color: PlayerColor.r1
        }, {
            name: Label.getContent('Retailer') + ' 2',
            data: result.latestPlayer2urban,
            color: PlayerColor.r2
        }, {
            name: Label.getContent('Traditional Trade'),
            data: result.latestPlayer3urban,
            color: PlayerColor.r3
        }, {
            name: Label.getContent('Supplier 1 Online'),
            data: result.latestPlayer4urban,
            color: PlayerColor.s1
        }, {
            name: Label.getContent('Supplier 2 Online'),
            data: result.latestPlayer5urban,
            color: PlayerColor.s2
        }, {
            name: Label.getContent('Supplier 3 Online'),
            data: result.latestPlayer6urban,
            color: PlayerColor.s3
        }];
        $scope.myModel = "RetailerPerceptions" + period;
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        var grossPeriods = [];

        for (var i = -3; i <= Request['period']; i++) {
            periods.push(i);
        }
        for (var i = Request['period'] - 1; i <= Request['period']; i++) {
            grossPeriods.push(i);
        }
        $scope.xTitle3 = Label.getContent('Convenience');
        $scope.yTitle3 = Label.getContent('Price Appeal');
        $scope.ruralTitle = Label.getContent('Rural');
        $scope.urbanTitle = Label.getContent('Urban');
        $scope.previousInfo = Label.getContent('Previous period');
        $scope.perception = organiseArray($scope.retailerPerception, Request['period']);


    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}