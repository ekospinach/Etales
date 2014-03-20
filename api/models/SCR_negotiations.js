var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_negotiationsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vnd_QuantityDiscount  : {
        discount_MinimumVolume : [variantInfoSchema]
        discount_Rate          : [variantInfoSchema]
    }
    vnd_TargetBonus       : {
        bonus_TargetVolume : [variantInfoSchema]
        bonus_Rate         : [variantInfoSchema]
        bonus_Value        : [variantInfoSchema]        
    }
    vnd_PaymentTerms      : [variantInfoSchema]
    vnd_OtherCompensation : [variantInfoSchema]
    vnd_ContractHonoured  : [variantInfoSchema],  
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    modernRetailerInfo : [modernRetailerInfoSchema]
})

var modernRetailerInfoSchema = mongoose.Schema({
    modernRetailerID : Number, // 1 or 2
    value : Number,
})


