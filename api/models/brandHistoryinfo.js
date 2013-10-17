var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var brandHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    brandName : String,
    brandID : Number,
    parentCompanyID : Number, (1~9)
    //b...
    awareness : Number,
    socialNetworksScore : 
    //pb...
    //rb...
})

var variantHistoryInfoSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    varName : String,
    varID : Number,
    parentBrandID : Number,
    parentBrandName : String,
    parentCompanyID : Number, (1~10)
    //pv...
    currentUnitAverageCost : Number,
    initialInventory_invd_Volume : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    nextPriceBM : Number,
    nextPriceEmall : Number,
    composition : Number,  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    salesVolume : Number,
    productionVolume : Number,
    supplierView : supplierViewSchema,
    channelView: [channelViewSchema]
    //v...
    //v_Composition : [Number] ??
})

//pv...
var supplierViewSchema = mongoose.Schema({

})
var channelViewSchema = mongoose.Schema({
    retailerID : Number,  //1~4
    channelMarketView : [channelMarketViewSchema]
})

//rv...
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

