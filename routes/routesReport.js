module.exports = function(app, io){

	app.get('/grBrandPerspective/:seminar/:period',						  require('./../api/models/GR_performanceHighlights.js').getBrandPerspective);
	app.get('/grChannelPerspective/:seminar/:period',					  require('./../api/models/GR_performanceHighlights.js').getChannelPerspective);
	
	//get generalReport record
	app.get('/crossSegmentSales/:seminar/:period',                        require('./../api/models/GR_crossSegmentSales.js').getCrossSegmentSales);
	app.get('/emallPrices/:seminar/:period',                              require('./../api/models/GR_emallPrices.js').getEmallPrices);
	app.get('/marketSales/:seminar/:period',                              require('./../api/models/GR_marketSales.js').getMarketSales);
	app.get('/marketShare/:seminar/:period',                              require('./../api/models/GR_marketShare.js').getMarketShare);
	app.get('/performanceHighlights/:seminar/:period',                    require('./../api/models/GR_performanceHighlights.js').getPerformanceHighlights);
	app.get('/productPortfolio/:seminar/:period',                         require('./../api/models/GR_productPortfolio.js').getProductPortfolio);
	app.get('/segmentLeadership/:seminar/:period/:categoryID',            require('./../api/models/GR_segmentLeadership.js').getSegmentLeadership);
	
	
	//get producer report record 
	app.get('/SCR-consolidatedProfitAndLoss/:seminar/:period/:producerID',require('./../api/models/SCR_consolidatedProfitAndLoss.js').getSCR_consolidatedProfitAndLoss);
	app.get('/SCR-channelsProfitability/:seminar/:period/:producerID',    require('./../api/models/SCR_channelsProfitability.js').getSCR_channelsProfitability);
	app.get('/SCR-inventoryVolumes/:seminar/:period/:producerID',         require('./../api/models/SCR_inventoryVolumes.js').getSCR_inventoryVolumes);
	app.get('/SCR-ClosingTotalInventoryVolume/:seminar/:period/:producerID/:brandName/:varName',         require('./../api/models/SCR_inventoryVolumes.js').getSCR_ClosingTotalInventoryVolume);
	
	app.get('/SCR-keyPerformanceIndicators/:seminar/:period/:producerID', require('./../api/models/SCR_keyPerformanceIndicators.js').getSCR_keyPerformanceIndicators);
	app.get('/SCR-negotiations/:seminar/:period/:producerID',             require('./../api/models/SCR_negotiations.js').getSCR_negotiations);
	app.get('/SCR-sharesCrossSegment/:seminar/:period/:producerID',       require('./../api/models/SCR_sharesCrossSegment.js').getSCR_sharesCrossSegment);
	
	
	//get retailer report record
	app.get('/RCR-consolidatedProfitAndLoss/:seminar/:period/:retailerID',require('./../api/models/RCR_consolidatedProfitAndLoss.js').getRCR_consolidatedProfitAndLoss);
	app.get('/RCR-inventoryVolumes/:seminar/:period/:retailerID',         require('./../api/models/RCR_inventoryVolumes.js').getRCR_inventoryVolumes);
	app.get('/RCR-keyPerformanceIndicators/:seminar/:period/:retailerID', require('./../api/models/RCR_keyPerformanceIndicators.js').getRCR_keyPerformanceIndicators);
	app.get('/RCR-negotiations/:seminar/:period/:retailerID',             require('./../api/models/RCR_negotiations.js').getRCR_negotiations);
	app.get('/RCR-profitabilityBySupplier/:seminar/:period/:retailerID',  require('./../api/models/RCR_profitabilityBySupplier.js').getRCR_profitabilityBySupplier);
	app.get('/RCR-sharesCrossSegment/:seminar/:period/:retailerID',       require('./../api/models/RCR_sharesCrossSegment.js').getRCR_sharesCrossSegment);
	
	//get market report
    app.get('/getSupplierReportPurchaseStatus/:seminar/:period/:producerID',                             require('./../api/models/producerDecision.js').getReportPurchaseStatus);
    app.get('/getRetailerReportPurchaseStatus/:seminar/:period/:retailerID',                             require('./../api/models/retailerDecision.js').getReportPurchaseStatus);
	
	app.get('/getMR-awarenessEvolution/:seminar/:period',                 require('./../api/models/MR_awarenessEvolution.js').getMR_awarenessEvolution);
	app.get('/getMR-sharesCrossSegment/:seminar/:period',                 require('./../api/models/MR_sharesCrossSegment.js').getMR_sharesCrossSegment);
	app.get('/getMR-salesCrossSegment/:seminar/:period',                  require('./../api/models/MR_salesCrossSegment.js').getMR_salesCrossSegment);
	app.get('/getMR-salesByChannel/:seminar/:period',                     require('./../api/models/MR_salesByChannel.js').getMR_salesByChannel);
	app.get('/getMR-netMarketPrices/:seminar/:period',                    require('./../api/models/MR_netMarketPrices.js').getMR_netMarketPrices);
	app.get('/getMR-pricePromotions/:seminar/:period',                    require('./../api/models/MR_pricePromotions.js').getMR_pricePromotions);
	app.get('/getMR-suppliersIntelligence/:seminar/:period',              require('./../api/models/MR_suppliersIntelligence.js').getMR_suppliersIntelligence);
	app.get('/getMR-variantPerceptionEvolution/:seminar/:period',         require('./../api/models/MR_variantPerceptionEvolution.js').getMR_variantPerceptionEvolution);
	app.get('/getMR-retailerPerceptionEvolution/:seminar/:period',        require('./../api/models/MR_retailerPerceptionEvolution.js').getMR_retailerPerceptionEvolution);
	app.get('/getMR-retailersIntelligence/:seminar/:period',              require('./../api/models/MR_retailersIntelligence.js').getMR_retailersIntelligence);
	app.get('/getMR-forecasts/:seminar/:period',                          require('./../api/models/MR_forecasts.js').getMR_forecasts);
	app.get('/getMR-webTrawlerScores/:seminar/:period',                   require('./../api/models/MR_webTrawlerScores.js').getMR_webTrawlerScores);

	//bg_feedback
	app.get('/getFeedBack/:seminar/:period',							  require('./../api/models/BG_feedbackSlides.js').getFeedBack);
	app.get('/getExtendedFeedback/:seminar/:period',					  require('./../api/models/BG_extendedFeedbackSlides.js').getFeedBack);
}

