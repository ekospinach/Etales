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
var MR_supplierIntelligence=mongoose.model('MR_supplierIntelligence',MR_supplierIntelligenceSchema);

exports.addMR_supplierIntelligence=function(req,res,next){
    var newMR_supplierIntelligence=MR_supplierIntelligence({});
    newMR_supplierIntelligence.save(function(err) {
        if(!err){
            res.send(200,newMR_supplierIntelligence);
            console.log("created new GeneralReport:"+newMR_supplierIntelligence);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_supplierIntelligence=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_supplierIntelligence.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}


