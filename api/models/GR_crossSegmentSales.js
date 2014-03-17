var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)
var crossSegmentSalesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    marketInfo : [marketInfoSchema],
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketTotal : 1~(2+1)
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)
    shopperInfo : [shopperInfoSchema]
})

var shooperInfoSchma = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    grcss_CrossSegmentsNetValues : Number,
    grcss_CrossSegmentsVolumes : Number
})

