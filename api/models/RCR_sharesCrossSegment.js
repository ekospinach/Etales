var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var RCR_sharesCrossSegmentSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    absoluteValue     : [variantInfoSchema],
    change            : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID  : Number,
    parentCompanyID   : Number,
    marketInfo: [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarkets : 1~2
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1),
    /*
        Elecssories:
        1-PriceSensitive
        2-Value for Money
        3-Fashion
        4-Freaks
        5-Total

        HealthBeauties:
        1-PriceSensitive
        2-Value for Money
        3-Health Conscious
        4-Impatient      
        5-Total
    */
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    value : Number,
})

var RCR_sharesCrossSegment=mongoose.model('RCR_sharesCrossSegment',RCR_sharesCrossSegmentSchema);

exports.addRCR_sharesCrossSegment=function(req,res,next){

}

exports.getRCR_sharesCrossSegment=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    RCR_sharesCrossSegment.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
