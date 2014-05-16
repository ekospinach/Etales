var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');


var oneQuarterExogenousDataSchema = mongoose.Schema({
    seminar    : String,
    period     : Number,
    marketID   : Number,
    categoryID : Number,
    MinBMPriceVsCost                : Number,
    MaxBMPriceVsCost                : Number,
    IngredientsQualityVsATLGap      : Number,
    ActiveAgentVsSmoothenerGap      : Number,
    MaxTargetVolumeVsTotalMarket    : Number,
    MinOnlinePriceVsCost            : Number,
    MaxOnlinePriceVsCost            : Number,
    MaxCapacityReduction            : Number,
    MaxCapacityIncrease             : Number,
    Supplier4AcquiredLevelsGapForPL : Number,
    MinPLPriceVsCost                : Number,
    MaxPLPriceVsCost                : Number,
    MinRetailPriceVsNetBMPrice      : Number,
    MaxRetailPriceVsNetBMPrice      : Number,    
})

var oneQuarterExogenousData = mongoose.model('bg_oneQuarterExogenousData',oneQuarterExogenousDataSchema);

exports.addOneQuarterExogenousData=function(req,res,next){
    var newOneQuarterExogenousData1=new oneQuarterExogenousData({
        seminar:'MAY',
        period:0,
        marketID:1,
        categoryID:1,
        MinBMPriceVsCost                : 0.4,
        MaxBMPriceVsCost                : 4,
        IngredientsQualityVsATLGap      : 2,
        ActiveAgentVsSmoothenerGap      : 1,
        MaxTargetVolumeVsTotalMarket    : 0.5,
        MinOnlinePriceVsCost            : 0.5,
        MaxOnlinePriceVsCost            : 6,
        MaxCapacityReduction            : -0.3,
        MaxCapacityIncrease             : 0.3,
        Supplier4AcquiredLevelsGapForPL : 10,
        MinPLPriceVsCost                : 0.4,
        MaxPLPriceVsCost                : 4,
        MinRetailPriceVsNetBMPrice      : 0.5,
        MaxRetailPriceVsNetBMPrice      : 3
    });
    newOneQuarterExogenousData1.save(function(err) {
        if(!err){
            res.send(200,newOneQuarterExogenousData1);
            console.log("created new OneQuarterExogenousData");
        } else {
            res.send(400,err);
        }
    });
    var newOneQuarterExogenousData2=new oneQuarterExogenousData({
        seminar:'MAY',
        period:0,
        marketID:1,
        categoryID:2,
        MinBMPriceVsCost                : 0.4,
        MaxBMPriceVsCost                : 4,
        IngredientsQualityVsATLGap      : 2,
        ActiveAgentVsSmoothenerGap      : 1,
        MaxTargetVolumeVsTotalMarket    : 0.5,
        MinOnlinePriceVsCost            : 0.5,
        MaxOnlinePriceVsCost            : 6,
        MaxCapacityReduction            : -0.3,
        MaxCapacityIncrease             : 0.3,
        Supplier4AcquiredLevelsGapForPL : 10,
        MinPLPriceVsCost                : 0.4,
        MaxPLPriceVsCost                : 4,
        MinRetailPriceVsNetBMPrice      : 0.5,
        MaxRetailPriceVsNetBMPrice      : 3
    });
    newOneQuarterExogenousData2.save(function(err) {
        if(!err){
            res.send(200,newOneQuarterExogenousData2);
            console.log("created new OneQuarterExogenousData");
        } else {
            res.send(400,err);
        }
    });
    var newOneQuarterExogenousData3=new oneQuarterExogenousData({
        seminar:'MAY',
        period:0,
        marketID:2,
        categoryID:1,
        MinBMPriceVsCost                : 0.4,
        MaxBMPriceVsCost                : 4,
        IngredientsQualityVsATLGap      : 2,
        ActiveAgentVsSmoothenerGap      : 1,
        MaxTargetVolumeVsTotalMarket    : 0.5,
        MinOnlinePriceVsCost            : 0.5,
        MaxOnlinePriceVsCost            : 6,
        MaxCapacityReduction            : -0.3,
        MaxCapacityIncrease             : 0.3,
        Supplier4AcquiredLevelsGapForPL : 10,
        MinPLPriceVsCost                : 0.4,
        MaxPLPriceVsCost                : 4,
        MinRetailPriceVsNetBMPrice      : 0.5,
        MaxRetailPriceVsNetBMPrice      : 3
    });
    newOneQuarterExogenousData3.save(function(err) {
        if(!err){
            res.send(200,newOneQuarterExogenousData3);
            console.log("created new OneQuarterExogenousData");
        } else {
            res.send(400,err);
        }
    });
    var newOneQuarterExogenousData4=new oneQuarterExogenousData({
        seminar:'MAY',
        period:0,
        marketID:2,
        categoryID:2,
        MinBMPriceVsCost                : 0.4,
        MaxBMPriceVsCost                : 4,
        IngredientsQualityVsATLGap      : 2,
        ActiveAgentVsSmoothenerGap      : 1,
        MaxTargetVolumeVsTotalMarket    : 0.5,
        MinOnlinePriceVsCost            : 0.5,
        MaxOnlinePriceVsCost            : 6,
        MaxCapacityReduction            : -0.3,
        MaxCapacityIncrease             : 0.3,
        Supplier4AcquiredLevelsGapForPL : 10,
        MinPLPriceVsCost                : 0.4,
        MaxPLPriceVsCost                : 4,
        MinRetailPriceVsNetBMPrice      : 0.5,
        MaxRetailPriceVsNetBMPrice      : 3
    });
    newOneQuarterExogenousData4.save(function(err) {
        if(!err){
            res.send(200,newOneQuarterExogenousData4);
            console.log("created new OneQuarterExogenousData");
        } else {
            res.send(400,err);
        }
    });
}

exports.getOneQuarterExogenousData=function(req,res,next){
    return oneQuarterExogenousData.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        categoryID:req.params.categoryID,
        marketID:req.params.marketID
    },function(err,doc){
        if(err){
            next(new Error(err));
        }
        if(doc){
            res.send(200,doc);
        }else{
            res.send(400,'fail');
        }
    })
}