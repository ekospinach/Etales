var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_channelsProfitabilitySchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrcp_VolumeOrdered    : [categoryInfoSchema],
    scrcp_VolumeSold       : [categoryInfoSchema],
    scrcp_VolumeSoldShare  : [categoryInfoSchema],
    scrcp_SalesValue       : [categoryInfoSchema],
    scrcp_SalesValueShare  : [categoryInfoSchema],
    scrcp_CostOfGoodsSold  : [categoryInfoSchema],
    scrcp_TradeSupport     : [categoryInfoSchema],
    scrcp_TradeProfit      : [categoryInfoSchema],
    scrcp_TradeProfitShare : [categoryInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,  //TCategoriesTotal : 1~3 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketsTotal : 1~3
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //TAccounts : 1~ 4, Two Modern Retailers + Traditional Trade + On-Line 
    value : Number,
})

