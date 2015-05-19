var supplierProductAvailabilityCtrl = function($scope, $http, PlayerColor) {

    var getResult = function(data, variantName, brandName, retailerID) {
        var result = _.find(data, function(obj) {
            return (obj.variantName == variantName && obj.parentBrandName == brandName && obj.BMRetailerID == retailerID);
        })
        return result;
    }

    // var getColor = function(brandName){
    //     brandName.subStr(brandName.length-1,1)
    //     switch(brandName.subStr(brandName.length-1,1)){
    //         case 1:break;
    //         case 2:break;
    //         case 3:break;
    //     }
    // }

    var organiseArray = function(data, marketID, categoryID) {
        var productList = [];
        var list = _.filter(data, function(obj) {
            return (obj.marketID == marketID && obj.categoryID == categoryID && obj.BMRetailerID == 1);
        });
        list.forEach(function(singleData) {
            var product = {
                name: '',
                'retailer_1_shelfSpace': 0,
                'retailer_1_inventoryVolume': 0,
                'retailer_2_shelfSpace': 0,
                'retailer_2_inventoryVolume': 0,
                'tt_shelfSpace': 0,
                'tt_inventoryVolume': 0,
            };
            var variantName = singleData.variantName;
            var brandName = singleData.parentBrandName;
            product.name = singleData.parentBrandName + '_' + singleData.variantName;
            product.retailer_1_shelfSpace = singleData.shelfSpace;
            product.retailer_1_inventoryVolume = singleData.inventoryVolume;
            product.retailer_2_shelfSpace = getResult(data, variantName, brandName, 2).shelfSpace;
            product.retailer_2_inventoryVolume = getResult(data, variantName, brandName, 2).inventoryVolume;
            product.tt_shelfSpace = getResult(data, variantName, brandName, 3).shelfSpace;
            product.tt_inventoryVolume = getResult(data, variantName, brandName, 3).inventoryVolume;
            productList.push(product);
        });
        return productList;
    }

    var initPage = function() {
        var productLists = {
            'urban_ele': [],
            'urban_hea': [],
            'rural_ele': [],
            'rural_hea': []
        }
        productLists.urban_ele = organiseArray($scope.feedback.xf_AvailabilityAtBMStores, 1, 1);
        productLists.urban_hea = organiseArray($scope.feedback.xf_AvailabilityAtBMStores, 1, 2);
        productLists.rural_ele = organiseArray($scope.feedback.xf_AvailabilityAtBMStores, 2, 1);
        productLists.rural_hea = organiseArray($scope.feedback.xf_AvailabilityAtBMStores, 2, 2);
        $scope.productLists = productLists;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}