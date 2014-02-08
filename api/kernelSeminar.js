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
			period : req.body.period
		}			
		
		//export R3/R4 and P4
		options.producerID = '4';
		options.cgiPath = conf.cgi.path_producerDecision;
		require('./models/producerDecision.js').exportToBinary(options).then(function(result){
	        io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '3';
			options.cgiPath = conf.cgi.path_retailerDecision;
			return require('./models/retailerDecision.js').exportToBinary(options);
		}).then(function(result){
	        io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '4';
			return require('./models/retailerDecision.js').exportToBinary(options);
		}).then(function(result){
	        io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			

		//call kernel moudule in the server
			options.cgiPath = conf.cgi.path_kernel;
			return require('./models/seminar.js').kernelSeminar(options);
		}).then(function(result){
	        io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			

		//import Decisions(P1/P2/P3, R1/R2) of next Period(++) (NEW blank decision)
			options.producerID = '1';
			options.cgiPath = conf.cgi.path_producerDecision;
			options.startFrom += 1;
			options.endWith += 1;		
			return require('./models/producerDecision.js').addProducerDecisions(options);
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.producerID = '2';			
			return require('./models/producerDecision.js').addProducerDecisions(options);
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.producerID = '3';			
			return require('./models/producerDecision.js').addProducerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '1';	
			options.cgiPath = conf.cgi.path_retailerDecision;
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			
			options.retailerID = '2';			
			return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });			

		//import History Info of selected period(--)
            options.startFrom -= 1;
            options.endWith -= 1;
            options.cgiPath = conf.cgi.path_brandHistoryInfo;			
			return require('./models/brandHistoryInfo.js').addInfos(options);		
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_variantHistoryInfo;			
			return require('./models/variantHistoryInfo.js').addInfos(options);										
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_companyHistoryInfo;			
			return require('./models/companyHistoryInfo.js').addInfos(options);				
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_quarterHistoryInfo;			
			return require('./models/quarterHistoryInfo.js').addInfos(options);		

		//import reports and charts		
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_marketReport;			
			return require('./models/marketReport.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_lineChart;			
			return require('./models/lineChart.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_perceptionMap;			
			return require('./models/perceptionMap.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_finReport;			
			return require('./models/finReport.js').addInfos(options);	
		}).then(function(result){
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });		
            options.cgiPath = conf.cgi.path_volReport;			
			return require('./models/volReport.js').addInfos(options);	

		//deal with promises chain 						
		}).then(function(result){ //log the success info
            io.sockets.emit('KernelProcessLog', { msg: result.msg, isError: false });	
            res.send(200, 'success');
		}, function(error){ //log the error
			console.log(error.msg);
            io.sockets.emit('KernelProcessLog', { msg: error.msg, isError: true });			
            res.send(300, 'error');            
		}, function(progress){ //log the progress
            io.sockets.emit('KernelProcessLog', { msg: progress.msg, isError: false });			
		})
	
	}

}




