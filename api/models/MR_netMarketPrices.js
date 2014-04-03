var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_netMarketPricesSchema = mongoose.Schema({
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
    previousNetMarketPrice : [Number], //0-Urban, 1-Rural
    latestNetMarketPrice   : [Number], //0-Urban, 1-Rural
    netMarketPriceChange   : [Number], //0-Urban, 1-Rural   
})

var MR_netMarketPrices=mongoose.model('MR_netMarketPrices',MR_netMarketPricesSchema);

exports.addMR_netMarketPrices=function(req,res,next){
    var newMR_netMarketPrices=MR_netMarketPrices({});
    newMR_netMarketPrices.save(function(err) {
        if(!err){
            res.send(200,newMR_netMarketPrices);
            console.log("created new GeneralReport:"+newMR_netMarketPrices);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_netMarketPrices=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_netMarketPrices.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}