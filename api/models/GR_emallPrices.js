var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)

//TActors : 1~(4+3)
//TBrandOwener : 1~6 (Prod_1_ID...Ret_2_ID)
//TAllProducer : 1~4 (ProsMaxPlus)
var emallPricesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    categoryInfo : [categoryInfoSchema]
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,                   //TCategoriesTotal : 1~(2+1)
    variantInfo : [variantInfoSchema]
})

var variantInfo = mongoose.Schema({
    varName : String,
    varID : Number,
    parentBrandID : Number,
    parentBrandName : String,
    vemp_NetOnlinePrice  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_PriceChange     : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    vemp_Promotions      : Number, //TAllProducer : 1~4 (ProsMaxPlus)
})

