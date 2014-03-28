var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_supplierIntelligenceSchema = mongoose.Schema({
    period : Number,
    seminar : String,

    supplierInfo : [supplierInfoSchema],
})

var supplierInfoSchema = mongoose.Schema({
    supplierID : Number,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~3 
    dvertisingOnLine              : Number,
    onLine_Visibility             : Number,
    onLine_Other                  : Number,
    acquiredTechnologyLevel       : Number,
    acquiredDesignLevel           : Number,
    productionCapacityAvailable   : Number,
    capacityUtilisationRate       : Number,
    productionplanningFlexibility : Number,    

    advertisingOffLine            : [Number], //0-Urban, 1-Rural, 2-Total

    actualTradeSupport            : [BMretailerInfoSchema], //BMRetsMax = 3
    negotiatedTradeSupport        : [BMretailerInfoSchema]
})

var BMretailerInfoSchema = mongoose.Schema({
    BMretailerID : Number, //1~BMRetsMax(3), 1-Retailer1, 2-Retailer2, 3-TraditionalTrade
    value : [Number] //0-Urban, 1-Rural, 2-Total
})


