var finalScoreCtrl=function($scope,$http){
    var initPage=function(){
        var suppliers=new Array({
            supplierID:1,
            data:[0,0,0,0],
            score:0,
            color:"#3257A7",
            bg:"#D4DCE6"
        },{
            supplierID:2,
            data:[0,0,0,0],
            score:0,
            color:"#B11E22",
            bg:"#D69492"
        },{
            supplierID:3,
            data:[0,0,0,0],
            score:0,
            color:"#F6B920",
            bg:"#FFF2CC"
        });
        var retailers=new Array({
            retailerID:1,
            data:[0,0,0,0],
            score:0,
            color:"#8B288B",
            bg:"#DFDAE4"
        },{
            retailerID:2,
            data:[0,0,0,0],
            score:0,
            color:"#F05422",
            bg:"#FCD5B5"
        });
        $scope.feedBack.ffs_SuppliersAbsoluteValues.forEach(function(singleData){
            if(singleData.supplierID!=4){
                suppliers[singleData.supplierID-1].data[singleData.evaluationIdx-1]=singleData.value;
            }
        });
        $scope.feedBack.ffs_RetailersAbsoluteValues.forEach(function(singleData){
            if(singleData.retailerID!=3){
                retailers[singleData.retailerID-1].data[singleData.evaluationIdx-1]=singleData.value;
            }
        })
        $scope.feedBack.ffs_SuppliersFinalScore.forEach(function(singleData){
            if(singleData.supplierID!=4){
                suppliers[singleData.supplierID-1].score=singleData.value;
            }
        });
        $scope.feedBack.ffs_RetailersFinalScore.forEach(function(singleData){
            if(singleData.retailerID!=3){
                retailers[singleData.retailerID-1].score=singleData.value;
            }
        });
        $scope.suppliers=suppliers;
        $scope.retailers=retailers;
    }
    $scope.$watch('feedBack', function(newValue, oldValue){
        if(newValue!=undefined) {
            initPage();
        }
    });
}

