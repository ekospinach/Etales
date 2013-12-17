var mongoose  = require('mongoose'),
	http = require('http'),
	util = require('util'),
	_ = require('underscore');
	uniqueValidator = require('mongoose-unique-validator'),
	q = require('q');

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
    isDraftFinished : Boolean,
    isLocked : Boolean, //if Admin lock this contract, none of user have ability to modify
})

contractSchema.plugin(uniqueValidator);

var contractDetailsSchema = mongoose.Schema({
	contractCode : String, 
	userType : String, // 'P' or 'R'
	negotiationItem : String,
	/*
    nc_MinimumOrder
    nc_VolumeDiscountRate

    nc_PaymentDays

    nc_SalesTargetVolume
    nc_PerformanceBonusAmount
    nc_PerformanceBonusRate

    nc_OtherCompensation
	*/
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

exports.contract = mongoose.model('contract', contractSchema);
exports.contractDetails = mongoose.model('contractDetails', contractDetailsSchema);
var contract = mongoose.model('contract', contractSchema);
var contractDetails = mongoose.model('contractDetails', contractDetailsSchema);

exports.getContractList = function(req, res, next){
        var data="";
        if(req.params.contractUserID==1||req.params.contractUserID==2||req.params.contractUserID==3){
                data={'seminar':req.params.seminar,'producerID':req.params.contractUserID};
        }else if(req.params.contractUserID==5||req.params.contractUserID==6){
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

exports.deleteContractDetailData=function(io){
	return function(req,res,next){
		var result=false;
		var queryCondition={
			relatedBrandName:req.body.relatedBrandName,
			deleteType:req.body.deleteType,
			index:req.body.index,
			seminar:req.body.seminar,
			period:req.body.period,
			producerID:req.body.producerID
		};
		contract.find({
			seminar:queryCondition.seminar,
			period:queryCondition.period,
			producerID:queryCondition.producerID
		},function(err,docs){
			var doc=new Array();
			if(docs.length!=0){
				for(var i=0;i<docs.length;i++){
					contractDetails.find({
						contractCode:docs[i].contractCode,
						relatedBrandName:queryCondition.relatedBrandName
					},function(err,newdocs){
						if(err){
							next(new Error(err));
						}
						if(newdocs.length!=0){
							for(var j=0;j<newdocs.length;j++){
								if(queryCondition.deleteType=="variant"){
                                    if(queryCondition.index==0){
                                    	newdocs[j].variant_A_ruralValue=0;
                                    	newdocs[j].variant_A_urbanValue=0;
                                    }else if(queryCondition.index==1){
                                   		newdocs[j].variant_B_ruralValue=0;
                                    	newdocs[j].variant_B_urbanValue=0;
                                   	}else if(queryCondition.index==2){
                                   		newdocs[j].variant_C_ruralValue=0;
                                   		newdocs[j].variant_C_urbanValue=0;
                                   	}
                                   	newdocs[j].save();
                                }else{
                                    newdocs[j].remove();
                                }
                                continue;
							}
						}
					});
				}
				res.send(200,'successfully');
			}else{
				res.send(200,'successfully');
			}
		})
			/*contractDetails.findOne({
				contractCode:queryCondition.contractCode,
				relatedBrandName:queryCondition.relatedBrandName
			},function(err,doc){
				if(err){
					next(new Error(err));
				}
				if(!doc){
					res.send(200,'no contract,mission complete');
				}else{
					if(queryCondition.deleteType=="variant"){
						//if(queryCondition.deleteType=="variant"){
						if(queryCondition.index==0){
							doc.variant_A_ruralValue=0;
							doc.variant_A_urbanValue=0;
						}else if(queryCondition.index==1){
							doc.variant_B_ruralValue=0;
							doc.variant_B_urbanValue=0;
						}else if(queryCondition.index==2){
							doc.variant_C_ruralValue=0;
							doc.variant_C_urbanValue=0;
						}
						doc.save(function(err){
							if(err) next(new Error(err));
						});
					}else{
						doc.remove(function(err){
							if(err) next(new Error(err));
						});
					}
					res.send(200,'successfully!');
				}
			});*/
	}
}

exports.updateContractDetails = function(io){
  	return function(req, res, next){
  		//console.log(req.body);
  		var result=false;
  		var queryCondition={
  			contractCode:req.body.contractCode,
  			userType:req.body.userType,
  			negotiationItem:req.body.negotiationItem,
  			relatedBrandName:req.body.relatedBrandName,
  			relatedBrandID:req.body.relatedBrandID,
  			type:req.body.type,
  			location:req.body.location,
  			index:req.body.index,
  			value:req.body.value,
  			count:req.body.count
  		};
  		console.log(queryCondition);
  		contractDetails.findOne({
  			contractCode:queryCondition.contractCode,
  			userType:queryCondition.userType,
  			negotiationItem:queryCondition.negotiationItem,
  			relatedBrandName:queryCondition.relatedBrandName,
  			relatedBrandID:queryCondition.relatedBrandID
  		},function(err,doc){
  			if(err){
  				next(new Error(err));
  			}
  			if(!doc){
  				var doc=new contractDetails({
  					contractCode:queryCondition.contractCode,
  					userType:queryCondition.userType,
  					negotiationItem:queryCondition.negotiationItem,
  					relatedBrandName:queryCondition.relatedBrandName,
  					relatedBrandID:queryCondition.relatedBrandID,
  					useBrandDetails : true,
					useVariantDetails : false,
					displayValue : 0,
					brand_urbanValue : 0,
					brand_ruralValue : 0,
					variant_A_urbanValue : 0,
					variant_A_ruralValue : 0,
					variant_B_urbanValue : 0,
					variant_B_ruralValue : 0,
					variant_C_urbanValue : 0,
					variant_C_ruralValue : 0,
					isVerified : false,
					amount_or_rate : true		
  				});
  			}
  			if(queryCondition.type=="brand"){
  				if(queryCondition.location=="rural"){
	  				doc.brand_ruralValue=queryCondition.value;
	  			}else if(queryCondition.location=="urban"){
	  				doc.brand_urbanValue=queryCondition.value;
	  			}
	  			doc.useBrandDetails=true;
	  			doc.useVariantDetails=false;
  			}else if(queryCondition.type=="variant"){
				if(queryCondition.location=="rural"){
	  				switch(queryCondition.index){
	  					case 0:doc.variant_A_ruralValue=queryCondition.value;break;
	  					case 1:doc.variant_B_ruralValue=queryCondition.value;break;
	  					case 2:doc.variant_C_ruralValue=queryCondition.value;break;
	  				}
	  			}else if(queryCondition.location=="urban"){
	  				switch(queryCondition.index){
	  					case 0:doc.variant_A_urbanValue=queryCondition.value;break;
	  					case 1:doc.variant_B_urbanValue=queryCondition.value;break;
	  					case 2:doc.variant_C_urbanValue=queryCondition.value;break;
	  				}
	  			}
	  			doc.useBrandDetails=false;
	  			doc.useVariantDetails=true;
  			}else{
  				doc.amount_or_rate=queryCondition.value;
  			}
  			//edit display value
  			/*
			1.MinimuOrder Display Value计算方式（求总和）：
			     a) if useBrandDetails: Display value = Rural input + Urban input
			     b) if useVariantDetails: Display value = VariantA.RuralInput+ VariantA.UrbanInput + VariantB.RuralInput+VariantB.UrbanInput ……
			2.DiscountRate Display Value计算 (求平均):
			     a) if useBrandDetails: Display value = (Rural input + Urban input) / 2
			     b) if useVariantDetails: Display value = (VariantA.RuralInput+ VariantA.UrbanInput + VariantB.RuralInput+VariantB.UrbanInput…)/ (VariantNumber * 2)

			（综上，第一栏MinimumOrder & Discount Rate界面上显示的综合值为 MinimOrder.DisplayValue ( DiscountRate.DisplayValue)。

			3. SalesTargetVolume Display Value计算方式：求总和
			4. PerformanceBonusRate Display Value计算方式：求平均
			5. PerformanceBonusAmount Display Value 计算方式：求总和
			     （综上，第二栏SalesTargetVolume&Bonus界面上显示的综合值为SalesTargetVolume.Displayvalue（BonusRate.DisplayValue or BonusAmount.DisplayValue））

			6. Payment Days Display Value计算方式：求平均
			7. Other Compensation Display Value计算方式：求总和
  			*/
  			switch(doc.negotiationItem){
  				case 'nc_MinimumOrder':
  					if(doc.useBrandDetails){
	  					doc.displayValue=doc.brand_urbanValue+doc.brand_ruralValue;
	  				}else{
	  					doc.displayValue=doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue;
	  				}
	  				break;
	  			case 'nc_VolumeDiscountRate':
	  				if(doc.useBrandDetails){
	  					doc.displayValue=(doc.brand_urbanValue+doc.brand_ruralValue)/2;
	  				}else{
	  					doc.displayValue=(doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue)/(queryCondition.count*2);
	  				}
	  				doc.displayValue=(doc.displayValue*100).toFixed(2)+"%";
	  				break;
	  			case 'nc_SalesTargetVolume':
	  			  	if(doc.useBrandDetails){
	  					doc.displayValue=doc.brand_urbanValue+doc.brand_ruralValue;
	  				}else{
	  					doc.displayValue=doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue;
	  				}
	  				break;
	  			case 'nc_PerformanceBonusAmount':
	  			  	if(doc.useBrandDetails){
	  					doc.displayValue=doc.brand_urbanValue+doc.brand_ruralValue;
	  				}else{
	  					doc.displayValue=doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue;
	  				}
	  				break;
	  			case 'nc_PerformanceBonusRate':
	  				if(doc.useBrandDetails){
	  					doc.displayValue=(doc.brand_urbanValue+doc.brand_ruralValue)/2;
	  				}else{
	  					doc.displayValue=(doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue)/(queryCondition.count*2);
	  				}
	  				doc.displayValue=(doc.displayValue*100).toFixed(2)+"%";
	  				break;
	  			case 'nc_PaymentDays':
	  				if(doc.useBrandDetails){
	  					doc.displayValue=(doc.brand_urbanValue+doc.brand_ruralValue)/2;
	  				}else{
	  					doc.displayValue=(doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue)/(queryCondition.count*2);
	  				}
	  				break;
	  			case 'nc_OtherCompensation':
	  			  	if(doc.useBrandDetails){
	  					doc.displayValue=doc.brand_urbanValue+doc.brand_ruralValue;
	  				}else{
	  					doc.displayValue=doc.variant_A_urbanValue+doc.variant_A_ruralValue+doc.variant_B_urbanValue+doc.variant_B_ruralValue+doc.variant_C_urbanValue+doc.variant_C_ruralValue;
	  				}
	  				break;
  			}

  			doc.save(function(err,doc,numberAffected){
  				if(err){
  					next(new Error(err));
  				}
  				console.log('save update,number affected:'+numberAffected);
  				res.send(200, {result:0});
  			});	
  		});
    }
}

exports.getContractsQuery = function(params){
	var deferred = q.defer();
	console.log('getContractsQuery');
	contract.find({seminar:params.seminar, 
					period:params.period, 
					producerID:params.producerID, 
					retailerID:params.retailerID},function(err, docs){
		if(err) deferred.reject({msg: err});
		if(docs){
			console.log('is contarct');
			deferred.resolve({docs:docs, msg:'Find contracts between producer ' + producerID + ' and retailer ' + retailerID + ' in period ' + period});
		} else {
			console.log('no contarct');			
			deferred.reject({msg:'NO contract between producer ' + producerID + ' and retailer ' + retailerID + ' in period ' + period})
		}
	});
	console.log('return promise');
	return deferred.promise;
}

exports.getVerifiedContractDetailsQuery = function(params){
	var deferred = q.defer();	
	contractDetails.find({contractCode : params.contractCode,
						  userType : params.userType,
						  negotiationItem : params.negotiationItem,
						  relatedBrandName : params.relatedBrandName,
						  relatedBrandID : params.relatedBrandID,
						  isVerified : true},function(err, docs){	

		if(err) deferred.reject({msg: err});
		if(docs){
			deferred.resolve({docs:docs, msg:'Find verified contract details with contractCode: ' + params.contractCode + ' and relatedBrandName: ' + params.relatedBrandName});
		} else {
			deferred.reject({msg:'NO contract details with contractCode: ' + params.contractCode + ' and relatedBrandName: ' + params.relatedBrandName});
		}		
	})
	return deferred.promise;
}

exports.getContractDetail=function(req,res,next){
	var queryCondition={
		contractCode:req.params.contractCode,
		userType:req.params.userType,
		negotiationItem:req.params.negotiationItem,
		brandName:req.params.brandName
	}
	contractDetails.find({
		'contractCode':req.params.contractCode,
		'userType':req.params.userType,
		'negotiationItem':req.params.negotiationItem,
		'relatedBrandName':req.params.brandName
	},function(err,doc){
		if(err) {next(new Error(err))};
		if(doc){
			res.send(200,doc);
		}else{
			res.send(404,'there is no contract');
		}
	});
}

exports.copyProposal = function(req, res, next){
	var contractCode = req.body.contractCode;
	contractDetails.find({contractCode : contractCode, userType:'P'}, function(err, docs){
		if(err) {next(new Error(err))};
		contractCount = 0;
		if(docs.length != 0){
			console.log('start copyContractDetails...');
			(function copyContractDetails(idx){
				contractDetails.update({contractCode : contractCode, 
										userType : 'R', 
										negotiationItem : docs[idx].negotiationItem, 
										relatedBrandName : docs[idx].relatedBrandName,
										relatedBrandID : docs[idx].relatedBrandID},
										{useBrandDetails : docs[idx].useBrandDetails, 
										useVariantDetails : docs[idx].useVariantDetails,
										displayValue : docs[idx].displayValue,
										brand_urbanValue : docs[idx].brand_urbanValue,
										brand_ruralValue : docs[idx].brand_ruralValue,
										variant_A_urbanValue : docs[idx].variant_A_urbanValue,
										variant_A_ruralValue : docs[idx].variant_A_ruralValue,
										variant_B_urbanValue : docs[idx].variant_B_urbanValue,
										variant_B_ruralValue : docs[idx].variant_B_ruralValue,
										variant_C_urbanValue : docs[idx].variant_C_urbanValue,
										variant_C_ruralValue : docs[idx].variant_C_ruralValue,
										amount_or_rate : docs[idx].amount_or_rate,
										isVerified : docs[idx].isVarified},
										{upsert:true},
										function(err, numberAffected, raw){
											if(!err){
												idx++;
												if(idx<docs.length){
													copyContractDetails(idx);
												}else{
													res.send(200, 'copy done');
												}			
											}
										})
			})(0);	

		} else {
			res.send(404, 'There is no contract details yet');
		}
	})
}

exports.compareContractDetailsAndUpdateIsVerified = function(req, res, next){
	var contractCode = req.body.contractCode;
	contractDetails.find({contractCode : contractCode, userType:'P'}, function(err, docs){
		if(err) {next(new Error(err))};
		contractCount = 0;
		if(docs.length != 0){
			(function compareContractDetails(idx){
				contractDetails.findOne({contractCode : contractCode, 
					userType : 'R', 
					negotiationItem : docs[idx].negotiationItem, 
					relatedBrandName : docs[idx].relatedBrandName}, function(err, doc){
					if(doc){
						console.log('find retailer input:' + doc);
						//if useBrandDetails, just compare brand Data
						if(doc.userBrandDetails){
							if(doc.useBrandDetails == docs[idx].useBrandDetails 
							&& doc.useVariantDetails == docs[idx].useVariantDetails
							&& doc.displayValue == docs[idx].displayValue
							&& doc.brand_urbanValue == docs[idx].brand_urbanValue
							&& doc.brand_ruralValue == docs[idx].brand_ruralValue
							&& doc.amount_or_rate == docs[idx].amount_or_rate){
								console.log('pass verified!');
								doc.isVerified = true;
								doc.save(function(err){
									if(!err){
										console.log('set producer isVerified true');									
										docs[idx].isVerified = true;
										docs[idx].save(function(err){
											if(!err){
												console.log('set retailer isVerified true, next...');									
												idx++;
												if(idx<docs.length){
													compareContractDetails(idx);
												}else{
													res.send(200, 'compare done');
													console.log('compare done');
												}
											}
										})
									}
								})
							}else{
								console.log('cannot pass verified, next...');							
								doc.isVerified = false;
								doc.save(function(err){
									if(!err){
										console.log('set producer isVerified false');
										docs[idx].isVerified = false;
										docs[idx].save(function(err){
											if(!err){
												console.log('set retailer isVerified false,');
												idx++;
												if(idx<docs.length){
													compareContractDetails(idx);
												}else{
													res.send(200, 'compare done');												
													console.log('compare done');
												}
											}
										})
									}
								})
							}
						//if useVariantDetails, just compare variantA/B/C input
						} else {
							if(doc.useBrandDetails == docs[idx].useBrandDetails 
							&& doc.useVariantDetails == docs[idx].useVariantDetails
							&& doc.displayValue == docs[idx].displayValue
							&& doc.variant_A_urbanValue == docs[idx].variant_A_urbanValue
							&& doc.variant_A_ruralValue == docs[idx].variant_A_ruralValue
							&& doc.variant_B_urbanValue == docs[idx].variant_B_urbanValue
							&& doc.variant_B_ruralValue == docs[idx].variant_B_ruralValue
							&& doc.variant_C_urbanValue == docs[idx].variant_C_urbanValue
							&& doc.variant_C_ruralValue == docs[idx].variant_C_ruralValue
							&& doc.amount_or_rate == docs[idx].amount_or_rate){
								console.log('pass verified!');
								doc.isVerified = true;
								doc.save(function(err){
									if(!err){
										console.log('set producer isVerified true');									
										docs[idx].isVerified = true;
										docs[idx].save(function(err){
											if(!err){
												console.log('set retailer isVerified true, next...');									
												idx++;
												if(idx<docs.length){
													compareContractDetails(idx);
												}else{
													res.send(200, 'compare done');
													console.log('compare done');
												}
											}
										})
									}
								})
							}else{
								console.log('cannot pass verified, next...');							
								doc.isVerified = false;
								doc.save(function(err){
									if(!err){
										console.log('set producer isVerified false');
										docs[idx].isVerified = false;
										docs[idx].save(function(err){
											if(!err){
												console.log('set retailer isVerified false,');
												idx++;
												if(idx<docs.length){
													compareContractDetails(idx);
												}else{
													res.send(200, 'compare done');												
													console.log('compare done');
												}
											}
										})
									}
								})
							}	
						}
					}else{
						console.log('no retailer inpt, next..');
						idx++;
						if(idx<docs.length){
							compareContractDetails(idx);
						}else{
							res.send(200, 'compare done');							
							console.log('compare done');
						}
					}				
				})
			})(0); 			
		} else {
			res.send(404, 'There is no contract details yet');
		}
	})

}


exports.addContract = function(io){
  return function(req, res, next){
  	contract.count({seminar: req.body.seminar,period:req.body.period, producerID:req.body.producerID, retailerID:req.body.retailerID},function(err,count){
  		if(count!=0){
  			res.send(404,'another contract');
	  	}else{
	  		contract.count({contractCode: req.body.contractCode},function(err,count){
	  			if(count!=0){
	  				res.send(404,'another contractCode');
	  			}else{
	  				var newContract=new contract({
				  		contractCode : req.body.contractCode,
						period : req.body.period,
						seminar : req.body.seminar,
						draftedByCompanyID : req.body.draftedByCompanyID,
						producerID : req.body.producerID,
						retailerID : req.body.retailerID,
						isDraftFinished : false
				  	});
				  	/*need add Contract Detail*/
				  	newContract.save(function(err){
						if(err) next(new Error(err));
						io.sockets.emit('contarctListChanged', {producerID: req.body.producerID, retailerID: req.body.retailerID}); 
						res.send(200,newContract);
					});
	  			}
	  		})
  		}
  	})
  }
}


exports.duplicateContract = function(io){
	return function(req, res, next){
  	contract.count({seminar: req.body.seminar,period:req.body.period, producerID:req.body.producerID, retailerID:req.body.retailerID},function(err,count){
  		if(count!=0){
  			res.send(404,'another contract');
	  	}else{
	  		contract.count({contractCode: req.body.contractCode},function(err,count){
	  			if(count!=0){
	  				res.send(404,'another contractCode');
	  			}else{
	  				var newContract=new contract({
				  		contractCode : req.body.contractCode,
						period : req.body.period,
						seminar : req.body.seminar,
						draftedByCompanyID : req.body.draftedByCompanyID,
						producerID : req.body.producerID,
						retailerID : req.body.retailerID,
						isDraftFinished : false
				  	});
				  	contractDetails.find({contractCode : req.body.duplicateCode, userType:'P'}, function(err, docs){
				  		if(err) {next(new Error(err))};
				  		contractCount = 0;
				  		if(docs.length != 0){
				  			console.log('start copyContractDetails...');
				  			(function copyContractDetails(idx){
				  				contractDetails.update({contractCode : req.body.contractCode, 
												userType : 'P', 
												negotiationItem : docs[idx].negotiationItem, 
												relatedBrandName : docs[idx].relatedBrandName,
												relatedBrandID : docs[idx].relatedBrandID},
												{useBrandDetails : docs[idx].useBrandDetails, 
												useVariantDetails : docs[idx].useVariantDetails,
												displayValue : docs[idx].displayValue,
												brand_urbanValue : docs[idx].brand_urbanValue,
												brand_ruralValue : docs[idx].brand_ruralValue,
												variant_A_urbanValue : docs[idx].variant_A_urbanValue,
												variant_A_ruralValue : docs[idx].variant_A_ruralValue,
												variant_B_urbanValue : docs[idx].variant_B_urbanValue,
												variant_B_ruralValue : docs[idx].variant_B_ruralValue,
												variant_C_urbanValue : docs[idx].variant_C_urbanValue,
												variant_C_ruralValue : docs[idx].variant_C_ruralValue,
												amount_or_rate : docs[idx].amount_or_rate,
												isVerified : false},
												{upsert:true},
												function(err, numberAffected, raw){
													if(!err){
														idx++;
														if(idx<docs.length){
															copyContractDetails(idx);
														}else{
															newContract.save(function(err){
																if(err) next(new Error(err));
																io.sockets.emit('contarctListChanged', {producerID: req.body.producerID, retailerID: req.body.retailerID}); 
																res.send(200,newContract);
															});														}		
													}
												})
							})(0);
						}
					})
					
	  			}
	  		})
  		}
  	})
  }
	
}
