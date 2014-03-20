var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrkpi_TradeSpendingEffectiveness : [categoryInfoSchema],
    scrkpi_MarketingEffectiveness     : [categoryInfoSchema],
    scrkpi_ChannelSalesValueShare     : [categoryInfoSchema],
    scrkpi_ChannelSalesVolumeShare    : [categoryInfoSchema],
    scrkpi_ShoppersShare              : [categoryInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})

