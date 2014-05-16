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
    var newOneQuarterExogenousData=new oneQuarterExogenousData({
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
    newOneQuarterExogenousData.save(function(err) {
        if(!err){
            res.send(200,newOneQuarterExogenousData);
            console.log("created new OneQuarterExogenousData:"+newOneQuarterExogenousData);
        } else {
            res.send(400,err);
        }
    });

}