define(['directives', 'services'], function(directives) {

    directives.directive('marketSupplierIntelligence', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '='
                },
                restrict: 'E',
                templateUrl: 'singleReportTemplate/MR_supplierIntelligence.html',
                link: function(scope, element, attrs) {
                    var initializePage = function() {
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/getMR-suppliersIntelligence/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod;
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
                        var myData = new Array();
                        myData.push({
                            /*
                            XXXXXXX_playerCategory: data.supplierInfo[player-1].categoryInfo[category-1].XXXXXXX
                            */

                            'AdvertisingOnline_1e'  : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].advertisingOnLine,
                            'AdvertisingOnline_2e'  : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].advertisingOnLine,
                            'AdvertisingOnline_3e'  : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].advertisingOnLine,
                            'AdvertisingOnline_1h'  : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].advertisingOnLine,
                            'AdvertisingOnline_2h'  : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].advertisingOnLine,
                            'AdvertisingOnline_3h'  : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].advertisingOnLine,
                            'AdvertisingOffline_1e' : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].advertisingOffLine,
                            'AdvertisingOffline_2e' : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].advertisingOffLine,
                            'AdvertisingOffline_3e' : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].advertisingOffLine,
                            'AdvertisingOffline_1h' : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].advertisingOffLine,
                            'AdvertisingOffline_2h' : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].advertisingOffLine,
                            'AdvertisingOffline_3h' : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].advertisingOffLine,
                            'OnLineVisibility_1e'   : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].onLineVisibility,
                            'OnLineVisibility_2e'   : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].onLineVisibility,
                            'OnLineVisibility_3e'   : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].onLineVisibility,
                            'OnLineVisibility_1h'   : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].onLineVisibility,
                            'OnLineVisibility_2h'   : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].onLineVisibility,
                            'OnLineVisibility_3h'   : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].onLineVisibility,
                            'OnLineOther_1e'        : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].onLineOther,
                            'OnLineOther_2e'        : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].onLineOther,
                            'OnLineOther_3e'        : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].onLineOther,
                            'OnLineOther_1h'        : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].onLineOther,
                            'OnLineOther_2h'        : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].onLineOther,
                            'OnLineOther_3h'        : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].onLineOther,
                            'TechnologyLevel_1e'    : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].acquiredTechnologyLevel,
                            'TechnologyLevel_2e'    : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].acquiredTechnologyLevel,
                            'TechnologyLevel_3e'    : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].acquiredTechnologyLevel,
                            'TechnologyLevel_1h'    : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].acquiredTechnologyLevel,
                            'TechnologyLevel_2h'    : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].acquiredTechnologyLevel,
                            'TechnologyLevel_3h'    : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].acquiredTechnologyLevel,
                            'DesignLevel_1e'        : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].acquiredDesignLevel,
                            'DesignLevel_2e'        : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].acquiredDesignLevel,
                            'DesignLevel_3e'        : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].acquiredDesignLevel,
                            'DesignLevel_1h'        : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].acquiredDesignLevel,
                            'DesignLevel_2h'        : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].acquiredDesignLevel,
                            'DesignLevel_3h'        : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].acquiredDesignLevel,
                            'Capacity_1e'           : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].productionCapacityAvailable,
                            'Capacity_2e'           : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].productionCapacityAvailable,
                            'Capacity_3e'           : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].productionCapacityAvailable,
                            'Capacity_1h'           : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].productionCapacityAvailable,
                            'Capacity_2h'           : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].productionCapacityAvailable,
                            'Capacity_3h'           : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].productionCapacityAvailable,
                            'UtilizationRate_1e'    : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].capacityUtilisationRate * 100,
                            'UtilizationRate_2e'    : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].capacityUtilisationRate * 100,
                            'UtilizationRate_3e'    : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].capacityUtilisationRate * 100,
                            'UtilizationRate_1h'    : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].capacityUtilisationRate * 100,
                            'UtilizationRate_2h'    : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].capacityUtilisationRate * 100,
                            'UtilizationRate_3h'    : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].capacityUtilisationRate * 100,
                            'FlexibilityMax_1e'     : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMax_2e'     : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMax_3e'     : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMax_1h'     : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'FlexibilityMax_2h'     : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'FlexibilityMax_3h'     : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'FlexibilityMin_1e'     : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMin_2e'     : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMin_3e'     : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].productionplanningFlexibility,
                            'FlexibilityMin_1h'     : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'FlexibilityMin_2h'     : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'FlexibilityMin_3h'     : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].productionplanningFlexibility,
                            'TradeSupport_1e'       : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].actualTradeSupport,
                            'TradeSupport_2e'       : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].actualTradeSupport,
                            'TradeSupport_3e'       : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].actualTradeSupport,
                            'TradeSupport_1h'       : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].actualTradeSupport,
                            'TradeSupport_2h'       : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].actualTradeSupport,
                            'TradeSupport_3h'       : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].actualTradeSupport,
                            'Negotiated_1e'         : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.ele].negotiatedTradeSupport,
                            'Negotiated_2e'         : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.ele].negotiatedTradeSupport,
                            'Negotiated_3e'         : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.ele].negotiatedTradeSupport,
                            'Negotiated_1h'         : data.supplierInfo[StaticValues.player.s1].categoryInfo[StaticValues.category.hea].negotiatedTradeSupport,
                            'Negotiated_2h'         : data.supplierInfo[StaticValues.player.s2].categoryInfo[StaticValues.category.hea].negotiatedTradeSupport,
                            'Negotiated_3h'         : data.supplierInfo[StaticValues.player.s3].categoryInfo[StaticValues.category.hea].negotiatedTradeSupport,
                        });
                        scope.data = myData[0];
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