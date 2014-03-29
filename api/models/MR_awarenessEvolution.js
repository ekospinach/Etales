var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var MR_awarenessEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandInfo : [brandInfoSchema],
})

var brandInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, 
    previousAwareness                    : [Number], //0-Urban, 1-Rural
    previousLatestAwareness              : [Number] //0-Urban, 1-Rural
})
