define(['directives', 'services'], function(directives) {

    directives.directive('supplierOnlineStoreManagement', ['ProducerDecisionBase', 'ProducerDecision', 'Label', 'SeminarInfo', '$http', '$location', '$filter', 'PeriodInfo', '$q', 'PlayerInfo',
        function(ProducerDecisionBase, ProducerDecision, Label, SeminarInfo, $http, $location, $filter, PeriodInfo, $q, PlayerInfo) {
            return {
                scope: {
                    isPageShown: '=',
                    isPageLoading: '=',
                    selectedPlayer: '=',
                    selectedPeriod: '=',
                    isPortfolioDecisionCommitted:'=',
                    isContractDeal:'=',
                    isContractFinalized:'=',
                    isDecisionCommitted:'='
                },
                restrict: 'E',
                templateUrl: '../../partials/singleReportTemplate/SD_onlineStoreManagement.html',
                link: function(scope, element, attrs) {

                    var selectPacks = function() {
                        
                        var selected = $filter('filter')(scope.packs, {value: scope.serviceLevel});
                        return (scope.serviceLevel && selected.length) ? Label.getContent(selected[0].text) : Label.getContent('Not set');
                    };

                    var initializePage = function() {
                        console.log('initializePage some small...');
                        scope.isPageLoading = true;
                        scope.isResultShown = false;
                        scope.Label = Label;
                        scope.packs = [{
                            value: 1, text: 'SL_BASE'
                        },{
                            value: 2, text: 'SL_FAIR'
                        },{
                            value: 3, text: 'SL_MEDIUM'
                        },{
                            value: 4, text: 'SL_ENHANCED'
                        },{
                            value: 5, text: 'SL_PREMIUM'
                        }]; 

                        scope.currentPeriod = scope.selectedPeriod;
                        ProducerDecisionBase.reload({
                            producerID: parseInt(scope.selectedPlayer),
                            period: scope.selectedPeriod,
                            seminar: SeminarInfo.getSelectedSeminar().seminarCode
                        }).then(function(base) {
                            scope.pageBase = base;
                            scope.serviceLevel=scope.pageBase.serviceLevel;
                            if(scope.serviceLevel=="SL_BASE"){
                                scope.serviceLevel=1;
                            }else if(scope.serviceLevel=="SL_FAIR"){
                                scope.serviceLevel=2;
                            }else if(scope.serviceLevel=="SL_MEDIUM"){
                                scope.serviceLevel=3;
                            }else if(scope.serviceLevel=="SL_ENHANCED"){
                                scope.serviceLevel=4;
                            }else if(scope.serviceLevel=="SL_PREMIUM"){
                                scope.serviceLevel=5;
                            }
                            scope.selectPacks = selectPacks;
                        }).then(function() {
                            return showView();
                        }),
                        function(reason) {
                            console.log('from ctr: ' + reason);
                        },
                        function(update) {
                            console.log('from ctr: ' + update);
                        };
                    }


                    var loadSelectCategory = function(category) {
                        var d = $q.defer();
                        var count = 0;
                        var brands = new Array();
                        var allProCatDecisions = _.filter(scope.pageBase.proCatDecision, function(obj) {
                            if (category == "HealthBeauty") {
                                return (obj.categoryID == 2);
                            } else {
                                return (obj.categoryID == 1);
                            }
                        });
                        for (var i = 0; i < allProCatDecisions.length; i++) {
                            for (var j = 0; j < allProCatDecisions[i].proBrandsDecision.length; j++) {
                                if (allProCatDecisions[i].proBrandsDecision[j] != undefined && allProCatDecisions[i].proBrandsDecision[j].brandID != undefined && allProCatDecisions[i].proBrandsDecision[j].brandID != 0) {
                                    allProCatDecisions[i].proBrandsDecision[j].supportEmall = parseFloat(allProCatDecisions[i].proBrandsDecision[j].supportEmall).toFixed(2);
                                    for (var k = 0; k < allProCatDecisions[i].proBrandsDecision[j].proVarDecision.length; k++) {
                                        allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePlannedVolume = allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePlannedVolume.toFixed(2);
                                        allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePrice = allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].onlinePrice.toFixed(2);
                                        //allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Frequency=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Frequency.toFixed(2);
                                        //allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate=allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate.toFixed(2);
                                        if (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate >= 0 && allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate <= 1) {
                                            allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate = (allProCatDecisions[i].proBrandsDecision[j].proVarDecision[k].pricePromotions.promo_Rate * 100).toFixed(2);
                                        }
                                    }
                                    brands.push(allProCatDecisions[i].proBrandsDecision[j]);
                                    count++;
                                }
                            }
                        }
                        if (count != 0) {
                            result = 1;
                            d.resolve();
                        } else {
                            d.reject(Label.getContent('load brands fail'));
                        }
                        if (category == "Elecssories") {
                            scope.brandes = brands;
                        } else {
                            scope.brandhs = brands;
                        }
                    }

                    scope.checkData = function(category, brandName, location, tep, index, value) {
                        var d = $q.defer();
                        var categoryID, max, result, ContractExpend, reportExpend, producerExpend, availableBudgetLeft;
                        var filter = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a number'));
                        }
                        var url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            max = data.data.budgetAvailable;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/brandName/varName/ignoreItem/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;
                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(scope.selectedPlayer) + '/' + brandName + '/' + location + '/' + tep;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            producerExpend = data.data.result;
                            availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                            console.log(availableBudgetLeft);
                            if(value>availableBudgetLeft){
                                d.resolve(Label.getContent('Input range') + ':0~' + (Math.floor((availableBudgetLeft * 100) / 100)));
                            }else{
                                d.resolve();
                            }
                        }, function(data) {
                            d.resolve(Label.getContent('fail'));
                        });
                        return d.promise;
                    }

                    scope.checkOrderVolumes = function(category, brandName, varName, location, additionalIdx, index, value) {
                        var d = $q.defer();
                        var categoryID, production, result;
                        if (category == "Elecssories") {
                            category = 1;
                        } else {
                            category = 2;
                        }
                        var filter = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a number'));
                        }
                        var url = '/producerCurrentDecision/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/' + brandName + '/' + varName;
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            production = data.data.production;
                            url = '/SCR-ClosingInternetInventoryVolume/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/' + scope.selectedPlayer + '/' + brandName + '/' + varName;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            //result=data.result;
                            var limited = data.data.result + production;
                            if (value > limited) {
                                d.resolve(Label.getContent('Input range') + ':0~' + (Math.floor((limited * 100) / 100)));
                            } else {

                                d.resolve();
                            }
                        }, function(err) {
                            //if error comes from request to /SCR-ClosingInternetInventoryVolume/...
                            var limited = production;
                            if (value > limited) {
                                d.resolve(Label.getContent('Input range') + ':0~' + (Math.floor((limited * 100) / 100)));
                            } else {
                                d.resolve();
                            }
                        });
                        return d.promise;
                    }

                    scope.checkFrequency = function(category, brandName, varName, location, additionalIdx, index, pointer) {
                        var d = $q.defer();
                        var filter=/^\d+$/;
                        var value=pointer.$data;
                        var rate=pointer.$$nextSibling.$data;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a Integer'));
                        }
                        if (value > 26 || value < 0) {
                            d.resolve(Label.getContent('Input range') + ':0~26');
                        } else if (value == 0 && rate != 0) {
                            d.resolve(Label.getContent('check PromototionFrequency Error'));
                        } else {
                            d.resolve();
                        }
                        return d.promise;
                    }

                    scope.checkDepth = function(category, brandName, varName, location, additionalIdx, index, pointer) {
                        var d = $q.defer();
                        var filter = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        var value=pointer.$data;
                        var frequency=pointer.$$prevSibling.$data;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a number'));
                        }
                        if (value > 100 || value < 0) {
                            d.resolve(Label.getContent('Input range') + ':0~100');
                        } else if (value == 0 && frequency != 0) {
                            d.resolve(Label.getContent('check ReductionRate Error'));
                        } else {
                            d.resolve();
                        }
                        return d.promise;
                    }

                    scope.checkPrices = function(category, brandName, varName, location, additionalIdx, index, value) {
                        var d = $q.defer();
                        var categoryID = 0,
                            max = 0,
                            currentUnitCost = 0;
                        var url = "";
                        var filter = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                        if (!filter.test(value)) {
                            d.resolve(Label.getContent('Input a number'));
                        }
                        if (category == "Elecssories") {
                            categoryID = 1;
                        } else {
                            categoryID = 2;
                        }
                        var postData = {
                            period: scope.selectedPeriod,
                            seminar: SeminarInfo.getSelectedSeminar().seminarCode,
                            brandName: brandName,
                            varName: varName,
                            catID: categoryID,
                            userRole: 2,
                            userID: scope.selectedPlayer,
                        }
                        $http({
                            method: 'POST',
                            url: '/getCurrentUnitCost',
                            data: postData
                        }).then(function(data) {
                            scope.currentUnitCost = data.data.result;
                            url = '/getOneQuarterExogenousData/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + categoryID + '/1' + '/' + scope.selectedPeriod;
                            return $http({
                                method: 'GET',
                                url: url
                            })
                        }).then(function(data) {
                            if (value > data.data.MaxOnlinePriceVsCost * scope.currentUnitCost || value < data.data.MinOnlinePriceVsCost * scope.currentUnitCost) {
                                d.resolve(Label.getContent('Input range') + ':' + (Math.floor((data.data.MinOnlinePriceVsCost * scope.currentUnitCost * 100) / 100) )+ '~' + (Math.floor((data.data.MaxOnlinePriceVsCost * scope.currentUnitCost * 100) / 100)));
                            } else {
                                d.resolve();
                            }
                        }, function() {
                            d.resolve(Label.getContent('fail'));
                        })
                        return d.promise;
                    }

                    scope.checkServiceLevel = function(){
                        var d = $q.defer();
                        var categoryID, max, result, ContractExpend, reportExpend, producerExpend, availableBudgetLeft, location='serviceLevel',tep=0;
                        var url = "/companyHistoryInfo/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod - 1) + '/P/' + parseInt(scope.selectedPlayer);
                        $http({
                            method: 'GET',
                            url: url
                        }).then(function(data) {
                            max = data.data.budgetAvailable;
                            url = '/getContractExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/' + scope.selectedPlayer + '/brandName/varName/ignoreItem/1';
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            ContractExpend = data.data.result;
                            url = '/getPlayerReportOrderExpend/' + SeminarInfo.getSelectedSeminar().seminarCode + '/' + scope.selectedPeriod + '/P/' + scope.selectedPlayer;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            reportExpend = data.data.result;
                            url = "/producerExpend/" + SeminarInfo.getSelectedSeminar().seminarCode + '/' + (scope.selectedPeriod) + '/' + parseInt(scope.selectedPlayer) + '/' + 'brandName' + '/' + location + '/' + tep;
                            return $http({
                                method: 'GET',
                                url: url
                            });
                        }).then(function(data) {
                            producerExpend = data.data.result;
                            availableBudgetLeft = max - ContractExpend  - reportExpend - producerExpend;
                            console.log(availableBudgetLeft);
                            if(availableBudgetLeft<0){
                                d.resolve(Label.getContent('Service Level Error'));
                            }else{
                                d.resolve();
                            }
                        }, function(data) {
                            d.resolve(Label.getContent('fail'));
                        });
                        return d.promise;
                    }

                    scope.updateServiceLevel = function(value){
                        ProducerDecisionBase.setServiceLevel(scope.selectedPlayer,value,'supplierOnlineStoreManagement');

                    }

                    scope.updateBrandDecision = function(category, brandName, location, tep, index) {
                        var categoryID;
                        if (category == "Elecssories") {
                            categoryID = 1;
                            if (location == "supportTraditionalTrade" || location == "advertisingOffLine") {
                                ProducerDecisionBase.setProducerDecisionBrand(categoryID, brandName, location, tep, scope.brandes[index][location][tep],'supplierOnlineStoreManagement');
                            } else {
                                ProducerDecisionBase.setProducerDecisionBrand(categoryID, brandName, location, tep, scope.brandes[index][location],'supplierOnlineStoreManagement');
                            }
                        } else {
                            categoryID = 2;
                            if (location == "supportTraditionalTrade" || location == "advertisingOffLine") {
                                ProducerDecisionBase.setProducerDecisionBrand(categoryID, brandName, location, tep, scope.brandhs[index][location][tep],'supplierOnlineStoreManagement');
                            } else {
                                ProducerDecisionBase.setProducerDecisionBrand(categoryID, brandName, location, tep, scope.brandhs[index][location],'supplierOnlineStoreManagement');
                            }
                        }
                    }

                    scope.setOnlineVariant = function(category, brandName, varName, variant) {
                        var categoryID;
                        if (category == "Elecssories") {
                            categoryID = 1;
                        } else {
                            categoryID = 2;
                        }
                        ProducerDecisionBase.setOnlineVariant(categoryID, brandName, varName, variant, 'supplierOnlineStoreManagement');
                    }

                    var showView = function() {
                        var d = $q.defer();
                        loadSelectCategory('Elecssories');
                        loadSelectCategory('HealthBeauty');
                        scope.isResultShown = true;
                        scope.isPageLoading = false;
                        return d.promise;
                    }

                    scope.$watch('isPageShown', function(newValue, oldValue) {
                        if (newValue == true) {
                            initializePage();
                        }
                    });

                    scope.$on('producerDecisionBaseChangedFromServer', function(event, data, newBase) {
                        //decision base had been updated, re-render the page with newBase
                        if(data.page=="supplierOnlineStoreManagement"){
                            scope.pageBase = newBase;
                            showView();
                        }
                    });

                }
            }
        }
    ])
})