var retailerBMPricesCtrl = function($scope, $http, PlayerColor, Label, StaticValues) {
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

    var loadRetailerPrice = function(data, category) {
        var result = {
            player1s: [],
            player2s: [],
            player3s: [],
            player5s: [],
            player6s: []
        }

        data.variantInfo.forEach(function(singleData) {
            if (singleData.parentCategoryID == category) {
                var fullName = singleData.parentBrandName + singleData.variantName;
                var rural1Value = rural1ValueChange = urban1Value = urban1ValueChange = rural2Value = rural2ValueChange = urban2Value = urban2ValueChange = 0;
                /*
                urban=latestNetMarketPrice[0]
                rural=latestNetMarketPrice[1]
                urbanChange=netMarketPriceChange[0]
                ruralChange=netMarketPriceChange[1]
                */
                if (singleData.accountInfo[StaticValues.player.r1] != undefined) {
                    rural1Value = singleData.accountInfo[StaticValues.player.r1].latestNetMarketPrice[StaticValues.market.rural];
                    rural1ValueChange = singleData.accountInfo[StaticValues.player.r1].netMarketPriceChange[StaticValues.market.rural] * 100;
                    urban1Value = singleData.accountInfo[StaticValues.player.r1].latestNetMarketPrice[StaticValues.market.urban];
                    urban1ValueChange = singleData.accountInfo[StaticValues.player.r1].netMarketPriceChange[StaticValues.market.urban] * 100;
                }
                if (singleData.accountInfo[StaticValues.player.r2] != undefined) {
                    rural2Value = singleData.accountInfo[StaticValues.player.r2].latestNetMarketPrice[StaticValues.market.rural];
                    rural2ValueChange = singleData.accountInfo[StaticValues.player.r2].netMarketPriceChange[StaticValues.market.rural] * 100;
                    urban2Value = singleData.accountInfo[StaticValues.player.r2].latestNetMarketPrice[StaticValues.market.urban];
                    urban2ValueChange = singleData.accountInfo[StaticValues.player.r2].netMarketPriceChange[StaticValues.market.urban] * 100;
                }
                if (singleData.accountInfo[StaticValues.player.r4] != undefined) {
                    onlineValue = singleData.accountInfo[StaticValues.player.r4].latestNetMarketPrice[StaticValues.market.urban];
                    onlineChange = singleData.accountInfo[StaticValues.player.r4].netMarketPriceChange[StaticValues.market.urban] * 100;
                }

                switch (singleData.parentCompanyID) {
                    case 1:
                        result.player1s.push({
                            'fullName': fullName,
                            'rural1Value': rural1Value,
                            'rural1ValueChange': rural1ValueChange,
                            'urban1Value': urban1Value,
                            'urban1ValueChange': urban1ValueChange,
                            'rural2Value': rural2Value,
                            'rural2ValueChange': rural2ValueChange,
                            'urban2Value': urban2Value,
                            'urban2ValueChange': urban2ValueChange,
                            'onlineValue': onlineValue,
                            'onlineChange': onlineChange
                        });
                        break;
                    case 2:
                        result.player2s.push({
                            'fullName': fullName,
                            'rural1Value': rural1Value,
                            'rural1ValueChange': rural1ValueChange,
                            'urban1Value': urban1Value,
                            'urban1ValueChange': urban1ValueChange,
                            'rural2Value': rural2Value,
                            'rural2ValueChange': rural2ValueChange,
                            'urban2Value': urban2Value,
                            'urban2ValueChange': urban2ValueChange,
                            'onlineValue': onlineValue,
                            'onlineChange': onlineChange
                        });
                        break;
                    case 3:
                        result.player3s.push({
                            'fullName': fullName,
                            'rural1Value': rural1Value,
                            'rural1ValueChange': rural1ValueChange,
                            'urban1Value': urban1Value,
                            'urban1ValueChange': urban1ValueChange,
                            'rural2Value': rural2Value,
                            'rural2ValueChange': rural2ValueChange,
                            'urban2Value': urban2Value,
                            'urban2ValueChange': urban2ValueChange,
                            'onlineValue': onlineValue,
                            'onlineChange': onlineChange
                        });
                        break;
                    case 5:
                        result.player5s.push({
                            'fullName': fullName,
                            'rural1Value': rural1Value,
                            'rural1ValueChange': rural1ValueChange,
                            'urban1Value': urban1Value,
                            'urban1ValueChange': urban1ValueChange,
                            'rural2Value': rural2Value,
                            'rural2ValueChange': rural2ValueChange,
                            'urban2Value': urban2Value,
                            'urban2ValueChange': urban2ValueChange,
                            'onlineValue': onlineValue,
                            'onlineChange': onlineChange
                        });
                        break;
                    case 6:
                        result.player6s.push({
                            'fullName': fullName,
                            'rural1Value': rural1Value,
                            'rural1ValueChange': rural1ValueChange,
                            'urban1Value': urban1Value,
                            'urban1ValueChange': urban1ValueChange,
                            'rural2Value': rural2Value,
                            'rural2ValueChange': rural2ValueChange,
                            'urban2Value': urban2Value,
                            'urban2ValueChange': urban2ValueChange,
                            'onlineValue': onlineValue,
                            'onlineChange': onlineChange
                        });
                        break;
                }
            }
        })
        return result;
    }

    var initPage = function() {

        var result = {
            'ele': {},
            'hea': {}
        }
        result.ele = loadRetailerPrice($scope.netMarketPrices, StaticValues.categoryID.ele);
        result.hea = loadRetailerPrice($scope.netMarketPrices, StaticValues.categoryID.hea);
        $scope.result = result;
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}