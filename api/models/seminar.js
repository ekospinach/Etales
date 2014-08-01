var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
	uniqueValidator = require('mongoose-unique-validator'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	userRoles = require('../../app/js/routingConfig').userRoles,
	check = require('validator');

var seminarSchema            = mongoose.Schema({
	seminarCode                  : {type:String, require:true, unique:true},
	seminarDescription           : {type:String, default:'seminar description'},
	seminarDate                  : {type:Date, default:Date.now},
	currentPeriod                : {type:Number, default:1},
	isInitialise                 : {type:Boolean, default:false}, //when user login, need check this value
	reportPrice                  : {
		awareness                    : {type:Number, default:0.375},
		brandPerceptions             : {type:Number, default:0.45},
		retailerPerceptions          : {type:Number, default:0.45},
		marketShareByConsumerSegment : {type:Number, default:0.275},
		salesByConsumerSegment       : {type:Number, default:0.275},
		marketShareByShopperSegment  : {type:Number, default:0.275},
		salesByShopperSegment        : {type:Number, default:0.275},
		BMRetailerPrices             : {type:Number, default:0.25},
		promotionIntensity           : {type:Number, default:0.25},
		supplierIntelligence         : {type:Number, default:0.5},
		retailerIntelligence         : {type:Number, default:0.5},
		forecasts                    : {type:Number, default:0.25},
	},
	producers                    : [producerSchema],
	retailers                    : [retailerSchema],
	facilitator                  : [facilitatorSchema],
	//Kernel communicate parameters 
	simulationSpan               : {type:Number,default:9},
	traceActive                  : {type:Boolean,default:true},
	traditionalTradeActive       : {type:Boolean,default:false},
	EMallActive                  : {type:Boolean,default:false},
	virtualSupplierActive        : {type:Boolean,default:false},
	independentMarkets           : {type:Boolean,default:false},
	forceNextDecisionsOverwrite  : {type:Boolean,default:false},
	market1ID                    : {type:Number,default:1},
	market2ID                    : {type:Number,default:2},
	category1ID                  : {type:Number,default:1},
	category2ID                  : {type:Number,default:1},

	useTimeSlot                  : {type:Boolean, default:true},
	isTimerActived			     : {type:Boolean, default:false},
	timeslotPortfolioDecisionCommitted : {type:Number, default: 20},
	timeslotContractDeal               : {type:Number, default: 20},
	timeslotContractFinalized          : {type:Number, default: 20},
	timeslotDecisionCommitted          : {type:Number, default: 20},	
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
	salesByConsumerSegment       : Boolean,
	marketShareByShopperSegment  : Boolean,
	salesByShopperSegment        : Boolean,
	BMRetailerPrices             : Boolean,
	promotionIntensity           : Boolean,
	supplierIntelligence         : Boolean,
	retailerIntelligence         : Boolean,
	forecasts                    : Boolean
})

var supplierDecisionCommitStatusSchema = mongoose.Schema({
	period                             : Number,
	isPortfolioDecisionCommitted       : Boolean,//step 1
	isContractDeal                     : Boolean, //step 2
	isContractFinalized                : Boolean,	//step 3
	isDecisionCommitted                : Boolean,//step 4	
})

var retailerDecisionCommitStatusSchema = mongoose.Schema({
	period                                 : Number,
	isContractDeal                         : Boolean, //step 1
	isContractFinalized                    : Boolean, // step 2
	isDecisionCommitted                    : Boolean, //step 3
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
	    var tempSeminar = {};

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

			tempSeminar.seminarCode = doc.seminarCode;
			tempSeminar.seminarDescription = doc.seminarDescription;
			tempSeminar.currentPeriod = doc.currentPeriod;
			tempSeminar.simulationSpan = doc.simulationSpan;				
			return done(null, { seminar: tempSeminar, role: para_role, roleID: para_roleID, username: username });
		});
});

exports.serializeUser = function(user, done){
	done(null, user.username);
}

exports.deserializeUser = function(username, done){
    var parameters = ['','',''],j = 0;    
    var tempSeminar = {};
    
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
		tempSeminar.seminarCode = doc.seminarCode;
		tempSeminar.seminarDescription = doc.seminarDescription;
		tempSeminar.currentPeriod = doc.currentPeriod;
		tempSeminar.simulationSpan = doc.simulationSpan;				

		return done(null, { seminar: tempSeminar, role: para_role, roleID: para_roleID, username: username });
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

exports.getSeminarReportPurchaseStatus=function  (req,res,next) {
	// body...
	var tempReportPurchaseStatus = {};
	return seminar.findOne({
		seminarCode:req.params.seminar
	},function(err,doc){
		if(err){
			next(new Error(err));
		}
		if(!doc){
			console.log('cannot find matched doc');
		}else{
			if(req.params.type=="P"){
				for(var i=0;i<doc.producers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(req.params.period==doc.producers[req.params.playerID-1].reportPurchaseStatus[i].period){
						tempReportPurchaseStatus=doc.producers[req.params.playerID-1].reportPurchaseStatus[i];
						break;
					}
				}
			}else{
				for(var i=0;i<doc.retailers[req.params.playerID-1].reportPurchaseStatus.length;i++){
					if(req.params.period==doc.retailers[req.params.playerID-1].reportPurchaseStatus[i].period){
						tempReportPurchaseStatus=doc.retailers[req.params.playerID-1].reportPurchaseStatus[i];
						break;
					}
				}
			}	
			res.send(200,tempReportPurchaseStatus);
		}
	})
}

exports.getSeminarInfo=function(req,res,next){
	var tempSeminar = {};
	return seminar.findOne({
		seminarCode:req.params.seminar
	},function(err,doc){
		if(err){
			next(new Error(err));
		}
		if(!doc){
			console.log('cannot find matched doc');
		}else{
			tempSeminar.seminarCode = doc.seminarCode;
			tempSeminar.seminarDescription = doc.seminarDescription;
			tempSeminar.currentPeriod = doc.currentPeriod;
			tempSeminar.simulationSpan = doc.simulationSpan;			
			res.send(200,tempSeminar);
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

exports.setCurrentPeriod = function(io){
	return function(req, res, next){
			var queryCondition={
				seminar:req.body.seminar,
				period:req.body.period
			}
			//console.log('setCurrentPeriod:' + queryCondition.seminar + '/' + queryCondition.period);
			seminar.findOne({seminarCode:queryCondition.seminar},function(err,doc){
				if(err) {next(new Error(err))};
				if(doc){
//					console.log('find seminar:' + doc)
					doc.currentPeriod = queryCondition.period;
					doc.save(function(err){
						if(!err){
							io.sockets.emit('socketIO:seminarPeriodChanged', {period : queryCondition.period, seminar : queryCondition.seminar, span : doc.simulationSpan});
			//				console.log('update seminar:' + doc)						
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

exports.addSeminars = function(req, res, next){
	var doc = new seminar({seminarCode: req.body.seminarCode, seminarDescription: req.body.seminarDescription});
	var retailerDoc, producerDoc;

	doc.facilitator.push({password:"310", facilitatorDescription:""});
	for (var i = 1; i <= 4; i++) {
		producerDoc = {producerID: i, password:"1" + i + "0", decisionCommitStatus:[], reportPurchaseStatus:[],members:[] };
		retailerDoc = {retailerID: i, password:"2" + i + "0", decisionCommitStatus:[], reportPurchaseStatus:[],members:[] };
		for (var j = 0; j <= 6; j++) {
			producerDoc.decisionCommitStatus.push({period :j, 	isDecisionCommitted  						  :false, 
																isPortfolioDecisionCommitted                  :false,
																isContractDeal                                :false, 
																isContractFinalized                           :false}); 

			retailerDoc.decisionCommitStatus.push({period :j, 	isDecisionCommitted 						  :false, 
																isContractDeal                                :false, 
																isContractFinalized                           :false});
			if(j == 0){
				producerDoc.reportPurchaseStatus.push({period:j, 
													   awareness                    : true,
													   brandPerceptions             : true,
													   retailerPerceptions          : true,
													   marketShareByConsumerSegment : true,
													   salesByConsumerSegment       : true,
													   marketShareByShopperSegment  : true,
													   salesByShopperSegment        : true,
													   BMRetailerPrices             : true,
													   promotionIntensity           : true,
													   supplierIntelligence         : true,
													   retailerIntelligence         : true,
													   forecasts                    : true});					
				retailerDoc.reportPurchaseStatus.push({period:j, 
													   awareness                    : true,
													   brandPerceptions             : true,
													   retailerPerceptions          : true,
													   marketShareByConsumerSegment : true,
													   salesByConsumerSegment       : true,
													   marketShareByShopperSegment  : true,
													   salesByShopperSegment        : true,
													   BMRetailerPrices             : true,
													   promotionIntensity           : true,
													   supplierIntelligence         : true,
													   retailerIntelligence         : true,
													   forecasts                    : true});				
			} else {
				producerDoc.reportPurchaseStatus.push({period:j, 
													   awareness                    : false,
													   brandPerceptions             : false,
													   retailerPerceptions          : false,
													   marketShareByConsumerSegment : false,
													   salesByConsumerSegment       : false,
													   marketShareByShopperSegment  : false,
													   salesByShopperSegment        : false,
													   BMRetailerPrices             : false,
													   promotionIntensity           : false,
													   supplierIntelligence         : false,
													   retailerIntelligence         : false,
													   forecasts                    : false});				
				retailerDoc.reportPurchaseStatus.push({period:j, 
													   awareness                    : false,
													   brandPerceptions             : false,
													   retailerPerceptions          : false,
													   marketShareByConsumerSegment : false,
													   salesByConsumerSegment       : false,
													   marketShareByShopperSegment  : false,
													   salesByShopperSegment        : false,
													   BMRetailerPrices             : false,
													   promotionIntensity           : false,
													   supplierIntelligence         : false,
													   retailerIntelligence         : false,
													   forecasts                    : false});				
			}
		};		
		doc.retailers.push(retailerDoc);
		doc.producers.push(producerDoc);

	};
	doc.save(function(err){
		if(!err){
			res.send(200, doc);
		} else {
			res.send(400, err);
		}
	});
}

exports.updateSeminar=function(io){

	return function(req, res, next){
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
					doc.save(function(err,doc,numberAffected){
						if(err){
							next(new Error(err));
						}
						io.sockets.emit('socketIO:seminarPeriodChanged', {period : doc.currentPeriod, seminar : doc.seminarCode, span : doc.simulationSpan});
	                    res.send(200, 'mission complete!');
					});
				}

			}
		});
		
	}
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
				  + '&category2ID=' + doc.category2ID
				  + '&period=' + options.period
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
				  + '&category2ID=' + doc.category2ID
				  + '&period=' + options.period

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