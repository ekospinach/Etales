var suppliersProfitabilityPerCustomerCtrl = function($scope, $http, PlayerColor) {

    var supplierProfitabilityPerCustomerSchema = {
        marketID: 1,
        categoryID: 1,

        xfsppr_SalesValue: 1,
        xfsppr_GrossProfit: 1,
        xfsppr_TradeSupport: 1,
        xfsppr_TradeProfit: 1,
        xfsppr_VisibilityShare: 1,
        xfsppr_TradeSupportShare: 1,
        xfsppr_SalesValueShare: 1,
        xfsppr_GrossProfitShare: 1,
        xfsppr_TradeProfitShare: 1,
    }

    var organiseTableArray = function(data, supplierID, categoryID) {
        var supplierDetail = {
            salesValues: {},
            grossProfits: {},
            tradeSupports: {},
            tradeProfits: {},
            visibilityShares: {},
            tradeSupportShares: {},
            salesValueShares: {},
            grossProfitShares: {},
            tradeProfitShares: {}
        };
        var list = _.filter(data, function(obj) {
            return (obj.categoryID == categoryID && obj.marketID == supplierID); //supplierID
        });
        list.forEach(function(singleData) {
            switch (singleData.BMRetailerID) { //bmretailerid
                case 1:
                    supplierDetail.salesValues.retailer1 = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.retailer1 = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.retailer1 = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.retailer1 = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.retailer1 = singleData.xfsppr_VisibilityShare;
                    supplierDetail.tradeSupportShares.retailer1 = singleData.xfsppr_TradeSupportShare;
                    supplierDetail.salesValueShares.retailer1 = singleData.xfsppr_SalesValueShare;
                    supplierDetail.grossProfitShares.retailer1 = singleData.xfsppr_GrossProfitShare;
                    supplierDetail.tradeProfitShares.retailer1 = singleData.xfsppr_TradeProfitShare;
                    break;
                case 2:
                    supplierDetail.salesValues.retailer2 = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.retailer2 = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.retailer2 = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.retailer2 = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.retailer2 = singleData.xfsppr_VisibilityShare;
                    supplierDetail.tradeSupportShares.retailer2 = singleData.xfsppr_TradeSupportShare;
                    supplierDetail.salesValueShares.retailer2 = singleData.xfsppr_SalesValueShare;
                    supplierDetail.grossProfitShares.retailer2 = singleData.xfsppr_GrossProfitShare;
                    supplierDetail.tradeProfitShares.retailer2 = singleData.xfsppr_TradeProfitShare;
                    break;
                case 3:
                    supplierDetail.salesValues.tt = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.tt = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.tt = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.tt = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.tt = singleData.xfsppr_VisibilityShare;
                    supplierDetail.tradeSupportShares.tt = singleData.xfsppr_TradeSupportShare;
                    supplierDetail.salesValueShares.tt = singleData.xfsppr_SalesValueShare;
                    supplierDetail.grossProfitShares.tt = singleData.xfsppr_GrossProfitShare;
                    supplierDetail.tradeProfitShares.tt = singleData.xfsppr_TradeProfitShare;
                    break;
                case 4:
                    supplierDetail.salesValues.online = singleData.xfsppr_SalesValue;
                    supplierDetail.grossProfits.online = singleData.xfsppr_GrossProfit;
                    supplierDetail.tradeSupports.online = singleData.xfsppr_TradeSupport;
                    supplierDetail.tradeProfits.online = singleData.xfsppr_TradeProfit;
                    supplierDetail.visibilityShares.online = singleData.xfsppr_VisibilityShare;
                    supplierDetail.tradeSupportShares.online = singleData.xfsppr_TradeSupportShare;
                    supplierDetail.salesValueShares.online = singleData.xfsppr_SalesValueShare;
                    supplierDetail.grossProfitShares.online = singleData.xfsppr_GrossProfitShare;
                    supplierDetail.tradeProfitShares.online = singleData.xfsppr_TradeProfitShare;
                    break;
            }
        });
        return supplierDetail;

    }

    var initPage = function() {
        var data = {
            'supplier_1': {
                'ele': {},
                'hea': {}
            },
            'supplier_2': {
                'ele': {},
                'hea': {}
            },
            'supplier_3': {
                'ele': {},
                'hea': {}
            },
        };
        data.supplier_1.ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 1);
        data.supplier_1.hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 1, 2);

        data.supplier_2.ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 1);
        data.supplier_2.hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 2, 2);

        data.supplier_3.ele = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 3, 1);
        data.supplier_3.hea = organiseTableArray($scope.feedback.xf_RetailersProfitabilityPerSupplier, 3, 2);
        $scope.data = data;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}