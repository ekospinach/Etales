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
var marketShareSchema = mongoose.Schema({
	period : Number,
    seminar : String,
	actorInfo : [actorInfoSchema],    
})

var actorInfoSchema = mongoose.Schema({
	actorID 					 : Number, //TActors : 1~(4+3)
    /*
        1 - Supplier 1
        2 - Supplier 2
        3 - Supplier 3
        4 - Supplier 4
        5 - Retailer 1
        6 - Retailer 2
        7 - Traditional Trade         
    */
    actorCategoryInfo : [actorCategoryInfoSchema]
})

var actorCategoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    actorMarketInfo : [actorMarketInfoSchema],
})

var actorMarketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketTotal : 1~(2+1)
    actorSegmentInfo : [actorSegmentInfoSchema]
})

var actorSegmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)
    actorShopperInfo : [actorShopperInfoSchema]
})

var actorShooperInfoSchma = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    grsom_MarketShareValue         : Number, //CategoryID : 1~3
    grsom_MarketShareVolume        : Number, //CategoryID : 1~2
    grsom_MarketShareValueChange   : Number, //CategoryID : 1~3
    grsom_MarketShareVolumeChange  : Number, //CategoryID : 1~2
})