var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
	uniqueValidator = require('mongoose-unique-validator');    

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
	decisionReadyPeriod : Number
	members : [memberSchema]	
})

var facilitatorSchema = mongoose.Schema({
	facilitatorDescription : String,
	password : String,
})

var memberSchema = mongoose.Schema({
	name : String,
	description : Stirng
})

