var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailersIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerInfo : [retailerInfoSchema],
})

var retailerInfoSchema = mongoose.Schema({
    retailerID : Number, //1~3     
    storeServiceLevel : [String], //0-Urban, 1-Rural
//    storePerceptionInfo : [storePerceptionInfoSchema],
    onlineAdvertising : [Number], //0-Urban, 1-Rural
    offlineAdvertising : [Number], //0-Urban, 1-Rural
    localAdvertising : [Number],//0-Urban, 1-Rural
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    shelfSpace                           : [Number], //0-Urban, 1-Rural
})

// var storePerceptionInfoSchema = mongoose.Schema({
//     perception : String, //PRICE, CONVENIENCE, TOTAL
//     onlineAdvertising : Number,
//     offlineAdvertising : Number,
//     localAdvertising : [Number], //0-Urban, 1-Rural               
// })
