var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailerPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    storeInfo : [variantInfoSchema],
})

var storeInfoSchema = mongoose.Schema({
    storeID : Number, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //1-Urban, 2-Rural
    previousPerception                   : [Number], //0-Price, 1-Convenience
    latestPerception                     : [Number], //0-Price, 1-Convenience
    perceptionChange                     : [Number]  //0-Price, 1-Convenience    
})
