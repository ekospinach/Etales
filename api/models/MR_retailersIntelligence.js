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
var MR_retailersIntelligence=mongoose.model('MR_retailersIntelligence',MR_retailersIntelligenceSchema);

exports.addMR_retailersIntelligence=function(req,res,next){
    var newMR_retailersIntelligence=MR_retailersIntelligence({});
    newMR_retailersIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_retailersIntelligence);
            console.log("created new GeneralReport:"+newMR_retailersIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailersIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_retailersIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
