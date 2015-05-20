var retailersProfitabilityPerSupplierCtrl = function($scope, $http, PlayerColor) {

    var organiseTableArray=function(data,marketID,categoryID,retailerID){
        var retailerDetail = {
            salesValues:{},
            rotations:{},
            grossContributions:{},
            grossContributionPerShelfSpaces:{},
            shelfSpaces:{},
            salesValueShare:{},
            grossContributionShares:{}
        };
        var list = _.filter(data, function(obj) {
            return (obj.marketID == marketID && obj.categoryID == categoryID && obj.BMRetailerID == retailerID);
        });
        list.forEach(function(singleData) {
            switch (singleData.supplierID) {
                case 1:
                    retailerDetail.salesValues.supplier1 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier1 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier1 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier1 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier1 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier1 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier1 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                case 2:
                    retailerDetail.salesValues.supplier2 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier2 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier2 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier2 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier2 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier2 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier2 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                case 3:
                    retailerDetail.salesValues.supplier3 = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.supplier3 = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.supplier3 = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.supplier3 = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.supplier3 = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.supplier3 = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.supplier3 = singleData.xfrpps_GrossContributionShare * 100;
                    break;
                default:
                    retailerDetail.salesValues.privateLabel = singleData.xfrpps_SalesValue;
                    retailerDetail.rotations.privateLabel = singleData.xfrpps_Rotation;
                    retailerDetail.grossContributions.privateLabel = singleData.xfrpps_GrossContribution;
                    retailerDetail.grossContributionPerShelfSpaces.privateLabel = singleData.xfrpps_GrossContributionPerShelfSpace;
                    retailerDetail.shelfSpaces.privateLabel = singleData.xfrpps_ShelfSpace * 100;
                    retailerDetail.salesValueShare.privateLabel = singleData.xfrpps_SalesValueShare * 100;
                    retailerDetail.grossContributionShares.privateLabel = singleData.xfrpps_GrossContributionShare * 100;
                    break;
            }
        })
        return retailerDetail;
    }

    var initPage = function() {
        var data={
            'retailer_1':{
                'urban_ele':{},
                'urban_hea':{},
                'rural_ele':{},
                'rural_hea':{}
            },
            'retailer_2':{
                'urban_ele':{},
                'urban_hea':{},
                'rural_ele':{},
                'rural_hea':{}
            }
        }
        data.retailer_1.urban_ele=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,1,1,1); // market category retailer
        data.retailer_1.urban_hea=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,1,2,1);
        data.retailer_1.rural_ele=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,2,1,1);
        data.retailer_1.rural_hea=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,2,2,1);
        data.retailer_2.urban_ele=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,1,1,2);
        data.retailer_2.urban_hea=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,1,2,2);
        data.retailer_2.rural_ele=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,2,1,2);
        data.retailer_2.rural_hea=organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier,2,2,2);
        $scope.data=data;
        console.log($scope.data);
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}