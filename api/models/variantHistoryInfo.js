var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var variantHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    varName : String,
    varID : Number,
    dateOfBirth : Number, //-4~10
    dateOfDeath : Number, //-4~10
    parentBrandID : Number,
    parentBrandName : String,
    parentCatID : Number,
    parentCompanyID : Number, //(1~9)   
    supplierView : [supplierViewSchema],
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
})

//pv...
var supplierViewSchema = mongoose.Schema({
    currentUnitAverageCost : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    nextPriceBM : Number,
    nextPriceEmall : Number,
    composition : [Number],  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    productionVolume : Number,
    initialInventory : [{  
        volume : Number,
        unitCost : Number,
        composition : [Number] 
    }], //length : TInventoryAgesTotal(0~4)
    supplierChannelView : [supplierChannelViewSchema] //length : TAllRetailersTotal(1~5)
})

var supplierChannelViewSchema = mongoose.Schema({
    salesVolume : [Number], // TMarketTotal(1~3)
})

var channelViewSchema = mongoose.Schema({
    channelMarketView : [channelMarketViewSchema] //length: TMarketsTotal(1~3)
})

//rv...
var channelMarketViewSchema = mongoose.Schema({
    closingInventory : [{  
        volume : String,
        unitCost : String,
        composition : [Number] 
    }], //length : TInventoryAgesTotal(0~4)
    currentUnitAcquisitionCost : Number, 
    salesVolume : Number,  
    shelfSpace : Number,
    marketPrice : Number,
    netMarketPrice : Number,
    promotionsDetails : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1
    }
})

var variantHistory = mongoose.model('variantHistory',variantHistoryInfoSchema);

exports.newDoc=function(req,res,next){
    var newDoc=new variantHistory({
        period : 0,
        seminar : "MAY",
        varName : "_A",
        varID : 111,
        dateOfBirth : -4, //-4~10
        dateOfDeath : 10, //-4~10
        parentBrandID : 11,
        parentBrandName : "ELAND1",
        parentCatID : 1,
        parentCompanyID : 1, //(1~9)   
        supplierView : [{
            currentUnitAverageCost : 1,
            currentPriceBM : 2,
            currentPriceEmall : 3,
            nextPriceBM : 4,
            nextPriceEmall : 5,
            composition : [6,7,8],  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
            productionVolume : 10,
            initialInventory : [{  
                volume : 11,
                unitCost : 12,
                composition : [13,14,15] 
            }], //length : TInventoryAgesTotal(0~4)
            supplierChannelView : [{
                salesVolume:[16,17,18]
            }]
        }],
        channelView : [{
            channelMarketView:[{
                closingInventory : [{  
                    volume : 19,
                    unitCost : 20,
                    composition : [21,22,23] 
                }], //length : TInventoryAgesTotal(0~4)
                currentUnitAcquisitionCost : 24, 
                salesVolume : 25,  
                shelfSpace : 26,
                marketPrice : 27,
                netMarketPrice : 28,
                promotionsDetails : {
                    promo_Frequency : 29, //range: 0~52
                    promo_Rate : 1 //0~1
                }
            }]
        }] 
    });
    newDoc.save(function(err){
        if(err){
            next(new Error(err));
        }
        console.log('insert success');
        res.send(200,'var insert success');
    })
}
