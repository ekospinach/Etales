var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');


var oneQuarterExogenousDataSchema = mongoose.Schema({
    seminar    : String,
    period     : Number,
    marketID   : Number,
    categoryID : Number,
    MinBMPriceVsCost                : Number,
    MaxBMPriceVsCost                : Number,
    IngredientsQualityVsATLGap      : Number,
    ActiveAgentVsSmoothenerGap      : Number,
    MaxTargetVolumeVsTotalMarket    : Number,
    MinOnlinePriceVsCost            : Number,
    MaxOnlinePriceVsCost            : Number,
    MaxCapacityReduction            : Number,
    MaxCapacityIncrease             : Number,
    Supplier4AcquiredLevelsGapForPL : Number,
    MinPLPriceVsCost                : Number,
    MaxPLPriceVsCost                : Number,
    MinRetailPriceVsNetBMPrice      : Number,
    MaxRetailPriceVsNetBMPrice      : Number,    
})

var oneQuarterExogenousDataSchema = mongoose.model('bg_oneQuarterExogenousData');
