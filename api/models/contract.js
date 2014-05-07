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
          contract.count({seminar: req.body.seminar,period:req.body.period, producerID:req.body.producerID, retailerID:req.body.retailerID},function(err,count){
               if(count!=0){
                    res.send(404,'another contract');
               }else{
                    var contractCode='P'+req.body.producerID+'and'+'R'+req.body.retailerID+'_'+req.body.seminar+'_'+req.body.period; //sth + period + seminar, must be
                    contract.count({contractCode: contractCode},function(err,count){
                         if(count!=0){
                              res.send(404,'another contractCode');
                         }else{
                              var newContract=new contract({
                                   contractCode : contractCode,
                                   period : req.body.period,
                                   seminar : req.body.seminar,
                                   draftedByCompanyID : req.body.draftedByCompanyID,
                                   producerID : req.body.producerID,
                                   retailerID : req.body.retailerID,
                                   isDraftFinished : false,
                                   isLocked : false, 
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
          var newContractVariantDetails=new contractVariantDetails({
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
          });
          newContractVariantDetails.save(function(err){
               if(err) next(new Error(err));
               io.sockets.emit('contarctListChanged', {producerID: req.body.producerID, retailerID: req.body.retailerID}); 
               res.send(200,newContractVariantDetails);
          });
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