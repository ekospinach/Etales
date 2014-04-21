var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

var MR_forecastsSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    //Importance means Size in (%), saved in file as a decimal
    minConsumerSegmentsImportance : [categorySegmentInfoSchema], 
    maxConsumerSegmentsImportance : [categorySegmentInfoSchema],

    minShopperSegmentsImportance  : [categoryShopperInfoSchema],
    maxShopperSegmentsImportance  : [categoryShopperInfoSchema],

    minTotalVolume                : [categoryInfoSchema],
    maxTotalVolume                : [categoryInfoSchema],

    minInternetPenetrationRate    : [periodInfoSchema],
    maxInternetPenetrationRate    : [periodInfoSchema],
})


var categorySegmentInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    segmentInfo : [segmentInfoSchema]
})

var segmentInfoSchema = mongoose.Schema({
    segmentID : Number, //TSegmentsTotal : 1~(4+1)x,
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
    periodInfo : [periodInfoSchema],
})


var categoryShopperInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    shopperInfo : [shopperInfoSchema]
})

var shopperInfoSchema = mongoose.Schema({
    shoperKind : String, // BMS, NETIZENS, MIXED, ALLSHOPPERS
    periodInfo : [periodInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //1~2
    periodInfo : [periodInfoSchema],    
})

var periodInfoSchema = mongoose.Schema({
    period : Number, //-2,-1,0,1,2
    value : [Number] //0-Urban, 1-Rural        
})

var MR_forecasts=mongoose.model('MR_forecasts',MR_forecastsSchema);

exports.addMR_forecasts=function(req,res,next){
    var newMR_forecasts=MR_forecasts({
        period : 0,
        seminar : 'MAY',
        //Importance means Size in (%), saved in file as a decimal
        minConsumerSegmentsImportance : [{
            categoryID : 1, //1~2
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [29,34] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [16,21] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [11,16] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [21,16] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [16,11] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            }]
        },{
            categoryID : 2, //1~2
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [29,34] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [16,21] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [11,16] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [21,16] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [16,11] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            }]
        }], 
        maxConsumerSegmentsImportance : [{
            categoryID : 1, //1~2
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [27,32] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [33,38] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [18,23] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [15,20] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [23,18] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [20,15] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            }]
        },{
            categoryID : 2, //1~2
            segmentInfo : [{
                segmentID : 1, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 2, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [27,32] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [33,38] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 3, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [18,23] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [15,20] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 4, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [23,18] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [20,15] //0-Urban, 1-Rural 
                }]
            },{
                segmentID : 5, //TSegmentsTotal : 1~(4+1)x,
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            }]
        }],
        minShopperSegmentsImportance  : [{
            categoryID : 1, //1~2
            shopperInfo : [{
                shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [29,34] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [16,21] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [11,16] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [21,16] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [16,11] //0-Urban, 1-Rural 
                }]
            }]
        },{
            categoryID : 2, //1~2
            shopperInfo : [{
                shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [28,33] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [32,37] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [29,34] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [16,21] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [11,16] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [21,16] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [16,11] //0-Urban, 1-Rural 
                }]
            }]
        }],
        maxShopperSegmentsImportance  : [{
            categoryID : 1, //1~2
            shopperInfo : [{
                shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [27,32] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [33,38] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [18,23] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [15,20] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [23,18] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [20,15] //0-Urban, 1-Rural 
                }]
            }]
        },{
            categoryID : 2, //1~2
            shopperInfo : [{
                shoperKind : 'BMS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [22,27] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [24,29] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [30,35] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [36,41] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'NETIZENS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [19,24] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [20,25] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [27,32] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [33,38] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'MIXED', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [25,30] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [23,28] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [21,26] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [18,23] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [15,20] //0-Urban, 1-Rural 
                }]
            },{
                shoperKind : 'ALLSHOPPERS', // BMS, NETIZENS, MIXED, ALLSHOPPERS
                periodInfo : [{
                    period : -2, //-2,-1,0,1,2
                    value : [30,25] //0-Urban, 1-Rural 
                },{
                    period : -1, //-2,-1,0,1,2
                    value : [28,23] //0-Urban, 1-Rural 
                },{
                    period : 0, //-2,-1,0,1,2
                    value : [26,21] //0-Urban, 1-Rural 
                },{
                    period : 1, //-2,-1,0,1,2
                    value : [23,18] //0-Urban, 1-Rural 
                },{
                    period : 2, //-2,-1,0,1,2
                    value : [20,15] //0-Urban, 1-Rural 
                }]
            }]
        }],
        minTotalVolume                : [{
            categoryID:1,
            periodInfo : [{
                period : -2, //-2,-1,0,1,2
                value : [20,25] //0-Urban, 1-Rural 
            },{
                period : -1, //-2,-1,0,1,2
                value : [22,27] //0-Urban, 1-Rural 
            },{
                period : 0, //-2,-1,0,1,2
                value : [24,29] //0-Urban, 1-Rural 
            },{
                period : 1, //-2,-1,0,1,2
                value : [28,33] //0-Urban, 1-Rural 
            },{
                period : 2, //-2,-1,0,1,2
                value : [32,37] //0-Urban, 1-Rural 
            }]
        },{
            categoryID:2,
            periodInfo : [{
                period : -2, //-2,-1,0,1,2
                value : [25,30] //0-Urban, 1-Rural 
            },{
                period : -1, //-2,-1,0,1,2
                value : [23,28] //0-Urban, 1-Rural 
            },{
                period : 0, //-2,-1,0,1,2
                value : [21,26] //0-Urban, 1-Rural 
            },{
                period : 1, //-2,-1,0,1,2
                value : [16,21] //0-Urban, 1-Rural 
            },{
                period : 2, //-2,-1,0,1,2
                value : [11,16] //0-Urban, 1-Rural 
            }]
        }],
        maxTotalVolume                : [{
            categoryID:1,
            periodInfo : [{
                period : -2, //-2,-1,0,1,2
                value : [20,25] //0-Urban, 1-Rural 
            },{
                period : -1, //-2,-1,0,1,2
                value : [22,27] //0-Urban, 1-Rural 
            },{
                period : 0, //-2,-1,0,1,2
                value : [24,29] //0-Urban, 1-Rural 
            },{
                period : 1, //-2,-1,0,1,2
                value : [30,35] //0-Urban, 1-Rural 
            },{
                period : 2, //-2,-1,0,1,2
                value : [36,41] //0-Urban, 1-Rural 
            }]
        },{
            categoryID:2,
            periodInfo : [{
                period : -2, //-2,-1,0,1,2
                value : [25,30] //0-Urban, 1-Rural 
            },{
                period : -1, //-2,-1,0,1,2
                value : [23,28] //0-Urban, 1-Rural 
            },{
                period : 0, //-2,-1,0,1,2
                value : [21,26] //0-Urban, 1-Rural 
            },{
                period : 1, //-2,-1,0,1,2
                value : [18,23] //0-Urban, 1-Rural 
            },{
                period : 2, //-2,-1,0,1,2
                value : [15,20] //0-Urban, 1-Rural 
            }]
        }],
        minInternetPenetrationRate    : [{
            period : -2, //-2,-1,0,1,2
            value : [19,24] //0-Urban, 1-Rural 
        },{
            period : -1, //-2,-1,0,1,2
            value : [20,25] //0-Urban, 1-Rural 
        },{
            period : 0, //-2,-1,0,1,2
            value : [21,26] //0-Urban, 1-Rural 
        },{
            period : 1, //-2,-1,0,1,2
            value : [25,30] //0-Urban, 1-Rural 
        },{
            period : 2, //-2,-1,0,1,2
            value : [29,34] //0-Urban, 1-Rural 
        }],
        maxInternetPenetrationRate    : [{
            period : -2, //-2,-1,0,1,2
            value : [19,24] //0-Urban, 1-Rural 
        },{
            period : -1, //-2,-1,0,1,2
            value : [20,25] //0-Urban, 1-Rural 
        },{
            period : 0, //-2,-1,0,1,2
            value : [21,26] //0-Urban, 1-Rural 
        },{
            period : 1, //-2,-1,0,1,2
            value : [27,32] //0-Urban, 1-Rural 
        },{
            period : 2, //-2,-1,0,1,2
            value : [33,38] //0-Urban, 1-Rural 
        }]
    });
    newMR_forecasts.save(function(err) {
        if(!err){
            res.send(200,newMR_forecasts);
            console.log("created new GeneralReport:"+newMR_forecasts);
        } else {
            res.send(400,"failed.");
        }
    }); 
}    

exports.getMR_forecasts=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period
    };
    MR_forecasts.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

