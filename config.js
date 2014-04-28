module.exports = function(){
	switch(process.env.NODE_ENV){
		case 'development':
			return {
				cgi : {
				  port                                : 8080,
				  host                                : 'localhost',
				  path_marketReport                   : '/cgi-bin/marketReport.exe',
				  path_lineChart                      : '/cgi-bin/lineChart.exe',
				  path_perceptionMap                  : '/cgi-bin/perceptionMap.exe',		
				  path_finReport                      : '/cgi-bin/finReport.exe',		
				  path_volReport                      : '/cgi-bin/volReport.exe',
				  path_producerDecision               : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision               : '/cgi-bin/retailerDecision.exe',
				  path_negotiationDecision            : '/cgi-bin/negotiationDecision.exe',
				  path_brandHistoryInfo               : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo             : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo             : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo             : '/cgi-bin/quarterHistoryInfo.exe',

				  path_initialize                     : '/cgi-bin/initialize.exe',
				  path_passive                        : '/cgi-bin/passive.exe',
				  path_kernel                         : '/cgi-bin/kernel.exe',

				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_crossSegmentSales           : '/cgi-bin/GR_crossSegmentSales.exe',
				  path_GR_emallPrices                 : '/cgi-bin/GR_emallPrices.exe',
				  path_GR_marketSales                 : '/cgi-bin/GR_marketSales.exe',
				  path_GR_marketShare                 : '/cgi-bin/GR_marketShare.exe',
				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_productPortfolio            : '/cgi-bin/GR_productPortfolio.exe',
				  path_GR_segmentLeadership           : '/cgi-bin/GR_segmentLeadership.exe',

				  path_SCR_channelsProfitability      : '/cgi-bin/SCR_channelsProfitability.exe',
				  path_SCR_consolidatedProfitAndLoss  : '/cgi-bin/SCR_consolidatedProfitAndLoss.exe',
				  path_SCR_inventoryVolumes           : '/cgi-bin/SCR_inventoryVolumes.exe',
				  path_SCR_keyPerformanceIndicators   : '/cgi-bin/SCR_keyPerformanceIndicators.exe',
				  path_SCR_negotiations               : '/cgi-bin/SCR_negotiations.exe',
				  path_SCR_sharesCrossSegment         : '/cgi-bin/SCR_sharesCrossSegment.exe',
				  
				  path_RCR_consolidatedProfitAndLoss  : '/cgi-bin/RCR_consolidatedProfitAndLoss.exe',
				  path_RCR_inventoryVolumes           : '/cgi-bin/RCR_inventoryVolumes.exe',
				  path_RCR_keyPerformanceIndicators   : '/cgi-bin/RCR_keyPerformanceIndicators.exe',
				  path_RCR_negotiations               : '/cgi-bin/RCR_negotiations.exe',
				  path_RCR_profitabilityBySupplier    : '/cgi-bin/RCR_profitabilityBySupplier.exe',
				  path_RCR_sharesCrossSegment         : '/cgi-bin/RCR_sharesCrossSegment.exe',

				  path_MR_awarenessEvolution          : '/cgi-bin/MR_awarenessEvolution.exe',
				  path_MR_forecasts                   : '/cgi-bin/MR_forecasts.exe',
				  path_MR_netMarketPrices             : '/cgi-bin/MR_netMarketPrices.exe',
				  path_MR_pricePromotions             : '/cgi-bin/MR_pricePromotions.exe',
				  path_MR_retailerPerceptionEvolution : '/cgi-bin/MR_retailerPerceptionEvolution.exe',
				  path_MR_retailersIntelligence       : '/cgi-bin/MR_retailersIntelligence.exe',
				  path_MR_salesCrossSegment           : '/cgi-bin/MR_salesCrossSegment.exe',
				  path_MR_sharesCrossSegment          : '/cgi-bin/MR_sharesCrossSegment.exe',
				  path_MR_suppliersIntelligence       : '/cgi-bin/MR_suppliersIntelligence.exe',
				  path_MR_variantPerceptionEvolution  : '/cgi-bin/MR_variantPerceptionEvolution.exe',

   			  	  uploadFileAbsDir                    : '&filepath=\\\\vmware-host\\Shared%20Folders\\ludwikOnMac\\Code\\Actived\\Etales-result-viewer\\upload\\'
				},
				server : {
				  port : 8000
				}
			}
		case 'production':
			return {
				cgi : {
				  port                     : 8080,
				  host                     : 'localhost',
				  path_marketReport        : '/cgi-bin/marketReport.exe',
				  path_lineChart           : '/cgi-bin/lineChart.exe',
				  path_perceptionMap       : '/cgi-bin/perceptionMap.exe',				
				  path_finReport           : '/cgi-bin/finReport.exe',		
				  path_volReport           : '/cgi-bin/volReport.exe',
				  path_producerDecision    : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision    : '/cgi-bin/retailerDecision.exe',
				  path_negotiationDecision : '/cgi-bin/negotiationDecision.exe',
				  path_brandHistoryInfo    : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo  : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo  : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo  : '/cgi-bin/quarterHistoryInfo.exe',

				  path_initialize          : '/cgi-bin/initialize.exe',
				  path_passive             : '/cgi-bin/passive.exe',
				  path_kernel              : '/cgi-bin/kernel.exe',

				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_crossSegmentSales           : '/cgi-bin/GR_crossSegmentSales.exe',
				  path_GR_emallPrices                 : '/cgi-bin/GR_emallPrices.exe',
				  path_GR_marketSales                 : '/cgi-bin/GR_marketSales.exe',
				  path_GR_marketShare                 : '/cgi-bin/GR_marketShare.exe',
				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_productPortfolio            : '/cgi-bin/GR_productPortfolio.exe',
				  path_GR_segmentLeadership           : '/cgi-bin/GR_segmentLeadership.exe',

				  path_SCR_channelsProfitability      : '/cgi-bin/SCR_channelsProfitability.exe',
				  path_SCR_consolidatedProfitAndLoss  : '/cgi-bin/SCR_consolidatedProfitAndLoss.exe',
				  path_SCR_inventoryVolumes           : '/cgi-bin/SCR_inventoryVolumes.exe',
				  path_SCR_keyPerformanceIndicators   : '/cgi-bin/SCR_keyPerformanceIndicators.exe',
				  path_SCR_negotiations               : '/cgi-bin/SCR_negotiations.exe',
				  path_SCR_sharesCrossSegment         : '/cgi-bin/SCR_sharesCrossSegment.exe',
				  
				  path_RCR_consolidatedProfitAndLoss  : '/cgi-bin/RCR_consolidatedProfitAndLoss.exe',
				  path_RCR_inventoryVolumes           : '/cgi-bin/RCR_inventoryVolumes.exe',
				  path_RCR_keyPerformanceIndicators   : '/cgi-bin/RCR_keyPerformanceIndicators.exe',
				  path_RCR_negotiations               : '/cgi-bin/RCR_negotiations.exe',
				  path_RCR_profitabilityBySupplier    : '/cgi-bin/RCR_profitabilityBySupplier.exe',
				  path_RCR_sharesCrossSegment         : '/cgi-bin/RCR_sharesCrossSegment.exe',

				  path_MR_awarenessEvolution          : '/cgi-bin/MR_awarenessEvolution.exe',
				  path_MR_forecasts                   : '/cgi-bin/MR_forecasts.exe',
				  path_MR_netMarketPrices             : '/cgi-bin/MR_netMarketPrices.exe',
				  path_MR_pricePromotions             : '/cgi-bin/MR_pricePromotions.exe',
				  path_MR_retailerPerceptionEvolution : '/cgi-bin/MR_retailerPerceptionEvolution.exe',
				  path_MR_retailersIntelligence       : '/cgi-bin/MR_retailersIntelligence.exe',
				  path_MR_salesCrossSegment           : '/cgi-bin/MR_salesCrossSegment.exe',
				  path_MR_sharesCrossSegment          : '/cgi-bin/MR_sharesCrossSegment.exe',
				  path_MR_suppliersIntelligence       : '/cgi-bin/MR_suppliersIntelligence.exe',
				  path_MR_variantPerceptionEvolution  : '/cgi-bin/MR_variantPerceptionEvolution.exe',

				},
				server : {
				  port : 9000
				}
			}
		case 'monsoul':
			return {
				cgi : {
				  port                                : 800,
				  host                                : '192.168.1.105',
				  path_marketReport                   : '/cgi-bin/marketReport.exe',
				  path_lineChart                      : '/cgi-bin/lineChart.exe',
				  path_perceptionMap                  : '/cgi-bin/perceptionMap.exe',				
				  path_finReport                      : '/cgi-bin/finReport.exe',				
				  path_volReport                      : '/cgi-bin/volReport.exe',	
				  path_producerDecision               : '/cgi-bin/producerDecision.exe',
				  path_retailerDecision               : '/cgi-bin/retailerDecision.exe',				  
				  path_negotiationDecision            : '/cgi-bin/negotiationDecision.exe',				  
				  path_brandHistoryInfo               : '/cgi-bin/brandHistoryInfo.exe',
				  path_variantHistoryInfo             : '/cgi-bin/variantHistoryInfo.exe',
				  path_companyHistoryInfo             : '/cgi-bin/companyHistoryInfo.exe',
				  path_quarterHistoryInfo             : '/cgi-bin/quarterHistoryInfo.exe',
				  uploadFileAbsDir                    : '',

				  path_initialize                     : '/cgi-bin/initialize.exe',
				  path_passive                        : '/cgi-bin/passive.exe',
				  path_kernel                         : '/cgi-bin/kernel.exe',		

				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_crossSegmentSales           : '/cgi-bin/GR_crossSegmentSales.exe',
				  path_GR_emallPrices                 : '/cgi-bin/GR_emallPrices.exe',
				  path_GR_marketSales                 : '/cgi-bin/GR_marketSales.exe',
				  path_GR_marketShare                 : '/cgi-bin/GR_marketShare.exe',
				  path_GR_performanceHighlights       : '/cgi-bin/GR_performanceHighlights.exe',
				  path_GR_productPortfolio            : '/cgi-bin/GR_productPortfolio.exe',
				  path_GR_segmentLeadership           : '/cgi-bin/GR_segmentLeadership.exe',

				  path_SCR_channelsProfitability      : '/cgi-bin/SCR_channelsProfitability.exe',
				  path_SCR_consolidatedProfitAndLoss  : '/cgi-bin/SCR_consolidatedProfitAndLoss.exe',
				  path_SCR_inventoryVolumes           : '/cgi-bin/SCR_inventoryVolumes.exe',
				  path_SCR_keyPerformanceIndicators   : '/cgi-bin/SCR_keyPerformanceIndicators.exe',
				  path_SCR_negotiations               : '/cgi-bin/SCR_negotiations.exe',
				  path_SCR_sharesCrossSegment         : '/cgi-bin/SCR_sharesCrossSegment.exe',
				  
				  path_RCR_consolidatedProfitAndLoss  : '/cgi-bin/RCR_consolidatedProfitAndLoss.exe',
				  path_RCR_inventoryVolumes           : '/cgi-bin/RCR_inventoryVolumes.exe',
				  path_RCR_keyPerformanceIndicators   : '/cgi-bin/RCR_keyPerformanceIndicators.exe',
				  path_RCR_negotiations               : '/cgi-bin/RCR_negotiations.exe',
				  path_RCR_profitabilityBySupplier    : '/cgi-bin/RCR_profitabilityBySupplier.exe',
				  path_RCR_sharesCrossSegment         : '/cgi-bin/RCR_sharesCrossSegment.exe',

				  path_MR_awarenessEvolution          : '/cgi-bin/MR_awarenessEvolution.exe',
				  path_MR_forecasts                   : '/cgi-bin/MR_forecasts.exe',
				  path_MR_netMarketPrices             : '/cgi-bin/MR_netMarketPrices.exe',
				  path_MR_pricePromotions             : '/cgi-bin/MR_pricePromotions.exe',
				  path_MR_retailerPerceptionEvolution : '/cgi-bin/MR_retailerPerceptionEvolution.exe',
				  path_MR_retailersIntelligence       : '/cgi-bin/MR_retailersIntelligence.exe',
				  path_MR_salesCrossSegment           : '/cgi-bin/MR_salesCrossSegment.exe',
				  path_MR_sharesCrossSegment          : '/cgi-bin/MR_sharesCrossSegment.exe',
				  path_MR_suppliersIntelligence       : '/cgi-bin/MR_suppliersIntelligence.exe',
				  path_MR_variantPerceptionEvolution  : '/cgi-bin/MR_variantPerceptionEvolution.exe',
				  		  
				},
				server : {
				  port : 8000
				}				
			}
		default:
			return {
				cgi : {
				  port               : 8080,
				  host               : 'localhost',
				  path_marketReport  : '/cgi-bin/marketReport.exe',
				  path_lineChart     : '/cgi-bin/lineChart.exe',
				  path_perceptionMap : '/cgi-bin/perceptionMap.exe',				
				  path_finReport     : '/cgi-bin/finReport.exe',		
				  path_volReport     : '/cgi-bin/volReport.exe',
				  uploadFileAbsDir   : '&filepath=D://EtalesRV//master//upload//'
				},
				server : {
				  port : 8000
				}
			}		
	}
}