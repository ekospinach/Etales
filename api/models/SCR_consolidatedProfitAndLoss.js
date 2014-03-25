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

    //pdf1-5
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
    scrv_NetProfitShareInCategory             : [variantInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategoriesTotal : 1~3 
    value : [Number], //0-traditional-bm business 1-Internet-online 2-Total
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

var SCR_consolidatedProfitAndLoss=mongoose.model('SCR_consolidatedProfitAndLoss',SCR_consolidatedProfitAndLossSchema);

exports.addSCR_consolidatedProfitAndLoss=function(req,res,next){
    var newSCR_consolidatedProfitAndLoss=SCR_consolidatedProfitAndLoss({
        period : 0,
        seminar : 'MAY',
        producerID  : 1, //TAllProducer : 1~4 (ProsMaxPlus)
        scrpl_Sales                                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_SalesChange                          : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_MaterialCosts                        : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_CostOfGoodsSold                      : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_DiscontinuedGoodsCost                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_InventoryHoldingCost                 : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_GrossProfit                          : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_GrossProfitChange                    : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_GrossProfitMargin                    : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_TradeAndMarketing                    : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_TradeAndMarketingAsPercentageOfSales : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_GeneralExpenses                      : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_Amortisation                         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_OperatingProfit                      : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_OperatingProfitChange                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_OperatingProfitMargin                : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_Interest                             : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_Taxes                                : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }],  
        scrpl_ExceptionalItems                     : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_NetProfit                            : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_NetProfitChange                      : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_NetProfitMargin                      : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        //---  Additional, used on the next two tables ( P&L per brand in B&M and onLine ) for the first columns --- 
        scrpl_AdvertisingOnLine                    : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 
        scrpl_AdvertisingOffLine                   : [{
            categoryID:1,
            value:[90,80,70]
        },{
            categoryID:2,
            value:[60,50,40]
        },{
            categoryID:3,
            value:[30,20,10]
        }], 
        scrpl_TradeSupport                         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[70,80,90]
        }], 

        //P&L per brand in B&M and onLine
        scrb_Sales                                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_SalesChange                          : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_SalesShareInCategory                 : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_CostOfGoodsSold                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_DiscontinuedGoodsCost                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_InventoryHoldingCost                 : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_GrossProfit                          : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_GrossProfitChange                    : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_TradeAndMarketing                    : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_AdvertisingOnLine                    : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_AdvertisingOffLine                   : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_TradeAndMarketingAsPercentageOfSales : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_TradeAndMarketingShareInCategory     : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_GeneralExpenses                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_Amortisation                         : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_OperatingProfit                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_OperatingProfitChange                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_OperatingProfitMargin                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_OperatingProfitShareInCategory       : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_Interest                             : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_Taxes                                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_ExceptionalItems                     : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_NetProfit                            : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_NetProfitChange                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],
        scrb_NetProfitMargin                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[40,50,60]
        }],
        scrb_NetProfitShareInCategory             : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            value:[90,80,70]
        },{
            brandName:'HLAN1',
            parentCategoryID:2,
            value:[55,65,75]
        }],

        ////P&L per variant in B&M and onLine
        scrv_Sales                                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_SalesChange                          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_SalesShareInCategory                 : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_CostOfGoodsSold                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_DiscontinuedGoodsCost                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_InventoryHoldingCost                 : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_GrossProfit                          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_GrossProfitChange                    : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_TradeAndMarketing                    : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_AdvertisingOnLine                    : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_AdvertisingOffLine                   : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_TradeAndMarketingAsPercentageOfSales : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_TradeAndMarketingShareInCategory     : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_GeneralExpenses                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_Amortisation                         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_OperatingProfit                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_OperatingProfitChange                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_OperatingProfitMargin                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_OperatingProfitShareInCategory       : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_Interest                             : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_Taxes                                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_ExceptionalItems                     : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_NetProfit                            : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_NetProfitChange                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }],
        scrv_NetProfitMargin                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[10,20,30]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[70,80,90]
        }],
        scrv_NetProfitShareInCategory             : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            value:[40,50,60]
        },{
            variantName:'_B',
            parentBrandName:'HLAN1',
            parentCategoryID:2,
            value:[45,55,65]
        }]
    });
    newSCR_consolidatedProfitAndLoss.save(function(err) {
        if(!err){
            res.send(200,newSCR_consolidatedProfitAndLoss);
            console.log("created new GeneralReport:"+newSCR_consolidatedProfitAndLoss);
        } else {
            res.send(400,"failed.");
        }
    });    
}

exports.getSCR_consolidatedProfitAndLoss=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    SCR_consolidatedProfitAndLoss.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}







