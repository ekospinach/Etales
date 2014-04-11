var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var RCR_consolidatedProfitAndLossSchema = mongoose.Schema({
    period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)

    //Consolidated Profit & Loss statement, retailers
    rcrpl_Sales                         : [categoryInfoSchema],
    rcrpl_PromotionsCost                : [categoryInfoSchema],
    rcrpl_OtherCompensation             : [categoryInfoSchema],
    rcrpl_NetSales                      : [categoryInfoSchema],
    rcrpl_NetSalesChange                : [categoryInfoSchema],
    rcrpl_CostOfGoodsSold               : [categoryInfoSchema],
    rcrpl_ValueOfQuantityDiscounts      : [categoryInfoSchema],
    rcrpl_ValueOfPerformanceBonus       : [categoryInfoSchema],
    rcrpl_DiscontinuedGoodsCost         : [categoryInfoSchema],
    rcrpl_InventoryHoldingCost          : [categoryInfoSchema],
    rcrpl_GrossProfit                   : [categoryInfoSchema],
    rcrpl_GrossProfitChange             : [categoryInfoSchema],
    rcrpl_GrossProfitMargin             : [categoryInfoSchema],
    rcrpl_GeneralExpenses               : [categoryInfoSchema],
    rcrpl_OperatingProfit               : [categoryInfoSchema],
    rcrpl_OperatingProfitChange         : [categoryInfoSchema],
    rcrpl_OperatingProfitMargin         : [categoryInfoSchema],
    rcrpl_Interest                      : [categoryInfoSchema],
    rcrpl_Taxes                         : [categoryInfoSchema],
    rcrpl_ExceptionalItems              : [categoryInfoSchema],
    rcrpl_NetProfit                     : [categoryInfoSchema],
    rcrpl_NetProfitChange               : [categoryInfoSchema],
    rcrpl_NetProfitMargin               : [categoryInfoSchema],

    //P&L per brand in B&M and onLine
    rcrb_Sales                         : [brandInfoSchema],
    rcrb_PromotionsCost                : [brandInfoSchema],
    rcrb_OtherCompensation             : [brandInfoSchema],
    rcrb_NetSales                      : [brandInfoSchema],
    rcrb_NetSalesChange                : [brandInfoSchema],
    rcrb_NetSalesShareInCategory       : [brandInfoSchema],
    rcrb_CostOfGoodsSold               : [brandInfoSchema],
    rcrb_ValueOfQuantityDiscounts      : [brandInfoSchema],
    rcrb_ValueOfPerformanceBonus       : [brandInfoSchema],
    rcrb_DiscontinuedGoodsCost         : [brandInfoSchema],
    rcrb_InventoryHoldingCost          : [brandInfoSchema],
    rcrb_GrossProfit                   : [brandInfoSchema],
    rcrb_GrossProfitChange             : [brandInfoSchema],
    rcrb_GrossProfitMargin             : [brandInfoSchema],
    rcrb_GrossProfitShareInCategory    : [brandInfoSchema],
    rcrb_GeneralExpenses               : [brandInfoSchema],
    rcrb_OperatingProfit               : [brandInfoSchema],
    rcrb_OperatingProfitChange         : [brandInfoSchema],
    rcrb_OperatingProfitMargin         : [brandInfoSchema],
    rcrb_OperatingProfitMarginShareInCategory: [brandInfoSchema],
    rcrb_Interest                      : [brandInfoSchema],
    rcrb_Taxes                         : [brandInfoSchema],
    rcrb_ExceptionalItems              : [brandInfoSchema],
    rcrb_NetProfit                     : [brandInfoSchema],
    rcrb_NetProfitChange               : [brandInfoSchema],
    rcrb_NetProfitMargin               : [brandInfoSchema],
    rcrb_NetProfitShareInCategory      : [brandInfoSchema],

    ////P&L per variant in B&M and onLine
    rcrv_Sales                         : [variantInfoSchema],
    rcrv_PromotionsCost                : [variantInfoSchema],
    rcrv_OtherCompensation             : [variantInfoSchema],
    rcrv_NetSales                      : [variantInfoSchema],
    rcrv_NetSalesChange                : [variantInfoSchema],
    rcrv_NetSalesShareInCategory       : [variantInfoSchema],
    rcrv_CostOfGoodsSold               : [variantInfoSchema],
    rcrv_ValueOfQuantityDiscounts      : [variantInfoSchema],
    rcrv_ValueOfPerformanceBonus       : [variantInfoSchema],
    rcrv_DiscontinuedGoodsCost         : [variantInfoSchema],
    rcrv_InventoryHoldingCost          : [variantInfoSchema],
    rcrv_GrossProfit                   : [variantInfoSchema],
    rcrv_GrossProfitChange             : [variantInfoSchema],
    rcrv_GrossProfitMargin             : [variantInfoSchema],
    rcrv_GrossProfitShareInCategory    : [variantInfoSchema],
    rcrv_GeneralExpenses               : [variantInfoSchema],
    rcrv_OperatingProfit               : [variantInfoSchema],
    rcrv_OperatingProfitChange         : [variantInfoSchema],
    rcrv_OperatingProfitMargin         : [variantInfoSchema],
    rcrv_OperatingProfitMarginShareInCategory:[variantInfoSchema],
    rcrv_Interest                      : [variantInfoSchema],
    rcrv_Taxes                         : [variantInfoSchema],
    rcrv_ExceptionalItems              : [variantInfoSchema],
    rcrv_NetProfit                     : [variantInfoSchema],
    rcrv_NetProfitChange               : [variantInfoSchema],
    rcrv_NetProfitMargin               : [variantInfoSchema],
    rcrv_NetProfitShareInCategory      : [variantInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number, //TCategoriesTotal : 1~3 
    value : [Number], //0-Urban, 1-Rural, 2-Total
})

var brandInfoSchema = mongoose.Schema({
    brandName                            : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    value                                : [Number], //0-Urban, 1-Rural, 2-Total
})

var variantInfoSchema = mongoose.Schema({
    variantName                          : String,
    parentBrandName                      : String,
    parentCategoryID                     : Number,
    parentCompanyID                      : Number, //TActors : 1~(4+3) 
    value                                : [Number], //0-Urban, 1-Rural, 2-Total
})

var RCR_consolidatedProfitAndLoss=mongoose.model('RCR_consolidatedProfitAndLoss',RCR_consolidatedProfitAndLossSchema);

exports.addRCR_consolidatedProfitAndLoss=function(req,res,next){
    var newRCR_consolidatedProfitAndLoss=RCR_consolidatedProfitAndLoss({
        period : 0,
        seminar : 'MAY',
        retailerID  : 1, //TBMRetailers : 1~3 (BMRetsMax)

        //Consolidated Profit & Loss statement, retailers
        rcrpl_Sales                         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_PromotionsCost                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_OtherCompensation             : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_NetSales                      : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_NetSalesChange                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_CostOfGoodsSold               : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_ValueOfQuantityDiscounts      : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_ValueOfPerformanceBonus       : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_DiscontinuedGoodsCost         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_InventoryHoldingCost          : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_GrossProfit                   : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_GrossProfitChange             : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_GrossProfitMargin             : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_GeneralExpenses               : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_OperatingProfit               : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_OperatingProfitChange         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_OperatingProfitMargin         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_Interest                      : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_Taxes                         : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_ExceptionalItems              : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_NetProfit                     : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_NetProfitChange                : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],
        rcrpl_NetProfitMargin               : [{
            categoryID:1,
            value:[10,20,30]
        },{
            categoryID:2,
            value:[40,50,60]
        },{
            categoryID:3,
            value:[75,85,95]
        }],

        //P&L per brand in B&M and onLine
        rcrb_Sales                          : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_PromotionsCost                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_OtherCompensation             : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetSales                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetSalesChange                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetSalesShareInCategory       : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_CostOfGoodsSold               : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_ValueOfQuantityDiscounts      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_ValueOfPerformanceBonus       : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_DiscontinuedGoodsCost         : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_InventoryHoldingCost          : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_GrossProfit                   : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_GrossProfitChange             : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_GrossProfitMargin             : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_GrossProfitShareInCategory    : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_GeneralExpenses               : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_OperatingProfit               : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_OperatingProfitChange          : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_OperatingProfitMargin         : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_OperatingProfitMarginShareInCategory         : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_Interest                      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_Taxes                         : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_ExceptionalItems              : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetProfit                     : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetProfitChange                : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetProfitMargin               : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],
        rcrb_NetProfitShareInCategory      : [{
            brandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[10,20,30]
        },{
            brandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[40,50,60]
        },{
            brandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[35,45,55]
        },{
            brandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,75,85]
        }],

        ////P&L per variant in B&M and onLine
        rcrv_Sales                         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_PromotionsCost                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_OtherCompensation             : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetSales                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetSalesChange                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetSalesShareInCategory       : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_CostOfGoodsSold               : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_ValueOfQuantityDiscounts      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_ValueOfPerformanceBonus       : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_DiscontinuedGoodsCost         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_InventoryHoldingCost          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_GrossProfit                   : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_GrossProfitChange             : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_GrossProfitMargin             : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_GrossProfitShareInCategory    : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_GeneralExpenses               : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_OperatingProfit               : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_OperatingProfitChange          : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_OperatingProfitMargin         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_OperatingProfitMarginShareInCategory         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_Interest                      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_Taxes                         : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_ExceptionalItems              : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetProfit                     : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetProfitChange                : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetProfitMargin               : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
        rcrv_NetProfitShareInCategory      : [{
            variantName:'_A',
            parentBrandName:'ELAN1',
            parentCategoryID:1,
            parentCompanyID:1,
            value:[35,45,55]
        },{
            variantName:'_A',
            parentBrandName:'ETALE2',
            parentCategoryID:1,
            parentCompanyID:2,
            value:[55,65,75]
        },{
            variantName:'_C',
            parentBrandName:'HLAN3',
            parentCategoryID:2,
            parentCompanyID:3,
            value:[95,85,75]
        },{
            variantName:'_C',
            parentBrandName:'HTTP1',
            parentCategoryID:2,
            parentCompanyID:1,
            value:[65,55,45]
        }],
    });
    newRCR_consolidatedProfitAndLoss.save(function(err) {
        if(!err){
            res.send(200,newRCR_consolidatedProfitAndLoss);
            console.log("created new GeneralReport:"+newRCR_consolidatedProfitAndLoss);
        } else {
            res.send(400,"failed.");
        }
    }); 
}

exports.getRCR_consolidatedProfitAndLoss=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'retailerID':req.params.retailerID
    };
    RCR_consolidatedProfitAndLoss.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

