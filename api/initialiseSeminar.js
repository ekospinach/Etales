var http = require('http'),
	util = require('util');

exports.initialiseSeminar = function(io){
	return function(req, res, next){
		var options = {
			producerID : '1', 
			retailerID : '1',
			seminar : req.body.seminar, 
			startFrom: -3, 
			endWith: 1, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port,			
			cgiPath : conf.cgi.path_producerDecision, 
		}	
		console.log('ini on the server');

		//call Initialize on the server, callback		
		//...		
		//import Decisions and Negotiation(import function haven't ready now, by Hao 20131210)
		require('./models/producerDecision.js').addProducerDecisions(options).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.producerID = '2';			
			return require('./models/producerDecision.js').addProducerDecisions(options);
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.producerID = '3';			
			return require('./models/producerDecision.js').addProducerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '1';	
			options.cgiPath = conf.cgi.path_retailerDecision;
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '2';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
            options.endWith = 0;
			options.retailerID = '3';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '4';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);	
		// }).then(function(result){
  //           io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
  //           options.cgiPath = conf.cgi.path_negotiationDecision;
  //           console.log('outside:' + util.inspect(options));
		// 	return require('./models/allDeal.js').addDecisions(options);	

		//import historyInformation		
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_brandHistoryInfo;			
			return require('./models/brandHistoryInfo.js').addInfos(options);		
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_variantHistoryInfo;			
			return require('./models/variantHistoryInfo.js').addInfos(options);										
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_companyHistoryInfo;			
			return require('./models/companyHistoryInfo.js').addInfos(options);				
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_quarterHistoryInfo;			
			return require('./models/quarterHistoryInfo.js').addInfos(options);		

		//import reports and charts		
		}).then(function(result){
			//need start from -2 until Dariusz fix the issue in result file
			options.startFrom = -2;
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_marketReport;			
			return require('./models/marketReport.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_lineChart;			
			return require('./models/lineChart.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_perceptionMap;			
			return require('./models/perceptionMap.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_finReport;			
			return require('./models/finReport.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_volReport;			
			return require('./models/volReport.js').addInfos(options);	

		//deal with promises chain 						
		}).then(function(result){ //log the success info
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	
            res.send(200, 'success');
		}, function(error){ //log the error
			console.log(error.msg);
            io.sockets.emit('AdminProcessLog', { msg: error.msg, isError: true });			
            res.send(300, 'error');            
		}, function(progress){ //log the progress
            io.sockets.emit('AdminProcessLog', { msg: progress.msg, isError: false });			
		})
	

		//import negotiations...
		//...		
		//import reports and charts and historyInfo...
		//...		
	    // require('./models/marketReport.js').addMarketReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_marketReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    // require('./models/lineChart.js').addLineCharts({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_lineChart, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    // require('./models/perceptionMap.js').addPerceptionMaps({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_perceptionMap, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    // require('./models/finReport.js').addFinReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_finReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    // require('./models/volReport.js').addVolReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_volReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);	    


	}
}




