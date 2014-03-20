var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var SCR_consolidatedProfitAndLossSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)

    //Consolidated Profit & Loss statement, suppliers
    scrpl_Sales                                : [categoryInfoSchema], 
    scrpl_SalesChange                          : [categoryInfoSchema], 
    scrpl_MaterialCosts                        : [categoryInfoSchema], 
    scrpl_CostOfGoodsSold                      : [categoryInfoSchema], 
    scrpl_DiscontinuedGoodsCost                : [categoryInfoSchema], 
    scrpl_InventoryHoldingCost                 : [categoryInfoSchema], 
    scrpl_GrossProfit                          : [categoryInfoSchema], 
    scrpl_GrossProfitChange                    : [categoryInfoSchema], 
    scrpl_GrossProfitMargin                    : [categoryInfoSchema], 
    scrpl_TradeAndMarketing                    : [categoryInfoSchema], 
    scrpl_TradeAndMarketingAsPercentageOfSales : [categoryInfoSchema], 
    scrpl_GeneralExpenses                      : [categoryInfoSchema], 
    scrpl_Amortisation                         : [categoryInfoSchema], 
    scrpl_OperatingProfit                      : [categoryInfoSchema], 
    scrpl_OperatingProfitChange                : [categoryInfoSchema], 
    scrpl_OperatingProfitMargin                : [categoryInfoSchema], 
    scrpl_Interest                             : [categoryInfoSchema], 
    scrpl_Taxes                                : [categoryInfoSchema], 
    scrpl_ExceptionalItems                     : [categoryInfoSchema], 
    scrpl_NetProfit                            : [categoryInfoSchema], 
    scrpl_NetProfitChange                      : [categoryInfoSchema], 
    scrpl_NetProfitMargin                      : [categoryInfoSchema], 
    //---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- 
    scrpl_AdvertisingOnLine                    : [categoryInfoSchema], 
    scrpl_AdvertisingOffLine                   : [categoryInfoSchema], 
    scrpl_TradeSupport                         : [categoryInfoSchema], 

    //P&L per brand in B&M and onLine
    scrb_Sales                                : [brandInfoSchema],
    scrb_SalesChange                          : [brandInfoSchema],
    scrb_SalesShareInCategory                 : [brandInfoSchema],
    scrb_CostOfGoodsSold                      : [brandInfoSchema],
    scrb_DiscontinuedGoodsCost                : [brandInfoSchema],
    scrb_InventoryHoldingCost                 : [brandInfoSchema],
    scrb_GrossProfit                          : [brandInfoSchema],
    scrb_GrossProfitChange                    : [brandInfoSchema],
    scrb_TradeAndMarketing                    : [brandInfoSchema],
    scrb_AdvertisingOnLine                    : [brandInfoSchema],
    scrb_AdvertisingOffLine                   : [brandInfoSchema],
    scrb_TradeAndMarketingAsPercentageOfSales : [brandInfoSchema],
    scrb_TradeAndMarketingShareInCategory     : [brandInfoSchema],
    scrb_GeneralExpenses                      : [brandInfoSchema],
    scrb_Amortisation                         : [brandInfoSchema],
    scrb_OperatingProfit                      : [brandInfoSchema],
    scrb_OperatingProfitChange                : [brandInfoSchema],
    scrb_OperatingProfitMargin                : [brandInfoSchema],
    scrb_OperatingProfitShareInCategory       : [brandInfoSchema],
    scrb_Interest                             : [brandInfoSchema],
    scrb_Taxes                                : [brandInfoSchema],
    scrb_ExceptionalItems                     : [brandInfoSchema],
    scrb_NetProfit                            : [brandInfoSchema],
    scrb_NetProfitChange                      : [brandInfoSchema],
    scrb_NetProfitMargin                      : [brandInfoSchema],
    scrb_NetProfitShareInCategory             : [brandInfoSchema],

    ////P&L per variant in B&M and onLine
    scrv_Sales                                : [variantInfoSchema],
    scrv_SalesChange                          : [variantInfoSchema],
    scrv_SalesShareInCategory                 : [variantInfoSchema],
    scrv_CostOfGoodsSold                      : [variantInfoSchema],
    scrv_DiscontinuedGoodsCost                : [variantInfoSchema],
    scrv_InventoryHoldingCost                 : [variantInfoSchema],
    scrv_GrossProfit                          : [variantInfoSchema],
    scrv_GrossProfitChange                    : [variantInfoSchema],
    scrv_TradeAndMarketing                    : [variantInfoSchema],
    scrv_AdvertisingOnLine                    : [variantInfoSchema],
    scrv_AdvertisingOffLine                   : [variantInfoSchema],
    scrv_TradeAndMarketingAsPercentageOfSales : [variantInfoSchema],
    scrv_TradeAndMarketingShareInCategory     : [variantInfoSchema],
    scrv_GeneralExpenses                      : [variantInfoSchema],
    scrv_Amortisation                         : [variantInfoSchema],
    scrv_OperatingProfit                      : [variantInfoSchema],
    scrv_OperatingProfitChange                : [variantInfoSchema],
    scrv_OperatingProfitMargin                : [variantInfoSchema],
    scrv_OperatingProfitShareInCategory       : [variantInfoSchema],
    scrv_Interest                             : [variantInfoSchema],
    scrv_Taxes                                : [variantInfoSchema],
    scrv_ExceptionalItems                     : [variantInfoSchema],
    scrv_NetProfit                            : [variantInfoSchema],
    scrv_NetProfitChange                      : [variantInfoSchema],
    scrv_NetProfitMargin                      : [variantInfoSchema],
    scrv_NetProfitShareInCategory             : [variantInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategoriesTotal : 1~3 
    value : [Number], //0-traditional 1-Internet 2-Total
})

var brandInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    value                                : [Number], //0-traditional, 1-Internet, 2-Total
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    value                                : [Number], //0-traditional, 1-Internet, 2-Total
})







