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

var MR_pricePromotions=mongoose.model('MR_pricePromotions',MR_pricePromotionsSchema);

exports.addMR_pricePromotions=function(req,res,next){
    var newMR_pricePromotions=MR_pricePromotions({});
    newMR_pricePromotions.save(function(err) {
        if(!err){
            res.send(200,newMR_pricePromotions);
            console.log("created new GeneralReport:"+newMR_pricePromotions);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_pricePromotions=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_pricePromotions.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}