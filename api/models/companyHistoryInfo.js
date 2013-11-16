var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var companyHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	companyID : Number, //(1~9)
	producerView : [producerViewSchema], //1~4
	retailerView : [retailerViewSchema]  //1~4
})

var producerViewSchema = mongoose.Schema({
	producerID : Number, //(1~4)
	//pt...
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number,
	//pc...
	productionCapacity : [Number], //TCategories(1~2)
	acquiredTechnologyLevel : [Number], //TCategories(1~2)
	acquiredProductionFlexibility : [Number], //TCategories(1~2)
	acquiredDesignLevel : [Number] //TCategories(1~2)
})

var retailerViewSchema = mongoose.Schema({
	retailerID : Number, //(1~4)
	//rr....
	budgetAvailable : Number,
	budgetOverspent : Number,
	budgetSpentToDate : Number
})

var companyHistory=mongoose.model('companyHistory',companyHistoryInfoSchema);

exports.newDoc=function(req,res,next){
	var newDoc=new companyHistory({
		period:0,
		seminar:"MAY",
		companyID:1,
		producerView:[{
			producerID:1,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		},{
			producerID:2,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		},{
			producerID:3,
			budgetAvailable:1,
			budgetOverspent:2,
			budgetSpentToDate:3,
			productionCapacity:[4,5],
			acquiredTechnologyLevel:[6,7],
			acquiredProductionFlexibility:[8,9],
			acquiredDesignLevel:[10,11],
		}],
		retailerView:[{
			retailerID : 1,
			budgetAvailable : 11,
			budgetOverspent : 12,
			budgetSpentToDate : 13
		},{
			retailerID : 2,
			budgetAvailable : 11,
			budgetOverspent : 12,
			budgetSpentToDate : 13
		}]
	});
	newDoc.save(function(err){
		if(err){
			next(new Error(err));
		}
		console.log("companyHistory insert success");
		res.send(200,'insert companyHistory success');
	})
}

// 	retailerCategoryView : [retailerCategoryViewSchema] //TCategories(1~2)
// })

// var retailerCategoryViewSchema = mongoose.Schema({
// 	retailerCategoryMarketView = [retailerCategoryMarketViewSchema] //TMarketsTotal(1~3)
// })

// var retailerCategoryMarketViewSchema = mongoose.Schema({
// 	//rq...
// 	rq_socialNetworsScore : Number;
// })

