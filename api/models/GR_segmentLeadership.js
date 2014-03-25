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
var segmentLeadershipSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    marketInfo : [marketInfoSchema],
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketTotal : 1~(2+1)
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1),
    /*
        Elecssories:
        1-PriceSensitive
        2-Value for Money
        3-Fashion
        4-Freaks

        HealthBeauties:
        1-PriceSensitive
        2-Value for Money
        3-Health Conscious
        4-Impatient      
    */
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    grsl_ValueLeaders : [segmentVariantLeadersSchema],
    grsl_VolumeLeaders : [segmentVariantLeadersSchema]
})

var segmentVariantLeadersSchema = mongoose.Schema({
    varID              : Number,
    varName            : String,
    parentBrandID      : Number,
    parentBrandName    : String,
    share              : Number 
})

var segmentLeadership=mongoose.model('segmentLeadership',segmentLeadershipSchema);

exports.addSegmentLeadership=function(req,res,next){
    var newSegmentLeadership= segmentLeadership({
        period : 0,
        seminar : 'MAY',
        categoryInfo : [{
            categoryID:1,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        },{
            categoryID:2,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        },{
            categoryID:3,
            marketInfo:[{
                marketID:1,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:2,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            },{
                marketID:3,
                segmentInfo:[{
                    segmentID:1,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:2,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:3,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:4,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                },{
                    segmentID:5,
                    shopperInfo:[{
                        shoperKind:'BMS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'NETIZENS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'MIXED',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    },{
                        shoperKind:'ALLSHOPPERS',
                        grsl_ValueLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }],
                        grsl_VolumeLeaders:[{
                            varID              : 101,
                            varName            : 'ELAN1',
                            parentBrandID      : 10,
                            parentBrandName    : 'ELAN',
                            share              : 10                             
                        },{
                            varID              : 201,
                            varName            : 'EWAN2',
                            parentBrandID      : 20,
                            parentBrandName    : 'EWAN',
                            share              : 20                             
                        },{
                            varID              : 301,
                            varName            : 'ETAN3',
                            parentBrandID      : 30,
                            parentBrandName    : 'ETAN',
                            share              : 30                             
                        },{
                            varID              : 401,
                            varName            : 'ESAN4',
                            parentBrandID      : 40,
                            parentBrandName    : 'ESAN',
                            share              : 40                             
                        },{
                            varID              : 501,
                            varName            : 'EXAN5',
                            parentBrandID      : 50,
                            parentBrandName    : 'EXAN',
                            share              : 50                             
                        },{
                            varID              : 601,
                            varName            : 'EZAN6',
                            parentBrandID      : 60,
                            parentBrandName    : 'EZAN',
                            share              : 60                             
                        }]
                    }]
                }]
            }]
        }]       
    });
    newSegmentLeadership.save(function(err) {
        if(!err){
            res.send(200,newSegmentLeadership);
            console.log("created new GeneralReport:"+newSegmentLeadership);
        } else {
            res.send(400,"failed.");
        }
    });    
}

exports.getSegmentLeadership=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    segmentLeadership.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })
}
