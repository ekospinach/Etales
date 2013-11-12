zvar http = require('http'),
	util = require('util');

exports.initializeSeminar = function(io){
	return function(req, res, next){
	
	io.sockets.on('connection', function(socket){

		//call Initialize on the server, callback		
		//...		
		//if callback is true, import decisions....
		require('./models/producerDecision.js').addProducerDecisions({producerID : '1', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		require('./models/producerDecision.js').addProducerDecisions({producerID : '2', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		require('./models/producerDecision.js').addProducerDecisions({producerID : '3', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);

		require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '1', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '2', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '3', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		require('./models/retailerDecision.js').addRetailerDecisions({retailerID : '4', cgiPath : conf.cgi.path_retailerDecision, seminar : req.body.seminar, startFrom: -3, endWith:0, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port}, socket);
		
		//import negotiations...
		//...		
		//import reports and charts...
		//...		
	    require('./models/marketReport.js').addMarketReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_marketReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    require('./models/lineChart.js').addLineCharts({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_lineChart, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    require('./models/perceptionMap.js').addPerceptionMaps({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_perceptionMap, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    require('./models/finReport.js').addFinReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_finReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);
	    require('./models/volReport.js').addVolReports({cgiHost : conf.cgi.host, cgiPath : conf.cgi.path_volReport, cgiPort : conf.cgi.port, seminar : req.body.seminar, startFrom: -3, endWith:0,}, socket);	    
	});

	}
}




