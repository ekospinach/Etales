var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_variantPerceptionEvolutionSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    variantInfo : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number,
    previousPerception                   : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    latestPerception                     : [Number], //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal
    perceptionChange                     : [Number]  //0-EasyOfUse(Performance), 1-Quality(Gentleness), 2-Price Appeal    
})
var MR_variantPerceptionEvolution=mongoose.model('MR_variantPerceptionEvolution',MR_variantPerceptionEvolutionSchema);

exports.addMR_variantPerceptionEvolution=function(req,res,next){
    var newMR_variantPerceptionEvolution=MR_variantPerceptionEvolution({});
    newMR_variantPerceptionEvolution.save(function(err) {
        if(!err){
            res.send(200,newMR_variantPerceptionEvolution);
            console.log("created new GeneralReport:"+newMR_variantPerceptionEvolution);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_variantPerceptionEvolution=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    MR_variantPerceptionEvolution.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

