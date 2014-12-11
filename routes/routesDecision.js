module.exports = function(app, io){
    app.post('/producerDecision',                                                                           require('./../api/models/producerDecision.js').updateProducerDecision(io));
    app.get('/producerDecision/:producerID/:period/:seminar',                                               require('./../api/models/producerDecision.js').getAllProducerDecision);
    app.get('/producerProducts/:producerID/:period/:seminar/:categoryID',                                   require('./../api/models/producerDecision.js').getProducerProductList);
    app.get('/producerBrands/:producerID/:period/:seminar',                                                 require('./../api/models/producerDecision.js').getProducerBrandList);
    app.get('/getProductInfo/:producerID/:period/:seminar/:brandName',                                      require('./../api/models/producerDecision.js').getProductInfo);
    app.get('/producerBrandDecision/:producerID/:period/:seminar/:brandName',                               require('./../api/models/producerDecision.js').getBrandHistory);

    //retailer get producerDecision
    app.get('/getProducerDecisionByVar/:producerID/:period/:seminar/:brandName/:varName',                   require('./../api/models/producerDecision.js').retailerGetProducerDecision);
    //producer check
    app.get('/productionResult/:seminar/:period/:producerID/:brandName/:varName',                           require('./../api/models/producerDecision.js').getProductionResult);
    app.get('/producerCurrentDecision/:seminar/:period/:producerID/:brandName/:varName',                    require('./../api/models/producerDecision.js').getProducerCurrentDecision);
    app.get('/checkProducerProduct/:seminar/:period/:producerID/:categoryID/:checkType/:brandName/:varName',require('./../api/models/producerDecision.js').checkProducerProduct);
    app.get('/producerVariantBM/:seminar/:period/:producerID/:categoryID/:brandName/:varName',              require('./../api/models/producerDecision.js').getProducerVariantBM);
    

    app.post('/retailerDecision',                                                                           require('./../api/models/retailerDecision.js').updateRetailerDecision(io));
    //retailer get retailerDecision
    app.get('/getRetailerDecisionByVar/:retailerID/:period/:seminar/:brandName/:varName',                   require('./../api/models/retailerDecision.js').retailerGetRetailerDecision);
    app.get('/retailerDecision/:retailerID/:period/:seminar',                                               require('./../api/models/retailerDecision.js').getAllRetailerDecision);
    app.get('/retailerProducts/:retailerID/:period/:seminar/:categoryID',                                   require('./../api/models/retailerDecision.js').getRetailerProductList);
    app.post('/deleteOrderData',                                                                            require('./../api/models/retailerDecision.js').deleteOrderData(io));    
    
    //app.get('/variantHistoryInfo/:seminar/:period/:parentBrandName/:varName',                               require('./../api/models/variantHistoryInfo').getVariantHistory);
    //get brandHistory getPeriodBrandHistory
    // app.get('/brandHistoryInfo/:seminar/:period/:brandName',                                                require('./../api/models/brandHistoryInfo.js').getBrandHistory);
    // app.get('/brandHistoryInfo/:seminar/:period',                                                           require('./../api/models/brandHistoryInfo.js').getPeriodBrandHistory);
    
    app.get('/companyHistoryInfo/:seminar/:period/:userType/:userID',                                       require('./../api/models/companyHistoryInfo.js').getCompanyHistory);
    //get companyHistory
    app.get('/producerCompanyDecision/:producerID/:period/:seminar/:categoryID',                            require('./../api/models/producerDecision.js').getCompanyHistory);
    app.get('/quarterHistoryInfo/:seminar/:period',                                                         require('./../api/models/quarterHistoryInfo.js').getQuarterHistory);
    

    app.get('/checkContract/:contractCode',                                                                 require('./../api/models/contract.js').checkContract);
    //retailer check
    app.get('/retailerShelfSpace/:seminar/:period/:retailerID/:marketID/:categoryID/:brandName/:varName',   require('./../api/models/retailerDecision.js').getRetailerShelfSpace);
    app.get('/checkRetailerProduct/:seminar/:period/:retailerID/:categoryID/:checkType/:brandName/:varName',require('./../api/models/retailerDecision.js').checkRetailerProduct);
    app.get('/retailerCurrentDecision/:seminar/:period/:retailerID/:brandName/:varName',                    require('./../api/models/retailerDecision.js').getRetailerCurrentDecision);
    
    //special calculate API
    app.post('/getCurrentUnitCost',                                                                         require('./../api/utils/unitCost').getCurrentUnitCost);
    app.get('/getReportPrice/:seminar/:period',                                                             require('./../api/models/BG_oneQuarterExogenousData.js').getReportPrice);
    app.get('/getSeminarReportPurchaseStatus/:seminar/:period/:type/:playerID',                             require('./../api/models/seminar.js').getSeminarReportPurchaseStatus);
    app.get('/seminarInfo/:seminar',                                                                        require('./../api/models/seminar.js').getSeminarInfo);
    app.get('/getScrplSales/:seminar/:period/:producerID/:categoryID',                                      require('./../api/models/SCR_consolidatedProfitAndLoss.js').getScrplSales);
    
    app.get('/getRcrplSales/:seminar/:period/:retailerID/:categoryID/:marketID',                            require('./../api/models/RCR_consolidatedProfitAndLoss.js').getRcrplSales);
    app.get('/getSalesVolume/:seminar/:period/:retailerID/:categoryID',                                     require('./../api/models/RCR_consolidatedProfitAndLoss.js').getSalesVolume);
    app.get('/getMarketSize/:seminar/:period/:retailerID/:categoryID',                                      require('./../api/models/RCR_consolidatedProfitAndLoss.js').getMarketSize);
    
    //Negotiation 
    app.post('/addContract',                                                                                require('./../api/models/contract.js').addContract(io));
    app.post('/addContractDetails',                                                                         require('./../api/models/contract.js').addContractDetails(io));
    app.post('/dealContractDetail',                                                                         require('./../api/models/contract.js').dealContractDetail(io));
    app.post('/finalizedContractDetail',                                                                    require('./../api/models/contract.js').finalizedContractDetail(io));
    
    app.get('/getContractDetails/:contractCode',                                                            require('./../api/models/contract.js').getContractDetails);
    app.get('/getContractUnApprovedDetails/:contractCode',                                                  require('./../api/models/contract.js').getContractUnApprovedDetails);
    app.get('/getContractDetail/:contractCode/:brandName/:varName',                                         require('./../api/models/contract.js').getContractDetail);
    
    
    //Check if selected contract details has been lock(both side choose agree)    
    //return { "result" : true, "doc" : contractDetails} : Locked
    //return { "result" : false, "doc" : contractDetails}  : not Locked
    app.get('/checkContractDetailsLockStatus/:contractCode/:parentBrandName/:variantName/:location',        require('./../api/models/contract.js').checkContractDetailsLockStatus);

    //Check if nc_MinimumOrder = 0
    //if 0, return true
    //if not 0, return false
    app.get('/checkVolume/:contractCode/:parentBrandName/:variantName',                                     require('./../api/models/contract.js').checkVolume);

    //Check if user has commit Sales target volume decision( nc_SalesTarget <> 0)
    app.get('/checkSalesTargetVolume/:contractCode/:parentBrandName/:variantName',                          require('./../api/models/contract.js').checkSalesTargetVolume);

    app.post('/updateContractDetails',                                                                      require('./../api/models/contract.js').updateContractDetails(io));
    app.post('/removeContract',                                                                             require('./../api/models/contract.js').removeContract(io));
    app.post('/removeContractDetailsByContractCode',                                                        require('./../api/models/contract.js').removeContractDetailsByContractcode(io));

    //Check if supplier has submitted portfolio decision 
    app.get('/checkProducerDecisionStatus/:seminar/:period/:producerID',                                    require('./../api/models/seminar.js').checkProducerDecisionStatus);  
    app.get('/checkRetailerDecisionStatus/:seminar/:period/:retailerID',                                    require('./../api/models/seminar.js').checkRetailerDecisionStatus);

    //check if TimerActived return  result include IsTimerActived and timeslot...
    app.get('/getTimerActiveInfo/:seminar',                                                                 require('./../api/models/seminar.js').getTimerActiveInfo);

    //Submit supplier research order decision
    app.post('/submitOrder',                                                                                require('./../api/models/seminar.js').submitOrder(io));

    
    app.post('/submitPortfolioDecision',                                         require('./../api/models/seminar.js').submitPortfolioDecision(io));
    app.post('/submitContractDeal',                                              require('./../api/models/seminar.js').submitContractDeal(io));
    app.post('/submitContractFinalized',                                         require('./../api/models/seminar.js').submitContractFinalized(io));
    app.post('/submitFinalDecision',                                             require('./../api/models/seminar.js').submitFinalDecision(io));

    app.get('/getOneQuarterExogenousData/:seminar/:categoryID/:marketID/:period',        require('./../api/models/BG_oneQuarterExogenousData.js').getOneQuarterExogenousData);

    //========== Spending calculation API =======================    
//    app.get('/availableBudgetLeft/:seminar/:period/:role/:playerID/:brandName/:varName/:marketID/:location/:additionalIdx', );

    //Marketing Spending includes:
    //1 - General Marketing - Advertising
    //2 - Market Research 
    app.get('/producerMarketingSpending/:seminar/:period/:producerID', require('./../api/models/producerDecision.js').getMarketingSpending);
    
    //Trade Support Spending
    //1 - All the Negotiation Cost
    //2 - General Marketing - Traditional Trade Support 
    //3 - All the cost happen in page "Online Store management" AKA Visibility + Promotion Cost
    app.get('/producerTradeSupportSpending/:seminar/:period/:producerID', require('./../api/models/producerDecision.js').getTradeSupportSpending);

    app.get('/producerExpend/:seminar/:period/:producerID/:brandName/:location/:additionalIdx', require('./../api/models/producerDecision.js').getProducerExpend);

    app.get('/retailerExpend/:seminar/:period/:retailerID/:marketID/:location/:additionalIdx', require('./../api/models/retailerDecision.js').getRetailerExpend);

    app.get('/getPlayerReportOrderExpend/:seminar/:period/:userType/:playerID', require('./../api/models/BG_oneQuarterExogenousData.js').getPlayerReportOrderExpend);    
    
    //calculate how much per contractCode cost AKA supplier have to pay for in current period(Volume Discount/Other compensation) or next period(Performance Bonus), Lock supplier's budget for current period by estimated cost
    //ignoreItem : volumeDiscount/performanceBonus/otherCopensation
    app.get('/getContractExpend/:seminar/:period/:producerID/:parentBrandName/:variantName/:ignoreItem/:ignoreRetailerID', require('./../api/models/contract.js').getContractExpend); 
 
    //Get sum of minimum order of rest product under same category, same contractCode
    app.get('/getAgreedProductionVolume/:seminar/:period/:producerID/:parentBrandName/:variantName',                            require('./../api/models/contract.js').getAgreedProductionVolume);

    //Get retailer additional budget from Supplier of current period(other compensation + volume discount )
    app.get('/getRetailerAdditionalBudget/:seminar/:period/:retailerID',        require('./../api/models/contract.js').getRetailerAdditionalBudget); 

    //app.get('/timer', require('./../api/models/seminar').setTimer(io));
    app.post('/timer', require('./../api/models/seminar').setTimer(io));


};