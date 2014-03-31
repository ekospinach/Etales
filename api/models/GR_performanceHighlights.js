var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)

var performanceHighlightsSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    actorInfo : [actorInfoSchema],	
})	

var actorInfoSchema = mongoose.Schema({
	actorID 					 : Number, //TActors : 1~(4+3)
    /*
        1 - Supplier 1
        2 - Supplier 2
        3 - Supplier 3
        4 - Supplier 4
        5 - Retailer 1
        6 - Retailer 2
        7 - Traditional Trade         
    */
    grph_OperatingProfit         : Number,
    grph_OperatingProfitChange   : Number,
    grph_CumulativeInvestment    : Number,
    actorCategoryInfo : [actorCategoryInfoSchema]
})

var actorCategoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    //Performance Highlights 
    grph_SalesVolume             : Number, //CategoryID : 1~2
    grph_NetSalesValue           : Number, //CategoryID : 1~3
    
    grph_ValueMarketShare        : Number, //CategoryID : 1~2
    grph_VolumeMarketShare       : Number, //CategoryID : 1~3

    grph_NetSalesValueChange     : Number, //CategoryID : 1~2
    grph_ValueMarketShareChange  : Number, //CategoryID : 1~2
    grph_VolumeMarketShareChange : Number, //CategoryID : 1~3
    grph_SalesVolumeChange       : Number, //CategoryID : 1~3
})

var performanceHighlights=mongoose.model('performanceHighlights',performanceHighlightsSchema);

exports.addPerformanceHighlights=function(req,res,next){
    var newPerformanceHighlights=new performanceHighlights({
        period:0,
        seminar:'MAY',
        actorInfo:[{
            actorID:1,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:2,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:3,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:4,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:5,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:6,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        },{
            actorID:7,
            grph_OperatingProfit         : 10,
            grph_OperatingProfitChange   : 11,
            grph_CumulativeInvestment    : 12,
            actorCategoryInfo : [{
                categoryID : 1,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 13, //CategoryID : 1~2
                grph_NetSalesValue           : 14, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 15, //CategoryID : 1~2
                grph_VolumeMarketShare       : 16, //CategoryID : 1~3

                grph_NetSalesValueChange     : 17, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 18, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 19, //CategoryID : 1~3
                grph_SalesVolumeChange       : 20 //CategoryID : 1~3
            },{
                categoryID : 2,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 23, //CategoryID : 1~2
                grph_NetSalesValue           : 24, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 25, //CategoryID : 1~2
                grph_VolumeMarketShare       : 26, //CategoryID : 1~3

                grph_NetSalesValueChange     : 27, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 28, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 29, //CategoryID : 1~3
                grph_SalesVolumeChange       : 30 //CategoryID : 1~3
            },{
                categoryID : 3,                   //TCategoriesTotal : 1~(2+1)
                //Performance Highlights 
                grph_SalesVolume             : 33, //CategoryID : 1~2
                grph_NetSalesValue           : 34, //CategoryID : 1~3
                
                grph_ValueMarketShare        : 35, //CategoryID : 1~2
                grph_VolumeMarketShare       : 36, //CategoryID : 1~3

                grph_NetSalesValueChange     : 37, //CategoryID : 1~2
                grph_ValueMarketShareChange  : 38, //CategoryID : 1~2
                grph_VolumeMarketShareChange : 39, //CategoryID : 1~3
                grph_SalesVolumeChange       : 40 //CategoryID : 1~3
            }]
        }]
    });
    newPerformanceHighlights.save(function(err) {
        if(!err){
            res.send(200,newPerformanceHighlights);
            console.log("created new GeneralReport:"+newPerformanceHighlights);
        } else {
            res.send(400,"failed.");
        }
    });
}

exports.getPerformanceHighlights=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    performanceHighlights.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}