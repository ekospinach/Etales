var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
	uniqueValidator = require('mongoose-unique-validator'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	userRoles = require('../../app/js/routingConfig').userRoles,
	check = require('validator'),
	events = require('events');

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
	category2ID                  : {type:Number,default:2},

	//useTimeSlot                  : {type:Boolean, default:true},
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

exports.localStrategy = new LocalStrategy(function(username, password, done) {
	var parameters = ['', '', ''],
		j = 0;
	var tempSeminar = {};

	for (var i = 0; i < username.length; i++) {
		if (username[i] == '^') j = j + 1;
		else parameters[j] = parameters[j] + username[i];
		if (j > 2) break;
	};
	var para_seminar = parameters[0],
		para_role = parameters[1],
		para_roleID = parameters[2];
	console.log('seminar:' + para_seminar + ',role:' + para_role + ',roleID:' + para_roleID);
	seminar.findOne({
		seminarCode: para_seminar
	}, function(err, doc) {
		if (err) {
			return done(err);
		}
		if (!doc) {
			console.log('incorrestseminar');
			return done(null, false, {
				message: 'Incorrect seminar code.'
			});
		}
		if (!doc.isInitialise) {
			console.log('notIni');
			return done(null, false, {
				message: 'Seminar has not opened.'
			})
		}
		switch (parseInt(para_role, 10)) {
			case userRoles.producer:
				if (doc.producers[para_roleID - 1].password != password) {
					return done(null, false, {
						message: 'Incorrect password'
					});
				}
				break;
			case userRoles.retailer:
				if (doc.retailers[para_roleID - 1].password != password) {
					return done(null, false, {
						message: 'Incorrect password'
					});
				}
				break;
			case userRoles.facilitator:
				if (doc.facilitator[para_roleID - 1].password != password) {
					return done(null, false, {
						message: 'Incorrect password'
					});
				}
				break;
			default:
				return done(null, false, {
					message: 'role does not exist.'
				});
		}

		tempSeminar.seminarCode = doc.seminarCode;
		tempSeminar.seminarDescription = doc.seminarDescription;
		tempSeminar.currentPeriod = doc.currentPeriod;
		tempSeminar.simulationSpan = doc.simulationSpan;
		return done(null, {
			seminar: tempSeminar,
			role: para_role,
			roleID: para_roleID,
			username: username
		});
	});
});

exports.serializeUser = function(user, done) {
	done(null, user.username);
}

exports.deserializeUser = function(username, done) {
	var parameters = ['', '', ''],
		j = 0;
	var tempSeminar = {};

	for (var i = 0; i < username.length; i++) {
		if (username[i] == '^') j = j + 1;
		else parameters[j] = parameters[j] + username[i];
		if (j > 2) break;
	};
	var para_seminar = parameters[0],
		para_role = parameters[1],
		para_roleID = parameters[2];
	seminar.findOne({
		seminarCode: para_seminar
	}, function(err, doc) {
		if (err) {
			return done(err);
		}
		if (!doc) {
			console.log('incorrestseminar');
			return done(null, false, {
				message: 'Incorrect seminar code.'
			});
		}
		if (!doc.isInitialise) {
			return done(null, false, {
				message: 'Seminar has not opened.'
			})
		}
		tempSeminar.seminarCode = doc.seminarCode;
		tempSeminar.seminarDescription = doc.seminarDescription;
		tempSeminar.currentPeriod = doc.currentPeriod;
		tempSeminar.simulationSpan = doc.simulationSpan;

		return done(null, {
			seminar: tempSeminar,
			role: para_role,
			roleID: para_roleID,
			username: username
		});
	});
}

exports.getSeminarList = function(req, res, next) {
	return seminar.find(function(err, docs) {
		if (!err) {
			return res.send(docs);
		} else {
			return console.log(err);
		}
	});
}

exports.getSeminarReportPurchaseStatus = function(req, res, next) {
	// body...
	var tempReportPurchaseStatus = {};
	return seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err));
		}
		if (!doc) {
			console.log('cannot find matched doc');
		} else {
			if (req.params.type == "P") {
				for (var i = 0; i < doc.producers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
					if (req.params.period == doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].period) {
						tempReportPurchaseStatus = doc.producers[req.params.playerID - 1].reportPurchaseStatus[i];
						break;
					}
				}
			} else {
				for (var i = 0; i < doc.retailers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
					if (req.params.period == doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].period) {
						tempReportPurchaseStatus = doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i];
						break;
					}
				}
			}
			res.send(200, tempReportPurchaseStatus);
		}
	})
}

exports.getSeminarInfo = function(req, res, next) {
	var tempSeminar = {};
	return seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err));
		}
		if (!doc) {
			console.log('cannot find matched doc');
		} else {
			tempSeminar.seminarCode = doc.seminarCode;
			tempSeminar.seminarDescription = doc.seminarDescription;
			tempSeminar.currentPeriod = doc.currentPeriod;
			tempSeminar.simulationSpan = doc.simulationSpan;
			res.send(200, tempSeminar);
		}
	})
}

exports.checkProducerDecisionStatus = function(req, res, next) {
	seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err))
		};
		if (doc) {
			var result = {
				'isPortfolioDecisionCommitted': false,
				'isContractDeal': false,
				'isContractFinalized': false,
				'isDecisionCommitted': false
			};
			for (var i = 0; i < doc.producers[req.params.producerID - 1].decisionCommitStatus.length; i++) {
				if (doc.producers[req.params.producerID - 1].decisionCommitStatus[i].period == req.params.period) {
					result.isPortfolioDecisionCommitted = doc.producers[req.params.producerID - 1].decisionCommitStatus[i].isPortfolioDecisionCommitted;
					result.isContractDeal = doc.producers[req.params.producerID - 1].decisionCommitStatus[i].isContractDeal;
					result.isContractFinalized = doc.producers[req.params.producerID - 1].decisionCommitStatus[i].isContractFinalized;
					result.isDecisionCommitted = doc.producers[req.params.producerID - 1].decisionCommitStatus[i].isDecisionCommitted;
				}
			}
			res.send(200, result);
		} else {
			res.send(404, 'there is no contract');
		}
	})
}

exports.checkRetailerDecisionStatus = function(req, res, next) {
	seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err))
		};
		if (doc) {
			var result = {
				'isContractDeal': false,
				'isContractFinalized': false,
				'isDecisionCommitted': false
			};
			for (var i = 0; i < doc.retailers[req.params.retailerID - 1].decisionCommitStatus.length; i++) {
				if (doc.retailers[req.params.retailerID - 1].decisionCommitStatus[i].period == req.params.period) {
					result.isContractDeal = doc.retailers[req.params.retailerID - 1].decisionCommitStatus[i].isContractDeal;
					result.isContractFinalized = doc.retailers[req.params.retailerID - 1].decisionCommitStatus[i].isContractFinalized;
					result.isDecisionCommitted = doc.retailers[req.params.retailerID - 1].decisionCommitStatus[i].isDecisionCommitted;

				}
			}
			res.send(200, result);
		} else {
			res.send(404, 'there is no contract');
		}
	})
}

exports.submitPortfolioDecision = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminar: req.body.seminar,
			producerID: req.body.producerID,
			period: req.body.period,
			value: req.body.value
		}

		seminar.findOne({
			seminarCode: queryCondition.seminar
		}, function(err, doc) {
			if (err) {
				next(new Error(err))
			};
			if (doc) {
				for (var i = 0; i < doc.producers[queryCondition.producerID - 1].decisionCommitStatus.length; i++) {
					if (doc.producers[queryCondition.producerID - 1].decisionCommitStatus[i].period == queryCondition.period) {
						doc.producers[queryCondition.producerID - 1].decisionCommitStatus[i].isPortfolioDecisionCommitted = queryCondition.value;
					}
				}
				doc.markModified('producers');

				//notify Retailer that supplier X has committed portfolio decision.
				//io.sockets.emit('socketIO:producerPortfolioDecisionStatusChanged', {period : queryCondition.period, producerID : queryCondition.producerID, seminar : queryCondition.seminar});                

				//notify Retailer to refresh negotiation page automatically 


				doc.save(function(err) {
					if (err) {
						res.send(400, 'fail')
					} else {
						io.sockets.emit('socketIO:committedPortfolio', {
							result: [{
								producerID: queryCondition.producerID
							}],
							period: queryCondition.period,
							seminar: queryCondition.seminar
						});
						res.send(200, 'success');
					}
				})
			} else {
				res.send(404, 'there is no contract');
			}
		})
	}
}

exports.submitContractDeal = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminar: req.body.seminar,
			roleID: req.body.roleID,
			role: req.body.role,
			period: req.body.period,
			value: req.body.value,
		}
		seminar.findOne({
			seminarCode: queryCondition.seminar
		}, function(err, doc) {
			if (err) {
				next(new Error(err));
			}
			if (doc) {
				switch (queryCondition.role) {
					case 'Producer':
						for (var i = 0; i < doc.producers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].isContractDeal = queryCondition.value;
							}
						}
						doc.markModified('producers');
						break;
					case 'Retailer':
						for (var i = 0; i < doc.retailers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].isContractDeal = queryCondition.value;
							}
						}
						doc.markModified('retailers');
						break;
				}
				doc.save(function(err) {
					if (!err) {
						if (queryCondition.value && queryCondition.role == "Producer") {
							io.sockets.emit('socketIO:dealContract', {
								seminar: queryCondition.seminar,
								producerID: queryCondition.roleID,
								period: queryCondition.period
							});
						}
						res.send(200, {
							result: 'success'
						});
					} else {
						res.send(400, {
							result: 'fail'
						});
					}
				})
			} else {
				res.send(404, 'there is no contract');
			}
		})
	}
}

exports.submitContractFinalized = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminar: req.body.seminar,
			roleID: req.body.roleID,
			role: req.body.role,
			period: req.body.period,
			value: req.body.value,
		}

		seminar.findOne({
			seminarCode: queryCondition.seminar
		}, function(err, doc) {
			if (err) {
				next(new Error(err));
			}
			if (doc) {
				switch (queryCondition.role) {
					case 'Producer':
						for (var i = 0; i < doc.producers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].isContractFinalized = queryCondition.value;
							}
						}
						doc.markModified('producers');
						break;
					case 'Retailer':
						for (var i = 0; i < doc.retailers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].isContractFinalized = queryCondition.value;
							}
						}
						doc.markModified('retailers');
						break;
				}
				doc.save(function(err) {
					if (!err) {
						io.sockets.emit('socketIO:finalizeContract', {
							seminar: queryCondition.seminar,
							role: queryCondition.role,
							roleID: queryCondition.roleID,
							period: queryCondition.period
						});
						res.send(200, {
							result: 'success'
						});
					} else {
						res.send(400, {
							result: 'fail'
						});
					}
				})
			} else {
				res.send(404, 'there is no contract');
			}
		})
	}
}

exports.submitFinalDecision = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminar: req.body.seminar,
			roleID: req.body.roleID,
			role: req.body.role,
			period: req.body.period,
			value: req.body.value,
		}

		seminar.findOne({
			seminarCode: queryCondition.seminar
		}, function(err, doc) {
			if (err) {
				next(new Error(err));
			}
			if (doc) {
				switch (queryCondition.role) {
					case 'Producer':
						for (var i = 0; i < doc.producers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.producers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted = queryCondition.value;
							}
						}
						doc.markModified('producers');
						break;
					case 'Retailer':
						for (var i = 0; i < doc.retailers[queryCondition.roleID - 1].decisionCommitStatus.length; i++) {
							if (doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].period == queryCondition.period) {
								doc.retailers[queryCondition.roleID - 1].decisionCommitStatus[i].isDecisionCommitted = queryCondition.value;
							}
						}
						doc.markModified('retailers');
						break;
				}
				doc.save(function(err) {
					if (!err) {
						io.sockets.emit('socketIO:committeDecision', {
							seminar: queryCondition.seminar,
							role: queryCondition.role,
							roleID: queryCondition.roleID,
							period: queryCondition.period
						});
						res.send(200, {
							result: 'success'
						});
					} else {
						res.send(400, {
							result: 'fail'
						});
					}
				})
			} else {
				res.send(404, 'there is no contract');
			}
		})
	}
}

exports.setCurrentPeriod = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminar: req.body.seminar,
			period: req.body.period
		}
		seminar.findOne({
			seminarCode: queryCondition.seminar
		}, function(err, doc) {
			if (err) {
				next(new Error(err))
			};
			if (doc) {
				doc.currentPeriod = queryCondition.period;
				doc.save(function(err) {
					if (!err) {
						io.sockets.emit('socketIO:seminarPeriodChanged', {
							currentPeriod: queryCondition.period,
							seminarCode: queryCondition.seminar,
							simulationSpan: doc.simulationSpan
						});
						res.send(200, {
							result: 'success'
						});
					} else {
						res.send(400, {
							result: 'fail'
						});
					}
				})
			} else {
				res.send(404, 'there is no such seminar...');
			}
		})
	}
}

exports.deleteSeminar = function(req, res, next) {
	console.log('try to remote a seminar:' + req.body.seminarCode);
	seminar.findOne({
		seminarCode: req.body.seminarCode
	}, function(err, doc) {
		if (err) {
			next(new Error(err));
		}
		if (!doc) {
			res.send(404, 'cannot find matched doc to remove....');
		} else {
			doc.remove(function(err, doc) {
				if (err) {
					res.send(400, 'remove seminar failure.');
				} else {
					res.send(200, 'delete');
				}
			});
		}
	});
}

exports.addSeminars = function(req, res, next) {
	var doc = new seminar({
		seminarCode: req.body.seminarCode,
		seminarDescription: req.body.seminarDescription
	});
	var retailerDoc, producerDoc;

	doc.facilitator.push({
		password: "310",
		facilitatorDescription: ""
	});
	for (var i = 1; i <= 4; i++) {
		producerDoc = {
			producerID: i,
			password: "1" + i + "0",
			decisionCommitStatus: [],
			reportPurchaseStatus: [],
			members: []
		};
		retailerDoc = {
			retailerID: i,
			password: "2" + i + "0",
			decisionCommitStatus: [],
			reportPurchaseStatus: [],
			members: []
		};
		for (var j = 0; j <= 6; j++) {
			producerDoc.decisionCommitStatus.push({
				period: j,
				isDecisionCommitted: false,
				isPortfolioDecisionCommitted: false,
				isContractDeal: false,
				isContractFinalized: false
			});

			retailerDoc.decisionCommitStatus.push({
				period: j,
				isDecisionCommitted: false,
				isContractDeal: false,
				isContractFinalized: false
			});
			if (j == 0) {
				producerDoc.reportPurchaseStatus.push({
					period: j,
					awareness: true,
					brandPerceptions: true,
					retailerPerceptions: true,
					marketShareByConsumerSegment: true,
					salesByConsumerSegment: true,
					marketShareByShopperSegment: true,
					salesByShopperSegment: true,
					BMRetailerPrices: true,
					promotionIntensity: true,
					supplierIntelligence: true,
					retailerIntelligence: true,
					forecasts: true
				});
				retailerDoc.reportPurchaseStatus.push({
					period: j,
					awareness: true,
					brandPerceptions: true,
					retailerPerceptions: true,
					marketShareByConsumerSegment: true,
					salesByConsumerSegment: true,
					marketShareByShopperSegment: true,
					salesByShopperSegment: true,
					BMRetailerPrices: true,
					promotionIntensity: true,
					supplierIntelligence: true,
					retailerIntelligence: true,
					forecasts: true
				});
			} else {
				producerDoc.reportPurchaseStatus.push({
					period: j,
					awareness: false,
					brandPerceptions: false,
					retailerPerceptions: false,
					marketShareByConsumerSegment: false,
					salesByConsumerSegment: false,
					marketShareByShopperSegment: false,
					salesByShopperSegment: false,
					BMRetailerPrices: false,
					promotionIntensity: false,
					supplierIntelligence: false,
					retailerIntelligence: false,
					forecasts: false
				});
				retailerDoc.reportPurchaseStatus.push({
					period: j,
					awareness: false,
					brandPerceptions: false,
					retailerPerceptions: false,
					marketShareByConsumerSegment: false,
					salesByConsumerSegment: false,
					marketShareByShopperSegment: false,
					salesByShopperSegment: false,
					BMRetailerPrices: false,
					promotionIntensity: false,
					supplierIntelligence: false,
					retailerIntelligence: false,
					forecasts: false
				});
			}
		};
		doc.retailers.push(retailerDoc);
		doc.producers.push(producerDoc);

	};
	doc.save(function(err) {
		if (!err) {
			res.send(200, doc);
		} else {
			res.send(400, err);
		}
	});
}

exports.updateSeminar = function(io) {

	return function(req, res, next) {
		var queryCondition = {
			seminarCode: req.body.seminarCode,
			currentPeriod: req.body.currentPeriod,
			behaviour: req.body.behaviour,
			/*
			password:edit password(need location ,additionalIdx,value)
			*/
			location: req.body.location,
			additionalIdx: req.body.additionalIdx,
			value: req.body.value
		};
		seminar.findOne({
			seminarCode: queryCondition.seminarCode
		}, function(err, doc) {
			if (err) {
				next(new Error(err));
			}
			if (!doc) {
				res.send(404, 'cannot find matched doc....');
			} else {
				var isUpdate = true;
				switch (queryCondition.behaviour) {
					case 'updatePassword':
						doc[queryCondition.location][queryCondition.additionalIdx].password = queryCondition.value;
						break;
					case 'updateCurrentPeriod':
						doc.currentPeriod = queryCondition.value;
						break;
					case 'switchTimer':
						doc.isTimerActived = queryCondition.value;
						break;
					case 'updateTimeslotPortfolioDecisionCommitted':
						doc.timeslotPortfolioDecisionCommitted = queryCondition.value;
						break;
					case 'updateTimeslotContractDeal':
						doc.timeslotContractDeal = queryCondition.value;
						break;
					case 'updateTimeslotContractFinalized':
						doc.timeslotContractFinalized = queryCondition.value;
						break;
					case 'updateTimeslotDecisionCommitted':
						doc.timeslotDecisionCommitted = queryCondition.value;
						break;
				}
				if (isUpdate) {
					doc.markModified('facilitator');
					doc.markModified('retailers');
					doc.markModified('producers');
					doc.save(function(err, doc, numberAffected) {
						if (err) {
							next(new Error(err));
						}
						if (queryCondition.behaviour == "updateCurrentPeriod") {
							io.sockets.emit('socketIO:seminarPeriodChanged', {
								currentPeriod: doc.currentPeriod,
								seminarCode: doc.seminarCode,
								simulationSpan: doc.simulationSpan
							});
						}

						if (queryCondition.behaviour == "switchTimer") {
							io.sockets.emit('socketIO:timerChanged', {
								period: doc.currentPeriod,
								seminar: doc.seminarCode,
								isTimerActived: queryCondition.value

							});
						}

						res.send(200, 'mission complete!');
					});
				}

			}
		});

	}
}

exports.submitOrder = function(io) {
	return function(req, res, next) {
		var queryCondition = {
			seminarCode: req.body.seminarCode,
			period: req.body.period,
			player: req.body.player,
			playerID: req.body.playerID,
			name: req.body.name,
			value: req.body.value
		};
		seminar.findOne({
			seminarCode: queryCondition.seminarCode
		}, function(err, doc) {
			if (err) {
				next(new Error(err));
			}
			if (!doc) {
				res.send(404, 'cannot find matched doc....');
			} else {
				var isUpdate = true;
				switch (queryCondition.player) {
					case 'Producer':
						for (var i = 0; i < doc.producers.length; i++) {
							if (doc.producers[i].producerID == queryCondition.playerID) {
								for (var j = 0; j < doc.producers[i].reportPurchaseStatus.length; j++) {
									if (doc.producers[i].reportPurchaseStatus[j].period == queryCondition.period) {
										doc.producers[i].reportPurchaseStatus[j][queryCondition.name] = queryCondition.value;
									}
								}
							}
						}
						break;
					case 'Retailer':
						for (var i = 0; i < doc.retailers.length; i++) {
							if (doc.retailers[i].retailerID == queryCondition.playerID) {
								for (var j = 0; j < doc.retailers[i].reportPurchaseStatus.length; j++) {
									if (doc.retailers[i].reportPurchaseStatus[j].period == queryCondition.period) {
										doc.retailers[i].reportPurchaseStatus[j][queryCondition.name] = queryCondition.value;
									}
								}
							}
						}
						break;
				}
				if (isUpdate) {
					doc.markModified('facilitator');
					doc.markModified('retailers');
					doc.markModified('producers');
					doc.save(function(err, doc, numberAffected) {
						if (err) {
							next(new Error(err));
						}
						if (queryCondition.player == "Producer") {
							io.sockets.emit('socketIO:producerMarketResearchOrdersChanged', {
								period: queryCondition.period,
								seminar: queryCondition.seminarCode,
								producerID: queryCondition.playerID
							});

						} else {
							io.sockets.emit('socketIO:retailerMarketResearchOrdersChanged', {
								period: queryCondition.period,
								seminar: queryCondition.seminarCode,
								retailerID: queryCondition.playerID
							});

						}
						console.log('save updated, number affected!:' + numberAffected + 'doc:' + doc);
						res.send(200, 'mission complete!');
					});
				}
			}
		})
	}
}

exports.getPlayerReportOrder = function(req, res, next) {
	seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err));
		}
		if (doc) {
			if (req.params.userType == "P") {
				for (var i = 0; i < doc.producers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
				if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].period == req.params.period) {
						res.send(200, doc.producers[req.params.playerID - 1].reportPurchaseStatus[i]);
						break;
					}
				}
			} else {
				for (var i = 0; i < doc.retailers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
					if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].period == req.params.period) {
						res.send(200, doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i]);
						break;
					}
				}
			}
		} else {
			res.send(404, 'cannot find matched doc....');
		}
	});
}

// exports.getPlayerReportOrderExpend = function(req, res, next) {
// 	seminar.findOne({
// 		seminarCode: req.params.seminar
// 	}, function(err, doc) {
// 		if (err) {
// 			next(new Error(err));
// 		}
// 		if (doc) {
// 			var result = 0;
// 			if (req.params.userType == "P") {
// 				for (var i = 0; i < doc.producers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].awareness) {
// 						result += doc.reportPrice.awareness;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].brandPerceptions) {
// 						result += doc.reportPrice.brandPerceptions;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].retailerPerceptions) {
// 						result += doc.reportPrice.retailerPerceptions;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].marketShareByConsumerSegment) {
// 						result += doc.reportPrice.marketShareByConsumerSegment;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].salesByConsumerSegment) {
// 						result += doc.reportPrice.salesByConsumerSegment;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].marketShareByShopperSegment) {
// 						result += doc.reportPrice.marketShareByShopperSegment;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].salesByShopperSegment) {
// 						result += doc.reportPrice.salesByShopperSegment;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].BMRetailerPrices) {
// 						result += doc.reportPrice.BMRetailerPrices;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].promotionIntensity) {
// 						result += doc.reportPrice.promotionIntensity;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].supplierIntelligence) {
// 						result += doc.reportPrice.supplierIntelligence;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].retailerIntelligence) {
// 						result += doc.reportPrice.retailerIntelligence;
// 					}
// 					if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].forecasts) {
// 						result += doc.reportPrice.forecasts;
// 					}
// 					res.send(200, {
// 						'result': result
// 					});
// 					break;
// 				}
// 				require('./producerDecision.js').getProducerReportOrder(req.params.seminar,req.params.period,req.params.playerID)
// 				.then(function(data){
// 					console.log('doc:'+doc+',data:'+data);
// 					// for(var i = 0; i < data.length; i++){
// 					// 	if(data[i]){
// 					// 		result+=doc.
// 					// 	}
// 					// }
// 					// for (var i = 0; i < doc.producers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
// 					// 	//if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].period == req.params.period) {
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].) {
// 					// 		result += doc.reportPrice.awareness;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i]) {
// 					// 		result += doc.reportPrice.brandPerceptions;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i]) {
// 					// 		result += doc.reportPrice.retailerPerceptions;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i]) {
// 					// 		result += doc.reportPrice.marketShareByConsumerSegment;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i]) {
// 					// 		result += doc.reportPrice.salesByConsumerSegment;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].marketShareByShopperSegment) {
// 					// 		result += doc.reportPrice.marketShareByShopperSegment;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].salesByShopperSegment) {
// 					// 		result += doc.reportPrice.salesByShopperSegment;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].BMRetailerPrices) {
// 					// 		result += doc.reportPrice.BMRetailerPrices;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].promotionIntensity) {
// 					// 		result += doc.reportPrice.promotionIntensity;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].supplierIntelligence) {
// 					// 		result += doc.reportPrice.supplierIntelligence;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].retailerIntelligence) {
// 					// 		result += doc.reportPrice.retailerIntelligence;
// 					// 	}
// 					// 	if (doc.producers[req.params.playerID - 1].reportPurchaseStatus[i].forecasts) {
// 					// 		result += doc.reportPrice.forecasts;
// 					// 	}
// 					// 	res.send(200, {
// 					// 		'result': result
// 					// 	});
// 					// 	break;
// 					// }
// 				},function(){

// 				})
// 			} else {
// 				for (var i = 0; i < doc.retailers[req.params.playerID - 1].reportPurchaseStatus.length; i++) {
// 					if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].period == req.params.period) {
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].awareness) {
// 							result += doc.reportPrice.awareness;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].brandPerceptions) {
// 							result += doc.reportPrice.brandPerceptions;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].retailerPerceptions) {
// 							result += doc.reportPrice.retailerPerceptions;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].marketShareByConsumerSegment) {
// 							result += doc.reportPrice.marketShareByConsumerSegment;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].salesByConsumerSegment) {
// 							result += doc.reportPrice.salesByConsumerSegment;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].marketShareByShopperSegment) {
// 							result += doc.reportPrice.marketShareByShopperSegment;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].salesByShopperSegment) {
// 							result += doc.reportPrice.salesByShopperSegment;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].BMRetailerPrices) {
// 							result += doc.reportPrice.BMRetailerPrices;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].promotionIntensity) {
// 							result += doc.reportPrice.promotionIntensity;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].supplierIntelligence) {
// 							result += doc.reportPrice.supplierIntelligence;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].retailerIntelligence) {
// 							result += doc.reportPrice.retailerIntelligence;
// 						}
// 						if (doc.retailers[req.params.playerID - 1].reportPurchaseStatus[i].forecasts) {
// 							result += doc.reportPrice.forecasts;
// 						}
// 						res.send(200, {
// 							'result': result
// 						});
// 						break;
// 					}
// 				}
// 			}
// 		} else {
// 			res.send(404, 'cannot find matched doc....');
// 		}
// 	})

// }

exports.getTimerActiveInfo = function(req, res, next) {
	seminar.findOne({
		seminarCode: req.params.seminar
	}, function(err, doc) {
		if (err) {
			next(new Error(err));
		}
		if (doc) {
			var result = {
				'result': doc.isTimerActived,
				'timeslotPortfolioDecisionCommitted': doc.timeslotPortfolioDecisionCommitted,
				'timeslotContractDeal': doc.timeslotContractDeal,
				'timeslotContractFinalized': doc.timeslotContractFinalized,
				'timeslotDecisionCommitted': doc.timeslotDecisionCommitted
			}
			res.send(200, result);
		} else {
			res.send(404, 'cannot find matched doc....');
		}
	})
}

exports.initializeSeminar = function(options) {
	var deferred = q.defer();

	console.log('initialise Seminar:' + options);
	var reqOptions = {
		hostname: options.cgiHost,
		port: options.cgiPort,
		path: options.cgiPath + '?seminar=' + options.seminar + '&span=' + options.simulationSpan + '&isTraceActive=' + options.traceActive + '&isTraditionalTradeActive=' + options.traditionalTradeActive + '&isEMallActive=' + options.EMallActive + '&isVirtualSupplierActive=' + options.virtualSupplierActive + '&isIndependentMarkets=' + options.independentMarkets + '&isForceNextDecisionsOverwrite=' + options.forceNextDecisionsOverwrite + '&market1ID=' + options.market1ID + '&market2ID=' + options.market2ID + '&category1ID=' + options.category1ID + '&category2ID=' + options.category2ID
	};

	http.get(reqOptions, function(response) {
		var data = '';
		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			data += chunk;
		}).on('end', function() {
			if (response.statusCode === (404 || 500))
				deferred.reject({
					msg: data
				});
			else {
				seminar.findOne({
					seminarCode: options.seminar
				}, function(err, doc) {
					if (err) {
						deferred.reject({
							msg: err
						});
					}
					if (!doc) {
						deferred.reject({
							msg: 'cannot find matched seminar : ' + options.seminar
						});
					}

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

					doc.save(function(err, doc, numberAffected) {
						if (err) {
							deferred.reject({
								msg: err
							});
						}
						deferred.resolve({
							msg: data
						})
					});
				});
			}
		}).on('error', function(e) {
			deferred.reject({
				msg: e.message
			});
		});
	})

	return deferred.promise;
}

exports.passiveSeminar = function(options) {
	var deferred = q.defer();
	seminar.findOne({
		seminarCode: options.seminar
	}, function(err, doc) {
		if (err) {
			deferred.reject({
				msg: err
			});
		}
		if (!doc) {
			deferred.reject({
				msg: 'cannot find matched seminar : ' + options.seminar
			});
		}
		var reqOptions = {
			hostname: options.cgiHost,
			port: options.cgiPort,
			path: options.cgiPath + '?seminar=' + doc.seminarCode + '&span=' + doc.simulationSpan + '&isTraceActive=' + doc.traceActive + '&isTraditionalTradeActive=' + doc.traditionalTradeActive + '&isEMallActive=' + doc.EMallActive + '&isVirtualSupplierActive=' + doc.virtualSupplierActive + '&isIndependentMarkets=' + doc.independentMarkets + '&isForceNextDecisionsOverwrite=' + doc.forceNextDecisionsOverwrite + '&market1ID=' + doc.market1ID + '&market2ID=' + doc.market2ID + '&category1ID=' + doc.category1ID + '&category2ID=' + doc.category2ID + '&period=' + options.period
		};
		http.get(reqOptions, function(response) {
			var data = '';
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				data += chunk;
			}).on('end', function() {
				if (response.statusCode === (404 || 500))
					deferred.reject({
						msg: data
					});
				else {
					deferred.resolve({
						msg: 'Get passive decision complete:' + data
					});
				}
			}).on('error', function(e) {
				deferred.reject({
					msg: e.message
				});
			});

		})
	});
	return deferred.promise;
}

exports.kernelSeminar = function(options) {
	var deferred = q.defer();
	seminar.findOne({
		seminarCode: options.seminar
	}, function(err, doc) {
		if (err) {
			deferred.reject({
				msg: err
			});
		}
		if (!doc) {
			deferred.reject({
				msg: 'cannot find matched seminar : ' + options.seminar
			});
		}
		var reqOptions = {
			hostname: options.cgiHost,
			port: options.cgiPort,
			path: options.cgiPath + '?seminar=' + doc.seminarCode + '&span=' + doc.simulationSpan + '&isTraceActive=' + doc.traceActive + '&isTraditionalTradeActive=' + doc.traditionalTradeActive + '&isEMallActive=' + doc.EMallActive + '&isVirtualSupplierActive=' + doc.virtualSupplierActive + '&isIndependentMarkets=' + doc.independentMarkets + '&isForceNextDecisionsOverwrite=' + doc.forceNextDecisionsOverwrite + '&market1ID=' + doc.market1ID + '&market2ID=' + doc.market2ID + '&category1ID=' + doc.category1ID + '&category2ID=' + doc.category2ID + '&period=' + options.period

		};
		http.get(reqOptions, function(response) {
			var data = '';
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				data += chunk;
			}).on('end', function() {
				if (response.statusCode === (404 || 500))
					deferred.reject({
						msg: data
					});
				else {
					deferred.resolve({
						msg: 'Run kernel complete:' + data
					});
				}
			}).on('error', function(e) {
				deferred.reject({
					msg: e.message
				});
			});
		})
	});
	return deferred.promise;
}

function duplicateSeminarDoc(options) {
	var deferred = q.defer();

	seminar.findOne({
		seminarCode: options.originalSeminarCode
	}, function(err, doc) {
		if (err) {
			deferred.reject({
				msg: err
			});
		}
		if (doc) {
			deferred.resolve({
				msg: 'duplicate seminar document complete.'
			});
		} else {
			deferred.reject({
				msg: 'cannot find matched seminar : ' + options.originalSeminarCode
			});
		}
	})

	return deferred.promise;
}

exports.duplicateSeminar = function(req, res, next) {
	var queryCondition = {
		originalSeminarCode: req.body.originalSeminarCode,
		targetSeminarCode: req.body.targetSeminarCode,
		seminarDescription: req.body.seminarDescription
	}

	console.log('query:' + util.inspect(queryCondition));
	duplicateSeminarDoc(queryCondition)
	//deal with promises chain 						
	.then(function(result) { //log the success info
		io.sockets.emit('AdminProcessLog', {
			msg: result.msg,
			isError: false
		});
		res.send(200, result.msg);
	}, function(error) { //log the error
		console.log(error.msg);
		io.sockets.emit('AdminProcessLog', {
			msg: error.msg,
			isError: true
		});
		res.send(404, error.msg);
	}, function(progress) { //log the progress
		io.sockets.emit('AdminProcessLog', {
			msg: progress.msg,
			isError: false
		});
	})
}

function createNewTimer(seminarCode, countDown, io, timersEvents) {
	newTimer = setInterval(function() {
		countDown.pass++;
		if (countDown.portfolio > 0) {
			countDown.portfolio--;
		} else if (countDown.contractDeal > 0) {
			countDown.contractDeal--;
		} else if (countDown.contractFinalized > 0) {
			countDown.contractFinalized--;
		} else if (countDown.contractDecisionCommitted > 0) {
			countDown.contractDecisionCommitted--;
		}
		io.sockets.emit('socketIO:timerWork', {
			'seminar': seminarCode,
			'pass': countDown.pass,
			'portfolio': countDown.portfolio,
			'contractDeal': countDown.contractDeal,
			'contractFinalized': countDown.contractFinalized,
			'contractDecisionCommitted': countDown.contractDecisionCommitted
		});
		if (countDown.pass == countDown.timersEvent[0]) {
			timersEvents.emit('deadlinePortfolio', seminarCode, io);
			// io.sockets.emit('socketIO:deadlinePortfolio', {
			// 	'seminar': seminarCode,
			// 	'pass': countDown.pass,
			// 	'portfolio': countDown.portfolio,
			// 	'contractDeal': countDown.contractDeal,
			// 	'contractFinalized': countDown.contractFinalized,
			// 	'contractDecisionCommitted': countDown.contractDecisionCommitted
			// });

		} else if (countDown.pass == countDown.timersEvent[1]) {
			timersEvents.emit('deadlineContractDeal', seminarCode, io);
			// io.sockets.emit('socketIO:deadlineContractDeal', {
			// 	'seminar': seminarCode,
			// 	'pass': countDown.pass,
			// 	'portfolio': countDown.portfolio,
			// 	'contractDeal': countDown.contractDeal,
			// 	'contractFinalized': countDown.contractFinalized,
			// 	'contractDecisionCommitted': countDown.contractDecisionCommitted
			// });

		} else if (countDown.pass == countDown.timersEvent[2]) {
			timersEvents.emit('deadlineContractFinalized', seminarCode, io);
			// io.sockets.emit('socketIO:deadlineContractFinalized', {
			// 	'seminar': seminarCode,
			// 	'pass': countDown.pass,
			// 	'portfolio': countDown.portfolio,
			// 	'contractDeal': countDown.contractDeal,
			// 	'contractFinalized': countDown.contractFinalized,
			// 	'contractDecisionCommitted': countDown.contractDecisionCommitted
			// });

		} else if (countDown.pass == countDown.timersEvent[3]) {
			timersEvents.emit('deadlineDecisionCommitted', seminarCode, io);
			// io.sockets.emit('socketIO:deadlineDecisionCommitted', {
			// 	'seminar': seminarCode,
			// 	'pass': countDown.pass,
			// 	'portfolio': countDown.portfolio,
			// 	'contractDeal': countDown.contractDeal,
			// 	'contractFinalized': countDown.contractFinalized,
			// 	'contractDecisionCommitted': countDown.contractDecisionCommitted
			// });
		}
	}, 1000);
	newTimer.seminarCode = seminarCode;
	return newTimer;
}

exports.setTimer = function(io) {
	var timers = [];
	var timersEvents = new events.EventEmitter();


	timersEvents.on('deadlinePortfolio', function(seminarCode, io) {
		//set isPortfolioDecisionCommitted = true for all the suppliers 
		//then do all the related io.sockets.emit()...
		console.log('deadlinePortfolio');

		seminar.findOne({
			seminarCode: seminarCode
		}, function(err, doc) {
			var result = new Array();
			if (doc) {
				for (var i = 0; i < 3; i++) {
					if (doc.producers[i].decisionCommitStatus[doc.currentPeriod].isPortfolioDecisionCommitted) {} else {
						doc.producers[i].decisionCommitStatus[doc.currentPeriod].isPortfolioDecisionCommitted = true;
						result.push({
							'producerID': i + 1
						});
					}
				}
			}
			require('./contract.js').addContractByAdmin(doc.seminarCode, doc.currentPeriod, result);
			require('./contract.js').addContractDetailsByAdmin(doc.seminarCode, doc.currentPeriod, result);

			doc.markModified('producers');
			io.sockets.emit('socketIO:committedPortfolio', {
				result: result,
				seminarCode: doc.seminarCode,
				period: doc.currentPeriod
			});
			doc.save();
		});



	}).on('deadlineContractDeal', function(seminarCode) {
		//....
		console.log('deadlineContractDeal');
		seminar.findOne({
			seminarCode: seminarCode
		}, function(err, doc) {
			if (doc) {
				doc.producers[0].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.producers[1].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.producers[2].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.producers[3].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.retailers[0].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.retailers[1].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.retailers[2].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
				doc.retailers[3].decisionCommitStatus[doc.currentPeriod].isContractDeal = true;
			}
			//
			require('./contract.js').dealContractsByAdmin(doc.seminarCode, doc.currentPeriod);

			doc.markModified('producers');
			doc.markModified('retailers');
			io.sockets.emit('socketIO:dealContract', {
				reult: [{
					producerID: 1
				}, {
					producerID: 2
				}, {
					producerID: 3
				}],
				seminar: doc.seminar,
				period: doc.period
			});
			doc.save();
		})

	}).on('deadlineContractFinalized', function(seminarCode) {
		//....
		console.log('deadlineContractFinalized');
		seminar.findOne({
			seminarCode: seminarCode
		}, function(err, doc) {
			if (doc) {
				doc.producers[0].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.producers[1].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.producers[2].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.producers[3].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.retailers[0].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.retailers[1].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.retailers[2].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
				doc.retailers[3].decisionCommitStatus[doc.currentPeriod].isContractFinalized = true;
			}
			doc.markModified('producers');
			doc.markModified('retailers');

			doc.save(function() {
				io.sockets.emit('socketIO:finalizeContract', {
					'seminarCode': doc.seminarCode,
					'period': doc.currentPeriod
				});
			});
		})


	}).on('deadlineDecisionCommitted', function(seminarCode) {
		//....
		console.log('deadlineDecisionCommitted');

		seminar.findOne({
			seminarCode: seminarCode
		}, function(err, doc) {
			if (doc) {
				doc.producers[0].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.producers[1].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.producers[2].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.producers[3].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.retailers[0].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.retailers[1].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.retailers[2].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
				doc.retailers[3].decisionCommitStatus[doc.currentPeriod].isDecisionCommitted = true;
			}
			doc.markModified('producers');
			doc.markModified('retailers');
			doc.save(function() {
				io.sockets.emit('socketIO:committeDecision', {
					'seminarCode': doc.seminarCode,
					'period': doc.currentPeriod
				});
			});
		})

		singleTimer = _.find(timers, function(obj) {
			return obj.seminarCode == seminarCode;
		});

		if (singleTimer) {
			clearInterval(singleTimer);
			console.log('timer is cleared ' + seminarCode + ' from event.');
		}
	});

	return function(req, res, next) {
		var seminarCode = req.body.seminarCode;
		var countDown = {
			pass: 0,
			portfolio: parseInt(req.body.portfolio),
			contractDeal: parseInt(req.body.contractDeal),
			contractFinalized: parseInt(req.body.contractFinalized),
			contractDecisionCommitted: parseInt(req.body.contractDecisionCommitted),
			timersEvent: [parseInt(req.body.portfolio), parseInt(req.body.portfolio) + parseInt(req.body.contractDeal), parseInt(req.body.portfolio) + parseInt(req.body.contractDeal) + parseInt(req.body.contractFinalized), parseInt(req.body.portfolio) + parseInt(req.body.contractDeal) + parseInt(req.body.contractFinalized) + parseInt(req.body.contractDecisionCommitted)]
		};


		timer = _.find(timers, function(obj) {
			return obj.seminarCode == req.body.seminarCode;
		});

		console.log('timers : ' + util.inspect(timers));
		//find existed timer in memory
		console.log((timer == undefined) && (req.body.active == 'switchOn'));
		if (timer) {
			console.log('find timer: ' + util.inspect(timer));

			//user choose to reset
			if (req.body.active == 'switchOn') {
				//remove existed one first 
				clearInterval(timer);
				timers = _.reject(timers, function(obj) {
					return obj.seminarCode == timer.seminarCode;
				});
				timers.push(createNewTimer(req.body.seminarCode, countDown, io, timersEvents));
				res.send(200, {
					'msg': 'reset timer:' + req.body.seminarCode,
					'seminar': seminarCode,
					'pass': countDown.pass,
					'portfolio': countDown.portfolio,
					'contractDeal': countDown.contractDeal,
					'contractFinalized': countDown.contractFinalized,
					'contractDecisionCommitted': countDown.contractDecisionCommitted
				});
				//user choose to stop timer
			} else {
				clearInterval(timer);
				//io.sockets.emit('socketIO:timerStop',{'seminarCode':req.body.seminarCode});
				res.send(200, 'stop timer: ' + timer.seminarCode);
			}

			//create a new timer and push into memory
			//if timer requested is not existed and user choose to start a new one instead of stopping existed one
		} else if ((timer == undefined) && (req.body.active == 'switchOn')) {

			timers.push(createNewTimer(req.body.seminarCode, countDown, io, timersEvents));
			res.send(200, {
				'msg': 'start a new timer:' + req.body.seminarCode,
				'seminar': seminarCode,
				'pass': countDown.pass,
				'portfolio': countDown.portfolio,
				'contractDeal': countDown.contractDeal,
				'contractFinalized': countDown.contractFinalized,
				'contractDecisionCommitted': countDown.contractDecisionCommitted
			});
		} else if ((timer == undefined) && (req.body.active == 'switchOff')) {
			res.send(400, 'cannot stop nonexistent timer: ' + req.body.seminarCode);
		}

	}
}
