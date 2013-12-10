var http = require('http'),
	util = require('util');

exports.runSeminar = function(io){
	return function(req, res, next){
		var options = {
			producerID : '1', 
			retailerID : '1',
			seminar : req.body.seminar, 
			startFrom: req.body.period, 
			endWith: req.body.period, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port,			
			cgiPath : conf.cgi.path_producerDecision, 
		}			

		//export R3/R4 and P4
		//...
		//call kernel moudule in the server, callback...
		//...
		//if callback is true, import decisions....
		//call Initialize on the server, callback		
		//...		
		//import Decisions and Negotiation
		options.startFrom += 1;
		options.endWith += 1;
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

            options.startFrom -= 1;
            options.endWith -= 1;
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
	
	}


}




