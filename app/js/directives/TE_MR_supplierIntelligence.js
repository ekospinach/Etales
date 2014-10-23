define(['directives', 'services'], function(directives){

    directives.directive('marketSupplierIntelligence', ['Label','SeminarInfo','$http','PeriodInfo','$q', function(Label, SeminarInfo, $http, PeriodInfo, $q){
        return {
            scope : {
                isPageShown : '=',
                isPageLoading : '=',
                selectedPeriod : '='
            },
            restrict : 'E',
            templateUrl : '../../partials/singleReportTemplate/MR_supplierIntelligence.html',            
            link : function(scope, element, attrs){                                                                
                var initializePage = function(){
                    scope.isPageLoading = true;
                    scope.isResultShown = false;                    
                    scope.Label = Label;
                    getResult();                    
                }

                var getResult =function(){
                    var url='/getMR-suppliersIntelligence/'+SeminarInfo.getSelectedSeminar().seminarCode+'/'+scope.selectedPeriod;
                    $http({
                        method:'GET',
                        url:url,
                        //tracker: scope.loadingTracker
                    }).then(function(data){   
                        return organiseArray(data.data[0]);
                    }).then(function(data){
                        scope.isResultShown = true;
                        scope.isPageLoading = false;                                                                         
                    },function(){
                        console.log('fail');
                    });
                }

                var organiseArray = function(data){
                    var deferred = $q.defer();
                    var myData=new Array();
                    myData.push({
                        /*
                            XXXXXXX_playerCategory: data.supplierInfo[player-1].categoryInfo[category-1].XXXXXXX
                        */

                        'AdvertisingOnline_1e':data.supplierInfo[0].categoryInfo[0].advertisingOnLine,
                        'AdvertisingOnline_2e':data.supplierInfo[1].categoryInfo[0].advertisingOnLine,
                        'AdvertisingOnline_3e':data.supplierInfo[2].categoryInfo[0].advertisingOnLine,
                        'AdvertisingOnline_1h':data.supplierInfo[0].categoryInfo[1].advertisingOnLine,
                        'AdvertisingOnline_2h':data.supplierInfo[1].categoryInfo[1].advertisingOnLine,
                        'AdvertisingOnline_3h':data.supplierInfo[2].categoryInfo[1].advertisingOnLine,
                        'AdvertisingOffline_1e':data.supplierInfo[0].categoryInfo[0].advertisingOffLine,
                        'AdvertisingOffline_2e':data.supplierInfo[1].categoryInfo[0].advertisingOffLine,
                        'AdvertisingOffline_3e':data.supplierInfo[2].categoryInfo[0].advertisingOffLine,
                        'AdvertisingOffline_1h':data.supplierInfo[0].categoryInfo[1].advertisingOffLine,
                        'AdvertisingOffline_2h':data.supplierInfo[1].categoryInfo[1].advertisingOffLine,
                        'AdvertisingOffline_3h':data.supplierInfo[2].categoryInfo[1].advertisingOffLine,
                        'OnLineVisibility_1e':data.supplierInfo[0].categoryInfo[0].onLineVisibility,
                        'OnLineVisibility_2e':data.supplierInfo[1].categoryInfo[0].onLineVisibility,
                        'OnLineVisibility_3e':data.supplierInfo[2].categoryInfo[0].onLineVisibility,
                        'OnLineVisibility_1h':data.supplierInfo[0].categoryInfo[1].onLineVisibility,
                        'OnLineVisibility_2h':data.supplierInfo[1].categoryInfo[1].onLineVisibility,
                        'OnLineVisibility_3h':data.supplierInfo[2].categoryInfo[1].onLineVisibility,
                        'OnLineOther_1e':data.supplierInfo[0].categoryInfo[0].onLineOther,
                        'OnLineOther_2e':data.supplierInfo[1].categoryInfo[0].onLineOther,
                        'OnLineOther_3e':data.supplierInfo[2].categoryInfo[0].onLineOther,
                        'OnLineOther_1h':data.supplierInfo[0].categoryInfo[1].onLineOther,
                        'OnLineOther_2h':data.supplierInfo[1].categoryInfo[1].onLineOther,
                        'OnLineOther_3h':data.supplierInfo[2].categoryInfo[1].onLineOther,
                        'TechnologyLevel_1e':data.supplierInfo[0].categoryInfo[0].acquiredTechnologyLevel,
                        'TechnologyLevel_2e':data.supplierInfo[1].categoryInfo[0].acquiredTechnologyLevel,
                        'TechnologyLevel_3e':data.supplierInfo[2].categoryInfo[0].acquiredTechnologyLevel,
                        'TechnologyLevel_1h':data.supplierInfo[0].categoryInfo[1].acquiredTechnologyLevel,
                        'TechnologyLevel_2h':data.supplierInfo[1].categoryInfo[1].acquiredTechnologyLevel,
                        'TechnologyLevel_3h':data.supplierInfo[2].categoryInfo[1].acquiredTechnologyLevel,
                        'DesignLevel_1e':data.supplierInfo[0].categoryInfo[0].acquiredDesignLevel,
                        'DesignLevel_2e':data.supplierInfo[1].categoryInfo[0].acquiredDesignLevel,
                        'DesignLevel_3e':data.supplierInfo[2].categoryInfo[0].acquiredDesignLevel,
                        'DesignLevel_1h':data.supplierInfo[0].categoryInfo[1].acquiredDesignLevel,
                        'DesignLevel_2h':data.supplierInfo[1].categoryInfo[1].acquiredDesignLevel,
                        'DesignLevel_3h':data.supplierInfo[2].categoryInfo[1].acquiredDesignLevel,
                        'Capacity_1e':data.supplierInfo[0].categoryInfo[0].productionCapacityAvailable,
                        'Capacity_2e':data.supplierInfo[1].categoryInfo[0].productionCapacityAvailable,
                        'Capacity_3e':data.supplierInfo[2].categoryInfo[0].productionCapacityAvailable,
                        'Capacity_1h':data.supplierInfo[0].categoryInfo[1].productionCapacityAvailable,
                        'Capacity_2h':data.supplierInfo[1].categoryInfo[1].productionCapacityAvailable,
                        'Capacity_3h':data.supplierInfo[2].categoryInfo[1].productionCapacityAvailable,
                        'UtilizationRate_1e':data.supplierInfo[0].categoryInfo[0].capacityUtilisationRate*100,
                        'UtilizationRate_2e':data.supplierInfo[1].categoryInfo[0].capacityUtilisationRate*100,
                        'UtilizationRate_3e':data.supplierInfo[2].categoryInfo[0].capacityUtilisationRate*100,
                        'UtilizationRate_1h':data.supplierInfo[0].categoryInfo[1].capacityUtilisationRate*100,
                        'UtilizationRate_2h':data.supplierInfo[1].categoryInfo[1].capacityUtilisationRate*100,
                        'UtilizationRate_3h':data.supplierInfo[2].categoryInfo[1].capacityUtilisationRate*100,
                        'FlexibilityMax_1e':data.supplierInfo[0].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMax_2e':data.supplierInfo[1].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMax_3e':data.supplierInfo[2].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMax_1h':data.supplierInfo[0].categoryInfo[1].productionplanningFlexibility,
                        'FlexibilityMax_2h':data.supplierInfo[1].categoryInfo[1].productionplanningFlexibility,
                        'FlexibilityMax_3h':data.supplierInfo[2].categoryInfo[1].productionplanningFlexibility,
                        'FlexibilityMin_1e':data.supplierInfo[0].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMin_2e':data.supplierInfo[1].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMin_3e':data.supplierInfo[2].categoryInfo[0].productionplanningFlexibility,
                        'FlexibilityMin_1h':data.supplierInfo[0].categoryInfo[1].productionplanningFlexibility,
                        'FlexibilityMin_2h':data.supplierInfo[1].categoryInfo[1].productionplanningFlexibility,
                        'FlexibilityMin_3h':data.supplierInfo[2].categoryInfo[1].productionplanningFlexibility,
                        'TradeSupport_1e':data.supplierInfo[0].categoryInfo[0].actualTradeSupport,
                        'TradeSupport_2e':data.supplierInfo[1].categoryInfo[0].actualTradeSupport,
                        'TradeSupport_3e':data.supplierInfo[2].categoryInfo[0].actualTradeSupport,
                        'TradeSupport_1h':data.supplierInfo[0].categoryInfo[1].actualTradeSupport,
                        'TradeSupport_2h':data.supplierInfo[1].categoryInfo[1].actualTradeSupport,
                        'TradeSupport_3h':data.supplierInfo[2].categoryInfo[1].actualTradeSupport,
                        'Negotiated_1e':data.supplierInfo[0].categoryInfo[0].negotiatedTradeSupport,
                        'Negotiated_2e':data.supplierInfo[1].categoryInfo[0].negotiatedTradeSupport,
                        'Negotiated_3e':data.supplierInfo[2].categoryInfo[0].negotiatedTradeSupport,
                        'Negotiated_1h':data.supplierInfo[0].categoryInfo[1].negotiatedTradeSupport,
                        'Negotiated_2h':data.supplierInfo[1].categoryInfo[1].negotiatedTradeSupport,
                        'Negotiated_3h':data.supplierInfo[2].categoryInfo[1].negotiatedTradeSupport,
                    });
                    scope.data=myData[0];
                    deferred.resolve({msg:'Array is ready.'});                    
                    return deferred.promise;
                }


                scope.$watch('isPageShown', function(newValue, oldValue){
                    if(newValue==true) {
                        initializePage();
                    }
                })
                scope.$watch('selectedPeriod', function(newValue, oldValue){
                    if(newValue!=oldValue&&scope.isPageShown) {
                        initializePage();
                    }
                })

            }
        }
    }])
})