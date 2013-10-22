var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var quarterHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	categoryView : [categoryViewSchema] //TCategoriesTotal(1~3)
})

var categoryViewSchema = mongoose.Schema({
	categoryMarketView = [categoryMarketViewSchema] //TMarketsTotal(1~3)
})

var categoryMarketViewSchema = mongoose.Schema({
	//q...
	segmentsVolumes : [Number]; //1~5, 5 for total
})