var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util'),
    _ = require('underscore');

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
    investInDesign : Number,/*E*/
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


var producerDecisionModel = mongoose.model('producerDecision', proDecisionSchema);

exports.getAllProducerDecision = function(req, res, next){
    /*P_1*/
    var producerDecisions={
        seminar:'MAY',
        period:0,
        producerID:1,
        nextBudgetExtension:1,
        approvedBudgetExtension:1,
        proCatDecision:[{
            categoryID:1,
            capacityChange:0,
            investInDesign:6.13,
            investInProductionFlexibility:11.57,
            investInTechnology:3.16,
            proBrandsDecision:[{
                brandName:'EGEND1',
                brandID:11,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'STANDARD', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'EHAYA1',
                brandID:12,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'ELAND1',
                brandID:13,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'PREMIUM', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        },{
            categoryID:2,
            capacityChange:0,
            investInDesign:0,/*null*/
            investInProductionFlexibility:21.21,
            investInTechnology:21.21,
            proBrandsDecision:[{
                brandName:'HEELY1',
                brandID:11,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 111, //varID = BrandID * 10 + varCount
                        parentBrandID : 11, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOTOO1',
                brandID:12,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 121, //varID = BrandID * 10 + varCount
                        parentBrandID : 12, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                }]
            },{
                brandName:'HOLAY1',
                brandID:13,
                paranetCompanyID:1,
                dateOfBirth:-4,
                dateOfDeath:10,
                advertisingOffLine:[10,20],
                advertisingOnLine:15,
                supportEmall:15,
                supportTraditionalTrade:[10,20],
                proVarDecision:[{
                        varName:'_A',
                        varID : 131, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06
                },{
                        varName:'_B',
                        varID : 132, //varID = BrandID * 10 + varCount
                        parentBrandID : 13, //brandID
                        packFormat : 'ECONOMY', //ECONOMY, STANDARD, PREMIUM
                        dateOfBirth : -4,
                        dateOfDeath : 10,
                        composition : [6,6,7], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                        production : 60,
                        currentPriceBM : 6.85,
                        currentPriceEmall : 8.25,
                        discontinue : false,
                        nextPriceBM : 7.06,
                        nextPriceEmall : 7.06                    
                }]
            }]
        }]
    };
    res.header("Content-Type", "application/json; charset=UTF-8");                                
    res.statusCode = 200;
    res.send(producerDecisions);    
}

