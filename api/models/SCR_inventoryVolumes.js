var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

//TActiveActors : 1~(3+2)
//TActors : 1~(4+3)

var SCR_inventoryVolumesSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    producerID  : Number, //TAllProducer : 1~4 (ProsMaxPlus)
    scrviv_Initial          : [variantInfoSchema],
    scrviv_Production       : [variantInfoSchema],
    scrviv_Sales            : [variantInfoSchema],
    scrviv_Discontinued     : [variantInfoSchema],
    scrviv_Closing          : [variantInfoSchema],
})

var variantInfoSchema = mongoose.Schema({
    variantName       : String,
    parentBrandName   : String,
    parentCategoryID : Number,
    value : [Number], ////0-traditional, 1-Internet, 2-Total
})
