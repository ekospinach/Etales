var http = require('http'),
	util = require('util');
    Config = require('./../config.js');

exports.passiveSeminar = function(io){
	var status;

	return function(req, res, next){
		if (status == 'pending'){
			res.send(404, 'Service is locked by other process, please wait for seconds.'); 					
		} else {
			status = 'pending';
			var options = {
				producerID : '1', 
				retailerID : '1',
				seminar    : req.body.seminar, 
				period     : req.body.period, 
				cgiHost    : conf.cgi.host, 
				cgiPort    : conf.cgi.port,
				cgiPath    : conf.cgi.path_producerDecision,
				startFrom  : req.body.period, 
				endWith    : req.body.period
			}	

			//export to binary, P1/P2/P3, R1/R2
			require('./models/producerDecision.js').exportToBinary(options).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				options.producerID = '2';
				return require('./models/producerDecision.js').exportToBinary(options);
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				options.producerID = '3';
				return require('./models/producerDecision.js').exportToBinary(options);
			}).then(function(result){				
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				options.retailerID = '1';
				options.cgiPath = conf.cgi.path_retailerDecision;
				return require('./models/retailerDecision.js').exportToBinary(options);
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				options.retailerID = '2';
				return require('./models/retailerDecision.js').exportToBinary(options);
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			

		    //export to binary, negotiations, P1/P2/P3, R1/R2
		    	options.cgiPath = conf.cgi.path_negotiationDecision;
				return require('./models/allDeal.js').exportToBinary(options);
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				
			//call passive module on the server, callback...
		        options.cgiPath = conf.cgi.path_passive;
		        return require('./models/seminar.js').passiveSeminar(options);
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			

			//if callback true, import P4 and R3	
		        options.producerID = 4;
		        options.cgiPath = conf.cgi.path_producerDecision;
		        return require('./models/producerDecision.js').addProducerDecisions(options);        
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });			
				options.retailerID = '3';	
				options.cgiPath = conf.cgi.path_retailerDecision;

				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
			}).then(function(result){
		        io.sockets.emit('PassiveProcessLog', { msg: result.msg, isError: false });		
		        	
		        status = 'actived';
				res.send(200, 'Get passive decison complete!');	
			}, function(error){ //log the error
		        io.sockets.emit('PassiveProcessLog', { msg: error.msg, isError: true });			
		        status = 'actived';
		        res.send(300, 'error');            
			}, function(progress){ //log the progress
		        io.sockets.emit('PassiveProcessLog', { msg: progress.msg, isError: false });			
			})
		
		}
		
	}
}

exports.getPassiveDecision = function(io){
	return function(req, res, next){
		var options = {
			producerID : '4', 
			retailerID : '3',
			seminar : req.body.seminar, 
			startFrom: req.body.period, 
			endWith: req.body.period, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port,			
			cgiPath : conf.cgi.path_producerDecision, 
		}			

	console.log(options);
	require('./models/producerDecision.js').addProducerDecisions(options).then(function(result){
				options.retailerID = '3';	
				options.cgiPath = conf.cgi.path_retailerDecision;
				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
			}).then(function(result){
	            io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
				options.retailerID = '4';			
				return require('./models/retailerDecision.js').addRetailerDecisions(options);			
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


exports.setPassiveDecision = function(io){
	return function(req, res, next){
		var options = {
			producerID : '4', 
			retailerID : '3',
			seminar : req.body.seminar, 
			period : req.body.period, 
			cgiHost : conf.cgi.host, 
			cgiPort : conf.cgi.port,			
			cgiPath : conf.cgi.path_producerDecision, 
		}			

		require('./models/producerDecision.js').exportToBinary(options).then(function(result){
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });					
				options.retailerID = '3';
				options.cgiPath = conf.cgi.path_retailerDecision;
				return require('./models/retailerDecision.js').exportToBinary(options);
			}).then(function(result){
		        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });			
				options.retailerID = '4';
				return require('./models/retailerDecision.js').exportToBinary(options);
			}).then(function(result){
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

exports.importResult = function(io){
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
		
        options.cgiPath = conf.cgi.path_brandHistoryInfo;			
		require('./models/brandHistoryInfo.js').addInfos(options).then(function(result){
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