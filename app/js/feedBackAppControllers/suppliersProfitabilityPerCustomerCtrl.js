var suppliersProfitabilityPerCustomerCtrl = function($scope, $http, PlayerColor) {


    var organiseTableArray=function(data,supplier,categoryID){
        var productList =[];
        var list = _.filter(data, function(obj) {
            return (obj.categoryID == categoryID);
        });
    }

    var initPage = function() {
        var profitabilityPerCustomer={
            'supplier1_ele':{},
            'supplier2_ele':{},
            'supplier3_ele':{},
            'supplier1_hea':{},
            'supplier2_hea':{},
            'supplier3_hea':{}
        }
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}