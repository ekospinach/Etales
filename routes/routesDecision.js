module.exports = function(app, io){
    app.post('/producerDecision',                                                                           require('./../api/models/producerDecision.js').updateProducerDecision(io));
    app.post('/retailerDecision',                                                                           require('./../api/models/retailerDecision.js').updateRetailerDecision(io));
    app.get('/producerDecision/:producerID/:period/:seminar',                                               require('./../api/models/producerDecision.js').getAllProducerDecision);
    app.get('/producerProducts/:producerID/:period/:seminar/:categoryID',                                   require('./../api/models/producerDecision.js').getProducerProductList);
    app.get('/producerBrands/:producerID/:period/:seminar',                                                 require('./../api/models/producerDecision.js').getProducerBrandList);
    app.get('/getProductInfo/:producerID/:period/:seminar/:brandName',                                      require('./../api/models/producerDecision.js').getProductInfo);
    app.get('/retailerDecision/:retailerID/:period/:seminar',                                               require('./../api/models/retailerDecision.js').getAllRetailerDecision);
    app.get('/retailerProducts/:retailerID/:period/:seminar/:categoryID',                                   require('./../api/models/retailerDecision.js').getRetailerProductList);
    
    app.get('/variantHistoryInfo/:seminar/:period/:parentBrandName/:varName',                               require('./../api/models/variantHistoryInfo').getVariantHistory);
    //get brandHistory getPeriodBrandHistory
    app.get('/brandHistoryInfo/:seminar/:period/:brandName',                                                require('./../api/models/brandHistoryInfo.js').getBrandHistory);
    app.get('/brandHistoryInfo/:seminar/:period',                                                           require('./../api/models/brandHistoryInfo.js').getPeriodBrandHistory);
    
    app.get('/producerBrandDecision/:producerID/:period/:seminar/:brandName',                               require('./../api/models/producerDecision.js').getBrandHistory);
    //retailer get producerDecision
    app.get('/getProducerDecisionByVar/:producerID/:period/:seminar/:brandName/:varName',                   require('./../api/models/producerDecision.js').retailerGetProducerDecision);
    //retailer get retailerDecision
    app.get('/getRetailerDecisionByVar/:retailerID/:period/:seminar/:brandName/:varName',                   require('./../api/models/retailerDecision.js').retailerGetRetailerDecision);
    app.get('/companyHistoryInfo/:seminar/:period/:userType/:userID',                                       require('./../api/models/companyHistoryInfo.js').getCompanyHistory);
    //get companyHistory
    app.get('/producerCompanyDecision/:producerID/:period/:seminar/:categoryID',                            require('./../api/models/producerDecision.js').getCompanyHistory);
    app.get('/quarterHistoryInfo/:seminar/:period',                                                         require('./../api/models/quarterHistoryInfo.js').getQuarterHistory);
    
    
    //producer check
    app.get('/productionResult/:seminar/:period/:producerID/:brandName/:varName',                           require('./../api/models/producerDecision.js').getProductionResult);
    app.get('/producerCurrentDecision/:seminar/:period/:producerID/:brandName/:varName',                    require('./../api/models/producerDecision.js').getProducerCurrentDecision);
    app.get('/checkProducerProduct/:seminar/:period/:producerID/:categoryID/:checkType/:brandName/:varName',require('./../api/models/producerDecision.js').checkProducerProduct);
    app.get('/producerExpend/:seminar/:period/:producerID/:brandName/:location/:additionalIdx',             require('./../api/models/producerDecision.js').getProducerExpend);

    app.get('/checkContract/:contractCode',                                                                 require('./../api/models/contract.js').checkContract);
    app.get('/producerVariantBM/:seminar/:period/:producerID/:categoryID/:brandName/:varName',              require('./../api/models/producerDecision.js').getProducerVariantBM);
    //retailer check
    app.get('/retailerExpend/:seminar/:period/:retailerID/:marketID/:location/:additionalIdx',              require('./../api/models/retailerDecision.js').getRetailerExpend);
    app.get('/retailerShelfSpace/:seminar/:period/:retailerID/:marketID/:categoryID/:brandName/:varName',   require('./../api/models/retailerDecision.js').getRetailerShelfSpace);
    app.get('/checkRetailerProduct/:seminar/:period/:retailerID/:categoryID/:checkType/:brandName/:varName',require('./../api/models/retailerDecision.js').checkRetailerProduct);
    app.get('/retailerCurrentDecision/:seminar/:period/:retailerID/:brandName/:varName',                    require('./../api/models/retailerDecision.js').getRetailerCurrentDecision);
    
    //special calculate API
    app.post('/getCurrentUnitCost',                                                                         require('./../api/utils/unitCost').getCurrentUnitCost);
    app.get('/currentPeriod/:seminar',                                                                      require('./../api/models/seminar.js').getCurrentPeriod);
    app.get('/getScrplSales/:seminar/:period/:producerID/:categoryID',                                      require('./../api/models/SCR_consolidatedProfitAndLoss.js').getScrplSales);
    
    app.get('/getRcrplSales/:seminar/:period/:retailerID/:categoryID/:marketID',                            require('./../api/models/RCR_consolidatedProfitAndLoss.js').getRcrplSales);
    app.get('/getSalesVolume/:seminar/:period/:retailerID/:categoryID',                                     require('./../api/models/RCR_consolidatedProfitAndLoss.js').getSalesVolume);
    app.get('/getMarketSize/:seminar/:period/:retailerID/:categoryID',                                      require('./../api/models/RCR_consolidatedProfitAndLoss.js').getMarketSize);
    
    
    //Negotiation 
    app.post('/addContract',                                                                                require('./../api/models/contract.js').addContract(io));
    app.post('/addContractDetails',                                                                         require('./../api/models/contract.js').addContractDetails(io));
    app.get('/getContractDetails/:contractCode',                                                            require('./../api/models/contract.js').getContractDetails);
    app.get('/getNegotiationExpend/:contractCode/:parentBrandName/:variantName',                            require('./../api/models/contract.js').getNegotiationExpend);//salesVolume 
    app.get('/getContractExpend/:seminar/:period/:producerID/:retailerID/:parentBrandName/:variantName',    require('./../api/models/contract.js').getContractExpend);//SalesTargetVolume
    
    app.get('/checkContractDetails/:contractCode/:parentBrandName/:variantName/:location',                  require('./../api/models/contract.js').checkContractDetails);
    app.get('/checkVolume/:contractCode/:parentBrandName/:variantName',                                     require('./../api/models/contract.js').checkVolume);
    app.get('/checkSalesTargetVolume/:contractCode/:parentBrandName/:variantName',                          require('./../api/models/contract.js').checkSalesTargetVolume);
    app.post('/updateContractDetails',                                                                      require('./../api/models/contract.js').updateContractDetails(io));
    app.post('/removeContract',                                                                             require('./../api/models/contract.js').removeContract(io));
    app.post('/removeContractDetailsByContractCode',                                                        require('./../api/models/contract.js').removeContractDetailsByContractcode(io));


};