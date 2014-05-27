var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore'),
    request = require('request'),
    q = require('q');

//New Schema
var BG_feedbackSlidesSchema = mongoose.Schmea({
    period : Number,
    seminar : String,
    f_DiscountsValue                  : [negotiationsItemDetailsSchema],
    f_PerformanceBonusesValue         : [negotiationsItemDetailsSchema],
    f_OtherCompensationsValue         : [negotiationsItemDetailsSchema],
    f_TransactionsPerTOP              : [transactionsPerTOPSchema];
    f_MarketSalesVolume               : [marketResultSchema],
    f_MarketSalesValue                : [marketResultSchema],
    f_VolumeMarketShares              : [marketResultSchema],
    f_ValueMarketShares               : [marketResultSchema],
    f_OperatingProfit                 : [marketResultSchema],
    f_OperatingProfitMargin           : [marketResultSchema],
    f_NetProfit                       : [marketResultSchema],
    f_NetProfitMargin                 : [marketResultSchema],
    f_ShelfSpaceAllocation            : [marketResultSchema],
    f_TradeSpendingEffectiveness      : [supplierKPIInfoSchema],
    f_MarketingSpendingEffectiveness  : [supplierKPIInfoSchema],
    f_PortfolioStrength               : [supplierKPIInfoSchema],
    f_SuppliersBMValueSalesShare      : [supplierKPIInfoSchema],
    f_SuppliersBMVolumeSalesShare     : [supplierKPIInfoSchema],
    f_SuppliersBMShareOfShoppers      : [supplierKPIInfoSchema],
    f_SuppliersOnlineValueSalesShare  : [supplierKPIInfoSchema],
    f_SuppliersOnlineVolumeSalesShare : [supplierKPIInfoSchema],
    f_SuppliersOnlineShareOfShoppers  : [supplierKPIInfoSchema],
    f_RetailersValueRotationIndex     : [retailerKPIInfoSchema],
    f_RetailersVolumeRotationIndex    : [retailerKPIInfoSchema],
    f_RetailersProfitabilityIndex     : [retailerKPIInfoSchema],
    f_RetailersStocksCover            : [retailerKPIInfoSchema],
    f_RetailersShoppersShare          : [retailerKPIInfoSchema],
})

var negotiationsItemDetailsSchema = mongoose.Schema({
    categoryID : Number,
    fcni_SuppliersCost       : [supplierInfoSchema],
    fcni_RetailersBenefits   : [retailerInfoSchema],
})

var supplierInfoSchema = mongoose.Schema({
    supplierID : Number,
    value : Number
})

var retailerInfoSchema = mongoose.Schema({
    retailerID : Number,
    value : Number
})

var transactionsPerTOPSchema = mongoose.Schema({
    categoryID : Number,
    topDays    : Number, //0~24, this is used as multiplications of 15 days to cover - almost - the entire year
    value      : Number   
})


var marketResultSchema = mongoose.Schmea({
    categoryID : Number,
    period     : Number, 
    actorID    : Number, //TActiveActors : 1~(3+2)
    value      : Number
})

var supplierKPIInfoSchema = mongoose.Schema({
    categoryID : Number,
    period     : Number,
    producerID : Number, //1~3
    value      : Number,
})

var retailerKPIInfoSchema = mongoose.Schema({
    categoryID : Number,
    marketID   : Number,
    period     : Number,
    retailerID : Number, //1~2
    value      : Number,
})

var BG_feedbackSlides=mongoose.model('BG_feedbackSlides',BG_feedbackSlidesSchema);
