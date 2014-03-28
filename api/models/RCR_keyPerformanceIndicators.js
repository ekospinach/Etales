var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var RCR_keyPerformanceIndicatorsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)
    
    rcrkpi_VolumeRotationIndex        : [categoryInfoSchema],
    rcrkpi_ValueRotationIndex         : [categoryInfoSchema],
    rcrkpi_ProfitabilityIndex         : [categoryInfoSchema],
    rcrkpi_StockCover                 : [categoryInfoSchema],
    rcrkpi_ShoppersShare              : [shoperInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,
    value : [Number], //0-Urban, 1-Rural, 2-Total
})

var shoperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS})
    categoryInfo : [categoryInfoSchema]
})
var RCR_keyPerformanceIndicators=mongoose.model('RCR_keyPerformanceIndicators',RCR_keyPerformanceIndicatorsSchema);

exports.addRCR_keyPerformanceIndicators=function(req,res,next){
    var newRCR_keyPerformanceIndicators=RCR_keyPerformanceIndicators({
        period : 0,
        seminar : 'MAY',
        retailerID  : 1, //TBMRetailers : 1~3 (BMRetsMax)
        
        rcrkpi_VolumeRotationIndex        : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        rcrkpi_ValueRotationIndex         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        rcrkpi_ProfitabilityIndex         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        rcrkpi_StockCover                 : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }],
        rcrkpi_ShoppersShare              : [{
            shoperKind:'BMS',
            categoryInfo:[{
                categoryID:1,
                value:[10,20,30]
            },{
                categoryID:2,
                value:[40,50,60]
            },{
                categoryID:3,
                value:[70,80,90]
            }]
        },{
            shoperKind:'NETIZENS',
            categoryInfo:[{
                categoryID:1,
                value:[10,20,30]
            },{
                categoryID:2,
                value:[40,50,60]
            },{
                categoryID:3,
                value:[70,80,90]
            }]
        },{
            shoperKind:'MIXED',
            categoryInfo:[{
                categoryID:1,
                value:[10,20,30]
            },{
                categoryID:2,
                value:[40,50,60]
            },{
                categoryID:3,
                value:[70,80,90]
            }]
        },{
            shoperKind:'ALLSHOPPERS',
            categoryInfo:[{
                categoryID:1,
                value:[10,20,30]
            },{
                categoryID:2,
                value:[40,50,60]
            },{
                categoryID:3,
                value:[70,80,90]
            }]
        }]
    });
    newRCR_keyPerformanceIndicators.save(function(err) {
        if(!err){
            res.send(200,newRCR_keyPerformanceIndicators);
            console.log("created new GeneralReport:"+newRCR_keyPerformanceIndicators);
        } else {
            res.send(400,"failed.");
        }
    }); 
}

exports.getRCR_keyPerformanceIndicators=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    RCR_keyPerformanceIndicators.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

