var mongoose  = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore');
	uniqueValidator = require('mongoose-unique-validator');

var allDealSchema = mongoose.Schema({
    producerDeal : [producerDealSchema]
})

var producerDealSchema = mongoose.Schema({
    producerID : Number,
    retailerDealSchema : [retailerDealSchema]
})

var retailerDealSchema = mongoose.Schema({
    retailerID : Number,
    categoryDeal : [categoryDealSchema]
})

var categoryDealSchema = mongoose.Schema({
    categoryID : Number,
    consignementVolume     : categoryDetailsSchema;
    inStoreActivitiesFee   : categoryDetailsSchema;
    minimumOrder           : categoryDetailsSchema;
    otherCompensation      : categoryDetailsSchema;
    paymentDays            : categoryDetailsSchema;
    performanceBonusAmount : categoryDetailsSchema;
    performanceBonusRate   : categoryDetailsSchema;
    promotionalSupport     : categoryDetailsSchema;
    salesTargetVolume      : categoryDetailsSchema;
    volumeDiscountRate     : categoryDetailsSchema;
})

var categoryDetailsSchema = mongoose.Schema({
    marketsDetails : [Number], //Length: TMarketTotal
    useBrandsDetails : Boolean,
    useMarketsDetails : Boolean,
    brandsDetails : [brandDetailsSchema], //Length: TProBrands
})

var brandDetailsSchema = mongoose.Schema({
    brandID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    marketsDetails : [Number],
    useVariantsDetails : Boolean,
    useMarketsDetails : Boolean,
    variantsDetails : [variantsDetailsSchema] //length: TOneBrandVars
})

var variantsDetailsSchema = mongoose.Schema({
    varID : Number,
    dateOfBirth : Number,
    dateOfDeath : Number,
    useMarketsDetails : Boolean,
    marketsDetails : [Number]
})