var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var RCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    
    rcrkpi_VolumeRotationIndex        : [categoryInfoSchema],
    rcrkpi_ValueRotationIndex         : [categoryInfoSchema],
    rcrkpi_ProfitabilityIndex         : [categoryInfoSchema],
    rcrkpi_StockCover                 : [categoryInfoSchema],
    rcrkpi_ShoppersShare              : [shoperInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,
    value : [Number], //0-Urban, 1-Rural, 2-Total
})

var shoperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS})
    categoryInfo : [categoryInfoSchema]
})

