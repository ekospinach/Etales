var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrkpi_TradeSpendingEffectiveness : [categoryInfoSchema],
    scrkpi_MarketingEffectiveness     : [categoryInfoSchema],
    scrkpi_ChannelSalesValueShare     : [categoryInfoSchema],
    scrkpi_ChannelSalesVolumeShare    : [categoryInfoSchema],
    scrkpi_ShoppersShare              : [categoryInfoSchema],
    //scrkpi_PortfolioStrength          : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})

var SCR_keyPerformanceIndicators=mongoose.model('SCR_keyPerformanceIndicators',SCR_keyPerformanceIndicatorsSchema);

exports.addSCR_keyPerformanceIndicators=function(req,res,next){
    var newSCR_keyPerformanceIndicators=SCR_keyPerformanceIndicators({
        period : 0,
        seminar : 'MAY',
        producerID  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
        scrkpi_TradeSpendingEffectiveness : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        scrkpi_MarketingEffectiveness     : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        scrkpi_ChannelSalesValueShare     : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        scrkpi_ChannelSalesVolumeShare    : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        scrkpi_ShoppersShare              : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }]
    });
    newSCR_keyPerformanceIndicators.save(function(err) {
        if(!err){
            res.send(200,newSCR_keyPerformanceIndicators);
            console.log("created new GeneralReport:"+newSCR_keyPerformanceIndicators);
        } else {
            res.send(400,"failed.");
        }
    });  
}

exports.getSCR_keyPerformanceIndicators=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    SCR_keyPerformanceIndicators.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })  
}

