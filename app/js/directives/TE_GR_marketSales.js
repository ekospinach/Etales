define(['directives', 'services'], function(directives) {

    directives.directive('generalMarketSales', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/GR_marketSales.html',
                link: function(scope, element, attrs) {


                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/marketSales/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;

                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            return organiseArray(data.data[0]);
                        }).then(function(data) {
                            scope.isResultShown = true;
                            scope.isPageLoading = false;
                        }, function() {
                            console.log('fail');
                        });
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        scope.totals         = [[],[],[],[]];
                        scope.totalChanges   = [[],[],[],[]];
                        scope.rurals         = [[],[],[],[]];
                        scope.ruralChanges   = [[],[],[],[]];
                        scope.urbans         = [[],[],[],[]];
                        scope.urbanChanges   = [[],[],[],[]];
                        scope.prices         = [[],[],[],[]];
                        scope.priceChanges   = [[],[],[],[]];
                        scope.values         = [[],[],[],[]];
                        scope.valueChanges   = [[],[],[],[]];
                        scope.fashions       = [[],[],[],[]];
                        scope.fashionChanges = [[],[],[],[]];
                        scope.freakss        = [[],[],[],[]];
                        scope.freaksChanges  = [[],[],[],[]];
                        scope.bms            = [[],[],[],[]];
                        scope.bmChanges      = [[],[],[],[]];
                        scope.onlines        = [[],[],[],[]];
                        scope.onlineChanges  = [[],[],[],[]];
                        scope.mixeds         = [[],[],[],[]];
                        scope.mixedChanges   = [[],[],[],[]];

                        data.actorInfo.forEach(function(singleData) {
                            for (j = 0; j < 4; j += 2) {
                                var k = 0;
                                if (j >= 2) {
                                    k = 1;
                                };
                                //total actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].xxxx
                                scope.totals[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.totalChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.totals[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.totalChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);
                                //rural actorMarketInfo[1].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all]
                                scope.rurals[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.rural].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.ruralChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.rural].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.rurals[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.rural].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.ruralChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.rural].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //urban actorMarketInfo[0].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all]
                                scope.urbans[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.urban].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.urbanChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.urban].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.urbans[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.urban].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.urbanChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.urban].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //prices actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.price].actorShopperInfo[StaticValues.shopper.all]
                                scope.prices[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.price].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.priceChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.price].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.prices[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.price].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.priceChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.price].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //values actorMarketInfo[StaticValues.market.total].actorSegmentInfo[1].actorShopperInfo[StaticValues.shopper.all]
                                scope.values[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.value].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.valueChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.value].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.values[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.value].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.valueChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.value].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //fashions actorMarketInfo[StaticValues.market.total].actorSegmentInfo[2].actorShopperInfo[StaticValues.shopper.all]
                                scope.fashions[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.fashion].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.fashionChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.fashion].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.fashions[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.fashion].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.fashionChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.fashion].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //freakss actorMarketInfo[StaticValues.market.total].actorSegmentInfo[3].actorShopperInfo[StaticValues.shopper.all]
                                scope.freakss[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.freaks].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolume);
                                scope.freaksChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.freaks].actorShopperInfo[StaticValues.shopper.all].grms_MarketSalesVolumeChange * 100);
                                scope.freakss[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.freaks].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValue);
                                scope.freaksChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.freaks].actorShopperInfo[StaticValues.shopper.all].grms_MarketNetSalesValueChange * 100);

                                //bms actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[0]
                                scope.bms[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.bm].grms_MarketSalesVolume);
                                scope.bmChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.bm].grms_MarketSalesVolumeChange * 100);
                                scope.bms[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.bm].grms_MarketNetSalesValue);
                                scope.bmChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.bm].grms_MarketNetSalesValueChange * 100);

                                //onlines actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[1]
                                scope.onlines[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.online].grms_MarketSalesVolume);
                                scope.onlineChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.online].grms_MarketSalesVolumeChange * 100);
                                scope.onlines[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.online].grms_MarketNetSalesValue);
                                scope.onlineChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.online].grms_MarketNetSalesValueChange * 100);

                                //mixed  actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[2]
                                scope.mixeds[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.mixed].grms_MarketSalesVolume);
                                scope.mixedChanges[j].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.mixed].grms_MarketSalesVolumeChange * 100);
                                scope.mixeds[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.mixed].grms_MarketNetSalesValue);
                                scope.mixedChanges[j + 1].push(singleData.actorCategoryInfo[k].actorMarketInfo[StaticValues.market.total].actorSegmentInfo[StaticValues.segment.total].actorShopperInfo[StaticValues.shopper.mixed].grms_MarketNetSalesValueChange * 100);
                            }
                        });

                        scope.marketSales1Series = [{
                            "name": Label.getContent('Producer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1]],
                            type: "column",
                            color: PlayerColor.s1
                        }, {
                            "name": Label.getContent('Producer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2]],
                            type: "column",
                            color: PlayerColor.s2
                        }, {
                            "name": Label.getContent('Producer') + ' 3',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3]],
                            type: "column",
                            color: PlayerColor.s3
                        }, {
                            "name": Label.getContent('Producer') + ' 4',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4]],
                            type: "column",
                            color: PlayerColor.s4
                        }, {
                            "name": Label.getContent('Retailer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1]],
                            type: "column",
                            color: PlayerColor.r1
                        }, {
                            "name": Label.getContent('Retailer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.urbans[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.rurals[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.prices[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.values[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.fashions[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.freakss[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.bms[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.onlines[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.mixeds[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2]],
                            type: "column",
                            color: PlayerColor.r2
                        }, ];

                        scope.change1s = scope.change2s = scope.change3s = scope.change4s = [[],[],[],[],[],[]];

                        scope.change1s = [
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s1]],
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s2]],
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s3]],
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.s4]],
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r1]],
                            [scope.totalChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.urbanChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.ruralChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.priceChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.valueChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.fashionChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.freaksChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], 0, scope.bmChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.onlineChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2], scope.mixedChanges[StaticValues.CandV.eleVolume][StaticValues.chartOwner.r2]]
                        ];

                        scope.marketSales1Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Total'), '', Label.getContent('Urban'), Label.getContent('Rural'), '', Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks'), '', Label.getContent('B&M Only'), Label.getContent('Online Only'), Label.getContent('Mixed')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    formatter: function() {
                                        var index = 0;
                                        if (this.series._i >= 6) {
                                            index = this.series._i - 6;
                                        } else {
                                            index = this.series._i;
                                        }
                                        var s = '<p><b>' + this.series.name + '</b></p>' + '<p>' + Label.getContent('Volume Sales') + ':' + this.point.y.toFixed(2) + '</p>' + '<p>' + scope.change1s[index][this.point.x].toFixed(2) + ' ' + Label.getContent('change over previous period') + '</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                }
                            },
                            series: scope.marketSales1Series,
                            title: {
                                text: Label.getContent('Elecssories') + ' - ' + Label.getContent('Volume Sales'),
                                style: {
                                    'font-size': '20px'
                                }
                            },
                            subtitle: {
                                text: '<p class="my-text-left">' + Label.getContent('Total') + '</p><p class="my-text-center-left">' + Label.getContent('by Market') + '</p><p class="my-text-center-right">' + Label.getContent('by Consumer Segment') + '</p><p class="my-text-right">' + Label.getContent('by Shopper Segment') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.marketSales2Series = [{
                            "name": Label.getContent('Producer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1]],
                            type: "column",
                            color: PlayerColor.s1
                        }, {
                            "name": Label.getContent('Producer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2]],
                            type: "column",
                            color: PlayerColor.s2
                        }, {
                            "name": Label.getContent('Producer') + ' 3',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3]],
                            type: "column",
                            color: PlayerColor.s3
                        }, {
                            "name": Label.getContent('Producer') + ' 4',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4]],
                            type: "column",
                            color: PlayerColor.s4
                        }, {
                            "name": Label.getContent('Retailer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1]],
                            type: "column",
                            color: PlayerColor.r1
                        }, {
                            "name": Label.getContent('Retailer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.urbans[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.rurals[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.prices[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.values[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.fashions[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.freakss[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.bms[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.onlines[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.mixeds[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2]],
                            type: "column",
                            color: PlayerColor.r2
                        }, ];

                        // scope.change2s = new Array();
                        // for (i = 0; i < 6; i++) {
                        //     scope.change2s[i] = new Array();
                        // }

                        scope.change2s = [
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s1]],
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s2]],
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s3]],
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.s4]],
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r1]],
                            [scope.totalChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.urbanChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.ruralChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.priceChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.valueChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.fashionChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.freaksChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], 0, scope.bmChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.onlineChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2], scope.mixedChanges[StaticValues.CandV.eleValue][StaticValues.chartOwner.r2]]
                        ];


                        scope.marketSales2Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Total'), '', Label.getContent('Urban'), Label.getContent('Rural'), '', Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Fashion'), Label.getContent('Freaks'), '', Label.getContent('B&M Only'), Label.getContent('Online Only'), Label.getContent('Mixed')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('$mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    formatter: function() {
                                        var index = 0;
                                        if (this.series._i >= 6) {
                                            index = this.series._i - 6;
                                        } else {
                                            index = this.series._i;
                                        }
                                        var s = '<p><b>' + this.series.name + '</b></p>' + '<p>' + Label.getContent('Value Sales') + ':' + this.point.y.toFixed(2) + '</p>' + '<p>' + scope.change2s[index][this.point.x].toFixed(2) + ' ' + Label.getContent('change over previous period') + '</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                }
                            },
                            series: scope.marketSales2Series,
                            title: {
                                text: Label.getContent('Elecssories') + ' - ' + Label.getContent('Value Sales'),
                                style: {
                                    'font-size': '20px'
                                }
                            },
                            subtitle: {
                                text: '<p class="my-text-left">' + Label.getContent('Total') + '</p><p class="my-text-center-left">' + Label.getContent('by Market') + '</p><p class="my-text-center-right">' + Label.getContent('by Consumer Segment') + '</p><p class="my-text-right">' + Label.getContent('by Shopper Segment') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.marketSales3Series = [{
                            "name": Label.getContent('Producer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1]],
                            type: "column",
                            color: PlayerColor.s1
                        }, {
                            "name": Label.getContent('Producer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2]],
                            type: "column",
                            color: PlayerColor.s2
                        }, {
                            "name": Label.getContent('Producer') + ' 3',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3]],
                            type: "column",
                            color: PlayerColor.s3
                        }, {
                            "name": Label.getContent('Producer') + ' 4',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4]],
                            type: "column",
                            color: PlayerColor.s4
                        }, {
                            "name": Label.getContent('Retailer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1]],
                            type: "column",
                            color: PlayerColor.r1
                        }, {
                            "name": Label.getContent('Retailer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.urbans[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.rurals[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.prices[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.values[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.fashions[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.freakss[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.bms[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.onlines[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.mixeds[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2]],
                            type: "column",
                            color: PlayerColor.r2
                        }, ];

                        // scope.change3s = new Array();
                        // for (i = 0; i < 6; i++) {
                        //     scope.change3s[i] = new Array();
                        // }

                        scope.change3s = [
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s1]],
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s2]],
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s3]],
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.s4]],
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r1]],
                            [scope.totalChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.urbanChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.ruralChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.priceChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.valueChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.fashionChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.freaksChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], 0, scope.bmChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.onlineChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2], scope.mixedChanges[StaticValues.CandV.heaVolume][StaticValues.chartOwner.r2]]
                        ];

                        scope.marketSales3Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Total'), '', Label.getContent('Urban'), Label.getContent('Rural'), '', Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient'), '', Label.getContent('B&M Only'), Label.getContent('Online Only'), Label.getContent('Mixed')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('units mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    formatter: function() {
                                        var index = 0;
                                        if (this.series._i >= 6) {
                                            index = this.series._i - 6;
                                        } else {
                                            index = this.series._i;
                                        }
                                        var s = '<p><b>' + this.series.name + '</b></p>' + '<p>' + Label.getContent('Volume Sales') + ':' + this.point.y.toFixed(2) + '</p>' + '<p>' + scope.change3s[index][this.point.x].toFixed(2) + ' ' + Label.getContent('change over previous period') + '</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                }
                            },
                            series: scope.marketSales3Series,
                            title: {
                                text: Label.getContent('HealthBeauties') + ' - ' + Label.getContent('Volume Sales'),
                                style: {
                                    'font-size': '20px'
                                }
                            },
                            subtitle: {
                                text: '<p class="my-text-left">' + Label.getContent('Total') + '</p><p class="my-text-center-left">' + Label.getContent('by Market') + '</p><p class="my-text-center-right">' + Label.getContent('by Consumer Segment') + '</p><p class="my-text-right">' + Label.getContent('by Shopper Segment') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        scope.marketSales4Series = [{
                            "name": Label.getContent('Producer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1]],
                            type: "column",
                            color: PlayerColor.s1
                        }, {
                            "name": Label.getContent('Producer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2]],
                            type: "column",
                            color: PlayerColor.s2
                        }, {
                            "name": Label.getContent('Producer') + ' 3',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3]],
                            type: "column",
                            color: PlayerColor.s3
                        }, {
                            "name": Label.getContent('Producer') + ' 4',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4]],
                            type: "column",
                            color: PlayerColor.s4
                        }, {
                            "name": Label.getContent('Retailer') + ' 1',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1]],
                            type: "column",
                            color: PlayerColor.r1
                        }, {
                            "name": Label.getContent('Retailer') + ' 2',
                            "data": [scope.totals[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.urbans[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.rurals[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.prices[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.values[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.fashions[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.freakss[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.bms[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.onlines[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.mixeds[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2]],
                            type: "column",
                            color: PlayerColor.r2
                        }, ];
                        // scope.change4s = new Array();
                        // for (i = 0; i < 6; i++) {
                        //     scope.change4s[i] = new Array();
                        // }

                        scope.change4s = [
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s1]],
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s2]],
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s3]],
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.s4]],
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r1]],
                            [scope.totalChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.urbanChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.ruralChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.priceChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.valueChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.fashionChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.freaksChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], 0, scope.bmChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.onlineChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2], scope.mixedChanges[StaticValues.CandV.heaValue][StaticValues.chartOwner.r2]]
                        ];

                        scope.marketSales4Config = {
                            options: {
                                xAxis: {
                                    categories: [Label.getContent('Total'), '', Label.getContent('Urban'), Label.getContent('Rural'), '', Label.getContent('Price Sensitive'), Label.getContent('Value for Money'), Label.getContent('Health Conscious'), Label.getContent('Impatient'), '', Label.getContent('B&M Only'), Label.getContent('Online Only'), Label.getContent('Mixed')]
                                },
                                yAxis: {
                                    title: {
                                        text: Label.getContent('$mln')
                                    }
                                },
                                chart: {
                                    type: 'areaspline'
                                },
                                tooltip: {
                                    formatter: function() {
                                        var index = 0;
                                        if (this.series._i >= 6) {
                                            index = this.series._i - 6;
                                        } else {
                                            index = this.series._i;
                                        }
                                        var s = '<p><b>' + this.series.name + '</b></p>' + '<p>' + Label.getContent('Value Sales') + ':' + this.point.y.toFixed(2) + '</p>' + '<p>' + scope.change4s[index][this.point.x].toFixed(2) + ' ' + Label.getContent('change over previous period') + '</p>';
                                        return s;
                                    },
                                    shared: false,
                                    useHTML: true
                                },
                                plotOptions: {
                                    series: {
                                        stacking: 'normal'
                                    }
                                }
                            },
                            series: scope.marketSales4Series,
                            title: {
                                text: Label.getContent('HealthBeauties') + ' - ' + Label.getContent('Value Sales'),
                                style: {
                                    'font-size': '20px'
                                }
                            },
                            subtitle: {
                                text: '<p class="my-text-left">' + Label.getContent('Total') + '</p><p class="my-text-center-left">' + Label.getContent('by Market') + '</p><p class="my-text-center-right">' + Label.getContent('by Consumer Segment') + '</p><p class="my-text-right">' + Label.getContent('by Shopper Segment') + '</p>',
                                useHTML: true,
                            },
                            credits: {
                                enabled: false
                            },
                            loading: false
                        }

                        deferred.resolve({
                            msg: 'Array is ready.'
                        });
                        return deferred.promise;
                    }


                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPeriod', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})