var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_forcastsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    //Importance means Size in (%), saved in file as a decimal
    minConsumerSegmentsImportance : [categorySegmentInfoSchema], 
    maxConsumerSegmentsImportance : [categorySegmentInfoSchema],

    minShopperSegmentsImportance  : [categoryShopperInfoSchema],
    maxShopperSegmentsImportance  : [categoryShopperInfoSchema],

    minTotalVolume                : [categoryInfoSchema],
    maxTotalVolume                : [categoryInfoSchema],

    minInternetPenetrationRate    : [periodInfoSchema],
    maxInternetPenetrationRate    : [periodInfoSchema],
})


var categorySegmentInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)x,
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
    periodInfo : [periodInfoSchema],
})




var categoryShopperInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    periodInfo : [periodInfoSchema],
})




var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    periodInfo : [periodInfoSchema],    
})




var periodInfoSchema = mongoose.Schema({
    period : Number, //-2,-1,0,1,2
    value : [Number] //0-Urban, 1-Rural        
})

var MR_forcasts=mongoose.model('MR_forcasts',MR_forcastsSchema);

exports.addMR_forcasts=function(req,res,next){
    var newMR_forcasts=MR_forcasts({});
    newMR_forcasts.save(function(err) {
        if(!err){
            res.send(200,newMR_forcasts);
            console.log("created new GeneralReport:"+newMR_forcasts);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_forcasts=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_forcasts.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

