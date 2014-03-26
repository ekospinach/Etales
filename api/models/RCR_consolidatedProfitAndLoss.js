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
    rcrpl_NetProfitChage                : [categoryInfoSchema],
    rcrpl_NetProfitMargin               : [categoryInfoSchema],

    //P&L per brand in B&M and onLine
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
    rcrb_OperatingProfitChage          : [brandInfoSchema],
    rcrb_OperatingProfitMargin         : [brandInfoSchema],
    rcrb_Interest                      : [brandInfoSchema],
    rcrb_Taxes                         : [brandInfoSchema],
    rcrb_ExceptionalItems              : [brandInfoSchema],
    rcrb_NetProfit                     : [brandInfoSchema],
    rcrb_NetProfitChage                : [brandInfoSchema],
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
    rcrv_OperatingProfitChage          : [variantInfoSchema],
    rcrv_OperatingProfitMargin         : [variantInfoSchema],
    rcrv_Interest                      : [variantInfoSchema],
    rcrv_Taxes                         : [variantInfoSchema],
    rcrv_ExceptionalItems              : [variantInfoSchema],
    rcrv_NetProfit                     : [variantInfoSchema],
    rcrv_NetProfitChage                : [variantInfoSchema],
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

}

exports.getRCR_consolidatedProfitAndLoss=function(req,res,next){
    var data={
        'seminar':req.params.seminar,
        'period':req.params.period,
        'producerID':req.params.producerID
    };
    RCR_consolidatedProfitAndLoss.find(data,function(err,docs){
        if(docs){
            res.send(200,docs);
        }else{
            res.send(404,'failed');
        }
    })    
}

