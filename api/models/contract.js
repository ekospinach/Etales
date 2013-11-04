var mongoose  = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore');
	uniqueValidator = require('mongoose-unique-validator');

var contractSchema = mongoose.Schema({
	contractCode : {type: String, require: true, unique: true}, //sth + period + seminar, must be 
	period : Number,
	seminar : String,
	draftedByCompanyID : Number,
    /*
        Prod_1_ID          = 1;
        Prod_2_ID          = 2;
        Prod_3_ID          = 3;
        Prod_4_ID          = 4;
        Ret_1_ID           = 5;
        Ret_2_ID           = 6;
    */
    producerID : Number,
    retailerID : Number,
    isDraftFinished : Boolean
})

contractSchema.plugin(uniqueValidator);

var contractDetailsSchema = mongoose.Schema({
	contractCode : String, 
	userType : String, // 'P' or 'R'
	negotiationItem : String,
	relatedBrandName : String,
	relatedBrandID : Number,

	useBrandDetails : Boolean,
	useVariantDetails : Boolean,
	displayValue : String,
	brand_urbanValue : Number,
	brand_ruralValue : Number,
	variant_A_urbanValue : Number,
	variant_A_ruralValue : Number,
	variant_B_urbanValue : Number,
	variant_B_ruralValue : Number,
	variant_C_urbanValue : Number,
	variant_C_ruralValue : Number,
	isVerified : Boolean,
	amount_or_rate : Boolean
})



var contract = mongoose.model('contract', contractSchema);
var contractDetailsSchema = mongoose.model('contractDetails', contractDetails);

exports.updateContract = function(io){
  return function(req, res, next){
	contract.update({contractCode : req.body.contractCode,
					 period : req.body.period,
					 seminar : req.body.seminar},
					 {draftedByCompanyID : req.body.draftedByCompanyID,
					  producerID : req.body.producerID,
					  retailerID : req.body.retailerID,
					  isDraftFinished : req.body.isDraftFinished},
					  {upsert : true},
					  function(err, numberAffected, raw){
					  	 if (err) return next(new Error(err));
 					  	 console.log('the number of updated documents was %d', numberAffected);
 					  	 //here : parameter should be added, client reload resource depends on parameter
 					  	 io.sockets.emit('contarctListChanged', {producerID: req.body.producerID, retailerID: req.body.retailerID}); 
					  	 res.send(200, 'Contract update done.')
					  });
  }
}

exports.getContractList = function(req, res, next){
	contract.find({period : req.body.period,
				   seminar : req.body.seminar,
				   producerID : req.body.seminar,
				   retailerID : req.body.seminar}, function(err, docs){
				   	 if(docs){
				   	 	res.send(200, docs);
				   	 } else {
				   	 	res.send(404, 'there is no contarct yet.');
				   	 }
				   })
}

exports.duplicateContract = function(req, res, next){
	contract.findOne({contractCode : req.body.contractCode},function(err, doc){
		if(doc){
			//....
		}
	})
}

exports.updateContractDetails = function(io){
  return function(req, res, next){
	var query = {
		contractCode : req.body.contractCode,
		userType : req.body.userType,
		negotiationItem : req.body.negotiationItem,
		relatedBrandName : req.body.relatedBrandName,
		relatedBrandID : req.body.relatedBrandID,

		useBrandDetails : req.body.useBrandDetails,
		useVariantDetails : req.body.useVariantDetails,
		displayValue : req.body.displayValue,
		brand_urbanValue : req.body.brand_urbanValue,
		brand_ruralValue : req.body.brand_ruralValue,
		variant_A_urbanValue : req.body.variant_A_urbanValue,
		variant_A_ruralValue : req.body.variant_A_ruralValue,
		variant_B_urbanValue : req.body.variant_B_urbanValue,
		variant_B_ruralValue : req.body.variant_B_ruralValue,
		variant_C_urbanValue : req.body.variant_C_urbanValue,
		variant_C_ruralValue : req.body.variant_C_ruralValue,
		isVerified : req.body.isVerified,
		amount_or_rate : req.body.amount_or_rate
	}

	//console.log(query);

	contract.update({contractCode : query.contractCode,
					 userType : query.userType,
					 negotiationItem : query.negotiationItem,
					 relatedBrandName : query.relatedBrandName,
					 relatedBrandID : query.relatedBrandID},
					 {useBrandDetails : query.useBrandDetails,
					  useVariantDetails : query.useVariantDetails,
					  displayValue : query.displayValue,
					  brand_urbanValue : query.brand_urbanValue,
					  brand_ruralValue : query.brand_ruralValue,
					  variant_A_urbanValue : query.variant_A_urbanValue					  
			    	  variant_A_ruralValue : query.variant_A_ruralValue,
					  variant_B_urbanValue : query.variant_B_urbanValue,
					  variant_B_ruralValue : query.variant_B_ruralValue,
					  variant_C_urbanValue : query.variant_C_urbanValue,
					  variant_C_ruralValue : query.variant_C_ruralValue,
					  isVerified : query.isVerified,
					  amount_or_rate : query.amount_or_rate},
					  {upsert : true},
					  function(err, numberAffected, raw){
					  	 if (err) return next(new Error(err));
 					  	 console.log('the number of updated documents was %d', numberAffected);
 					  	 io.sockets.emit('contarctDetailsChanged', {contractCode : query.contractCode}); 					  	 
					  	 res.send(200, 'Contract details update done.')
					  });
  }
}

exports.getContractDetails = function(res, req, next){

}

