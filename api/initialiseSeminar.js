var http = require('http'),
	util = require('util');

exports.initialiseSeminar = function(io){
	return function(req, res, next){
	
	// io.sockets.on('connection', function(socket){
        
 //        socket.emit('InitialiseProcess', { msg: 'Adding producer decisions into database...' });     
 //        socket.emit('InitialiseProcess', { msg: 'Producer decision generation done.' });                                  }

	// 	//call Initialize on the server, callback		
	// 	//...		
	// 	//if callback is true, import decisions....
	// 	require('./models/producerDecision.js').addProducerDecisions({producerID : '1', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
	// 	require('./models/producerDecision.js').addProducerDecisions({producerID : '2', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
	// 	require('./models/producerDecision.js').addProducerDecisions({producerID : '3', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);

	// 	require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '1', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
	// 	require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '2', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
	// 	require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '3', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
	// 	require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '4', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		
	// 	//import negotiations...
	// 	//...		
	// 	//import reports and charts...
	// 	//...		
	//     require('./models/marketReport.js').addMarketReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_marketReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	//     require('./models/lineChart.js').addLineCharts({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_lineChart, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	//     require('./models/perceptionMap.js').addPerceptionMaps({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_perceptionMap, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	//     require('./models/finReport.js').addFinReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_finReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	//     require('./models/volReport.js').addVolReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_volReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);	    
	// });

		var options = {
			producerID : '1', 
			retailerID : '1',
			seminar : req.body.seminar, 
			startFrom: -3, 
			endWith: 0, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port			
			cgiPath : conf.cgi.path_producerDecision, 
		}	

		require('./models/producerDecision.js').addProducerDecisions(options).then(function(result){
			console.log(result.msg);
			options.producerID = '2';			
			return require('./models/producerDecision.js').addProducerDecisions(options);
		}).then(function(result){
			console.log(result.msg);
			options.producerID = '3';			
			return require('./models/producerDecision.js').addProducerDecisions(options);			
		}).then(function(result){
			console.log(result.msg);
		// 	options.retailerID = '1';	
		// 	options.cgiPath = conf.cgi.path_retailerDecision;
		// 	return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		// }).then(function(result){
		// 	console.log(result.msg);
		// 	options.retailerID = '2';			
		// 	options.cgiPath = conf.cgi.path_retailerDecision;
		// 	return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		// }).then(function(result){
		// 	console.log(result.msg);
		// 	options.retailerID = '3';			
		// 	options.cgiPath = conf.cgi.path_retailerDecision;			
		// 	return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		// }).then(function(result){
		// 	console.log(result.msg);
		// 	options.retailerID = '4';			
		// 	options.cgiPath = conf.cgi.path_retailerDecision;			
		// 	return require('./models/retailerDecision.js').addRetailerDecisions(options);			
		}).then(function(result){ //log the success info
			console.log(result.log)
		}, function(error){ //log the error
			console.log(error.msg)
		}, function(progress){ //log the progress
			console.log(progress.msg)
		})
	

	}
}




