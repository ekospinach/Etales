var http = require('http'),
	util = require('util');

exports.initialiseSeminar = function(io){
	return function(req, res, next){
		var options = {
			producerID : '1', 
			retailerID : '1',
			seminar : req.body.seminar, 
			startFrom: -3, 
			endWith: 0, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port,			
			cgiPath : conf.cgi.path_producerDecision, 
		}	
		console.log('ini on the server');

		//call Initialize on the server, callback		
		//...		
		//if callback is true, import decisions....
		require('./models/producerDecision.js').addProducerDecisions(options).then(function(result){
			console.log(result);
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
			options.retailerID = '3';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '4';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);		
		}).then(function(result){
            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_brandHistoryInfo;			
			return require('./models/brandHistoryInfo.js').addInfos(options);								
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




