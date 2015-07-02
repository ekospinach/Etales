var retailerServiceLevelsCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var loadValue = function(data, storeID, market, period) {
        var result = 0;
        var array = _.find(data, function(obj) {
            return (obj.storeID == storeID && obj.marketID == market && obj.period == period)
        });
        switch (array.serviceLevel) {
            case 'SL_BASE':
                result = 1;
                break;
            case 'SL_FAIR':
                result = 2;
                break;
            case 'SL_MEDIUM':
                result = 3;
                break;
            case 'SL_ENHANCED':
                result = 4;
                break;
            case 'SL_PREMIUM':
                result = 5;
                break;
        }

        return result;
    }

    var organiseArray = function(data, market) {
        var result = {
            config: [{
                name: Label.getContent('Retailer') + ' 1',
                data: [
                    [1, 0, 10],
                    [1, 0, 100]
                ],
                color: PlayerColor.r1
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [
                    [2, 0, 10],
                    [2, 0, 100]
                ],
                color: PlayerColor.r2
            }, {
                name: Label.getContent('Traditional Trade'),
                data: [
                    [3, 0, 10],
                    [3, 0, 100]
                ],
                color: PlayerColor.r3
            }, {
                name: Label.getContent('Supplier') + ' 1',
                data: [
                    [4, 0, 10],
                    [4, 0, 100]
                ],
                color: PlayerColor.s1
            }, {
                name: Label.getContent('Supplier') + ' 2',
                data: [
                    [5, 0, 10],
                    [5, 0, 100]
                ],
                color: PlayerColor.s2
            }, {
                name: Label.getContent('Supplier') + ' 3',
                data: [
                    [6, 0, 10],
                    [6, 0, 100]
                ],
                color: PlayerColor.s3
            }]
        }

        var Request = GetRequest();
        var period = Request['period'];
        for (var i = 1; i < 7; i++) {
            result.config[i - 1].data[1][1] = loadValue(data, i, market, period);
            result.config[i - 1].data[0][1] = loadValue(data, i, market, period - 1);
        }

        $scope.myModel = "retailerServiceLevels" + market;
        return result;
    }

    var initPage = function() {

        var result = {
            'urban': {},
            'rural': {}
        }

        result.urban = organiseArray($scope.feedback.xf_StoresServiceLevel, 1).config;
        result.rural = organiseArray($scope.feedback.xf_StoresServiceLevel, 2).config;
        $scope.categories = [Label.getContent('SL_BASE'), Label.getContent('SL_FAIR'), Label.getContent('SL_MEDIUM'), Label.getContent('SL_ENHANCED'), Label.getContent('SL_PREMIUM')]
        $scope.yTitle = Label.getContent('Service Level');
        $scope.ruralTitle = Label.getContent('Rural');
        $scope.urbanTitle = Label.getContent('Urban');
        $scope.serviceLevels = result;
        $scope.Label = Label;


    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}