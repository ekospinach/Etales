var productAvailabilityCtrl = function($scope, $http, PlayerColor) {

    var getStoreResult = function(data, variantName, brandName, retailerID, marketID, categoryID) {
        var result = _.find(data, function(obj) {
            return (obj.variantName == variantName && obj.parentBrandName == brandName && obj.BMRetailerID == retailerID && obj.marketID==marketID && obj.categoryID==categoryID);
        })
        return result;
    }

    var organiseStoreArray = function(data, marketID, categoryID) {
        var productList = [];
        var list = _.filter(data, function(obj) {
            return (obj.marketID == marketID && obj.categoryID == categoryID && obj.BMRetailerID == 1);
        });
        list.forEach(function(singleData) {
            var product = {
                'index': 0,
                'brandName': '',
                'variantName': '',
                'retailer_1_shelfSpace': 0,
                'retailer_1_inventoryVolume': 0,
                'retailer_2_shelfSpace': 0,
                'retailer_2_inventoryVolume': 0,
                'tt_shelfSpace': 0,
                'tt_inventoryVolume': 0,
            };
            var variantName = singleData.variantName;
            var brandName = singleData.parentBrandName;
            product.index = brandName.substr(brandName.length - 1, 1);
            product.brandName = singleData.parentBrandName;
            product.variantName = singleData.variantName;
            product.retailer_1_shelfSpace = singleData.shelfSpace * 100;
            product.retailer_1_inventoryVolume = singleData.inventoryVolume;
            product.retailer_2_shelfSpace = getStoreResult(data, variantName, brandName, 2, marketID, categoryID).shelfSpace * 100;
            product.retailer_2_inventoryVolume = getStoreResult(data, variantName, brandName, 2, marketID, categoryID).inventoryVolume;
            product.tt_shelfSpace = getStoreResult(data, variantName, brandName, 3, marketID, categoryID).shelfSpace * 100;
            product.tt_inventoryVolume = getStoreResult(data, variantName, brandName, 3, marketID, categoryID).inventoryVolume;
            productList.push(product);
        });
        return productList;
    }

    var organiseOnlineArray = function(data, categoryID) {
        var productList = [];
        var list = _.filter(data, function(obj) {
            return (obj.categoryID == categoryID);
        });
        list.forEach(function(singleData) {
            var product = {
                'index': 0,
                'brandName': '',
                'variantName': '',
                'supplier_1_visibility': -99,
                'supplier_1_inventoryVolume': -99,
                'supplier_2_visibility': -99,
                'supplier_2_inventoryVolume': -99,
                'supplier_3_visibility': -99,
                'supplier_3_inventoryVolume': -99,
            };
            var variantName = singleData.variantName;
            var brandName = singleData.parentBrandName;
            product.brandName = singleData.parentBrandName;
            product.variantName = singleData.variantName;
            product.index = brandName.substr(brandName.length - 1, 1);

            switch (brandName.substr(brandName.length - 1, 1)) {
                case '1':
                    product.supplier_1_visibility = singleData.shelfSpace * 100;
                    product.supplier_1_inventoryVolume = singleData.inventoryVolume;
                    break;
                case '2':
                    product.supplier_2_visibility = singleData.shelfSpace * 100;
                    product.supplier_2_inventoryVolume = singleData.inventoryVolume;
                    break;
                case '3':
                    product.supplier_3_visibility = singleData.shelfSpace * 100;
                    product.supplier_3_inventoryVolume = singleData.inventoryVolume;
                    break;
            }
            productList.push(product);
        });
        return productList;
    }

    var initPage = function() {
        var productLists = {
            'urban_ele': [],
            'urban_hea': [],
            'rural_ele': [],
            'rural_hea': [],
            'online_ele': [],
            'online_hea': [],
        }
        productLists.urban_ele = organiseStoreArray($scope.feedback.xf_AvailabilityAtBMStores, 1, 1); // market 1, category 1
        productLists.urban_hea = organiseStoreArray($scope.feedback.xf_AvailabilityAtBMStores, 1, 2);
        productLists.rural_ele = organiseStoreArray($scope.feedback.xf_AvailabilityAtBMStores, 2, 1);
        productLists.rural_hea = organiseStoreArray($scope.feedback.xf_AvailabilityAtBMStores, 2, 2);

        productLists.online_ele = organiseOnlineArray($scope.feedback.xf_AvailabilityOnline, 1); //category
        productLists.online_hea = organiseOnlineArray($scope.feedback.xf_AvailabilityOnline, 2);

        $scope.productLists = productLists;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}