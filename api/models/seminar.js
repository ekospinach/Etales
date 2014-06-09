var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
	uniqueValidator = require('mongoose-unique-validator'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	userRoles = require('../../app/js/routingConfig').userRoles,
	check = require('validator');

var seminarSchema = mongoose.Schema({
	seminarCode : {type:String, require:true, unique:true},
	seminarDescription : String, 
	seminarDate : {type:Date, default:Date.now},
	currentPeriod : {type:Number, default:0},
	isInitialise : {type:Boolean, default:false}, //when user login, need check this value
	reportPrice : {
		awareness                    : Number,
		brandPerceptions             : Number,
		retailerPerceptions          : Number,
		marketShareByConsumerSegment : Number,
		salesByConsumerSegment      : Number,
		marketShareByShopperSegment  : Number,
		salesByShopperSegment        : Number,
		BMRetailerPrices             : Number,
		promotionIntensity           : Number,
		supplierIntelligence         : Number,
		retailerIntelligence         : Number,
		forecasts                     : Number
	},

	producers : [producerSchema],
	retailers : [retailerSchema],
	facilitator : [facilitatorSchema],

	//Kernel communicate parameters 
    simulationSpan : Number,
    traceActive : Boolean,
    traditionalTradeActive : Boolean,
    EMallActive : Boolean,
    virtualSupplierActive : Boolean,
    independentMarkets : Boolean,
    forceNextDecisionsOverwrite : Boolean,
	market1ID : Number,
	market2ID : Number,
	category1ID : Number,
	category2ID : Number,
	// reportPrice : {
	// 	brandAwareness : Number,
	// 	brandPerceptions : Number,
	// 	retailerPerceptions : Number	
	// }
})

var producerSchema = mongoose.Schema({
	producerID : Number, //1,2,3 
	password : String,
	decisionReadyPeriod : Number,
	members : [memberSchema],
	//newProductDecisionReadyPeriod : Number,
    decisionCommitStatus : [supplierDecisionCommitStatusSchema],
	reportPurchaseStatus : [reportPurchaseStatusSchema],
})

var retailerSchema = mongoose.Schema({
	retailerID : Number, //1,2,3
	password : String,
	//decisionReadyPeriod : Number,
    decisionCommitStatus : [retailerDecisionCommitStatusSchema],
	reportPurchaseStatus : [reportPurchaseStatusSchema],
})


var reportPurchaseStatusSchema = mongoose.Schema({
	period                       : Number,
	awareness                    : Boolean,
	brandPerceptions             : Boolean,
	retailerPerceptions          : Boolean,
	marketShareByConsumerSegment : Boolean,
	salesByConsumerSegment      : Boolean,
	marketShareByShopperSegment  : Boolean,
	salesByShopperSegment        : Boolean,
	BMRetailerPrices             : Boolean,
	promotionIntensity           : Boolean,
	supplierIntelligence         : Boolean,
	retailerIntelligence         : Boolean,
	forecasts                     : Boolean
})

var supplierDecisionCommitStatusSchema = mongoose.Schema({
	period : Number,
	isPortfolioDecisionCommitted : Boolean,
	isDecisionCommitted : Boolean,
})


var retailerDecisionCommitStatusSchema = mongoose.Schema({
	period : Number,
	isDecisionCommitted : Boolean,
})


var facilitatorSchema = mongoose.Schema({
	facilitatorDescription : String,
	password : String
})

var memberSchema = mongoose.Schema({
	name : String,
	description : String
})

seminarSchema.plugin(uniqueValidator);

var seminar = mongoose.model('seminar', seminarSchema);

exports.localStrategy = new LocalStrategy(function(username, password, done){
	    var parameters = ['','',''],j = 0;    
	    for (var i = 0; i < username.length; i++) {
	      if(username[i] == '^') j = j + 1;
	      else parameters[j] = parameters[j] + username[i]; 
	      if(j>2) break;      
	    };
	    var para_seminar = parameters[0],
	    para_role = parameters[1],
	    para_roleID = parameters[2];
	    console.log('seminar:' + para_seminar + ',role:' + para_role + ',roleID:' + para_roleID);
		seminar.findOne({seminarCode:para_seminar},function(err,doc){
			if(err){ return done(err); }
			if(!doc){ console.log('incorrestseminar'); return done(null, false, {message:'Incorrect seminar code.'}); }
			if(!doc.isInitialise) { console.log('notIni');  return done(null, false, {message:'Seminar has not opened.'})}
			switch(parseInt(para_role, 10)){
				case userRoles.producer:
					if(doc.producers[para_roleID-1].password != password){ return done(null, false, {message:'Incorrect password'}); }
					break;
				case userRoles.retailer:
					if(doc.retailers[para_roleID-1].password != password){ return done(null, false, {message:'Incorrect password'}); }
					break;
				case userRoles.facilitator:
					if(doc.facilitator[para_roleID-1].password != password){ return done(null, false, {message:'Incorrect password'}); }
					break;				
				default:
					return done(null, false, {message:'role does not exist.'});
			}			
			return done(null, { seminar: para_seminar, role: para_role, roleID: para_roleID, username: username });
		});
});

exports.serializeUser = function(user, done){
	done(null, user.username);
}

exports.deserializeUser = function(username, done){
    var parameters = ['','',''],j = 0;    
    for (var i = 0; i < username.length; i++) {
      if(username[i] == '^') j = j + 1;
      else parameters[j] = parameters[j] + username[i]; 
      if(j>2) break;      
    };
    var para_seminar = parameters[0],
    para_role = parameters[1],
    para_roleID = parameters[2];	
	seminar.findOne({seminarCode:para_seminar},function(err,doc){
		if(err){ return done(err); }
		if(!doc){ console.log('incorrestseminar'); return done(null, false, {message:'Incorrect seminar code.'}); }
		if(!doc.isInitialise) {  return done(null, false, {message:'Seminar has not opened.'})}
		return done(null, { seminar: para_seminar, role: para_role, roleID: para_roleID, username: username });
	});
}

exports.getSeminarList=function(req,res,next){
	return seminar.find(function(err, docs){
		if(!err){
			return res.send(docs);
		} else {
			return console.log(err);
		}
	});
}

exports.getCurrentPeriod=function(req,res,next){
	return seminar.findOne({
		seminarCode:req.params.seminar
	},function(err,doc){
		if(err){
			next(new Error(err));
		}
		if(!doc){
			console.log('cannot find matched doc');
		}else{
			res.send(200,doc);
		}
	})
}

exports.checkProducerDecision=function(req,res,next){
	seminar.findOne({seminarCode:req.params.seminar},function(err,doc){
		if(err) {next(new Error(err))};
		if(doc){
			for(var i=0;i<doc.producers[req.params.producerID-1].decisionCommitStatus.length;i++){
				if(doc.producers[req.params.producerID-1].decisionCommitStatus[i].period==req.params.period){
					if(doc.producers[req.params.producerID-1].decisionCommitStatus[i].isPortfolioDecisionCommitted==true){
						res.send(200,'isReady');
					}else{
						res.send(200,'unReady');
					}
				}
			}
			
		}else{
			res.send(404,'there is no contract');
		}
	})
}

exports.checkProducerFinalDecision=function(req,res,next){
	seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err))
		};
		if (doc) {
			for (var i = 0; i < doc.producers[req.params.producerID - 1].decisionCommitStatus.length; i++) {
				if (doc.producers[req.params.producerID - 1].decisionCommitStatus[i].period == req.params.period) {
					if (doc.producers[req.params.producerID - 1].decisionCommitStatus[i].isDecisionCommitted == true) {
						res.send(200, 'isReady');
					} else {
						res.send(200, 'unReady');
					}
				}
			}

		} else {
			res.send(404, 'there is no contract');
		}
	})
}

exports.checkRetailerDecision=function(req,res,next){
	seminar.findOne({seminarCode:req.params.seminar},function(err,doc){
		if(err) {next(new Error(err))};
		if(doc){
			for(var i=0;i<doc.retailers[req.params.retailerID-1].decisionCommitStatus.length;i++){
				if(doc.retailers[req.params.retailerID-1].decisionCommitStatus[i].period==req.params.period){
					if(doc.retailers[req.params.retailerID-1].decisionCommitStatus[i].isDecisionCommitted==true){
						res.send(200,'isReady');
					}else{
						res.send(200,'unReady');
					}
				}
			}
			
		}else{
			res.send(404,'there is no contract');
		}
	})
}

exports.submitPortfolioDecision=function(io){
	return function(req,res,next){
		var queryCondition = {
			seminar    : req.body.seminar,
			producerID : req.body.producerID,
			period     : req.body.period,
			value       : req.body.value
		}
		console.log(util.inspect(queryCondition, {depth : null}));

		seminar.findOne({seminarCode:queryCondition.seminar},function(err,doc){
			if(err) {next(new Error(err))};
			if(doc){
				for (var i = 0; i < doc.producers[queryCondition.producerID - 1].decisionCommitStatus.length; i++) {
					if (doc.producers[queryCondition.producerID - 1].decisionCommitStatus[i].period == queryCondition.period) {
						doc.producers[queryCondition.producerID - 1].decisionCommitStatus[i].isPortfolioDecisionCommitted = queryCondition.value;
						console.log(doc.producers[queryCondition.producerID - 1].decisionCommitStatus[i].isPortfolioDecisionCommitted);						
					}
				}
				doc.markModified('producers');

				//notify Retailer that supplier X has committed portfolio decision.
                io.sockets.emit('socketIO:producerPortfolioDecisionStatusChanged', {period : queryCondition.period, producerID : queryCondition.producerID, seminar : queryCondition.seminar});                

                //notify Retailer to refresh negotiation page automatically 
                io.sockets.emit('socketIO:contractDetailsUpdated', {userType   : 'P', 
                                                                        seminar    : queryCondition.seminar, 
                                                                        producerID : queryCondition.producerID, 
                                                                        retailerID : 1,
                                                                        period     : queryCondition.period});
                io.sockets.emit('socketIO:contractDetailsUpdated', {userType   : 'P', 
                                                                        seminar    : queryCondition.seminar, 
                                                                        producerID : queryCondition.producerID, 
                                                                        retailerID : 2,
                                                                        period     : queryCondition.period});

				doc.save(function(err){
					if(!err){
						//notify supplier that decision has been saved to reload page
                        io.sockets.emit('socketIO:producerBaseChanged', {period : queryCondition.period, producerID : queryCondition.producerID, seminar : queryCondition.seminar});
						res.send(200,'success');
					}else{
						res.send(400,'fail');
					}
				})
			}else{
				res.send(404,'there is no contract');
			}
		})
	}
}

exports.submitFinalDecision=function(io){
	return function(req,res,next){
		var queryCondition = {
			seminar    : req.body.seminar,
			roleID 	   : req.body.roleID,
			role     : req.body.role,
			period     : req.body.period,
			value       : req.body.value,
		}

		seminar.findOne({seminarCode:queryCondition.seminar},function(err,doc){
			if(err) {next(new Error(err)); }
			if(doc){
				switch(queryCondition.role){
					case 'Producer':
						for (var i = 0; i < doc.producers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted = queryCondition.value;
								console.log(doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted);
							}
						}
						doc.markModified('producers');
						break;
					case 'Retailer':
						for (var i = 0; i < doc.retailers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted = queryCondition.value;
								console.log(doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted);
							}
						}
						doc.markModified('retailers');
						break;
				}				
				doc.save(function(err){
					if(!err){
						io.sockets.emit('socketIO:finalDecisionCommitted', {seminar : queryCondition.seminar, role: queryCondition.role, roleID : queryCondition.roleID, period : queryCondition.period});
						res.send(200,'success');
					}else{						
						res.send(400,'fail');
					}
				})
			}else{
				res.send(404,'there is no contract');
			}
		})
	}
}

exports.setCurrentPeriod = function(req, res, next){
		var queryCondition={
			seminar:req.body.seminar,
			period:req.body.period
		}
		console.log('setCurrentPeriod:' + queryCondition.seminar + '/' + queryCondition.period);
		seminar.findOne({seminarCode:queryCondition.seminar},function(err,doc){
			if(err) {next(new Error(err))};
			if(doc){
				console.log('find seminar:' + doc)
				doc.currentPeriod = queryCondition.period;
				doc.save(function(err){
					if(!err){
						console.log('update seminar:' + doc)						
						res.send(200,'success');
					}else{
						res.send(400,'fail');
					}
				})
			}else{
				res.send(404,'there is no such seminar...');
			}
		})
}

exports.deleteSeminar = function(req, res, next){
	console.log('try to remote a seminar:' + req.body.seminarCode);
	seminar.findOne({seminarCode:req.body.seminarCode},function(err,doc){
		if(err){ next(new Error(err));}
		if(!doc){
			res.send(404,'cannot find matched doc to remove....');
		}else{
			doc.remove(function(err, doc){
				if(err){ res.send(400, 'remove seminar failure.'); }
				else {res.send(200,'delete');}				
			});
		}
	});
}

exports.addSeminar=function(req,res,next){
	//TODO: add Seminar need to be more "automatic", period information should start from 0, end with Max period(simulationSpan)

	var Newseminar = new seminar({
		seminarCode : req.body.seminarCode,
		seminarDescription : req.body.seminarDescription, 
		seminarDate : Date.now(),
		currentPeriod : 1,
		isInitialise : false, //when user login, need check this value
		reportPrice : {
			awareness                    : 0.375,
			brandPerceptions             : 0.45,
			retailerPerceptions          : 0.45,
			marketShareByConsumerSegment : 0.275,
			salesByConsumerSegment      : 0.275,
			marketShareByShopperSegment  : 0.275,
			salesByShopperSegment        : 0.275,
			BMRetailerPrices             : 0.25,
			promotionIntensity           : 0.25,
			supplierIntelligence         : 0.5,
			retailerIntelligence         : 0.5,
			forecasts                     : 0.25
		},
		facilitator : [{
            password : "310",
            facilitatorDescription : "Help you"
        }],
	    retailers : [{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	password : "210",
	    	retailerID : 1,
	    	decisionCommitStatus : [{
	    		period : 1,
	    		isDecisionCommitted : false
	    	},{
	    		period : 0,
	    		isDecisionCommitted : true
	    	}],
	    	reportPurchaseStatus : [{
	    		period                       : 1,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
        },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	password : "220",
	    	retailerID : 2,
	    	decisionCommitStatus : [{
	    		period : 1,
	    		isDecisionCommitted : false
	    	},{
	    		period : 0,
	    		isDecisionCommitted : true
	    	}],
	    	reportPurchaseStatus : [{
	    		period                       : 1,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
        },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	password : "230",
	    	retailerID : 3,
	    	decisionCommitStatus : [{
	    		period : 1,
	    		isDecisionCommitted : false
	    	},{
	    		period : 0,
	    		isDecisionCommitted : true
	    	}],
	    	reportPurchaseStatus : [{
	    		period                       : 1,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
        },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	password : "240",
	    	retailerID : 4,
	    	decisionCommitStatus : [{
	    		period : 1,
	    		isDecisionCommitted : false
	    	},{
	    		period : 0,
	    		isDecisionCommitted : true
	    	}],
	    	reportPurchaseStatus : [{
	    		period                       : 1,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : true,
				brandPerceptions             : false,
				retailerPerceptions          : false,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
        }],
	    producers : [{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	decisionReadyPeriod : 0,
	    	password : "110",
	    	producerID : 1,
	    	decisionCommitStatus:[{
	    		period : 1,
				isPortfolioDecisionCommitted : false,
				isDecisionCommitted : false,
	    	},{
	    		period : 0,
				isPortfolioDecisionCommitted : true,
				isDecisionCommitted : true,
	    	}],
	    	reportPurchaseStatus:[{
	    		period                       : 1,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
	    },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	decisionReadyPeriod : 0,
	    	password : "120",
	    	producerID : 2,
	    	decisionCommitStatus:[{
	    		period : 1,
				isPortfolioDecisionCommitted : false,
				isDecisionCommitted : false,
	    	},{
	    		period : 0,
				isPortfolioDecisionCommitted : true,
				isDecisionCommitted : true,
	    	}],
	    	reportPurchaseStatus:[{
	    		period                       : 1,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
	    },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	decisionReadyPeriod : 0,
	    	password : "130",
	    	producerID : 3,
	    	decisionCommitStatus:[{
	    		period : 1,
				isPortfolioDecisionCommitted : false,
				isDecisionCommitted : false,
	    	},{
	    		period : 0,
				isPortfolioDecisionCommitted : true,
				isDecisionCommitted : true,
	    	}],
	    	reportPurchaseStatus:[{
	    		period                       : 1,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
	    },{
	    	members : [{
	    		description : "Tom and Jack",
	    		name : "Tom"
	    	},{
	    		description : "Tom and Jack",
	    		name : "Jack"
	    	}],
	    	decisionReadyPeriod : 0,
	    	password : "140",
	    	producerID : 4,
	    	decisionCommitStatus:[{
	    		period : 1,
				isPortfolioDecisionCommitted : false,
				isDecisionCommitted : false,
	    	},{
	    		period : 0,
				isPortfolioDecisionCommitted : true,
				isDecisionCommitted : true,
	    	}],
	    	reportPurchaseStatus:[{
	    		period                       : 1,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	},{
	    		period                       : 0,
				awareness                    : false,
				brandPerceptions             : false,
				retailerPerceptions          : true,
				marketShareByConsumerSegment : false,
				salesByConsumerSegment      : false,
				marketShareByShopperSegment  : false,
				salesByShopperSegment        : false,
				BMRetailerPrices             : false,
				promotionIntensity           : false,
				supplierIntelligence         : false,
				retailerIntelligence         : false,
				forecasts                     : false
	    	}]
	    }],
	    simulationSpan : 6,
	    traceActive : true,
	    traditionalTradeActive : false,
	    EMallActive : false,
	    virtualSupplierActive : false,
	    independentMarkets : false,
	    forceNextDecisionsOverwrite : false,
	    market1ID : 1,
	    market2ID : 2,
	    category1ID : 1,
	    category2ID : 2
	});

	Newseminar.save(function(err) {
		if(!err){
			res.send(200,Newseminar);
			console.log("created new seminar:"+Newseminar);
		} else {
			res.send(400,err);
			//res.send(400,"Seminar code has existed in the list, validation failed.");
		}
	});
}

exports.updateSeminar=function(req,res,next){
	var queryCondition={
		seminarCode:req.body.seminarCode,
		currentPeriod:req.body.currentPeriod,
		behaviour:req.body.behaviour,
		/*
		password:edit password(need location ,additionalIdx,value)
		*/
		location:req.body.location,
		additionalIdx:req.body.additionalIdx,
		value:req.body.value
	};
	seminar.findOne({seminarCode:queryCondition.seminarCode},function(err,doc){
		if(err){
			next(new Error(err));
		}
		if(!doc){
			console.log("cannot find matched doc....");
			res.send(404,'cannot find matched doc....');
		}else{
			var isUpdate=true;
			switch(queryCondition.behaviour){
				case 'updatePassword':
					doc[queryCondition.location][queryCondition.additionalIdx].password=queryCondition.value;
					break;
				case 'updateCurrentPeriod':
					doc.currentPeriod = queryCondition.value;
					break;
				// case 'updateActive':
				// 	doc.is
			}
			if(isUpdate){
				doc.markModified('facilitator');
				doc.markModified('retailers');
				doc.markModified('producers');
				console.log(doc.producers[0].password);
				doc.save(function(err,doc,numberAffected){
					if(err){
						next(new Error(err));
					}
					console.log('save updated, number affected:'+numberAffected+'doc:'+doc);
                    res.send(200, 'mission complete!');
				});
			}

		}
	});
}

exports.submitOrder=function(io){
	return function(req,res,next){
		var queryCondition={
			seminarCode:req.body.seminarCode,
			period:req.body.period,
			player:req.body.player,
			playerID:req.body.playerID,
			name:req.body.name,
			value:req.body.value
		};
		seminar.findOne({seminarCode:queryCondition.seminarCode},function(err,doc){
			if(err){
				next(new Error(err));
			}
			if(!doc){
				console.log("cannot find matched doc....");
				res.send(404,'cannot find matched doc....');
			}else{
				var isUpdate=true;
				switch(queryCondition.player){
					case 'Producer':
						for(var i=0;i<doc.producers.length;i++){
							if(doc.producers[i].producerID==queryCondition.playerID){
								for(var j=0;j<doc.producers[i].reportPurchaseStatus.length;j++){
									if(doc.producers[i].reportPurchaseStatus[j].period==queryCondition.period){
										doc.producers[i].reportPurchaseStatus[j][queryCondition.name]=queryCondition.value;
									}
								}
							}
						}
						break;
					case 'Retailer':
						for(var i=0;i<doc.retailers.length;i++){
							if(doc.retailers[i].retailerID==queryCondition.playerID){
								for(var j=0;j<doc.retailers[i].reportPurchaseStatus.length;j++){
									if(doc.retailers[i].reportPurchaseStatus[j].period==queryCondition.period){
										// for(var k=0;k<queryCondition.data.length;k++){
										// 	console.log(doc.retailers[i].reportPurchaseStatus[j][queryCondition.data[k].realName]);
										// 	doc.retailers[i].reportPurchaseStatus[j][queryCondition.data[k].realName]=queryCondition.data[k].playerStatus;
										// }
										doc.retailers[i].reportPurchaseStatus[j][queryCondition.name]=queryCondition.value;
									}
								}
							}
						}
						break;
				}
				if(isUpdate){
					doc.markModified('facilitator');
					doc.markModified('retailers');
					doc.markModified('producers');
					doc.save(function(err,doc,numberAffected){
						if(err){
							next(new Error(err));
						}
						if(queryCondition.player=="Producer"){
						io.sockets.emit('socketIO:producerMarketResearchOrdersChanged', {period : queryCondition.period,  seminar : queryCondition.seminarCode,producerID:queryCondition.playerID});

						}else{
						io.sockets.emit('socketIO:retailerMarketResearchOrdersChanged', {period : queryCondition.period,  seminar : queryCondition.seminarCode,retailerID:queryCondition.playerID});

						}
						console.log('save updated, number affected!:'+numberAffected+'doc:'+doc);
	                    res.send(200, 'mission complete!');
					});
				}
			}
		})
	}
}

exports.getPlayerReportOrder=function(req,res,next){
	seminar.findOne({seminarCode:req.params.seminar},function(err,doc){
		if(err){ next(new Error(err));}
		if(doc){
			if(req.params.userType=="P"){
				for(var i=0;i<doc.producers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].period==req.params.period){
						res.send(200,doc.producers[req.params.playerID-1].reportPurchaseStatus[i]);
						break;
					}
				}
			}else{
				for(var i=0;i<doc.retailers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].period==req.params.period){
						res.send(200,doc.retailers[req.params.playerID-1].reportPurchaseStatus[i]);
						break;
					}
				}
			}
		}else{
			res.send(404,'cannot find matched doc....');
		}
	});
}

exports.getPlayerReportOrderExpend=function(req,res,next){
	seminar.findOne({seminarCode:req.params.seminar},function(err,doc){
		if(err){
			next(new Error(err));
		}
		if(doc){
			var result=0;
			if(req.params.userType=="P"){
				for(var i=0;i<doc.producers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].period==req.params.period){
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].awareness){
							result+=doc.reportPrice.awareness;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].brandPerceptions){
							result+=doc.reportPrice.brandPerceptions;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].retailerPerceptions){
							result+=doc.reportPrice.retailerPerceptions;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].marketShareByConsumerSegment){
							result+=doc.reportPrice.marketShareByConsumerSegment;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].salesByConsumerSegment){
							result+=doc.reportPrice.salesByConsumerSegment;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].marketShareByShopperSegment){
							result+=doc.reportPrice.marketShareByShopperSegment;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].salesByShopperSegment){
							result+=doc.reportPrice.salesByShopperSegment;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].BMRetailerPrices){
							result+=doc.reportPrice.BMRetailerPrices;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].promotionIntensity){
							result+=doc.reportPrice.promotionIntensity;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].supplierIntelligence){
							result+=doc.reportPrice.supplierIntelligence;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].retailerIntelligence){
							result+=doc.reportPrice.retailerIntelligence;
						}
						if(doc.producers[req.params.playerID-1].reportPurchaseStatus[i].forecasts){
							result+=doc.reportPrice.forecasts;
						}
						res.send(200,{'result':result});
						break;
					}
				}
			}else{
				for(var i=0;i<doc.retailers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].period==req.params.period){
						console.log(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].awareness);
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].awareness){
							result+=doc.reportPrice.awareness;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].brandPerceptions){
							result+=doc.reportPrice.brandPerceptions;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].retailerPerceptions){
							result+=doc.reportPrice.retailerPerceptions;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].marketShareByConsumerSegment){
							result+=doc.reportPrice.marketShareByConsumerSegment;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].salesByConsumerSegment){
							result+=doc.reportPrice.salesByConsumerSegment;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].marketShareByShopperSegment){
							result+=doc.reportPrice.marketShareByShopperSegment;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].salesByShopperSegment){
							result+=doc.reportPrice.salesByShopperSegment;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].BMRetailerPrices){
							result+=doc.reportPrice.BMRetailerPrices;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].promotionIntensity){
							result+=doc.reportPrice.promotionIntensity;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].supplierIntelligence){
							result+=doc.reportPrice.supplierIntelligence;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].retailerIntelligence){
							result+=doc.reportPrice.retailerIntelligence;
						}
						if(doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].forecasts){
							result+=doc.reportPrice.forecasts;
						}
						res.send(200,{'result':result});
						break;
					}
				}
			}
		}else{
			res.send(404,'cannot find matched doc....');
		}
	})
}



exports.initializeSeminar = function(options){
	var deferred = q.defer();

	console.log('initialise Seminar:' + options);
	var reqOptions = {
		hostname: options.cgiHost,
		port: options.cgiPort,
		path: options.cgiPath + '?seminar=' + options.seminar
			  + '&span=' + options.simulationSpan
			  + '&isTraceActive=' + options.traceActive
			  + '&isTraditionalTradeActive=' + options.traditionalTradeActive
			  + '&isEMallActive=' + options.EMallActive
			  + '&isVirtualSupplierActive=' + options.virtualSupplierActive
			  + '&isIndependentMarkets=' + options.independentMarkets
			  + '&isForceNextDecisionsOverwrite=' + options.forceNextDecisionsOverwrite
			  + '&market1ID=' + options.market1ID
			  + '&market2ID=' + options.market2ID
			  + '&category1ID=' + options.category1ID
			  + '&category2ID=' + options.category2ID
	};

	http.get(reqOptions, function(response){
		var data = '';
		response.setEncoding('utf8');
		response.on('data', function(chunk){
			data += chunk;
		}).on('end', function(){
			if (response.statusCode === (404 || 500))
  			  	deferred.reject({msg:data});
			else {
				seminar.findOne({seminarCode:options.seminar},function(err,doc){
					if(err){ deferred.reject({msg:err}); } 
					if(!doc){ deferred.reject({msg:'cannot find matched seminar : ' + options.seminar}); } 

				    doc.simulationSpan = options.simulationSpan;
				    doc.traceActive = options.traceActive;
				    doc.traditionalTradeActive = options.traditionalTradeActive;
				    doc.EMallActive = options.EMallActive;
				    doc.virtualSupplierActive = options.virtualSupplierActive;
				    doc.independentMarkets = options.independentMarkets;
				    doc.forceNextDecisionsOverwrite = options.forceNextDecisionsOverwrite;
					doc.market1ID = options.market1ID;
					doc.market2ID = options.market2ID;
					doc.category1ID = options.category1ID;
					doc.category2ID = options.category2ID;

					doc.isInitialise = true;
					
					doc.save(function(err,doc,numberAffected){
						if(err){ deferred.reject({msg:err}); }
						deferred.resolve({msg:data})
					});				
  		   	    });					
			}
		}).on('error', function(e){
			deferred.reject({msg:e.message});
		});
	})

	return deferred.promise;
}

exports.passiveSeminar = function(options){
	var deferred = q.defer();
	seminar.findOne({seminarCode:options.seminar}, function(err, doc){
		if(err){ deferred.reject({msg:err}); } 
		if(!doc){ deferred.reject({msg:'cannot find matched seminar : ' + options.seminar}); } 
		var reqOptions = {
			hostname: options.cgiHost,
			port: options.cgiPort,
			path: options.cgiPath + '?seminar=' + doc.seminarCode
				  + '&span=' + doc.simulationSpan
				  + '&isTraceActive=' + doc.traceActive
				  + '&isTraditionalTradeActive=' + doc.traditionalTradeActive
				  + '&isEMallActive=' + doc.EMallActive
				  + '&isVirtualSupplierActive=' + doc.virtualSupplierActive
				  + '&isIndependentMarkets=' + doc.independentMarkets
				  + '&isForceNextDecisionsOverwrite=' + doc.forceNextDecisionsOverwrite
				  + '&market1ID=' + doc.market1ID
				  + '&market2ID=' + doc.market2ID
				  + '&category1ID=' + doc.category1ID
				  + '&category2ID=' + doc.category2ID,
			period : options.period
		};
		http.get(reqOptions, function(response){
			var data = '';
			response.setEncoding('utf8');
			response.on('data', function(chunk){
				data += chunk;
			}).on('end', function(){		
				if (response.statusCode === (404 || 500))
	  			  	deferred.reject({msg:data});
				else {				
					deferred.resolve({msg:'Get passive decision complete:' + data});
				}
			}).on('error', function(e){
				deferred.reject({msg:e.message});
			});				

		})
	});	
	return deferred.promise;
}

exports.kernelSeminar = function(options){
	var deferred = q.defer();
	seminar.findOne({seminarCode:options.seminar}, function(err, doc){
		if(err){ deferred.reject({msg:err}); } 
		if(!doc){ deferred.reject({msg:'cannot find matched seminar : ' + options.seminar}); } 
		var reqOptions = {
			hostname: options.cgiHost,
			port: options.cgiPort,
			path: options.cgiPath + '?seminar=' + doc.seminarCode
				  + '&span=' + doc.simulationSpan
				  + '&isTraceActive=' + doc.traceActive
				  + '&isTraditionalTradeActive=' + doc.traditionalTradeActive
				  + '&isEMallActive=' + doc.EMallActive
				  + '&isVirtualSupplierActive=' + doc.virtualSupplierActive
				  + '&isIndependentMarkets=' + doc.independentMarkets
				  + '&isForceNextDecisionsOverwrite=' + doc.forceNextDecisionsOverwrite
				  + '&market1ID=' + doc.market1ID
				  + '&market2ID=' + doc.market2ID
				  + '&category1ID=' + doc.category1ID
				  + '&category2ID=' + doc.category2ID,
			period : options.period

		};
		http.get(reqOptions, function(response){
			var data = '';
			response.setEncoding('utf8');
			response.on('data', function(chunk){
				data += chunk;
			}).on('end', function(){		
				if (response.statusCode === (404 || 500))
	  			  	deferred.reject({msg:data});
				else {				
					deferred.resolve({msg:'Run kernel complete:' + data});
				}
			}).on('error', function(e){
				deferred.reject({msg:e.message});
			});				
		})	
	});
	return deferred.promise;
}

function duplicateSeminarDoc(options){
	var deferred = q.defer();

	seminar.findOne({seminarCode:options.originalSeminarCode}, function(err, doc){
		if(err){ deferred.reject({msg:err});}
		if(doc){
			console.log(doc);
			deferred.resolve({msg:'duplicate seminar document complete.'});
		}else{
			deferred.reject({msg:'cannot find matched seminar : ' + options.originalSeminarCode});
		}
	})			

	return deferred.promise;
}

exports.duplicateSeminar = function(req, res, next){
	var queryCondition = {
		originalSeminarCode : req.body.originalSeminarCode,
		targetSeminarCode : req.body.targetSeminarCode,
		seminarDescription : req.body.seminarDescription
	}

	console.log('query:' + util.inspect(queryCondition));
	duplicateSeminarDoc(queryCondition)
	//deal with promises chain 						
	.then(function(result){ //log the success info
        io.sockets.emit('AdminProcessLog', { msg: result.msg, isError: false });	
        res.send(200, result.msg);
	}, function(error){ //log the error
		console.log(error.msg);
        io.sockets.emit('AdminProcessLog', { msg: error.msg, isError: true });			
        res.send(404, error.msg);            
	}, function(progress){ //log the progress
        io.sockets.emit('AdminProcessLog', { msg: progress.msg, isError: false });			
	})	
}