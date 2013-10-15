var proDecisionSchema = mongoose.Schema({
    seminar : String,
    period : Number,
    producerID : Number,
    nextBudgetExtension : Number,
    approvedBudgetExtension : Number,
    proCatDecision : [proCatDecisionSchema] //Length: TCategories(1~2)
})

var proCatDecisionSchema = mongoose.Schema({
    categoryID : Number,
    capacityChange : Number,
    investInDesign : Number,
    investInProductionFlexibility : Number,
    investInTechnology : Number,
    proBrandsDecision : [proBrandDecisionSchema] //Length: TProBrands(1~5)
})

var proBrandDecisionSchema = mongoose.Schema({
    brandName : String,
    brandID : Number,
    paranetCompanyID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    advertisingOffLine : [Number], //TMarketDetails, 1-Urban, 2-Rural
    advertisingOnLine : Number,
    supportEmall : Number,
    supportTraditionalTrade : [Number], //TMarketDetails, 1-Urban, 2-Rural
    proVarDecision : [proVarDecisionSchema] //Length: TOneBrandVars(1~3)
})

var proVarDecisionSchema = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
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