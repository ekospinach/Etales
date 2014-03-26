var mongoose = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore'),
	request = require('request'),
	q = require('q');

var RCR_profitabilityBySupplierSchema = mongoose.Schema({
	period : Number,
    seminar : String,
    retailerID  : Number, //TBMRetailers : 1~3 (BMRetsMax)

    rcrps_ShelfSpace                     : [categoryInfoSchema],
    rcrps_NetSales                       : [categoryInfoSchema],
    rcrps_NetSalesPerShelfSpace          : [categoryInfoSchema],
    rcrps_NetSalesShare                  : [categoryInfoSchema],
    rcrps_GrossContribution              : [categoryInfoSchema],
    rcrps_GrossContributionPerShelfSpace : [categoryInfoSchema],
    rcrps_GrossContributionMargin        : [categoryInfoSchema],
    rcrps_GrossContributionShare         : [categoryInfoSchema],
    rcrps_PaymentTerms                   : [categoryInfoSchema],
})

var categoryInfoSchema = mongoose.Schema({
    categoryID : Number,  //TCategoriesTotal : 1~2 
    marketInfo : [marketInfoSchema]
})

var marketInfoSchema = mongoose.Schema({
    marketID : Number, //TMarketsTotal : 1~3
    factoriesInfo : [factoriesInfoSchema]
})

var factoriesInfoSchema = mongoose.Schema({
    factoriesID : Number, 
    /*    
    {                                TFactories correspond to:                                                    }
    {       [1] = Supplier_1,                                                                                     }
    {       [2] = Supplier_2,                                                                                     }
    {       [3] = Supplier_3,                                                                                     }
    {       [4] = Supplier_4, only if he is ACTIVE player and in that case can sell his brands to B&M retailers,  }
    {                         otherwise (i.e. Supplier_4 is PASSIVE) this column(s) should not be displayed       }
    {                         because Supplier_4 brands are only sold on-line                                     }
    {       [5] = Supplier_4, this time as a producer of private labels                                           }
    */    
    value : Number,
})

