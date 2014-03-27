var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_variantPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number,
    previousPerception                   : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    latestPerception                     : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    perceptionChange                     : [Number]  //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal    
})


