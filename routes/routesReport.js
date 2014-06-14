module.exports = function(app, io){
	//add generalReport record
	app.get('/addCrossSegmentSales',                                      require('./../api/models/GR_crossSegmentSales.js').addCrossSegmentSales);
	app.get('/addEmallPrices',                                            require('./../api/models/GR_emallPrices.js').addEmallPrices);
	app.get('/addMarketSales',                                            require('./../api/models/GR_marketSales.js').addMarketSales);
	app.get('/addMarketShare',                                            require('./../api/models/GR_marketShare.js').addMarketShare);
	app.get('/addPerformanceHighlights',                                  require('./../api/models/GR_performanceHighlights.js').addPerformanceHighlights);
	app.get('/addProductPortfolio',                                       require('./../api/models/GR_productPortfolio.js').addProductPortfolio);
	app.get('/addSegmentLeadership',                                      require('./../api/models/GR_segmentLeadership.js').addSegmentLeadership);
	
	//get generalReport record
	app.get('/crossSegmentSales/:seminar/:period',                        require('./../api/models/GR_crossSegmentSales.js').getCrossSegmentSales);
	app.get('/emallPrices/:seminar/:period',                              require('./../api/models/GR_emallPrices.js').getEmallPrices);
	app.get('/marketSales/:seminar/:period',                              require('./../api/models/GR_marketSales.js').getMarketSales);
	app.get('/marketShare/:seminar/:period',                              require('./../api/models/GR_marketShare.js').getMarketShare);
	app.get('/performanceHighlights/:seminar/:period',                    require('./../api/models/GR_performanceHighlights.js').getPerformanceHighlights);
	app.get('/productPortfolio/:seminar/:period',                         require('./../api/models/GR_productPortfolio.js').getProductPortfolio);
	app.get('/segmentLeadership/:seminar/:period',                        require('./../api/models/GR_segmentLeadership.js').getSegmentLeadership);
	
	//add producer report record
	app.get('/addSCR-consolidatedProfitAndLoss',                          require('./../api/models/SCR_consolidatedProfitAndLoss.js').addSCR_consolidatedProfitAndLoss);
	app.get('/addSCR-channelsProfitability',                              require('./../api/models/SCR_channelsProfitability.js').addSCR_channelsProfitability);
	app.get('/addSCR-inventoryVolumes',                                   require('./../api/models/SCR_inventoryVolumes.js').addSCR_inventoryVolumes);
	app.get('/addSCR-keyPerformanceIndicators',                           require('./../api/models/SCR_keyPerformanceIndicators.js').addSCR_keyPerformanceIndicators);
	app.get('/addSCR-negotiations',                                       require('./../api/models/SCR_negotiations.js').addSCR_negotiations);
	app.get('/addSCR-sharesCrossSegment',                                 require('./../api/models/SCR_sharesCrossSegment.js').addSCR_sharesCrossSegment);
	
	//get producer report record 
	app.get('/SCR-consolidatedProfitAndLoss/:seminar/:period/:producerID',require('./../api/models/SCR_consolidatedProfitAndLoss.js').getSCR_consolidatedProfitAndLoss);
	app.get('/SCR-channelsProfitability/:seminar/:period/:producerID',    require('./../api/models/SCR_channelsProfitability.js').getSCR_channelsProfitability);
	app.get('/SCR-inventoryVolumes/:seminar/:period/:producerID',         require('./../api/models/SCR_inventoryVolumes.js').getSCR_inventoryVolumes);
	app.get('/SCR-ClosingInternetInventoryVolume/:seminar/:period/:producerID/:brandName/:varName',         require('./../api/models/SCR_inventoryVolumes.js').getSCR_ClosingInternetInventoryVolume);
	
	app.get('/SCR-keyPerformanceIndicators/:seminar/:period/:producerID', require('./../api/models/SCR_keyPerformanceIndicators.js').getSCR_keyPerformanceIndicators);
	app.get('/SCR-negotiations/:seminar/:period/:producerID',             require('./../api/models/SCR_negotiations.js').getSCR_negotiations);
	app.get('/SCR-sharesCrossSegment/:seminar/:period/:producerID',       require('./../api/models/SCR_sharesCrossSegment.js').getSCR_sharesCrossSegment);
	
	//add retailer report record
	app.get('/addRCR-consolidatedProfitAndLoss',                          require('./../api/models/RCR_consolidatedProfitAndLoss.js').addRCR_consolidatedProfitAndLoss);
	app.get('/addRCR-inventoryVolumes',                                   require('./../api/models/RCR_inventoryVolumes.js').addRCR_inventoryVolumes);
	app.get('/addRCR-keyPerformanceIndicators',                           require('./../api/models/RCR_keyPerformanceIndicators.js').addRCR_keyPerformanceIndicators);
	app.get('/addRCR-negotiations',                                       require('./../api/models/RCR_negotiations.js').addRCR_negotiations);
	app.get('/addRCR-profitabilityBySupplier',                            require('./../api/models/RCR_profitabilityBySupplier.js').addRCR_profitabilityBySupplier);
	app.get('/addRCR-sharesCrossSegment',                                 require('./../api/models/RCR_sharesCrossSegment.js').addRCR_sharesCrossSegment);
	
	//get retailer report record
	app.get('/RCR-consolidatedProfitAndLoss/:seminar/:period/:retailerID',require('./../api/models/RCR_consolidatedProfitAndLoss.js').getRCR_consolidatedProfitAndLoss);
	app.get('/RCR-inventoryVolumes/:seminar/:period/:retailerID',         require('./../api/models/RCR_inventoryVolumes.js').getRCR_inventoryVolumes);
	app.get('/RCR-keyPerformanceIndicators/:seminar/:period/:retailerID', require('./../api/models/RCR_keyPerformanceIndicators.js').getRCR_keyPerformanceIndicators);
	app.get('/RCR-negotiations/:seminar/:period/:retailerID',             require('./../api/models/RCR_negotiations.js').getRCR_negotiations);
	app.get('/RCR-profitabilityBySupplier/:seminar/:period/:retailerID',  require('./../api/models/RCR_profitabilityBySupplier.js').getRCR_profitabilityBySupplier);
	app.get('/RCR-sharesCrossSegment/:seminar/:period/:retailerID',       require('./../api/models/RCR_sharesCrossSegment.js').getRCR_sharesCrossSegment);
	
	//add market report
	app.get('/addMR-awarenessEvolution',                                  require('./../api/models/MR_awarenessEvolution.js').addMR_awarenessEvolution);
	app.get('/addMR-sharesCrossSegment',                                  require('./../api/models/MR_sharesCrossSegment.js').addMR_sharesCrossSegment);
	app.get('/addMR-salesCrossSegment',                                   require('./../api/models/MR_salesCrossSegment.js').addMR_salesCrossSegment);
	app.get('/addMR-netMarketPrices',                                     require('./../api/models/MR_netMarketPrices.js').addMR_netMarketPrices);
	app.get('/addMR-pricePromotions',                                     require('./../api/models/MR_pricePromotions.js').addMR_pricePromotions);
	app.get('/addMR-suppliersIntelligence',                               require('./../api/models/MR_suppliersIntelligence.js').addMR_suppliersIntelligence);
	app.get('/addMR-variantPerceptionEvolution',                          require('./../api/models/MR_variantPerceptionEvolution.js').addMR_variantPerceptionEvolution);
	app.get('/addMR-retailerPerceptionEvolution',                         require('./../api/models/MR_retailerPerceptionEvolution.js').addMR_retailerPerceptionEvolution);
	app.get('/addMR-retailersIntelligence',                               require('./../api/models/MR_retailersIntelligence.js').addMR_retailersIntelligence);
	//get market report
	app.get('/getMR-awarenessEvolution/:seminar/:period',                 require('./../api/models/MR_awarenessEvolution.js').getMR_awarenessEvolution);
	app.get('/getMR-sharesCrossSegment/:seminar/:period',                 require('./../api/models/MR_sharesCrossSegment.js').getMR_sharesCrossSegment);
	app.get('/getMR-salesCrossSegment/:seminar/:period',                  require('./../api/models/MR_salesCrossSegment.js').getMR_salesCrossSegment);
	app.get('/getMR-netMarketPrices/:seminar/:period',                    require('./../api/models/MR_netMarketPrices.js').getMR_netMarketPrices);
	app.get('/getMR-pricePromotions/:seminar/:period',                    require('./../api/models/MR_pricePromotions.js').getMR_pricePromotions);
	app.get('/getMR-suppliersIntelligence/:seminar/:period',              require('./../api/models/MR_suppliersIntelligence.js').getMR_suppliersIntelligence);
	app.get('/getMR-variantPerceptionEvolution/:seminar/:period',         require('./../api/models/MR_variantPerceptionEvolution.js').getMR_variantPerceptionEvolution);
	app.get('/getMR-retailerPerceptionEvolution/:seminar/:period',        require('./../api/models/MR_retailerPerceptionEvolution.js').getMR_retailerPerceptionEvolution);
	app.get('/getMR-retailersIntelligence/:seminar/:period',              require('./../api/models/MR_retailersIntelligence.js').getMR_retailersIntelligence);
	app.get('/getMR-forecasts/:seminar/:period',                          require('./../api/models/MR_forecasts.js').getMR_forecasts);
	//bg_feedback
	app.get('/getFeedBack/:seminar/:period',							  require('./../api/models/BG_feedbackSlides.js').getFeedBack);
}

