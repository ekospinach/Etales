var mongoose = require('mongoose'),
    http = require('http'),
    util = require('util');

var quarterHistoryInfoSchema = mongoose.Schema({
	period : Number,
	seminar : String,
	categoryView : [categoryViewSchema] //TCategoriesTotal(1~3)
})

var categoryViewSchema = mongoose.Schema({
	categoryMarketView : [categoryMarketViewSchema] //TMarketsTotal(1~3)
})

var categoryMarketViewSchema = mongoose.Schema({
	//q...
	segmentsVolumes : [Number] //1~5, 5 for total
})

var quarterHistory=mongoose.model('quarterHistory',quarterHistoryInfoSchema);

exports.newDoc=function(req,res,next){
	var newDoc=new quarterHistory({
		period:0,
		seminar:"MAY",
		categoryView:[{
			categoryMarketView:[{
				segmentsVolumes:[22,23,24,25,26]
			},{
				segmentsVolumes:[32,33,34,35,36]
			}]
		},{
			categoryMarketView:[{
				segmentsVolumes:[122,123,124,125,126]
			},{
				segmentsVolumes:[132,133,134,135,136]
			}]
		}]
	});
	newDoc.save(function(err){
		if(err){
			next(new Error(err));
		}
		console.log('quarterHistoryHistoryInfo insert success');
		res.send(200,'insert success')
	})
}
