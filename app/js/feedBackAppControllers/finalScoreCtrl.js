var finalScoreCtrl = function($scope, $http) {
    var initPage = function() {
        var suppliers = new Array({
            supplierID: 1,
            data: [{
                value: -14.2
            }, {
                value: 35.1
            }, {
                value: 0.5
            }, {
                value: 22.3
            }],
            score: 0.00,
            color: "#3257A7",
            bg: "#D4DCE6"
        }, {
            supplierID: 2,
            data: [{
                value: 7.0
            }, {
                value: 61.7
            }, {
                value: 1.0
            }, {
                value: 42.2
            }],
            score: 0.82,
            color: "#B11E22",
            bg: "#D69492"
        }, {
            supplierID: 3,
            data: [{
                value: 1.6
            }, {
                value: 20.4
            }, {
                value: 0.6
            }, {
                value: 35.5
            }],
            score: 0.37,
            color: "#F6B920",
            bg: "#FFF2CC"
        });
        var retailers = new Array({
            retailerID: 1,
            data: [{
                value: 1.5
            }, {
                value: -35.3
            }, {
                value: -1857.9
            }, {
                value: 23.6
            }],
            score: 0.18,
            color: "#8B288B",
            bg: "#DFDAE4"
        }, {
            retailerID: 2,
            data: [{
                value: 1.5
            }, {
                value: -60.0
            }, {
                value: -2504.4
            }, {
                value: 21.6
            }],
            score: -0.02,
            color: "#329444",
            bg: "#FCD5B5"
        });
        $scope.suppliers = suppliers;
        $scope.retailers = retailers;
    }
    $scope.$watch('feedBack', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}