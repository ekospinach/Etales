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
// var generalReportsSchema = mongoose.Schema({
// 	period : Number,
//     seminar : String,
// 	actorInfo : [actorInfoSchema],    
// })

// var actorInfoSchema = mongoose.Schema({
// 	actorID 					 : Number, //TActors : 1~(4+3)
//     /*
//         1 - Supplier 1
//         2 - Supplier 2
//         3 - Supplier 3
//         4 - Supplier 4
//         5 - Retailer 1
//         6 - Retailer 2
//         7 - Traditional Trade         
//     */
//     grph_OperatingProfit         : Number,
//     grph_OperatingProfitChange   : Number,
//     grph_CumulativeInvestment    : Number,
//     actorCategoryInfo : [actorCategoryInfoSchema]
// })

// var actorCategoryInfoSchema = mongoose.Schema({
//     categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
//     //Performance Highlights 
//     grph_SalesVolume             : Number, //CategoryID : 1~2
//     grph_NetSalesValue           : Number, //CategoryID : 1~3
    
//     grph_ValueMarketShare        : Number, //CategoryID : 1~2
//     grph_VolumeMarketShare       : Number, //CategoryID : 1~3

//     grph_NetSalesValueChange     : Number, //CategoryID : 1~2
//     grph_ValueMarketShareChange  : Number, //CategoryID : 1~2
//     grph_VolumeMarketShareChange : Number, //CategoryID : 1~3
//     grph_SalesVolumeChange       : Number, //CategoryID : 1~3

//     actorMarketInfo : [actorMarketInfoSchema],
//   //  variantInfo : [variantInfoSchema]
// })

// var actorMarketInfoSchema = mongoose.Schema({
//     marketID : Number, //TMarketTotal : 1~(2+1)
//     actorSegmentInfo : [actorSegmentInfoSchema]
// })

// var actorSegmentInfoSchema = mongoose.Schema({
//     segmentID : Number, //TSegmentsTotal : 1~(4+1)
//     actorShopperInfo : [actorShopperInfoSchema]
// })

// var actorShooperInfoSchma = mongoose.Schema({
//     shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
//     //SharesOfMarket
//     grsom_MarketShareValue         : Number, //CategoryID : 1~3
//     grsom_MarketShareVolume        : Number, //CategoryID : 1~2
//     grsom_MarketShareValueChange   : Number, //CategoryID : 1~3
//     grsom_MarketShareVolumeChange  : Number, //CategoryID : 1~2
//     //MarketSales
//     grms_MarketNetSalesValue       : Number, //CategoryID : 1~3
//     grms_MarketSalesVolume         : Number, //CategoryID : 1~2
//     grms_MarketNetSalesValueChange : Number, //CategoryID : 1~3
//     grms_MarketSalesVolumeChange   : Number, //CategoryID : 1~2
// })

// var variantInfo = mongoose.Schema({
//     varName : String,
//     varID : Number,
//     parentBrandID : Number,
//     parentBrandName : String,
//     packFormat : String,
//     vc_composition : [Number], // TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//     vemp_NetOnlinePrice  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
//     vemp_PriceChange     : Number, //TAllProducer : 1~4 (ProsMaxPlus)
//     vemp_Promotions      : Number, //TAllProducer : 1~4 (ProsMaxPlus)
// })



