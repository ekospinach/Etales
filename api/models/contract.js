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
     producerID : Number,
     retailerID : Number,
     isDraftFinished : Boolean,
     isLocked : Boolean, //if Admin lock this contract, none of user have ability to modify
})

var contractVariantDetailsSchema = mongoose.Schema({
     contractCode                           : String,
     parentBrandName                        : String,
     parentBrandID                          : Number,
     variantName                            : String,
     variantID                              : Number,
    
     composition                            : [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
     currentPriceBM                         : Number,
     isNewProduct					    : Boolean,  //used for showing tag "NEW"
     isCompositionModified                  : Boolean, //compare with previous period composition, used for showing tag "MODIFIED"

     nc_MinimumOrder                        : Number,
     nc_MinimumOrder_lastModifiedBy         : String,
     nc_VolumeDiscountRate                  : Number,
     nc_VolumeDiscountRate_lastModifiedBy   : String,    
    
     nc_SalesTargetVolume                   : Number,
     nc_SalesTargetVolume_lastModifiedBy    : String,
     nc_PerformanceBonusRate                : Number,
     nc_PerformanceBonusRate_lastModifiedBy : String,
    
     nc_PaymentDays                         : Number,
     nc_PaymentDays_lastModifiedBy          : String,
     nc_OtherCompensation                   : Number,
     nc_OtherCompensation_lastModifiedBy    : String,
    
     isProducerApproved                     : Boolean,
     isRetailerApproved                     : Boolean,

})

contractSchema.plugin(uniqueValidator);

exports.contract = mongoose.model('contract', contractSchema);
exports.contractVariantDetails = mongoose.model('contractVariantDetails', contractVariantDetailsSchema);

var contract = mongoose.model('contract', contractSchema);
var contractVariantDetails = mongoose.model('contractVariantDetails', contractVariantDetailsSchema);

exports.addContract = function(io){
     return function(req, res, next){
          contract.count({
                    seminar: req.body.seminar,
                    period:req.body.period, 
                    producerID:req.body.producerID, 
                    retailerID:req.body.retailerID},function(err,count){
               if(count!=0){
                    res.send(400,'bad contract pair: supplier ' + req.body.producerID + ' retialer ' + req.body.retailerID +', already existed, please remove them first.');
               }else{
                    var contractCode='P'+req.body.producerID+'and'+'R'+req.body.retailerID+'_'+req.body.seminar+'_'+req.body.period; //sth + period + seminar, must be
                    contract.count({contractCode: contractCode},function(err,count){
                         if(count!=0){
                              res.send(400,'bad contractCode:' + contractCode);
                         }else{
                              var newContract=new contract({
                                   contractCode : contractCode,
                                   period : req.body.period,
                                   seminar : req.body.seminar,
                                   draftedByCompanyID : req.body.draftedByCompanyID,
                                   producerID : req.body.producerID,
                                   retailerID : req.body.retailerID,  
                                   isDraftFinished : false,
                                   isLocked : false
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

exports.getContractExpend=function(req,res,next){
     var result=0;
     contractVariantDetails.find({
          contractCode:'P'+req.params.producerID+'andR'+req.params.retailerID+'_'+req.params.seminar+'_'+req.params.period,
     },function(err,docs){
          if(err){
               next(new Error(err));
          }         
          if(docs.length!=0){
               for(var i=0;i<docs.length;i++){
                    result+=docs[i].nc_SalesTargetVolume;
                    if(docs[i].parentBrandName==req.params.parentBrandName&&docs[i].variantName==req.params.variantName){
                         result-=docs[i].nc_SalesTargetVolume;
                    }
               }
               res.send(200,{'result':result});
          }else{
               res.send(200,{'result':0});
          }
     });
}

exports.checkVolume=function(req,res,next){
     contractVariantDetails.findOne({
          contractCode:req.params.contractCode,
          parentBrandName:req.params.parentBrandName,
          variantName:req.params.variantName
     },function(err,doc){
          if(err){
               next(new Error(err));
          }
          if(!doc){
               res.send(400,'fail');
          }else if(doc.nc_MinimumOrder!=0){
               res.send(200,'isReady');
          }else{
               res.send(200,'unReady');
          }
     })
}
exports.checkSalesTargetVolume=function(req,res,next){
     contractVariantDetails.findOne({
          contractCode:req.params.contractCode,
          parentBrandName:req.params.parentBrandName,
          variantName:req.params.variantName
     },function(err,doc){
          if(err){
               next(new Error(err));
          }
          if(!doc){
               res.send(400,'fail');
          }else if(doc.nc_SalesTargetVolume!=0){
               res.send(200,'isReady');
          }else{
               res.send(200,'unReady');
          }
     })
}
exports.checkContract=function(req,res,next){
     contract.findOne({contractCode:req.params.contractCode},function(err,doc){
          if(err) {next(new Error(err))};
          if(doc){
               res.send(200,'isReady');
          }else{
          res.send(200,'unReady');
          }
     })  
}

exports.addContractDetails=function(io){
     return function(req,res,next){
          
          var currentPeriodCode = req.body.contractCode;
          var period = currentPeriodCode.substring(currentPeriodCode.length - 1, currentPeriodCode.length);
          var previousPeriod = parseInt(period) - 1;

          // console.log('Period:' + period);
          // console.log('Period(afterparse):' + parseInt(period));
          // console.log('previous Period:' + previousPeriod);

          var previousPeriodCode = currentPeriodCode.substring(0, currentPeriodCode.length - 1) + previousPeriod;
          // console.log('current Period Code:' + currentPeriodCode);
          // console.log('previous Period Code: ' + previousPeriodCode);

          contractVariantDetails.findOne({contractCode : previousPeriodCode,
                                          parentBrandName : req.body.brandName,
                                          parentBrandID   : req.body.brandID,
                                          variantName     : req.body.variantName,
                                          variantID       : req.body.variantID},
                                         function(err, previousDoc){
                                             if(err){ next(new Error(err));}

                                             //check previous period input first, if anything, copy original ones.
                                             if(previousDoc){
                                                  var newContractVariantDetails = new contractVariantDetails({
                                                       contractCode                           : req.body.contractCode,
                                                       parentBrandName                        : req.body.brandName,
                                                       parentBrandID                          : req.body.brandID,
                                                       variantName                            : req.body.varName,
                                                       variantID                              : req.body.varID,              
                                                       nc_MinimumOrder                        : previousDoc.nc_MinimumOrder,                       
                                                       nc_MinimumOrder_lastModifiedBy         : previousDoc.nc_MinimumOrder_lastModifiedBy,        
                                                       nc_VolumeDiscountRate                  : previousDoc.nc_VolumeDiscountRate,                 
                                                       nc_VolumeDiscountRate_lastModifiedBy   : previousDoc.nc_VolumeDiscountRate_lastModifiedBy,  
                                                       nc_SalesTargetVolume                   : previousDoc.nc_SalesTargetVolume,                  
                                                       nc_SalesTargetVolume_lastModifiedBy    : previousDoc.nc_SalesTargetVolume_lastModifiedBy,   
                                                       nc_PerformanceBonusRate                : previousDoc.nc_PerformanceBonusRate,               
                                                       nc_PerformanceBonusRate_lastModifiedBy : previousDoc.nc_PerformanceBonusRate_lastModifiedBy,
                                                       nc_PaymentDays                         : previousDoc.nc_PaymentDays,                        
                                                       nc_PaymentDays_lastModifiedBy          : previousDoc.nc_PaymentDays_lastModifiedBy,         
                                                       nc_OtherCompensation                   : previousDoc.nc_OtherCompensation,                  
                                                       nc_OtherCompensation_lastModifiedBy    : previousDoc.nc_OtherCompensation_lastModifiedBy,                
                                                       isProducerApproved                     : false,
                                                       isRetailerApproved                     : false,  
                                                       isNewProduct                           : false,  //used for showing tag "NEW"
                                                       isCompositionModified                  : false,  //compare with previous period composition, used for showing tag "MODIFIED"
                                                       composition                            : req.body.composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                                                       currentPriceBM                         : req.body.currentPriceBM             
                                                  });
                                             //if no history, create empty doc
                                             }else{
                                                  var newContractVariantDetails = new contractVariantDetails({
                                                       contractCode                           : req.body.contractCode,
                                                       parentBrandName                        : req.body.brandName,
                                                       parentBrandID                          : req.body.brandID,
                                                       variantName                            : req.body.varName,
                                                       variantID                              : req.body.varID,              
                                                       nc_MinimumOrder                        : 0,
                                                       nc_MinimumOrder_lastModifiedBy         : 'P',
                                                       nc_VolumeDiscountRate                  : 0,
                                                       nc_VolumeDiscountRate_lastModifiedBy   : 'P',                  
                                                       nc_SalesTargetVolume                   : 0,
                                                       nc_SalesTargetVolume_lastModifiedBy    : 'P',
                                                       nc_PerformanceBonusRate                : 0,
                                                       nc_PerformanceBonusRate_lastModifiedBy : 'P',              
                                                       nc_PaymentDays                         : 0,
                                                       nc_PaymentDays_lastModifiedBy          : 'P',
                                                       nc_OtherCompensation                   : 0,
                                                       nc_OtherCompensation_lastModifiedBy    : 'P',             
                                                       isProducerApproved                     : false,
                                                       isRetailerApproved                     : false,  
                                                       isNewProduct                           : false,  //used for showing tag "NEW"
                                                       isCompositionModified                  : false,  //compare with previous period composition, used for showing tag "MODIFIED"
                                                       composition                            : req.body.composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                                                       currentPriceBM                         : req.body.currentPriceBM             
                                                  });
                                             }

                                             newContractVariantDetails.save(function(err){
                                                  if(err) next(new Error(err));
                                                  io.sockets.emit('contarctListChanged', {producerID: req.body.producerID, retailerID: req.body.retailerID}); 
                                                  res.send(200,newContractVariantDetails);
                                             });
                                         })

     }
}

exports.getContractDetails=function(req,res,next){
     contractVariantDetails.find({
          contractCode:req.params.contractCode
     },function(err,doc){
          if(err){next(new Error(err))};
          if(doc){
               doc.sort(function(x,y){
                    return x.parentBrandID-y.parentBrandID;
               });
               res.send(200,doc);
          }else{
               res.send(404,'fail');
          }
     })
}

exports.checkContractDetails=function(req,res,next){
     contractVariantDetails.findOne({
          contractCode:req.params.contractCode,
          parentBrandName:req.params.parentBrandName,
          variantName:req.params.variantName
     },function(err,doc){
          if(err){
               next(new Error(err));
          }
          if((doc.isProducerApproved&&req.params.location!="isRetailerApproved"&&req.params.location!="isProducerApproved")||(doc.isRetailerApproved&&req.params.location!="isRetailerApproved"&&req.params.location!="isProducerApproved")||(doc.isRetailerApproved&&doc.isProducerApproved)){
               res.send(200,{'result':'no',doc:doc});
          }else{
               res.send(200,{'result':'yes',doc:doc});
          }
     });
}

exports.getNegotiationExpend=function(req,res,next){
     contractVariantDetails.find({
          contractCode:req.params.contractCode
     },function(err,docs){
          if(err){
               next(new Error(err));
          }
          var result=0,brandName="";
          if(req.params.parentBrandName.substr(0,1)=="E"){
               brandName="H";
          }else{
               brandName="E";
          }
          if(docs){
               for(var i=0;i<docs.length;i++){
                    result+=docs[i].nc_MinimumOrder;
                    if(docs[i].parentBrandName==req.params.parentBrandName&&docs[i].variantName==req.params.variantName){
                         result-=docs[i].nc_MinimumOrder;  
                    }  
                    if(docs[i].parentBrandName.substr(0,1)==brandName){
                         result-=docs[i].nc_MinimumOrder;  
                    }  
               }
               res.send(200,{'result':result});
          }else{
               res.send(404,'fail');
          }
     });
}

exports.updateContractDetails=function(io){
     return function(req,res,next){
          var result=false;
          var queryCondition={
               contractCode:req.body.contractCode,
               parentBrandName:req.body.brandName,
               variantName:req.body.varName,
               userType:req.body.userType,
               location:req.body.location,
               modify:req.body.location+'_lastModifiedBy',
               value:req.body.value,
          };
          contractVariantDetails.findOne({
               contractCode:queryCondition.contractCode,
               parentBrandName:queryCondition.parentBrandName,
               variantName:queryCondition.variantName
          },function(err,doc){
               if(err){
                    next(new Error(err));
               }
               doc[queryCondition.location]=queryCondition.value;
               if(queryCondition.location!="isProducerApproved"||queryCondition.location!="isRetailerApproved"){
                  doc[queryCondition.modify]=queryCondition.userType;  
               }
               if(queryCondition.location=="nc_MinimumOrder"){
                    doc.nc_VolumeDiscountRate=0;
                    doc.nc_VolumeDiscountRate_lastModifiedBy=queryCondition.userType;
               }
               if(queryCondition.location=="nc_VolumeDiscountRate"){
                    doc.nc_SalesTargetVolume=0;
                    doc.nc_SalesTargetVolume_lastModifiedBy=queryCondition.userType;
               }
               if(queryCondition.userType=="P"){
                    io.sockets.emit('supplierEditNegotiation', 'Supplier Edit Negotiation');
               }else{
                    io.sockets.emit('retailerEditNegotiation', 'Retailer Edit Negotiation');
               }
               if(queryCondition.location=="nc_SalesTargetVolume"){
                    io.sockets.emit('EditSalesTargetVolume','Supplier Edit Negotiation');
               }
               doc.save(function(err,doc,numberAffected){
                    if(err){
                         next(new Error(err));
                    }
                    console.log('save update,number affected:'+numberAffected);
                    res.send(200, doc);
               });  
          })
     }
}


exports.removeContractDetailsByContractcode = function(io){
     return function(req, res, next){
          contractVariantDetails.remove({contractCode : req.body.contractCode}, function(err, numberAffected){
               if(err){ next(new Error(err))};
               res.send('Related contractDetails("' + req.body.contractCode + '") have been removed,  number affected : ' + numberAffected);
          });
     }
}

exports.removeContract = function(io){
     return function(req, res, next){
          contract.remove({contractCode : req.body.contractCode}, function(err, numberAffected){
               if(err){ next(new Error(err))};
               res.send('Related contract("' + req.body.contractCode + '") have been removed,  number affected : ' + numberAffected);
          });
     }
}
