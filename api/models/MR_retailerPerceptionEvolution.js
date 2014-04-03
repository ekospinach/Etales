var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_retailerPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    storeInfo : [variantInfoSchema],
})

var storeInfoSchema = mongoose.Schema({
    storeID : Number, //AllStoresMax  = BMRetsMax(3) + ProsMaxPlus(4); { all B&M and four E-malls }
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //1-Urban, 2-Rural
    previousPerception                   : [Number], //0-Price, 1-Convenience
    latestPerception                     : [Number], //0-Price, 1-Convenience
    perceptionChange                     : [Number]  //0-Price, 1-Convenience    
})
var MR_retailerPerceptionEvolution=mongoose.model('MR_retailerPerceptionEvolution',MR_retailerPerceptionEvolutionSchema);

exports.addMR_retailerPerceptionEvolution=function(req,res,next){
    var newMR_retailerPerceptionEvolution=MR_retailerPerceptionEvolution({});
    newMR_retailerPerceptionEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_retailerPerceptionEvolution);
            console.log("created new GeneralReport:"+newMR_retailerPerceptionEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_retailerPerceptionEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_retailerPerceptionEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}