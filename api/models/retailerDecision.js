var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var retDecisionSchema = mongoose.Schema({
    retailerID : Number, //TAllRetailers (1~4)
    onlineAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number
    },
    tradtionalAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number        
    },
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    retCatDecision : [retCatDecisionSchema], //length: TCategories(1~2)
    retMarketDecision [retMarketDecisionSchema] //length: TMarkets(1~2)
})


//date struture for decision (step 1,2,4)
var retMarketDecisionSchema = mongoose.Schema({
    marketID : Number, //1~2
    categorySurfaceShare : [Number], //[1]for Elecssories [2]for HealthBeauty
    emptySpaceOptimised : Boolean,
    localAdvertising : {
        PRICE : Number,
        CONVENIENCE : Number,
        ASSORTMENT : Number            
    },
    serviceLevel : String, //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
    retMarketAssortmentDecision : [retQuarterAssortmentDecisionSchema] //length : TCategories(1~2)
})

var retQuarterAssortmentDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    retVariantDecision : [retVariantDecisionSchema] //length : TRetVariants(1~21)
})

var retVariantDecisionSchema = mongoose.Schema({
    brandID : Number,
    variantID : Number,
    brandName : String, //need Dariusz to add this in dataStruture
    varName : String, //need Dariusz to add this in dataStruture
    dateOfBirth : Number,
    dateOfDeath : Number,
    order : Number,
    pricePromotions : {
        promo_Frequency : Number, //range: 0~52
        promo_Rate : Number //0~1
    },
    retailerPrice : Number,
    shelfSpace : Number //saved as a %
})

//date strute for private labels (step 3)
var retCatDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    privateLabelDecision : [privateLabelDecisionSchema] //length: TPrivateLabels(1~4, effective number is 3)
})

var privateLabelDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,
    /*
        case 'P': brandID = (10 * userCount) + brandCount
        case 'R': brandID = (10 * (userCount +4)) + brandCount
        userCount = 1~4
        brandCount = 1~5
    */    
    parentCompanyID : Number,
    /*
        Prod_1_ID          = 1;
        Prod_2_ID          = 2;
        Prod_3_ID          = 3;
        Prod_4_ID          = 4;
        Ret_1_ID           = 5;
        Ret_2_ID           = 6;
        TradTrade_ID       = 7;
        E_Mall_ID          = 8;
        Admin_ID           = 9;
    */  
    dateOfBirth : Number, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
    dateOfDeath : Number, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
    privateLabelVarDecision : [privateLabelVarDecision] //length: TOneBrandVars(1~3)
})

var privateLabelVarDecision = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
    dateOfDeath : Number,
    dateOfBirth : Number,
    packFormat : String,
    composition : [Number],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    discontinue : boolean    
})
