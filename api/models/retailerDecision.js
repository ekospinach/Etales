var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var retDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    retailerID : Number, //TAllRetailers (1~4)
    seminar : String,
    period : Number,    
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
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
    retCatDecision : [retCatDecisionSchema], //length: TCategories(1~2)
    retMarketDecision: [retMarketDecisionSchema] //length: TMarkets(1~2)
})


//date struture for decision (step 2,4)
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
    discontinue : Boolean    
})

var retailerDecisionModel = mongoose.model('retailerDecision', retDecisionSchema);

exports.updateRetailerDecision = function(io){
    return function(req, res, next){
        var queryCondition = {
            seminar : req.body.seminar,
            period : req.body.period,
            retailerID : req.body.producerID,
            behaviour : req.body.hehaviour,
            /*
            - step 1
            updateGeneralDecision

            - step 2
            updateMarketDecision            

            - step 3
            addProductNewBrand
            addProductExistedBrand
            deleteProduct
            deleteBrand

            - step 4
            updateOrders
            addOrders
            deleteOrders
            */
        }
    }
}

exports.getAllRetailerDecision = function(req, res, next){
    /*R_1*/
    var retailerDecisions={
        seminar : 'MAY',
        period : 0,
        retailerID:1,
        onlineAdvertising : {
            PRICE : 10,
            CONVENIENCE : 20,
            ASSORTMENT : 30
        },
        tradtionalAdvertising : {
            PRICE : 11,
            CONVENIENCE : 21,
            ASSORTMENT : 31        
        },
        nextBudgetExtension : 15,
        approvedBudgetExtension : 16,
        retCatDecision : [{
            //undefined
        },{
            categoryID:1,
            retVariantDecision:[{
                //undefined
            },{
                brandName : 'ELISA5',
                brandID : 51,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    //undefined
                },{
                    varName : '_A',
                    varID : 511,
                    parentBrandID : 51,
                    dateOfDeath : -4,
                    dateOfBirth : 10,
                    packFormat : 'STANDARD',
                    composition : [undefined,4,4,4],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                },{
                    varName : '_B',
                    varID : 512,
                    parentBrandID : 51,
                    dateOfDeath : -4,
                    dateOfBirth : 10,
                    packFormat : 'STANDARD',
                    composition : [undefined,5,5,5],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false                     
                }] //length: TOneBrandVars(1~3)
            },{
                brandName : 'ELEEX5',
                brandID : 52,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    //undefined
                },{
                    varName : '_A',
                    varID : 521,
                    parentBrandID : 52,
                    dateOfDeath : -4,
                    dateOfBirth : 10,
                    packFormat : 'PREMIUM',
                    composition : [undefined,4,4,4],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)
            }]
        },{
            categoryID:2,
            retVariantDecision:[{
                //undefined
            },{
                brandName : 'HARIS5',
                brandID : 51,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    //undefined
                },{
                    varName : '_A',
                    varID : 511,
                    parentBrandID : 51,
                    dateOfDeath : -4,
                    dateOfBirth : 10,
                    packFormat : 'ECONOMY',
                    composition : [undefined,3,3,3],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)
            },{
                brandName : 'HICHY5',
                brandID : 52,
                parentCompanyID : 5,
                dateOfBirth : -4, //which period this brand be created, if this brand is initialized in the beginning, this value should be -4
                dateOfDeath : 10, //which period this brand be discontinued, if this brand haven't been discontinued, this value should be 10
                privateLabelVarDecision : [{
                    //undefined
                },{
                    varName : '_A',
                    varID : 521,
                    parentBrandID : 52,
                    dateOfDeath : -4,
                    dateOfBirth : 10,
                    packFormat : 'STANDARD',
                    composition : [undefined,6,6,6],//1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                    discontinue : false    
                }] //length: TOneBrandVars(1~3)                
            }]
        }], //length: TCategories(1~2)
        retMarketDecision: [{
            //undefined
        },{
            marketID : 1, //1~2
            categorySurfaceShare : [undefined,10,20], //[1]for Elecssories [2]for HealthBeauty
            emptySpaceOptimised : false,
            localAdvertising : {
                PRICE : 11,
                CONVENIENCE : 22,
                ASSORTMENT : 33            
            },
            serviceLevel : 'MEDIUM', //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
            retMarketAssortmentDecision : [{
                //undefined
            },{
                categoryID : 1, //1~2
                retVariantDecision : [{
                    //undefined
                },{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Etales15', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Etales25', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Etales35', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            },{
                categoryID:2,
                retVariantDecision : [{
                    //undefined
                },{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Health15', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Health25', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Health35', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            }] //length : TCategories(1~2)
        },{
            marketID : 2, //1~2
            categorySurfaceShare : [undefined,20,30], //[1]for Elecssories [2]for HealthBeauty
            emptySpaceOptimised : false,
            localAdvertising : {
                PRICE : 22,
                CONVENIENCE : 33,
                ASSORTMENT : 44            
            },
            serviceLevel : 'BASE', //SL_BASE, SL_FAIR, SL_MEDIUM, SL_ENHANCED, SL_PREMIUM
            retMarketAssortmentDecision : [{
                //undefined
            },{
                categoryID : 1, //1~2
                retVariantDecision : [{
                    //undefined
                },{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Etales1', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 20,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Etales2', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Etales3', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            },{
                categoryID:2,
                retVariantDecision : [{
                    //undefined
                },{
                    brandID : 51,
                    variantID : 511,
                    brandName : 'Health1', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 20,
                    order : 90,
                    pricePromotions : {
                        promo_Frequency : 39, //range: 0~52
                        promo_Rate : 1 //0~1
                    },
                    retailerPrice : 33,
                    shelfSpace : 90 //saved as a %
                },{
                    brandID : 52,
                    variantID : 512,
                    brandName : 'Health2', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 80,
                    pricePromotions : {
                        promo_Frequency : 48, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 23,
                    shelfSpace : 80 //saved as a %
                },{
                    brandID : 53,
                    variantID : 513,
                    brandName : 'Health3', //need Dariusz to add this in dataStruture
                    varName : '_A', //need Dariusz to add this in dataStruture
                    dateOfBirth : -4,
                    dateOfDeath : 10,
                    order : 70,
                    pricePromotions : {
                        promo_Frequency : 28, //range: 0~52
                        promo_Rate : 0 //0~1
                    },
                    retailerPrice : 13,
                    shelfSpace : 60 //saved as a %
                }]
            }] //length : TCategories(1~2)
        }] 
    }
    res.header("Content-Type", "application/json; charset=UTF-8");                                
    res.statusCode = 200;
    res.send(retailerDecisions); 
}
