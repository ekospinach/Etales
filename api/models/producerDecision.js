var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var proDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    producerID : Number, //1~4
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    proCatDecision : [proCatDecisionSchema] //Length: TCategories(1~2)
})

var proCatDecisionSchema = mongoose.Schema({
    categoryID : Number, //1~2
    capacityChange : Number,
    investInDesign : Number,
    investInProductionFlexibility : Number,
    investInTechnology : Number,
    proBrandsDecision : [proBrandDecisionSchema] //Length: TProBrands(1~5) 
})

var proBrandDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,   
    /*
        case 'P': brandID = (10 * userCount) + brandCount
        case 'R': brandID = (10 * (userCount +4)) + brandCount
        userCount = 1~4
        brandCount = 1~5
    */
    paranetCompanyID : Number, //TBrandOwners(Prod_1_ID~Ret_2_ID)
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
    advertisingOffLine : [Number], //TMarketDetails, 1-Urban, 2-Rural
    advertisingOnLine : Number,
    supportEmall : Number,
    supportTraditionalTrade : [Number], //TMarketDetails, 1-Urban, 2-Rural
    proVarDecision : [proVarDecisionSchema] //Length: TOneBrandVars(1~3)
})

var proVarDecisionSchema = mongoose.Schema({
    varName : String,
    varID : Number, //varID = BrandID * 10 + varCount
    parentBrandID : Number, //brandID
    packFormat : String, //ECONOMY, STANDARD, PREMIUM
    dateOfBirth : Number,
    dateOfDeath : Number,
    composition : [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
    production : Number,
    currentPriceBM : Number,
    currentPriceEmall : Number,
    discontinue : Boolean,
    nextPriceBM : Number,
    nextPriceEmall : Number
})


