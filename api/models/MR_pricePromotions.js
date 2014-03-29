var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_pricePromotionsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    accountInfo : [accountInfoSchema]
})

var accountInfoSchema = mongoose.Schema({
    accountID : Number, //1~4:AccountMax
    promoFrequency : [Number], //0-Urban, 1-Rural, { saved as # of weeks }
    promoRate   : [Number], //0-Urban, 1-Rural, { saved as a decimal  }
})

