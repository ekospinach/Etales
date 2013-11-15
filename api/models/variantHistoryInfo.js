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
    composition : Number,  //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
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

/*exports.newDoc=function(req,res,next){
    var newDoc=new variantHistory({
        period : 0,
        seminar : "MAY",
        varName : String,
        varID : Number,
        dateOfBirth : Number, //-4~10
        dateOfDeath : Number, //-4~10
        parentBrandID : Number,
        parentBrandName : String,
        parentCatID : Number,
        parentCompanyID : Number, //(1~9)   
        supplierView : [supplierViewSchema],
        channelView : [channelViewSchema] 
    })
}*/
