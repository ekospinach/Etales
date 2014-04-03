var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_salesCrossSegmentSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    absoluteValue     : [variantInfoSchema],
    valueChange       : [variantInfoSchema],
    absoluteVolume    : [variantInfoSchema],
    volumeChange      : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID  : Number,
    parentCompanyID   : Number,
    marketInfo: [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarkets : 1~2
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
        5-Total

        HealthBeauties:
        1-PriceSensitive
        2-Value for Money
        3-Health Conscious
        4-Impatient      
        5-Total
    */
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    value : Number,
})
var MR_salesCrossSegment=mongoose.model('MR_salesCrossSegment',MR_salesCrossSegmentSchema);

exports.addMR_salesCrossSegment=function(req,res,next){
    var newMR_salesCrossSegment=MR_salesCrossSegment({
        period : 0,
        seminar : 'MAY',
        absoluteValue     : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        }],
        valueChange       : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        }],
        absoluteVolume    : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        }],
        volumeChange      : [{
            variantName       : '_A',
            parentBrandName   : 'ELAN1',
            parentCategoryID  : 1,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_B',
            parentBrandName   : 'HLAN1',
            parentCategoryID  : 2,
            parentCompanyID   : 1,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_C',
            parentBrandName   : 'EMORE2',
            parentCategoryID  : 1,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_D',
            parentBrandName   : 'HTTP2',
            parentCategoryID  : 2,
            parentCompanyID   : 2,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_E',
            parentBrandName   : 'EKK3',
            parentCategoryID  : 1,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_F',
            parentBrandName   : 'HQQ3',
            parentCategoryID  : 2,
            parentCompanyID   : 3,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_G',
            parentBrandName   : 'EYYY5',
            parentCategoryID  : 1,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_H',
            parentBrandName   : 'HUUU5',
            parentCategoryID  : 2,
            parentCompanyID   : 5,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_X',
            parentBrandName   : 'EXXX6',
            parentCategoryID  : 1,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        },{
            variantName       : '_Z',
            parentBrandName   : 'HYYY6',
            parentCategoryID  : 2,
            parentCompanyID   : 6,
            marketInfo: [{
                marketID : 1, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            },{
                marketID : 2, //TMarkets : 1~2
                segmentInfo : [{
                    segmentID : 1, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 10
                    }]
                },{
                    segmentID : 2, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 20
                    }]
                },{
                    segmentID : 3, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 30
                    }]
                },{
                    segmentID : 4, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 40
                    }]
                },{
                    segmentID : 5, //TSegmentsTotal : 1~(4+1),
                    shopperInfo : [{
                        shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    },{
                        shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                        value : 50
                    }]
                }]
            }]
        }]
    });
    newMR_salesCrossSegment.save(function(err) {
        if(!err){
            res.send(200,newMR_salesCrossSegment);
            console.log("created new GeneralReport:"+newMR_salesCrossSegment);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_salesCrossSegment=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_salesCrossSegment.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}
