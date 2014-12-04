define(['directives', 'services'], function(directives) {

    directives.directive('marketForecastsShopper', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_forecastsShopper.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/getMR-forecasts/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
                        $http({
                            method: 'GET',
                            url: url,
                            //tracker: scope.loadingTracker
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
                        scope.forecastsShopperSeries1 = [{
                            //data:[1,min,max],[2,min.max]...
                            //B&M Only shopperInfo[StaticValues.shopper.bm]
                            //Online Only shopperInfo[StaticValues.shopper.online]
                            //Mixed shopperInfo[StaticValues.shopper.mixed]

                            //urban value[StaticValues.market.urban]*100
                            //rural value[StaticValues.market.rural]*100

                            //E ShopperSegmentsImportance[StaticValues.category.ele]
                            //H ShopperSegmentsImportance[StaticValues.category.hea]
                            'name': Label.getContent('B&M Only'),
                            'color': PlayerColor.bm,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Online Only'),
                            'color': PlayerColor.online,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Mixed'),
                            'color': PlayerColor.mixed,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }];
                        scope.forecastsShopperSeries2 = [{
                            'name': Label.getContent('B&M Only'),
                            'color': PlayerColor.bm,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Online Only'),
                            'color': PlayerColor.online,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Mixed'),
                            'color': PlayerColor.mixed,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.ele].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }];
                        scope.forecastsShopperSeries3 = [{
                            'name': Label.getContent('B&M Only'),
                            'color': PlayerColor.bm,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Online Only'),
                            'color': PlayerColor.online,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Mixed'),
                            'color': PlayerColor.mixed,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }];
                        scope.forecastsShopperSeries4 = [{
                            'name': Label.getContent('B&M Only'),
                            'color': PlayerColor.bm,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.bm].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Online Only'),
                            'color': PlayerColor.online,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.online].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Mixed'),
                            'color': PlayerColor.mixed,
                            'data': [
                                [1, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxShopperSegmentsImportance[StaticValues.category.hea].shopperInfo[StaticValues.shopper.mixed].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }];
                        scope.segmentYTitle = Label.getContent('Segment Size') + '(%)';
                        scope.segmentXTitle = Label.getContent('Period');
                        var curP = scope.selectedPeriod;

                        scope.categories = ['', curP - 2, curP - 1, curP, curP + 1, curP + 2];

                        scope.title1 = Label.getContent('Elecssories') + '-' + Label.getContent('Rural');
                        scope.title2 = Label.getContent('Elecssories') + '-' + Label.getContent('Urban');
                        scope.title3 = Label.getContent('HealthBeauties') + '-' + Label.getContent('Rural');
                        scope.title4 = Label.getContent('HealthBeauties') + '-' + Label.getContent('Urban');
                        scope.myModel = 'Shopper Segment Size' + curP;
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