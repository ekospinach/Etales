define(['directives', 'services'], function(directives) {
    directives.directive('supplierNegotiations', ['Label', 'SeminarInfo', '$http', 'PeriodInfo', '$q', 'PlayerInfo', 'StaticValues',
        function(Label, SeminarInfo, $http, PeriodInfo, $q, PlayerInfo, StaticValues) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPeriod: '=',
                    selectedPlayer: '=',
                    producerShow: '='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SCR_supplierNegotiations.html',
                link: function(scope, element, attrs) {

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        getResult();
                    }

                    var getResult = function() {
                        var url = '/SCR-negotiations/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + parseInt(scope.selectedPlayer);
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

                    var loadValue = function(data, varName, brandName, retailer) {
                        var results = _.find(data, function(obj) {
                            return (obj.variantName == varName && obj.parentBrandName == brandName && obj.modernRetailerID == retailer);
                        })
                        return results.value;
                    }

                    var loadNegotiations = function(data, category, retailer, i) {
                        var varName, brandName, discount_MinimumVolume, discount_Rate, bonus_TargetVolume, bonus_Rate, bonus_Value, vnd_PaymentTerm, vnd_OtherCompensation, vnd_ContractHonoured;
                        brandName              = data.vnd_QuantityDiscount.discount_MinimumVolume[i].parentBrandName;
                        varName                = data.vnd_QuantityDiscount.discount_MinimumVolume[i].variantName;
                        discount_MinimumVolume = data.vnd_QuantityDiscount.discount_MinimumVolume[i].value;
                        discount_Rate          = loadValue(data.vnd_QuantityDiscount.discount_Rate, varName, brandName, retailer);
                        bonus_TargetVolume     = loadValue(data.vnd_TargetBonus.bonus_TargetVolume, varName, brandName, retailer);
                        bonus_Rate             = loadValue(data.vnd_TargetBonus.bonus_Rate, varName, brandName, retailer);
                        bonus_Value            = loadValue(data.vnd_TargetBonus.bonus_Value, varName, brandName, retailer);
                        vnd_PaymentTerm        = loadValue(data.vnd_PaymentTerms, varName, brandName, retailer);
                        vnd_OtherCompensation  = loadValue(data.vnd_OtherCompensation, varName, brandName, retailer);
                        vnd_ContractHonoured   = loadValue(data.vnd_ContractHonoured, varName, brandName, retailer);
                        if (vnd_ContractHonoured) {
                            vnd_ContractHonoured = "yes";
                        } else {
                            vnd_ContractHonoured = "no";
                        }
                        if (category == 1) {
                            if (retailer == 1) {
                                if (discount_MinimumVolume != undefined && discount_Rate != undefined && bonus_TargetVolume != undefined && bonus_Rate != undefined && bonus_Value != undefined && vnd_PaymentTerm != undefined & vnd_OtherCompensation != undefined && vnd_ContractHonoured != undefined) {
                                    scope.product1es.push({
                                        'fullName': brandName + varName,
                                        'discount_MinimumVolume': discount_MinimumVolume,
                                        'discount_Rate': discount_Rate,
                                        'bonus_TargetVolume': bonus_TargetVolume,
                                        'bonus_Rate': bonus_Rate,
                                        'bonus_Value': bonus_Value,
                                        'vnd_PaymentTerm': vnd_PaymentTerm,
                                        'vnd_OtherCompensation': vnd_OtherCompensation,
                                        'vnd_ContractHonoured': vnd_ContractHonoured
                                    });
                                }
                            } else {
                                if (discount_MinimumVolume != undefined && discount_Rate != undefined && bonus_TargetVolume != undefined && bonus_Rate != undefined && bonus_Value != undefined && vnd_PaymentTerm != undefined & vnd_OtherCompensation != undefined && vnd_ContractHonoured != undefined) {
                                    scope.product2es.push({
                                        'fullName': brandName + varName,
                                        'discount_MinimumVolume': discount_MinimumVolume,
                                        'discount_Rate': discount_Rate,
                                        'bonus_TargetVolume': bonus_TargetVolume,
                                        'bonus_Rate': bonus_Rate,
                                        'bonus_Value': bonus_Value,
                                        'vnd_PaymentTerm': vnd_PaymentTerm,
                                        'vnd_OtherCompensation': vnd_OtherCompensation,
                                        'vnd_ContractHonoured': vnd_ContractHonoured
                                    });
                                }
                            }
                        } else {
                            if (retailer == 1) {
                                if (discount_MinimumVolume != undefined && discount_Rate != undefined && bonus_TargetVolume != undefined && bonus_Rate != undefined && bonus_Value != undefined && vnd_PaymentTerm != undefined & vnd_OtherCompensation != undefined && vnd_ContractHonoured != undefined) {
                                    scope.product1hs.push({
                                        'fullName': brandName + varName,
                                        'discount_MinimumVolume': discount_MinimumVolume,
                                        'discount_Rate': discount_Rate,
                                        'bonus_TargetVolume': bonus_TargetVolume,
                                        'bonus_Rate': bonus_Rate,
                                        'bonus_Value': bonus_Value,
                                        'vnd_PaymentTerm': vnd_PaymentTerm,
                                        'vnd_OtherCompensation': vnd_OtherCompensation,
                                        'vnd_ContractHonoured': vnd_ContractHonoured
                                    });
                                }
                            } else {
                                if (discount_MinimumVolume != undefined && discount_Rate != undefined && bonus_TargetVolume != undefined && bonus_Rate != undefined && bonus_Value != undefined && vnd_PaymentTerm != undefined & vnd_OtherCompensation != undefined && vnd_ContractHonoured != undefined) {
                                    scope.product2hs.push({
                                        'fullName': brandName + varName,
                                        'discount_MinimumVolume': discount_MinimumVolume,
                                        'discount_Rate': discount_Rate,
                                        'bonus_TargetVolume': bonus_TargetVolume,
                                        'bonus_Rate': bonus_Rate,
                                        'bonus_Value': bonus_Value,
                                        'vnd_PaymentTerm': vnd_PaymentTerm,
                                        'vnd_OtherCompensation': vnd_OtherCompensation,
                                        'vnd_ContractHonoured': vnd_ContractHonoured
                                    });
                                }
                            }
                        }
                    }

                    var organiseArray = function(data) {
                        var deferred = $q.defer();
                        scope.product1es = [];
                        scope.product1hs = [];
                        scope.product2es = [];
                        scope.product2hs = [];
                        var varName, brandName, discount_MinimumVolume, discount_Rate, bonus_TargetVolume, bonus_Rate, bonus_Value, vnd_PaymentTerm, vnd_OtherCompensation, vnd_ContractHonoured;
                        data.vnd_QuantityDiscount.discount_MinimumVolume.forEach(function(singleData, index) {
                            if (singleData.parentCategoryID == 1) {
                                switch (singleData.modernRetailerID) {
                                    case 1:
                                        loadNegotiations(data, StaticValues.categoryID.ele, StaticValues.retailerID.r1, index);
                                        break;
                                    case 2:
                                        loadNegotiations(data, StaticValues.categoryID.ele, StaticValues.retailerID.r2, index);
                                        break;

                                }
                            } else {
                                switch (singleData.modernRetailerID) {
                                    case 1:
                                        loadNegotiations(data, StaticValues.categoryID.hea, StaticValues.retailerID.r1, index);
                                        break;
                                    case 2:
                                        loadNegotiations(data, StaticValues.categoryID.hea, StaticValues.retailerID.r2, index);
                                        break;

                                }
                            }
                        })
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
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })
                    scope.$watch('selectedPlayer', function(newValue, oldValue) {
                        if (newValue != oldValue && scope.isPageShown && scope.producerShow) {
                            initializePage();
                        }
                    })

                }
            }
        }
    ])
})