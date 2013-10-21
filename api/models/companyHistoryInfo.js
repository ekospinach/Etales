var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var companyHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	companyID : Number, (1~9)
	producerView : [producerViewSchema], //1~4
	retailerView : [retailerViewSchema]  //1~4
})

var producerViewSchema = mongoose.Schema({
	producerID : Number, (1~4)
	//pt...
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number
	//pc...
	productionCapacity : [Number], //TCategories(1~2)
	acquiredTechnologyLevel : [Number], //TCategories(1~2)
	acquiredProductionFlexibility : [Number], //TCategories(1~2)
	acquiredDesignLevel : [Number] //TCategories(1~2)
})

var retailerViewSchema = mongoose.Schema({
	retailerID : Number, (1~4)
	//rr....
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number
})

// 	retailerCategoryView : [retailerCategoryViewSchema] //TCategories(1~2)
// })

// var retailerCategoryViewSchema = mongoose.Schema({
// 	retailerCategoryMarketView = [retailerCategoryMarketViewSchema] //TMarketsTotal(1~3)
// })

// var retailerCategoryMarketViewSchema = mongoose.Schema({
// 	//rq...
// 	rq_socialNetworsScore : Number;
// })

