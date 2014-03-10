var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');



//TActors : 1~(4+3)
//TActiveActors : 1~(3+2)
var generalReportsSchema = mongoose.Schema({
	period : Number,
	actorInfo : [actorInfoSchema]
})

var actorInfoSchema = mongoose.Schema({
	actorID 					 : Number, //1~(4+3)
	grph_SalesVolume 			 : [Number], //1~2
    grph_NetSalesValue           : [Number], //1~2
    grph_ValueMarketShare        : [Number], //1~2
    grph_NetSalesValueChange     : [Number], //1~2
    grph_ValueMarketShareChange  : [Number], //1~2

    grph_VolumeMarketShareChange : [Number], //1~3
    grph_SalesVolumeChange       : [Number], //1~3
    grph_VolumeMarketShare       : [Number], //1~3

    grph_OperatingProfit         : Number,
    grph_OperatingProfitChange   : Number,
    grph_CumulativeInvestment    : Number,
})

