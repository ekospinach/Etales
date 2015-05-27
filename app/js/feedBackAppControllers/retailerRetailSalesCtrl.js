var retailerRetailSalesCtrl = function($scope, $http, PlayerColor, Label) {
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

    var feedback = {
        // BMS, NETIZENS, MIXED, ALLSHOPPERS
        // { It is a bit overloaded with data. For absolute values in the top line you only need: [market, category, period, ALLSHOPPERS, ALlStoresMaxTotal].xfsss_Absolute element } 
        // { For left side bar charts use: [market, category, period, BMS/NETIZENS/MIXED, ALlStoresMaxTotal].xfsss_Importance }
        // { For right side bar use: [market, category, period, ALLSHOPPERS, store].xfsss_Importance }
        xf_ChannelShoppersSegmentsRetailSalesValue: [{
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'BMS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'NETIZENS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'MIXED',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -3,
                shopperKind: 'ALLSHOPPERS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'BMS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'NETIZENS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'MIXED',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -2,
                shopperKind: 'ALLSHOPPERS',
                storeID: 7,
                absolute: 1,
                importance: 1
            },

            {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'BMS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'NETIZENS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'MIXED',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: -1,
                shopperKind: 'ALLSHOPPERS',
                storeID: 7,
                absolute: 1,
                importance: 1
            },

            {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 1,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 2,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 3,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 4,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 5,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 6,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'BMS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'NETIZENS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'MIXED',
                storeID: 7,
                absolute: 1,
                importance: 1
            }, {
                marketID: 1,
                categoryID: 1,
                period: 0,
                shopperKind: 'ALLSHOPPERS',
                storeID: 7,
                absolute: 1,
                importance: 1
            }

        ]
    }


    var organiseArray = function(data, periods, marketID, categoryID) {
        // BMS, NETIZENS, MIXED, ALLSHOPPERS
        // { It is a bit overloaded with data. For absolute values in the top line you only need: [market, category, period, ALLSHOPPERS, ALlStoresMaxTotal].xfsss_Absolute element } 
        // { For left side bar charts use: [market, category, period, BMS/NETIZENS/MIXED, ALlStoresMaxTotal].xfsss_Importance }
        // { For right side bar use: [market, category, period, ALLSHOPPERS, store].xfsss_Importance }
        var result = {
            data: [{
                name: Label.getContent('B&M Only'),
                data: [],
                color: PlayerColor.bm,
                xAxis: 0
            }, {
                name: Label.getContent('Online Only'),
                data: [],
                color: PlayerColor.online,
                xAxis: 0
            }, {
                name: Label.getContent('Mixed'),
                data: [],
                color: PlayerColor.mixed,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') + ' 1',
                data: [],
                color: PlayerColor.r1,
                xAxis: 0
            }, {
                name: Label.getContent('Retailer') + ' 2',
                data: [],
                color: PlayerColor.r2,
                xAxis: 0
            }, {
                name: Label.getContent('Traditional Trade'),
                data: [],
                color: PlayerColor.r3,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 1',
                data: [],
                color: PlayerColor.s1,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 2',
                data: [],
                color: PlayerColor.s2,
                xAxis: 0
            }, {
                name: Label.getContent('Supplier') + ' 3',
                data: [],
                color: PlayerColor.s3,
                xAxis: 0
            }, {
                name: ' ',
                data: [0, 0],
                color: 'transparent',
                xAxis: 1, //第二个X轴
            }, {
                name: ' ',
                data: [],
                color: 'transparent',
                xAxis: 2, //第二个X轴
            }],
            categories: []
        };
        var list = {};

        for (var i = 0; i < 2 * periods.length + 1; i++) {
            result.data[0].data[i] = 0;
            result.data[1].data[i] = 0;
            result.data[2].data[i] = 0;
            result.data[3].data[i] = 0;
            result.data[4].data[i] = 0;
            result.data[5].data[i] = 0;
            result.data[6].data[i] = 0;
            result.data[7].data[i] = 0;
            result.data[8].data[i] = 0;
            result.data[10].data[i] = 0;
            result.categories[i] = ' ';
        }

        periods.forEach(function(singlePeriod) {
            //period
            data.forEach(function(singleData) {
                lists = _.filter(data, function(obj) {
                    return (obj.period == singlePeriod && obj.categoryID == categoryID && obj.marketID == marketID);
                })
                lists.forEach(function(singleList) {
                    switch (singleList.shopperKind) {
                        case 'BMS':
                            if (singleList.storeID == 7) {
                                result.data[0].data[singlePeriod + 3] = singleList.importance;
                            }
                            break;
                        case 'NETIZENS':
                            if (singleList.storeID == 7) {
                                result.data[1].data[singlePeriod + 3] = singleList.importance;
                            }
                            break;
                        case 'MIXED':
                            if (singleList.storeID == 7) {
                                result.data[2].data[singlePeriod + 3] = singleList.importance;
                            }
                            break;
                        case 'ALLSHOPPERS':
                            if (singleData.storeID == 4) {
                                result.data[3].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleData.storeID == 5) {
                                result.data[4].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleData.storeID == 6) {
                                result.data[5].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleData.storeID == 1) {
                                result.data[6].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleData.storeID == 2) {
                                result.data[7].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleData.storeID == 3) {
                                result.data[8].data[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            if (singleList.storeID == 7) {
                                result.categories[singlePeriod + 3] = singleList.absolute;
                                //bug
                                result.categories[($scope.categories.length - 1) / 2 + singlePeriod + 4] = singleList.importance;
                            }
                            break;
                    }
                })

            })
        });
        console.log(result);
        return result;
    }

    var initPage = function() {
        var Request = GetRequest();
        var periods = [];
        $scope.categories = [];
        $scope.subCategories = [];
        for (var i = -3; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
            periods.push(i);
        }
        $scope.categories.push(' ');
        $scope.subCategories.push(' ');
        for (var i = -3; i <= Request['period']; i++) {
            $scope.categories.push('Period:' + i);
        }
        var result = {
            'urban_ele': {
                data: {},
                categories: {}
            },
            'urban_hea': {
                data: {},
                categories: {}
            },
            'rural_ele': {
                data: {},
                categories: {}
            },
            'rural_hea': {
                data: {},
                categories: {}
            },
        }
        result.urban_ele = organiseArray(feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 1);
        result.urban_hea = organiseArray(feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 1, 2);
        result.rural_ele = organiseArray(feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 2, 1);
        result.rural_hea = organiseArray(feedback.xf_ChannelShoppersSegmentsRetailSalesValue, periods, 2, 2);
        $scope.urban_eleRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban_ele.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
            },
            title: {
                text: ''
            },
            series: result.urban_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.urban_heaRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.urban_hea.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
            },
            title: {
                text: ''
            },
            series: result.urban_hea.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rural_eleRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural_ele.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
            },
            title: {
                text: ''
            },
            series: result.rural_ele.data,
            credits: {
                enabled: false
            },
            loading: false
        }
        $scope.rural_heaRetailSales = {
            options: {
                xAxis: [{
                    categories: $scope.categories,
                    tickWidth: 0,
                    gridLineWidth: 0
                }, {
                    categories: [Label.getContent('Feedback By Shopper Segment'), Label.getContent('Feedback By Market Players')],
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                            'text-align': 'right'
                        },
                    },
                    lineWidth: 0,
                    tickWidth: 0
                }, {
                    categories: result.rural_hea.categories,
                    labels: {
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f',
                        },
                        y: -30
                    },
                    title: {
                        text: Label.getContent('Total Sales'),
                        style: {
                            'font-size': '16px',
                            'color': '#f26c4f'
                        }
                    },
                    tickWidth: 0,
                    opposite: true //对立面 表示显示在上方
                }],
                yAxis: {
                    title: {
                        text: '%'
                    },
                    max: 100
                },
                chart: {
                    type: 'column',
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        stacking: 'percent'
                    }
                }
            },
            title: {
                text: ''
            },
            series: result.rural_hea.data,
            credits: {
                enabled: false
            },
            loading: false
        }
    }
    $scope.$watch('feedback', function(newValue, oldValue) {
        if (newValue != undefined) {
            initPage();
        }
    });
}