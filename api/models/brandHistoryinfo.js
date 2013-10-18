var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var brandHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandName : String,
    brandID : Number,
    dateOfBirth : Number, //-4~10
    dateOfDeath : Number, //-4~10
    parentCatID : Number,    
    parentCompanyID : Number, (1~9)
    
    supplierView : supplierViewSchema, 
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
})

var supplierViewSchema = mongoose.Schema({
    //b...
    awareness : [Number], //length: TMarketsDetails(1~2)
    socialNetworksScore : [{
        sentiment : Number,
        strength : Number
    }]    //length: TMarketsTotalDetails(1~3)
})

var channelViewSchema = mongoose.Schema({
    visibilityShare : [Number] //length: TMarketsTotalDetails(1~3)
})

