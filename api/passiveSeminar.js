var http = require('http'),
	util = require('util');
    Config = require('./../config.js');

exports.passiveSeminar = function(io){
	return function(req, res, next){
	
	conf = new Config();	
	console.log('outside of io.sockets:' + conf.cgi.path_producerDecision);

//	io.sockets.on('connection', function(socket){
		//export to binary, negotiations, P1/P2/P3, R1/R2
		require('./models/producerDecision.js').exportToBinary({producerID : '1', cgiPath : conf.cgi.path_producerDecision, seminar : req.body.seminar, period : req.body.period, cgiHost : conf.cgi.host, cgiPort : conf.cgi.port});
		res.send(200, 'complete');
		//call passive module on the server, callback...
		//...		
		//if callback true, import P4 and R3/R4
		//...
//	});

	}
}
