var finalScoreCtrl = function($scope, $http, PlayerColor) {
    var initPage = function() {
        var suppliers = new Array({
            supplierID: 1,
            data: [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
            score: 0,
            color: PlayerColor.s1,
            bg: PlayerColor.final_s1
        }, {
            supplierID: 2,
            data: [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
            score: 0,
            color: PlayerColor.s2,
            bg: PlayerColor.final_s2
        }, {
            supplierID: 3,
            data: [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
            score: 0,
            color: PlayerColor.s3,
            bg: PlayerColor.final_s3
        });
        var retailers = new Array({
            retailerID: 1,
            data: [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
            score: 0,
            color: PlayerColor.r1,
            bg: PlayerColor.final_r1
        }, {
            retailerID: 2,
            data: [{value: 0}, {value: 0}, {value: 0}, {value: 0}],
            score: 0,
            color: PlayerColor.r2,
            bg: PlayerColor.final_r2
        });
        $scope.feedBack.ffs_SuppliersAbsoluteValues.forEach(function(singleData) {
            if (singleData.supplierID != 4 && singleData.value != undefined) {
                suppliers[singleData.supplierID - 1].data[singleData.evaluationIdx - 1].value = singleData.value;
            }
        });
        $scope.feedBack.ffs_RetailersAbsoluteValues.forEach(function(singleData) {
            if (singleData.retailerID != 3 && singleData.value != undefined) {
                retailers[singleData.retailerID - 1].data[singleData.evaluationIdx - 1].value = singleData.value;
            }
        })
        $scope.feedBack.ffs_SuppliersFinalScore.forEach(function(singleData) {
            if (singleData.supplierID != 4 && singleData.value != undefined) {
                suppliers[singleData.supplierID - 1].score = singleData.value;
            }
        });
        $scope.feedBack.ffs_RetailersFinalScore.forEach(function(singleData) {
            if (singleData.retailerID != 3 && singleData.value != undefined) {
                retailers[singleData.retailerID - 1].score = singleData.value;
            }
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