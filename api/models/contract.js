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
var contractDetails = mongoose.model('contractDetails', contractDetailsSchema);

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

exports.newDoc=function(req,res,next){
	var newDoc1=new contract({
		contractCode : 'P1vsR1', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 1,
	    producerID : 1,
	    retailerID : 1,
	    isDraftFinished : false
	});
	var newDoc2=new contract({
		contractCode : 'P1vsR2', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 1,
	    producerID : 1,
	    retailerID : 2,
	    isDraftFinished : false
	});
	var newDoc3=new contract({
		contractCode : 'P2vsR1', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 2,
	    producerID : 2,
	    retailerID : 1,
	    isDraftFinished : false
	});
	var newDoc4=new contract({
		contractCode : 'P2vsR2', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 2,
	    producerID : 2,
	    retailerID : 2,
	    isDraftFinished : false
	});
	var newDoc5=new contract({
		contractCode : 'P3vsR1', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 3,
	    producerID : 3,
	    retailerID : 1,
	    isDraftFinished : false
	});
	var newDoc6=new contract({
		contractCode : 'P3vsR2', 
		period : 0,
		seminar : "MAY",
		draftedByCompanyID : 3,
	    producerID : 3,
	    retailerID : 2,
	    isDraftFinished : false
	});
	var newDoc7=new contract({
		contractCode : 'P1vsR1', 
		period : 1,
		seminar : "MAY",
		draftedByCompanyID : 1,
	    producerID : 1,
	    retailerID : 1,
	    isDraftFinished : false
	});
	var newDoc8=new contract({
		contractCode : 'P1vsR2', 
		period : 1,
		seminar : "MAY",
		draftedByCompanyID : 1,
	    producerID : 1,
	    retailerID : 2,
	    isDraftFinished : false
	});
	newDoc1.save(function(err){
		if(err) next(new Error(err));
		console.log('contract1 insert successfully');
	});
	newDoc2.save(function(err){
		if(err) next(new Error(err));
		console.log('contract2 insert successfully');
	});
	newDoc3.save(function(err){
		if(err) next(new Error(err));
		console.log('contract3 insert successfully');
	});
	newDoc4.save(function(err){
		if(err) next(new Error(err));
		console.log('contract4 insert successfully');
	});
	newDoc5.save(function(err){
		if(err) next(new Error(err));
		console.log('contract5 insert successfully');
	});
	newDoc6.save(function(err){
		if(err) next(new Error(err));
		console.log('contract6 insert successfully');
	});
	newDoc7.save(function(err){
		if(err) next(new Error(err));
		console.log('contract7 insert successfully');
	});
	newDoc8.save(function(err){
		if(err) next(new Error(err));
		console.log('contract8 insert successfully');
		res.end('insert successfully');
	});
}

exports.getContractList = function(req, res, next){
	var data="";
	if(req.params.contractUserID==1||req.params.contractUserID==2||req.params.contractUserID==3){
		data={'seminar':req.params.seminar,'producerID':req.params.contractUserID};
	}else if(req.params.contractUserID==4||req.params.contractUserID==5){
		data={'seminar':req.params.seminar,'retailerID':req.params.contractUserID-4};
	}else{
		data={'seminar':req.params.seminar};
	}
	contract.find(data,function(err,docs){
		if(docs){
			res.send(200,docs);
		}else{
			res.send(404,'there is no contract');
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
						  variant_A_urbanValue : query.variant_A_urbanValue,				  
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

