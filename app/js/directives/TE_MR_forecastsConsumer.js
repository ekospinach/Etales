define(['directives', 'services'], function(directives) {

    directives.directive('marketForecastsConsumer', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerColor', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerColor, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/MR_forecastsConsumer.html',
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
                        //data:[1,min,max],[2,min.max]...
                        //Price Sensitive segmentInfo[StaticValues.segment.price]
                        //Value For Money segmentInfo[StaticValues.segment.value]
                        //Fashion segmentInfo[StaticValues.segment.fashion]
                        //Freaks segmentInfo[StaticValues.segment.freaks]

                        //urban value[StaticValues.market.urban]
                        //rural value[StaticValues.market.rural]

                        //E ConsumerSegmentsImportance[0]
                        //H ConsumerSegmentsImportance[1]

                        scope.forecastsConsumerSeries1 = [{
                            'name': Label.getContent('Price Sensitive'),
                            'color': PlayerColor.price,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Value For Money'),
                            'color': PlayerColor.value,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Fashion'),
                            'color': PlayerColor.fashion,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Freaks'),
                            'color': PlayerColor.freaks,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }];
                        scope.forecastsConsumerSeries2 = [{
                            'name': Label.getContent('Price Sensitive'),
                            'color': PlayerColor.price,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Value For Money'),
                            'color': PlayerColor.value,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Fashion'),
                            'color': PlayerColor.fashion,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Freaks'),
                            'color': PlayerColor.freaks,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.ele].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }];
                        scope.forecastsConsumerSeries3 = [{
                            'name': Label.getContent('Price Sensitive'),
                            'color': PlayerColor.price,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Value For Money'),
                            'color': PlayerColor.value,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Health Conscious'),
                            'color': PlayerColor.fashion,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Impatient'),
                            'color': PlayerColor.freaks,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.rural] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.rural] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.rural] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.rural] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.rural] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.rural] * 100]
                            ]
                        }];
                        scope.forecastsConsumerSeries4 = [{
                            'name': Label.getContent('Price Sensitive'),
                            'color': PlayerColor.price,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.price].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Value For Money'),
                            'color': PlayerColor.value,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.value].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Health Conscious'),
                            'color': PlayerColor.fashion,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.fashion].periodInfo[4].value[StaticValues.market.urban] * 100]
                            ]
                        }, {
                            'name': Label.getContent('Impatient'),
                            'color': PlayerColor.freaks,
                            'data': [
                                [1, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[0].value[StaticValues.market.urban] * 100],
                                [2, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[1].value[StaticValues.market.urban] * 100],
                                [3, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[2].value[StaticValues.market.urban] * 100],
                                [4, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[3].value[StaticValues.market.urban] * 100],
                                [5, data.minConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.urban] * 100, data.maxConsumerSegmentsImportance[StaticValues.category.hea].segmentInfo[StaticValues.segment.freaks].periodInfo[4].value[StaticValues.market.urban] * 100]
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
                        scope.myModel = 'Consumer Segment Size' + curP;
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