var http = require('http'),
	util = require('util');

exports.initialiseSeminar = function(io){
	var status;

	return function(req, res, next){
		if(status == 'pending'){
			res.send(404, 'Service is locked by other process, please wait for seconds.'); 			
		} else {
			status = 'pending';
			var options = {
				producerID                 : '1', 
				retailerID                 : '1',
				seminar                    : req.body.seminar, 
				startFrom                  : -3, 
				endWith                    : 0, 
				cgiHost                    : conf.cgi.host, 
				cgiPort                    : conf.cgi.port,			
				//cgiPath                  : conf.cgi.path_initialize,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
				cgiPath                    : conf.cgi.path_initialize,
				schemaName                 : 'Initialize.DLL',

			    simulationSpan             : req.body.simulationSpan,
			    traceActive                : req.body.traceActive,
			    traditionalTradeActive     : req.body.traditionalTradeActive,
			    EMallActive                : req.body.EMallActive,
			    virtualSupplierActive      : req.body.virtualSupplierActive,
			    independentMarkets         : req.body.independentMarkets,
			    forceNextDecisionsOverwrite: req.body.forceNextDecisionsOverwrite,
				market1ID                  : req.body.market1ID,
				market2ID                  : req.body.market2ID,
				category1ID                : req.body.category1ID,
				category2ID                : req.body.category2ID,		
				isKeepExistedPeriod1Decision : req.body.isKeepExistedPeriod1Decision
			}	
			
		    //io.sockets.emit('AdminProcessLog', { msg: 'Create separated folder for binary files of seminar : '+ req.body.seminar, isError: false }); 
		   	io.sockets.emit('AdminProcessLog', { msg: 'Start calling Initialize.DLL...', isError: false });                             
			require('./models/seminar.js').initializeSeminar(options).then(function(result){
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });      
		        options.producerID = '1';
		
			//Import General reports		
		        options.cgiPath = conf.cgi.path_producerDecision;
				options.cgiPath = conf.cgi.path_GR_performanceHighlights;
				options.schemaName = 'GR_performanceHighlights';		
				return require('./models/GR_performanceHighlights.js').addReports(options);
			}).then(function(result){	   
				io.sockets.emit('AdminProcessLog', {msg: result.msg, isError:false });

				options.cgiPath = conf.cgi.path_GR_crossSegmentSales;
				options.schemaName = 'GR_crossSegmentSales';
				return require('./models/GR_crossSegmentSales.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_GR_emallPrices;
				options.schemaName = 'GR_emallPrices';
				return require('./models/GR_emallPrices.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_GR_marketSales;
				options.schemaName = 'GR_marketSales';
				return require('./models/GR_marketSales.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_GR_marketShare;
				options.schemaName = 'GR_marketShare';
				return require('./models/GR_marketShare.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_GR_productPortfolio;
				options.schemaName = 'GR_productPortfolio';
				return require('./models/GR_productPortfolio.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_GR_segmentLeadership;
				options.schemaName = 'GR_segmentLeadership';
				return require('./models/GR_segmentLeadership.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	


		    //Import SCR(Supplier confidential) reports
				options.cgiPath = conf.cgi.path_SCR_channelsProfitability;
				options.schemaName = 'SCR_channelsProfitability';
				return require('./models/SCR_channelsProfitability.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_consolidatedProfitAndLoss;
				options.schemaName = 'SCR_consolidatedProfitAndLoss';
				return require('./models/SCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_inventoryVolumes;
				options.schemaName = 'SCR_inventoryVolumes';
				return require('./models/SCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_keyPerformanceIndicators;
				options.schemaName = 'SCR_keyPerformanceIndicators';
				return require('./models/SCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_negotiations;
				options.schemaName = 'SCR_negotiations';
				return require('./models/SCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_sharesCrossSegment;
				options.schemaName = 'SCR_sharesCrossSegment';
				return require('./models/SCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	
				options.producerID = 2;
				options.cgiPath = conf.cgi.path_SCR_channelsProfitability;
				options.schemaName = 'SCR_channelsProfitability';
				return require('./models/SCR_channelsProfitability.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_consolidatedProfitAndLoss;
				options.schemaName = 'SCR_consolidatedProfitAndLoss';
				return require('./models/SCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_inventoryVolumes;
				options.schemaName = 'SCR_inventoryVolumes';
				return require('./models/SCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_keyPerformanceIndicators;
				options.schemaName = 'SCR_keyPerformanceIndicators';
				return require('./models/SCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_negotiations;
				options.schemaName = 'SCR_negotiations';
				return require('./models/SCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_sharesCrossSegment;
				options.schemaName = 'SCR_sharesCrossSegment';
				return require('./models/SCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

					options.producerID = 3;
				options.cgiPath = conf.cgi.path_SCR_channelsProfitability;
				options.schemaName = 'SCR_channelsProfitability';
				return require('./models/SCR_channelsProfitability.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_consolidatedProfitAndLoss;
				options.schemaName = 'SCR_consolidatedProfitAndLoss';
				return require('./models/SCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_inventoryVolumes;
				options.schemaName = 'SCR_inventoryVolumes';
				return require('./models/SCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_keyPerformanceIndicators;
				options.schemaName = 'SCR_keyPerformanceIndicators';
				return require('./models/SCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_negotiations;
				options.schemaName = 'SCR_negotiations';
				return require('./models/SCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_sharesCrossSegment;
				options.schemaName = 'SCR_sharesCrossSegment';
				return require('./models/SCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
			        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.producerID = 4;
				options.cgiPath = conf.cgi.path_SCR_channelsProfitability;
				options.schemaName = 'SCR_channelsProfitability';
				return require('./models/SCR_channelsProfitability.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_consolidatedProfitAndLoss;
				options.schemaName = 'SCR_consolidatedProfitAndLoss';
				return require('./models/SCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_inventoryVolumes;
				options.schemaName = 'SCR_inventoryVolumes';
				return require('./models/SCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_keyPerformanceIndicators;
				options.schemaName = 'SCR_keyPerformanceIndicators';
				return require('./models/SCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_negotiations;
				options.schemaName = 'SCR_negotiations';
				return require('./models/SCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_SCR_sharesCrossSegment;
				options.schemaName = 'SCR_sharesCrossSegment';
				return require('./models/SCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
			              io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 	    


		    //Import RCR(Retailer confidential) reports
				options.cgiPath = conf.cgi.path_RCR_consolidatedProfitAndLoss;
				options.schemaName = 'RCR_consolidatedProfitAndLoss';
				return require('./models/RCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_inventoryVolumes;
				options.schemaName = 'RCR_inventoryVolumes';
				return require('./models/RCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_keyPerformanceIndicators;
				options.schemaName = 'RCR_keyPerformanceIndicators';
				return require('./models/RCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_negotiations;
				options.schemaName = 'RCR_negotiations';
				return require('./models/RCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_profitabilityBySupplier;
				options.schemaName = 'RCR_profitabilityBySupplier';
				return require('./models/RCR_profitabilityBySupplier.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_sharesCrossSegment;
				options.schemaName = 'RCR_sharesCrossSegment';
				return require('./models/RCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

		    	options.retailerID  = 2;
				options.cgiPath = conf.cgi.path_RCR_consolidatedProfitAndLoss;
				options.schemaName = 'RCR_consolidatedProfitAndLoss';
				return require('./models/RCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_inventoryVolumes;
				options.schemaName = 'RCR_inventoryVolumes';
				return require('./models/RCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_keyPerformanceIndicators;
				options.schemaName = 'RCR_keyPerformanceIndicators';
				return require('./models/RCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_negotiations;
				options.schemaName = 'RCR_negotiations';
				return require('./models/RCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_profitabilityBySupplier;
				options.schemaName = 'RCR_profitabilityBySupplier';
				return require('./models/RCR_profitabilityBySupplier.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_sharesCrossSegment;
				options.schemaName = 'RCR_sharesCrossSegment';
				return require('./models/RCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		    

		    	options.retailerID  = 3;
				options.cgiPath = conf.cgi.path_RCR_consolidatedProfitAndLoss;
				options.schemaName = 'RCR_consolidatedProfitAndLoss';
				return require('./models/RCR_consolidatedProfitAndLoss.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_inventoryVolumes;
				options.schemaName = 'RCR_inventoryVolumes';
				return require('./models/RCR_inventoryVolumes.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_keyPerformanceIndicators;
				options.schemaName = 'RCR_keyPerformanceIndicators';
				return require('./models/RCR_keyPerformanceIndicators.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_negotiations;
				options.schemaName = 'RCR_negotiations';
				return require('./models/RCR_negotiations.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	
				
				options.cgiPath = conf.cgi.path_RCR_profitabilityBySupplier;
				options.schemaName = 'RCR_profitabilityBySupplier';
				return require('./models/RCR_profitabilityBySupplier.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_RCR_sharesCrossSegment;
				options.schemaName = 'RCR_sharesCrossSegment';
				return require('./models/RCR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		


		    //Import Market Reports
				options.cgiPath = conf.cgi.path_MR_awarenessEvolution;
				options.schemaName = 'MR_awarenessEvolution';
				return require('./models/MR_awarenessEvolution.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_netMarketPrices;
				options.schemaName = 'MR_netMarketPrices';
				return require('./models/MR_netMarketPrices.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_pricePromotions;
				options.schemaName = 'MR_pricePromotions';
				return require('./models/MR_pricePromotions.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_retailerPerceptionEvolution;
				options.schemaName = 'MR_retailerPerceptionEvolution';
				return require('./models/MR_retailerPerceptionEvolution.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_retailersIntelligence;
				options.schemaName = 'MR_retailersIntelligence';
				return require('./models/MR_retailersIntelligence.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_suppliersIntelligence;
				options.schemaName = 'MR_suppliersIntelligence';
				return require('./models/MR_suppliersIntelligence.js').addReports(options);			
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_variantPerceptionEvolution;
				options.schemaName = 'MR_variantPerceptionEvolution';
				return require('./models/MR_variantPerceptionEvolution.js').addReports(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_salesCrossSegment;
				options.schemaName = 'MR_salesCrossSegment';
				return require('./models/MR_salesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_sharesCrossSegment;
				options.schemaName = 'MR_sharesCrossSegment';
				return require('./models/MR_sharesCrossSegment.js').addReports(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	

				options.cgiPath = conf.cgi.path_MR_salesByChannel;
				options.schemaName = 'MR_salesByChannel';
				return require('./models/MR_salesByChannel.js').addReports(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			         

				options.cgiPath = conf.cgi.path_MR_forecasts;
				options.schemaName = 'MR_forecasts';
				return require('./models/MR_forecasts.js').addReports(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	
			
				options.cgiPath = conf.cgi.path_BG_feedbackSlides;
				options.schemaName = 'BG_feedbackSlides';
				//return require('./models/companyHistoryInfo.js').addInfos(options);
				return require('./models/BG_feedbackSlides.js').addInfos(options);							
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 
			
		    //import Supplier decision 
		        if(options.isKeepExistedPeriod1Decision){					        	
		        	options.endWith = 0;
		        } else {
		        	options.endWith = 1;	        	
		        }

		        options.producerID = '1';
				options.cgiPath = conf.cgi.path_producerDecision;
				options.schemaName = 'producerDecision';
				return require('./models/producerDecision.js').addProducerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	             

		        options.producerID = '2';
				options.cgiPath = conf.cgi.path_producerDecision;
				options.schemaName = 'producerDecision';
				return require('./models/producerDecision.js').addProducerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	             

		        options.producerID = '3';
				options.cgiPath = conf.cgi.path_producerDecision;
				options.schemaName = 'producerDecision';
				return require('./models/producerDecision.js').addProducerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	             

		        options.endWith = 0;
		        options.producerID = '4';
				options.cgiPath = conf.cgi.path_producerDecision;
				options.schemaName = 'producerDecision';
				return require('./models/producerDecision.js').addProducerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	             

		        //import retailer decision 
		        if(options.isKeepExistedPeriod1Decision){					        	
		        	options.endWith = 0;
		        } else {
		        	options.endWith = 1;	        	
		        }
		        options.retailerID = '1';
				options.cgiPath = conf.cgi.path_retailerDecision;
				options.schemaName = 'retailerDecision';
				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 

		        options.retailerID = '2';
				options.cgiPath = conf.cgi.path_retailerDecision;
				options.schemaName = 'retailerDecision';
				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 

		        options.endWith = 0;
		        options.retailerID = '3';
				options.cgiPath = conf.cgi.path_retailerDecision;
				options.schemaName = 'retailerDecision';
				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
			}).then(function(result){ 
		         io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 


		       	//import background data 
				options.cgiPath = conf.cgi.path_companyHistoryInfo;
				options.schemaName = 'companyHistoryInfo';
				return require('./models/companyHistoryInfo.js').addInfos(options);							
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 


				options.cgiPath = conf.cgi.path_BG_oneQuarterExogenousData;
				options.schemaName = 'BG_oneQuarterExogenousData';
				return require('./models/BG_oneQuarterExogenousData.js').addInfos(options);							
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 

				options.cgiPath = conf.cgi.path_BG_oneQuarterParameterData;
				options.schemaName = 'BG_oneQuarterParameterData';
				return require('./models/BG_oneQuarterParameterData.js').addInfos(options);							
			}).then(function(result){ 
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	 


		        status = 'actived';
		        res.send(200, 'Initialization done.');
			}, function(error){ //log the error
		        io.sockets.emit('AdminProcessLog', { msg: error.msg, isError: true });			
		        status = 'actived';
		        res.send(404, error.msg);            
			}, function(progress){ //log the progress
		        io.sockets.emit('AdminProcessLog', { msg: progress.msg, isError: false });			
			}).done();		

		}
	}
}

	

exports.initialiseSeminarRetailer=function(io){
	return function(req, res, next){
		var options = {
			producerID: '1', 
			retailerID: '1',
			seminar   : req.body.seminar, 
			startFrom : -3, 
			endWith   : 1, 
			cgiHost   : conf.cgi.host, 
			cgiPort   : conf.cgi.port,			
			cgiPath   : conf.cgi.path_retailerDecision, 
		}	
		console.log('ini on the server');
		require('./models/retailerDecision.js').addRetailerDecisions(options).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		});
	}
}



