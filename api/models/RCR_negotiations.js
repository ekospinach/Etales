var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var RCR_negotiationsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)

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
    producerInfo : [producerInfoSchema]
})

var producerInfoSchema = mongoose.Schema({
    producerID : Number, 
    // TAllProducers : 1~4
    // Again, the rows for Supplier_4 brands should only be added if he was ACTIVE player 
    value : Number,
})


