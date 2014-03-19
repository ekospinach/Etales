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
var marketSalesSchema = mongoose.Schema({
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
    actorCategoryInfo : [actorCategoryInfoSchema]
})

var actorCategoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    actorMarketInfo : [actorMarketInfoSchema],
})

var actorMarketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketTotal : 1~(2+1)
    actorSegmentInfo : [actorSegmentInfoSchema]
})

var actorSegmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)
    actorShopperInfo : [actorShopperInfoSchema]
})

var actorShopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    grms_MarketNetSalesValue       : Number, //CategoryID : 1~3
    grms_MarketSalesVolume         : Number, //CategoryID : 1~2
    grms_MarketNetSalesValueChange : Number, //CategoryID : 1~3
    grms_MarketSalesVolumeChange   : Number, //CategoryID : 1~2
})

var marketSales=mongoose.model('marketSales',marketSalesSchema);

exports.addMarketSales=function(req,res,next){
    var newMarketSales=new marketSales({
        period : 1,
        seminar : 'MAY',
        actorInfo : [{
            actorID:1,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:2,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:3,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:4,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:5,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:6,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        },{
            actorID:7,
            actorCategoryInfo:[{
                categoryID:1,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:2,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            },{
                categoryID:3,
                actorMarketInfo:[{
                    marketID:1,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:2,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                },{
                    marketID:3,
                    actorSegmentInfo:[{
                        segmentID:1,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:2,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:3,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:4,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    },{
                        segmentID:5,
                        actorShopperInfo:[{
                            shoperKind:'BMS',
                            grms_MarketNetSalesValue       : 10, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 11, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 12, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 13 //CategoryID : 1~2
                        },{
                            shoperKind:'NETIZENS',
                            grms_MarketNetSalesValue       : 20, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 21, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 22, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 23 //CategoryID : 1~2
                        },{
                            shoperKind:'MIXED',
                            grms_MarketNetSalesValue       : 30, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 31, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 32, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 33 //CategoryID : 1~2
                        },{
                            shoperKind:'ALLSHOPPERS',
                            grms_MarketNetSalesValue       : 40, //CategoryID : 1~3
                            grms_MarketSalesVolume         : 41, //CategoryID : 1~2
                            grms_MarketNetSalesValueChange : 42, //CategoryID : 1~3
                            grms_MarketSalesVolumeChange   : 43 //CategoryID : 1~2
                        }]
                    }]
                }]
            }]
        }]    
    });
    newMarketSales.save(function(err){
        if(!err){
            res.send(200,newMarketSales);
            console.log("created new GeneralReport:"+newMarketSales);
        } else {
            res.send(400,"failed.");
        }
    })
}

exports.getMarketSales=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    marketSales.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    });
}