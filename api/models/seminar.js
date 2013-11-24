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
	producers : [producerSchema],
	retailers : [retailerSchema],
	facilitator : [facilitatorSchema]
})

var producerSchema = mongoose.Schema({
	producerID : Number, //1,2,3
	password : String,
	newProductDecisionReadyPeriod : Number,
	decisionReadyPeriod : Number,
	members : [memberSchema]
})

var retailerSchema = mongoose.Schema({
	retailerID : Number, //1,2,3
	password : String,
	decisionReadyPeriod : Number,
	members : [memberSchema]	
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

exports.newDoc=function(req,res,next){
	var newDoc=new seminar({
		seminarCode : "Jan",
		seminarDescription : "Jan", 
		seminarDate : 2013-1-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar1 insert');
    });
    newDoc=new seminar({
		seminarCode : "Feb",
		seminarDescription : "Feb", 
		seminarDate : 2013-2-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar2 insert');
    });
    newDoc=new seminar({
		seminarCode : "Mar",
		seminarDescription : "Mar", 
		seminarDate : 2013-3-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar3 insert');
    });
    newDoc=new seminar({
		seminarCode : "Apr",
		seminarDescription : "Apr", 
		seminarDate : 2013-4-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar4 insert');
    });
    newDoc=new seminar({
		seminarCode : "MAY",
		seminarDescription : "MAY", 
		seminarDate : 2013-5-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar5 insert');
    });
    newDoc=new seminar({
		seminarCode : "Jun",
		seminarDescription : "Jun", 
		seminarDate : 2013-6-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar6 insert');
    });
    newDoc=new seminar({
		seminarCode : "Jul",
		seminarDescription : "Jul", 
		seminarDate : 2013-7-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar7 insert');
    });
    newDoc=new seminar({
		seminarCode : "Aug",
		seminarDescription : "Aug", 
		seminarDate : 2013-8-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar8 insert');
    });
    newDoc=new seminar({
		seminarCode : "Sep",
		seminarDescription : "Sep", 
		seminarDate : 2013-9-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar9 insert');
    });
    newDoc=new seminar({
		seminarCode : "Oct",
		seminarDescription : "Oct", 
		seminarDate : 2013-10-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar10 insert');
    });
    newDoc=new seminar({
		seminarCode : "Nov",
		seminarDescription : "Nov", 
		seminarDate : 2013-11-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar11 insert');
    });
    newDoc=new seminar({
		seminarCode : "Dec",
		seminarDescription : "Dec", 
		seminarDate : 2013-12-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar12 insert');
    });
    newDoc=new seminar({
		seminarCode : "Mon",
		seminarDescription : "Mon", 
		seminarDate : 2014-1-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar13 insert');
    });
    newDoc=new seminar({
		seminarCode : "Tues",
		seminarDescription : "Tues", 
		seminarDate : 2014-2-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar14 insert');
    });
    newDoc=new seminar({
		seminarCode : "Wed",
		seminarDescription : "Wed", 
		seminarDate : 2014-3-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar15 insert');
    });
    newDoc=new seminar({
		seminarCode : "Thur",
		seminarDescription : "Thur", 
		seminarDate : 2014-4-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar16 insert');
    });
    newDoc=new seminar({
		seminarCode : "Fri",
		seminarDescription : "Fri", 
		seminarDate : 2014-5-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar17 insert');
    });
    newDoc=new seminar({
		seminarCode : "Sat",
		seminarDescription : "Sat", 
		seminarDate : 2014-6-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar18 insert');
    });
    newDoc=new seminar({
		seminarCode : "Sun",
		seminarDescription : "Sun", 
		seminarDate : 2014-7-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar19 insert');
    });
    newDoc=new seminar({
		seminarCode : "Raven",
		seminarDescription : "Raven", 
		seminarDate : 2014-8-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar20 insert');
    });
    newDoc=new seminar({
		seminarCode : "Monsoul",
		seminarDescription : "Monsoul", 
		seminarDate : 2014-9-1,
		currentPeriod : 0,
		isInitialise : false, //when user login, need check this value
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	newDoc.save(function(err){
        if(err){
            next (new Error(err));
        }
        console.log('seminar21 insert');
        res.send(200,'seminar insert success');
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
	console.log(req.params.seminar);
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

exports.addSeminar=function(req,res,next){
	
	var Newseminar = new seminar({
		seminarCode: req.body.seminarCode,
		seminarDescription: req.body.seminarDescription,
		seminarDate: Date.now(),
		currentPeriod:req.body.currentPeriod,
		isInitialise:false,
		producers : [{
			producerID : 1,
			password : "110",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 2,
			password : "120",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			producerID : 3,
			password : "130",
			newProductDecisionReadyPeriod : 1,
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		retailers : [{
			retailerID : 1,
			password : "210",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 2,
			password : "220",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		},{
			retailerID : 3,
			password : "230",
			decisionReadyPeriod : 0,
			members : [{
				name : "Tom",
				description: "Tom and Jack"
			},{
				name : "Jack",
				description: "Tom and Jack"			
			}]
		}],
		facilitator : [{
			facilitatorDescription : "Help you",
			password : "310"
		}]
	});
	Newseminar.save(function(err) {
		if(!err){
			res.send(200,Newseminar);
			console.log("created new seminar:"+Newseminar);
		} else {
			res.send(400,err);
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
	console.log(queryCondition);
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
