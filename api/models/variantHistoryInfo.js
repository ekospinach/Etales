var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var variantHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    varName : String,
    varID : Number,
    parentBrandID : Number,
    parentBrandName : String,
    parentCompanyID : Number, (1~9)
    supplierView : supplierViewSchema,
    channelView : [channelViewSchema] //length:TRetailersTotal(1~4)
    //v...
    //v_Composition : [Number] ??
})

//pv...
var supplierViewSchema = mongoose.Schema({
    currentUnitAverageCost : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    nextPriceBM : Number,
    nextPriceEmall : Number,
    composition : Number,  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    productionVolume : Number,
    initialInventory : [{  
        volume : single,
        unitCost : single,
        composition : [Number] 
    }],
    salesVolume : [Number][Number], //TAllRetailersTotal(1~5), TMarketTotal(1~3)
})

var channelViewSchema = mongoose.Schema({
    channelMarketView : [channelMarketViewSchema]
})

var channelMarketViewSchema = mongoose.Schema({
    closingInventory : [{  
        volume : single,
        unitCost : single,
        composition : [Number] 
    }], //length : TInventoryAgesTotal(0~4, Inventory is tracked 3 years backward, any older inventory will be considered also 3 years old, 4 is used to calculated total volume/regardless of age/ and average cost)
    currentUnitAcquisitionCost : Number, //length: TMarkets(1~2)
    salesVolume : Number,  //length: TMarkets(1~2)  
    shelfSpace : Number,
    marketPrice : Number,
    netMarketPrice : Number,
    promotionsDetails : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1
    }
})

