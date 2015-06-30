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

    var loadValue = function(data, store, market) {
        var array = _.find(data, function(obj) {
            return (obj.storeID == store && obj.marketID == market)
        });
        return array;
    }

    var organiseArray = function(data, market) {
        var result = {
            config: [{
                name: Label.getContent('Retailer') + ' 1',
                data: [
                    [1, 3, 10],
                    [1, 5, 100]
                ],
                color: PlayerColor.r1
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [
                    [2, 4, 10],
                    [2, 4, 100]
                ],
                color: PlayerColor.r2
            }, {
                name: Label.getContent('Traditional Trade'),
                data: [
                    [3, 3, 10],
                    [3, 5, 100]
                ],
                color: PlayerColor.r3
            }, {
                name: Label.getContent('Supplier 1 Online'),
                data: [
                    [4, 1, 10],
                    [4, 5, 100]
                ],
                color: PlayerColor.s1
            }, {
                name: Label.getContent('Supplier 2 Online'),
                data: [
                    [5, 2, 10],
                    [5, 2, 100]
                ],
                color: PlayerColor.s2
            }, {
                name: Label.getContent('Supplier 3 Online'),
                data: [
                    [6, 3, 10],
                    [6, 5, 100]
                ],
                color: PlayerColor.s3
            }]
        }
        $scope.myModel = "retailerServiceLevels" + market;
        return result;
    }

    var initPage = function() {

        var result = {
            'urban': {},
            'rural': {}
        }

        result.urban = organiseArray($scope.feedback, 1).config;
        result.rural = organiseArray($scope.feedback, 2).config;
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