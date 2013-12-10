var http = require('http'),
	util = require('util');
    Config = require('./../config.js');

exports.passiveSeminar = function(io){
	return function(req, res, next){
	var options = {
		producerID : '1', 
		retailerID : '1',
		seminar : req.body.seminar, 
		period : req.body.period, 
		cgiHost : conf.cgi.host, 
		cgiPort : conf.cgi.port,
		cgiPath : conf.cgi.path_producerDecision,
		startFrom: -3, 
		endWith: 0
	}	

	//export to binary, negotiations, P1/P2/P3, R1/R2
	require('./models/producerDecision.js').exportToBinary(options).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		options.producerID = '2';
		return require('./models/producerDecision.js').exportToBinary(options);
	}).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		options.producerID = '3';
		return require('./models/producerDecision.js').exportToBinary(options);
	}).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		options.retailerID = '1';
		options.cgiPath = conf.cgi.path_retailerDecision;
		return require('./models/retailerDecision.js').exportToBinary(options);
	}).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		options.retailerID = '2';
		return require('./models/retailerDecision.js').exportToBinary(options);
	}).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
    	options.cgiPath = conf.cgi.path_negotiationDecision;
		return require('./models/allDeal.js').exportToBinary(options);

	//call passive module on the server, callback...
	//...		
	//if callback true, import P4 and R3/R4
	//...
	}).then(function(result){
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
		res.send(200, 'complete');	
	}, function(error){ //log the error
        io.sockets.emit('AdminProcessLog', { msg: error.msg, isError: true });			
        res.send(300, 'error');            
	}, function(progress){ //log the progress
        io.sockets.emit('AdminProcessLog', { msg: progress.msg, isError: false });			
	})
	

	}
}
