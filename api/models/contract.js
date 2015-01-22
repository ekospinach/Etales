var mongoose = require('mongoose-q')(require('mongoose')),
     http = require('http'),
     util = require('util'),
     _ = require('underscore'),
     uniqueValidator = require('mongoose-unique-validator'),
     q = require('q');

var contractSchema = mongoose.Schema({
     contractCode: {
          type: String,
          require: true,
          unique: true
     }, //sth + period + seminar, must be
     period: Number,
     seminar: String,
     draftedByCompanyID: Number,
     producerID: Number,
     retailerID: Number,
     isDraftFinished: Boolean,
     isLocked: Boolean, //if Admin lock this contract, none of user have ability to modify
})

var contractVariantDetailsSchema = mongoose.Schema({
     seminar: String,
     contractCode: String,
     producerID: Number,
     retailerID: Number,
     parentBrandName: String,
     parentBrandID: Number,
     variantName: String,
     variantID: Number,



     composition: [Number], //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
     currentPriceBM: Number,
     packFormat: String,
     isNewProduct: Boolean, //used for showing tag "NEW"
     isCompositionModified: Boolean, //compare with previous period composition, used for showing tag "MODIFIED"

     nc_MinimumOrder: Number,
     nc_MinimumOrder_lastModifiedBy: String,
     nc_VolumeDiscountRate: Number,
     nc_VolumeDiscountRate_lastModifiedBy: String,

     nc_SalesTargetVolume: Number,
     nc_SalesTargetVolume_lastModifiedBy: String,
     nc_PerformanceBonusRate: Number,
     nc_PerformanceBonusRate_lastModifiedBy: String,

     nc_PaymentDays: Number,
     nc_PaymentDays_lastModifiedBy: String,
     nc_OtherCompensation: Number,
     nc_OtherCompensation_lastModifiedBy: String,

     isProducerApproved: Boolean,
     isRetailerApproved: Boolean,

})

contractSchema.plugin(uniqueValidator);

exports.contract = mongoose.model('contract', contractSchema);
exports.contractVariantDetails = mongoose.model('contractVariantDetails', contractVariantDetailsSchema);

var contract = mongoose.model('contract', contractSchema);
var contractVariantDetails = mongoose.model('contractVariantDetails', contractVariantDetailsSchema);


exports.removeContractDetailsByAdmin = function(seminar, period, producers) {
     var deferred = q.defer();
     (function removeContractDetails(seminar, period, producers, idx) {
          var d = q.defer();
          if (idx < producers.length) {
               var contractCode1 = 'P' + producers[idx].producerID + 'and' + 'R' + 1 + '_' + seminar + '_' + period; //sth + period + seminar, must be
               var contractCode2 = 'P' + producers[idx].producerID + 'and' + 'R' + 2 + '_' + seminar + '_' + period; //sth + period + seminar, must be
               contractVariantDetails.removeQ({
                    contractCode: contractCode1
               }).then(function(result) {
                    return contractVariantDetails.removeQ({
                         contractCode: contractCode2
                    });
               }).then(function(result) {
                    idx++;
                    return removeContractDetails(seminar, period, producers, idx);
               });
          } else {
               deferred.resolve({
                    msg: 'removeContractDetails done'
               });
          }
          return d.promise;
     })(seminar, period, producers, 0);
     return deferred.promise;
}

exports.removeContractByAdmin = function(seminar, period, producers) {
     var deferred = q.defer();
     console.log('removeContractByAdmin');
     (function removeContract(seminar, period, producers, idx) {
          var d = q.defer();
          if (idx < producers.length) {
               var contractCode1 = 'P' + producers[idx].producerID + 'and' + 'R' + 1 + '_' + seminar + '_' + period; //sth + period + seminar, must be
               var contractCode2 = 'P' + producers[idx].producerID + 'and' + 'R' + 2 + '_' + seminar + '_' + period; //sth + period + seminar, must be

               contract.removeQ({
                    contractCode: contractCode1
               }).then(function(result) {
                    return contract.removeQ({
                         contractCode: contractCode2
                    });
               }).then(function(result) {
                    idx++;
                    return removeContract(seminar, period, producers, idx);
               });
          } else {
               deferred.resolve({
                    msg: 'removeContract done'
               });
          }
          return d.promise;
     })(seminar, period, producers, 0);
     return deferred.promise;
}

exports.addContractByAdmin = function(seminar, period, producers) {
     var deferred = q.defer();
     console.log('addContractByAdmin');  
     var contractCode1,newContract1,contractCode2,newContract2;

     (function addContract(seminar, period, producers,idx) {
          var d = q.defer();
          if (idx < producers.length) {
               //add contract
               contractCode1 = 'P' + producers[idx].producerID + 'and' + 'R' + 1 + '_' + seminar + '_' + period; //sth + period + seminar, must be
               contractCode2 = 'P' + producers[idx].producerID + 'and' + 'R' + 2 + '_' + seminar + '_' + period; //sth + period + seminar, must be

               newContract1 = new contract({
                    contractCode: contractCode1,
                    period: period,
                    seminar: seminar,
                    draftedByCompanyID: producers[idx].producerID,
                    producerID: producers[idx].producerID,
                    retailerID: 1,
                    isDraftFinished: false,
                    isLocked: false
               });
               newContract2 = new contract({
                    contractCode: contractCode2,
                    period: period,
                    seminar: seminar,
                    draftedByCompanyID: producers[idx].producerID,
                    producerID: producers[idx].producerID,
                    retailerID: 2,
                    isDraftFinished: false,
                    isLocked: false
               });

               newContract1.saveQ().then(function(result) {
                    return newContract2.saveQ();
               }).then(function(result) {
                    idx++;
                    return addContract(seminar, period, producers, idx);
               });
          } else {
               deferred.resolve({
                    msg: 'removeContract done'
               });
          }
          return d.promise;
     })(seminar, period, producers, 0);
     return deferred.promise;
}

exports.addContractDetailsByAdmin = function(seminar, period, producers) {
     var deferred = q.defer();
     console.log('addContractDetailsByAdmin');

     (function addContractDetail(seminar, period, producers, idx) {
          var d = q.defer();
          if (idx < producers.length) {
               //add contract
               var contractCode1 = 'P' + producers[idx].producerID + 'and' + 'R' + 1 + '_' + seminar + '_' + period;
               var contractCode2 = 'P' + producers[idx].producerID + 'and' + 'R' + 2 + '_' + seminar + '_' + period;
               var previousPeriodCode1 = 'P' + producers[idx].producerID + 'and' + 'R' + 1 + '_' + seminar + '_' + (period - 1);
               var previousPeriodCode2 = 'P' + producers[idx].producerID + 'and' + 'R' + 2 + '_' + seminar + '_' + (period - 1);


               var products = new Array();
               var promise = require('./producerDecision.js').proDecision.findOne({
                    seminar: seminar,
                    period: period,
                    producerID: producers[idx].producerID
               }).exec();
               promise.then(function(doc) {

                    doc.proCatDecision.forEach(function(singleCategroy) {
                         singleCategroy.proBrandsDecision.forEach(function(singleBrand) {
                              singleBrand.proVarDecision.forEach(function(singleVar) {
                                   if (singleVar.varName != "" && singleVar.channelPreference != 1) {
                                        singleVar.parentBrandName = singleBrand.brandName;
                                        products.push(singleVar);
                                   }
                                   if(singleVar.channelPreference == 1){
                                        singleVar.saledOnline = true;
                                   }
                              })
                         })
                    });
               }).then(function(data) {
                    return createContractDetails(contractCode1, previousPeriodCode1, producers[idx].producerID, 1, seminar, period, products);
               }).then(function(data) {
                    return createContractDetails(contractCode2, previousPeriodCode2, producers[idx].producerID, 2, seminar, period, products);
               }).then(function(data) {
                    idx++;
                    return addContractDetail(seminar, period, producers, idx);
               }, function(data) {
                    console.log(data);
               });


          } else {
               deferred.resolve({
                    msg: 'addContractDetail done'
               });
          }
          return d.promise;
     })(seminar, period, producers, 0);
     return deferred.promise;
}

function createContractDetails(contractCode, previousPeriodCode, producerID, retailerID, seminar, period, productList) {
     var deferred = q.defer();
     console.log('createContractDetails');
     (function createContractDetail(products, producerID, retailerID, seminar, period, idx) {
          var d = q.defer();
          if (idx < products.length) {
               var details = [];
               var promise = contractVariantDetails.findOne({
                    contractCode: previousPeriodCode,
                    parentBrandName: products[idx].parentBrandName,
                    variantName: products[idx].varName
               }).exec();
               promise.then(function(doc) {
                    if (doc) {
                         console.log('found previous input, copy...');
                         var newContractVariantDetail = new contractVariantDetails({
                              contractCode: contractCode,
                              producerID: producerID,
                              retailerID: retailerID,
                              parentBrandName: products[idx].parentBrandName,
                              parentBrandID: products[idx].parentBrandID,
                              variantName: products[idx].varName,
                              variantID: products[idx].varID,
                              nc_MinimumOrder: doc.nc_MinimumOrder,
                              nc_MinimumOrder_lastModifiedBy: doc.nc_MinimumOrder_lastModifiedBy,
                              nc_VolumeDiscountRate: doc.nc_VolumeDiscountRate,
                              nc_VolumeDiscountRate_lastModifiedBy: doc.nc_VolumeDiscountRate_lastModifiedBy,
                              nc_SalesTargetVolume: doc.nc_SalesTargetVolume,
                              nc_SalesTargetVolume_lastModifiedBy: doc.nc_SalesTargetVolume_lastModifiedBy,
                              nc_PerformanceBonusRate: doc.nc_PerformanceBonusRate,
                              nc_PerformanceBonusRate_lastModifiedBy: doc.nc_PerformanceBonusRate_lastModifiedBy,
                              nc_PaymentDays: doc.nc_PaymentDays,
                              nc_PaymentDays_lastModifiedBy: doc.nc_PaymentDays_lastModifiedBy,
                              nc_OtherCompensation: doc.nc_OtherCompensation,
                              nc_OtherCompensation_lastModifiedBy: doc.nc_OtherCompensation_lastModifiedBy,
                              isProducerApproved: false,
                              isRetailerApproved: false,
                              isNewProduct: false, //used for showing tag "NEW"
                              isCompositionModified: false, //compare with previous period composition, used for showing tag "MODIFIED"
                              composition: products[idx].composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                              currentPriceBM: products[idx].currentPriceBM,
                              packFormat: products[idx].packFormat,
                              seminar: seminar
                         });
                         return newContractVariantDetail.saveQ();
                    } else {
                         console.log('not found from previous, creat new...');
                         var newContractVariantDetail = new contractVariantDetails({
                              contractCode: contractCode,
                              producerID: producerID,
                              retailerID: retailerID,
                              parentBrandName: products[idx].parentBrandName,
                              parentBrandID: products[idx].parentBrandID,
                              variantName: products[idx].varName,
                              variantID: products[idx].varID,
                              nc_MinimumOrder: 0,
                              nc_MinimumOrder_lastModifiedBy: 'P',
                              nc_VolumeDiscountRate: 0,
                              nc_VolumeDiscountRate_lastModifiedBy: 'P',
                              nc_SalesTargetVolume: 0,
                              nc_SalesTargetVolume_lastModifiedBy: 'P',
                              nc_PerformanceBonusRate: 0,
                              nc_PerformanceBonusRate_lastModifiedBy: 'P',
                              nc_PaymentDays: 0,
                              nc_PaymentDays_lastModifiedBy: 'P',
                              nc_OtherCompensation: 0,
                              nc_OtherCompensation_lastModifiedBy: 'P',
                              isProducerApproved: false,
                              isRetailerApproved: false,
                              isNewProduct: false, //used for showing tag "NEW"
                              isCompositionModified: false, //compare with previous period composition, used for showing tag "MODIFIED"
                              composition: products[idx].composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                              currentPriceBM: products[idx].currentPriceBM,
                              packFormat: products[idx].packFormat,
                              seminar: seminar
                         });
                         return newContractVariantDetail.saveQ();
                    }

               }).then(function(result) {
                    idx++;
                    return createContractDetail(productList, producerID, retailerID, seminar, period, idx);
               });
          } else {
               deferred.resolve({
                    msg: 'done'
               });
          }
          return d.promise;
     })(productList, producerID, retailerID, seminar, period, 0);
     return deferred.promise;
}

exports.dealContractsByAdmin = function(seminar, period) {
     var deferred = q.defer();

     (function dealContract(seminar, period, idx) {

          if (idx < 4) {
               var currentPeriodCode1 = 'P' + idx + 'andR1_' + seminar + '_' + period;
               var previousPeriodCode1 = 'P' + idx + 'andR1_' + seminar + '_' + (period - 1);
               var currentPeriodCode2 = 'P' + idx + 'andR2_' + seminar + '_' + period;
               var previousPeriodCode2 = 'P' + idx + 'andR2_' + seminar + '_' + (period - 1);
               var details = new Array();
               var promise = contractVariantDetails.find({
                    contractCode: currentPeriodCode1,
                    $where: "this.isRetailerApproved != true || this.isProducerApproved != true"
               }).exec();
               
               promise.then(function(docs) {
                    details = docs;
               }).then(function(data) {
                    return dealContracts(previousPeriodCode1, details);
               }).then(function() {
                    return contractVariantDetails.find({
                         contractCode: currentPeriodCode2,
                         $where: "this.isRetailerApproved != true || this.isProducerApproved != true"
                    }).exec();
               }).then(function(docs) {
                    details = docs;
                    return dealContracts(previousPeriodCode2, details);
               }).then(function() {
                    idx++;
                    dealContract(seminar, period, idx);
               }, function() {
                    console.log('fail');
               })
          } else {
               deferred.resolve({
                    msg: 'deal ContractDetail done'
               });
          }

     })(seminar, period, 1)

     return deferred.promise;
}

function dealContracts(previousPeriodCode, details) {
     var deferred = q.defer();

     (function dealContract(previousPeriodCode, details, idx) {

          if (idx < details.length) {
               var promise = contractVariantDetails.findOne({
                    contractCode: previousPeriodCode,
                    parentBrandName: details[idx].parentBrandName,
                    parentBrandID: details[idx].parentBrandID,
                    variantName: details[idx].variantName,
                    variantID: details[idx].variantID
               }).exec();
               promise.then(function(doc) {
                    if (doc) {
                         //console.log('found previous input, copy...detail.ContractCode:'+details[idx].contractCode+',variant:'+details[idx].parentBrandName+details[idx].variantName);
                         var update = {
                              $set: {
                                   nc_MinimumOrder: doc.nc_MinimumOrder,
                                   nc_VolumeDiscountRate: doc.nc_VolumeDiscountRate,
                                   nc_SalesTargetVolume: doc.nc_SalesTargetVolume,
                                   nc_PerformanceBonusRate: doc.nc_PerformanceBonusRate,
                                   nc_PaymentDays: doc.nc_PaymentDays,
                                   nc_OtherCompensation: doc.nc_OtherCompensation
                              }
                         };
                         contractVariantDetails.findOneAndUpdate({
                              _id: details[idx]._id
                         }, update, function(err, doc) {
                              idx++;
                              dealContract(previousPeriodCode, details, idx);
                         });
                    } else {
                         idx++;
                         dealContract(previousPeriodCode, details, idx);
                    }
               });
          } else {
               deferred.resolve({
                    msg: 'deal ContractDetail done'
               });
          }
     })(previousPeriodCode, details, 0);

     return deferred.promise;
}

exports.addContract = function(io) {
     return function(req, res, next) {
          contract.count({
               seminar: req.body.seminar,
               period: req.body.period,
               producerID: req.body.producerID,
               retailerID: req.body.retailerID
          }, function(err, count) {
               if (count != 0) {
                    res.send(400, 'bad contract pair: supplier ' + req.body.producerID + ' retialer ' + req.body.retailerID + ', already existed, please remove them first.');
               } else {
                    var contractCode = 'P' + req.body.producerID + 'and' + 'R' + req.body.retailerID + '_' + req.body.seminar + '_' + req.body.period; //sth + period + seminar, must be
                    contract.count({
                         contractCode: contractCode
                    }, function(err, count) {
                         if (count != 0) {
                              res.send(400, 'bad contractCode:' + contractCode);
                         } else {
                              var newContract = new contract({
                                   contractCode: contractCode,
                                   period: req.body.period,
                                   seminar: req.body.seminar,
                                   draftedByCompanyID: req.body.draftedByCompanyID,
                                   producerID: req.body.producerID,
                                   retailerID: req.body.retailerID,
                                   isDraftFinished: false,
                                   isLocked: false
                              });
                              /*need add Contract Detail*/
                              newContract.save(function(err) {
                                   if (err) return next(new Error(err));
                                   io.sockets.emit('contarctListChanged', {
                                        producerID: req.body.producerID,
                                        retailerID: req.body.retailerID
                                   });
                                   res.send(200, newContract);
                              });
                         }
                    })
               }
          })

     }
}

//Supplier Contract cost(budget LOCK):
//(1) discountCost = Minimum volume * ( 1 - discount rate ) * BM Price, no matter if Retailer's order meet the minimum order in this period.
//(2) bonusCost = Target volume * bonus rate * BM Price
//(3) Other compensation only if other compensation > 0 (means Supplier transfer cash to Retailer)
exports.getContractExpend = function(req, res, next) {
     var result = 0;

     exports.calculateProducerNegotiationCost(req.params.seminar,
          req.params.producerID,
          req.params.period,
          req.params.parentBrandName,
          req.params.variantName,
          req.params.ignoreItem,
          req.params.ignoreRetailerID).then(function(result){
               res.send(200, result);
          }).fail(function(err){
               res.send(400, err);
          }).done();

}

exports.calculateProducerNegotiationCost = function(seminar, producerID, period, parentBrandName, variantName, ignoreItem, ignoreRetailerID){
     var deferred = q.defer();

     var result = 0;
     contractVariantDetails
          .find()
          .where('contractCode').in(['P' + producerID + 'andR1_' + seminar + '_' + period,
               'P' + producerID + 'andR2_' + seminar + '_' + period
          ])
          .exec(function(err, docs) {
               if (err) {
                    deferred.reject(err);
               } else {
                    if (docs.length != 0) {
                         for (var i = 0; i < docs.length; i++) {
                              if (docs[i].nc_VolumeDiscountRate == 0) {
                                   result += 0;
                              } else {
                                   result += docs[i].nc_MinimumOrder * docs[i].nc_VolumeDiscountRate * docs[i].currentPriceBM;
                              }

                              if ((parentBrandName != 'brandName') && (variantName != 'varName') && (docs[i].parentBrandName == parentBrandName) && (docs[i].variantName == variantName) && (ignoreItem == 'volumeDiscount') && (ignoreRetailerID == docs[i].retailerID)) {

                                   if (docs[i].nc_VolumeDiscountRate == 0) {
                                        result -= 0;
                                   } else {
                                        result -= docs[i].nc_MinimumOrder * docs[i].nc_VolumeDiscountRate * docs[i].currentPriceBM;
                                   }
                              }

                              result += docs[i].nc_SalesTargetVolume * docs[i].nc_PerformanceBonusRate * docs[i].currentPriceBM;
                              if ((parentBrandName != 'brandName') && (variantName != 'varName') && (docs[i].parentBrandName == parentBrandName) && (docs[i].variantName == variantName) && (ignoreItem == 'performanceBonus') && (ignoreRetailerID == docs[i].retailerID)) {

                                   result -= docs[i].nc_SalesTargetVolume * docs[i].nc_PerformanceBonusRate * docs[i].currentPriceBM;
                              }

                              if (docs[i].nc_OtherCompensation > 0) {
                                   result += docs[i].nc_OtherCompensation;
                                   if ((parentBrandName != 'brandName') && (variantName != 'varName') && (docs[i].parentBrandName == parentBrandName) && (docs[i].variantName == variantName) && (ignoreItem == 'otherCompensation') && (ignoreRetailerID == docs[i].retailerID)) {

                                        result -= docs[i].nc_OtherCompensation;
                                   }
                              }
                         }
                         deferred.resolve({result : result});

                    } else {
                         deferred.resolve({result : 0});
                    }
               }
          });

     return deferred.promise;
}

exports.checkVolume = function(req, res, next) {
     contractVariantDetails.findOne({
          contractCode: req.params.contractCode,
          parentBrandName: req.params.parentBrandName,
          variantName: req.params.variantName
     }, function(err, doc) {
          if (err) {
               return next(new Error(err));
          }
          if (!doc) {
               res.send(400, 'fail');
          } else if (doc.nc_MinimumOrder != 0) {
               res.send(200, 'isReady');
          } else {
               res.send(200, 'unReady');
          }
     })
}
exports.checkSalesTargetVolume = function(req, res, next) {
     contractVariantDetails.findOne({
          contractCode: req.params.contractCode,
          parentBrandName: req.params.parentBrandName,
          variantName: req.params.variantName
     }, function(err, doc) {
          if (err) {
               return next(new Error(err));
          }
          if (!doc) {
               res.send(400, 'fail');
          } else if (doc.nc_SalesTargetVolume != 0) {
               res.send(200, 'isReady');
          } else {
               res.send(200, 'unReady');
          }
     })
}
exports.checkContract = function(req, res, next) {
     contract.findOne({
          contractCode: req.params.contractCode
     }, function(err, doc) {
          if (err) {
               return next(new Error(err))
          };
          if (doc) {
               res.send(200, 'isReady');
          } else {
               res.send(200, 'unReady');
          }
     })
}

exports.addContractDetails = function(io) {
     return function(req, res, next) {

          var currentPeriodCode = req.body.contractCode;
          var period = currentPeriodCode.substring(currentPeriodCode.length - 1, currentPeriodCode.length);
          var previousPeriod = parseInt(period) - 1;

          var previousPeriodCode = currentPeriodCode.substring(0, currentPeriodCode.length - 1) + previousPeriod;

          contractVariantDetails.findOne({
                    contractCode: previousPeriodCode,
                    parentBrandName: req.body.brandName,
                    parentBrandID: req.body.brandID,
                    variantName: req.body.varName,
                    variantID: req.body.varID
               },
               function(err, previousDoc) {
                    if (err) {
                         return next(new Error(err));
                    }

                    //check previous period input first, if anything, copy original ones.(without discountRate/bonusRate/OtherCompensation just in case out of budget in the last period)
                    if (previousDoc) {
                         var newContractVariantDetails = new contractVariantDetails({
                              contractCode                           : req.body.contractCode,
                              producerID                             : req.body.producerID,
                              retailerID                             : req.body.retailerID,
                              parentBrandName                        : req.body.brandName,
                              parentBrandID                          : req.body.brandID,
                              variantName                            : req.body.varName,
                              variantID                              : req.body.varID,
                              nc_MinimumOrder                        : previousDoc.nc_MinimumOrder,
                              nc_MinimumOrder_lastModifiedBy         : previousDoc.nc_MinimumOrder_lastModifiedBy,
                              nc_VolumeDiscountRate                  : 0,
                              nc_VolumeDiscountRate_lastModifiedBy   : previousDoc.nc_VolumeDiscountRate_lastModifiedBy,
                              nc_SalesTargetVolume                   : previousDoc.nc_SalesTargetVolume,
                              nc_SalesTargetVolume_lastModifiedBy    : previousDoc.nc_SalesTargetVolume_lastModifiedBy,
                              nc_PerformanceBonusRate                : 0,
                              nc_PerformanceBonusRate_lastModifiedBy : previousDoc.nc_PerformanceBonusRate_lastModifiedBy,
                              nc_PaymentDays                         : previousDoc.nc_PaymentDays,
                              nc_PaymentDays_lastModifiedBy          : previousDoc.nc_PaymentDays_lastModifiedBy,
                              nc_OtherCompensation                   : 0,
                              nc_OtherCompensation_lastModifiedBy    : previousDoc.nc_OtherCompensation_lastModifiedBy,
                              isProducerApproved                     : false,
                              isRetailerApproved                     : false,
                              isNewProduct                           : false, //used for showing tag "NEW"
                              isCompositionModified                  : false, //compare with previous period composition, used for showing tag "MODIFIED"
                              composition                            : req.body.composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                              currentPriceBM                         : req.body.currentPriceBM,
                              packFormat                             : req.body.packFormat,
                              seminar                                : req.body.seminar
                         });
                         //if no history, create empty doc
                    } else {
                         var newContractVariantDetails = new contractVariantDetails({
                              contractCode                           : req.body.contractCode,
                              producerID                             : req.body.producerID,
                              retailerID                             : req.body.retailerID,
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
                              isNewProduct                           : false, //used for showing tag "NEW"
                              isCompositionModified                  : false, //compare with previous period composition, used for showing tag "MODIFIED"
                              composition                            : req.body.composition, //1-DesignIndex(ActiveAgent), 2-TechnologdyLevel, 3-RawMaterialsQuality(SmoothenerLevel)
                              currentPriceBM                         : req.body.currentPriceBM,
                              packFormat                             : req.body.packFormat,
                              seminar                                : req.body.seminar
                         });
                    }

                    newContractVariantDetails.save(function(err) {
                         if (err) return next(new Error(err));
                         io.sockets.emit('contarctListChanged', {
                              producerID: req.body.producerID,
                              retailerID: req.body.retailerID
                         });
                         res.send(200, newContractVariantDetails);
                    });
               })

     }
}
//

// 
exports.dealContractDetail = function(io) {
     return function(req, res, next) {

          var detail = req.body.detail;
          var currentPeriodCode = detail.contractCode;
          var period = currentPeriodCode.substring(currentPeriodCode.length - 1, currentPeriodCode.length);
          var previousPeriod = parseInt(period) - 1;


          var previousPeriodCode = currentPeriodCode.substring(0, currentPeriodCode.length - 1) + previousPeriod;
          contractVariantDetails.findOne({
                    contractCode: previousPeriodCode,
                    parentBrandName: detail.parentBrandName,
                    parentBrandID: detail.parentBrandID,
                    variantName: detail.variantName,
                    variantID: detail.variantID
               },
               function(err, previousDoc) {
                    if (err) {
                         return next(new Error(err));
                    }
 
                    if (previousDoc) {
                         var update = {
                              $set: {
                                   nc_MinimumOrder: previousDoc.nc_MinimumOrder,
                                   nc_VolumeDiscountRate: previousDoc.nc_VolumeDiscountRate,
                                   nc_SalesTargetVolume: previousDoc.nc_SalesTargetVolume,
                                   nc_PerformanceBonusRate: previousDoc.nc_PerformanceBonusRate,
                                   nc_PaymentDays: previousDoc.nc_PaymentDays,
                                   nc_OtherCompensation: previousDoc.nc_OtherCompensation
                              }
                         };

                         contractVariantDetails.findOneAndUpdate({
                              _id: detail._id
                         }, update, function(err, doc) {
                              if (err) return next(new Error(err));
                              res.send(200, {
                                   'result': true,
                                   'detail': doc
                              });
                         });
                    } else {
                         res.send(200, {
                              'result': false,
                              'detail': detail
                         });
                    }
               })
     }
}

exports.finalizedContractDetail = function(io) {
     return function(req, res, next) {
          var detail = req.body.detail;
          contractVariantDetails.findOne({
               contractCode: detail.contractCode,
               parentBrandName: detail.parentBrandName,
               variantName: detail.variantName
          }, function(err, doc) {
               if (err) {
                    return next(new Error(err));
               }
               if (doc) {
                    doc.isProducerApproved = req.body.value;
                    doc.isRetailerApproved = req.body.value;
                    doc.save(function(err) {
                         if (!err) {
                              res.send(200, 'success');
                         } else {
                              res.send(400, 'fail');
                         }
                    })
               }
          })
     }
}

exports.getContractDetails = function(req, res, next) {
     contractVariantDetails.find({
          contractCode: req.params.contractCode
     }, function(err, doc) {
          if (err) {
               return next(new Error(err))
          };
          if (doc) {
               doc.sort(function(x, y) {
                    return x.parentBrandID - y.parentBrandID;
               });
               res.send(200, doc);
          } else {
               res.send(404, 'fail');
          }
     })
}

exports.getContractUnApprovedDetails = function(req, res, next) {
     contractVariantDetails.find({
          contractCode: req.params.contractCode
     }, function(err, docs) {
          if (err) {
               return next(new Error(err))
          };
          if (docs) {
               for (var i = 0; i < docs.length; i++) {
                    if (docs[i].isProducerApproved || docs[i].isRetailerApproved) {
                         docs.splice(i, 1);
                    }
               }
               docs.sort(function(x, y) {
                    return x.parentBrandID - y.parentBrandID;
               });
               res.send(200, docs);
          } else {
               res.send(404, 'fail');
          }
     })
}

exports.getContractDetail = function(req, res, next) {
     contractVariantDetails.findOne({
          contractCode: req.params.contractCode,
          parentBrandName: req.params.brandName,
          variantName: req.params.varName
     }, function(err, doc) {
          if (err) {
               return next(new Error(err));
          } else {
               if (doc) {
                    res.send(200, doc);
               } else {
                    res.send(404, 'fail');
               }
          }
     })
}


//Two situation
//1: Before user commit some normal value(MinimumOrders, DiscountRate...), they want to check if item has been "freeze"
//In this case, either supplier or Retailer approve item, return True(Freeze)
//2: Before user want to change isApproved field(isRetilerApproved, isProducerApproved)
//In this case, only return True when both sides approve item
exports.checkContractDetailsLockStatus = function(req, res, next) {
     contractVariantDetails.findOne({
          contractCode: req.params.contractCode,
          parentBrandName: req.params.parentBrandName,
          variantName: req.params.variantName
     }, function(err, doc) {
          if (err) {
               return next(new Error(err));
          }
          if(doc){
               if ((doc.isProducerApproved && req.params.location != "isRetailerApproved" && req.params.location != "isProducerApproved") || (doc.isRetailerApproved && req.params.location != "isRetailerApproved" && req.params.location != "isProducerApproved") || (doc.isRetailerApproved && doc.isProducerApproved)) {
                    res.send(200, {
                         'result': true,
                         doc: doc
                    });
               } else {
                    res.send(200, {
                         'result': false,
                         doc: doc
                    });
               }
          } else {
                    res.send(200, {
                         'result': false,
                         doc: doc
                    });
          }
          // console.log(doc.isProducerApproved && req.params.location != "isRetailerApproved" && req.params.location != "isProducerApproved");
          // console.log(doc.isRetailerApproved && req.params.location != "isRetailerApproved" && req.params.location != "isProducerApproved");
          // console.log(doc.isRetailerApproved && doc.isProducerApproved);
     });
}

//the sum of minimum orders what has been already inputted in this and other deals
exports.getAgreedProductionVolume = function(req, res, next) {
     var result = 0,
          brandName = "";

     contractVariantDetails
          .find()
          .where('contractCode').in(['P' + req.params.producerID + 'andR1_' + req.params.seminar + '_' + req.params.period,
               'P' + req.params.producerID + 'andR2_' + req.params.seminar + '_' + req.params.period
          ])
          .exec(function(err, docs) {
               if (err) {
                    return next(new Error(err));
               } else {
                    if (req.params.parentBrandName.substr(0, 1) == "E") {
                         brandName = "H";
                    } else {
                         brandName = "E";
                    }

                    if (docs.length != 0) {
                         for (var i = 0; i < docs.length; i++) {
                              result += docs[i].nc_MinimumOrder;

                              if (docs[i].parentBrandName == req.params.parentBrandName && docs[i].variantName == req.params.variantName) {
                                   result -= docs[i].nc_MinimumOrder;
                              }
                              if (docs[i].parentBrandName.substr(0, 1) == brandName) {
                                   result -= docs[i].nc_MinimumOrder;
                              }
                         }
                         res.send(200, {
                              'result': result
                         });
                    } else {
                         res.send(404, 'fail');
                    }
               }
          });
}


exports.updateContractDetails = function(io) {
     return function(req, res, next) {
          var result = false;
          var queryCondition = {
               contractCode: req.body.contractCode,
               parentBrandName: req.body.brandName,
               variantName: req.body.varName,
               userType: req.body.userType,
               location: req.body.location,
               modify: req.body.location + '_lastModifiedBy',
               value: req.body.value,

               producerID: req.body.producerID,
               retailerID: req.body.retailerID,
               seminar: req.body.seminar,
               period: req.body.period
          };
          contractVariantDetails.findOne({
               contractCode: queryCondition.contractCode,
               parentBrandName: queryCondition.parentBrandName,
               variantName: queryCondition.variantName
          }, function(err, doc) {
               if (err) {
                    return next(new Error(err));
               }

               if (queryCondition.location == "nc_VolumeDiscountRate" || queryCondition.location == "nc_PerformanceBonusRate") {
                    doc[queryCondition.location] = queryCondition.value / 100;
               } else {
                    doc[queryCondition.location] = queryCondition.value;
               }

               //doc[queryCondition.location] = queryCondition.value;
               if (queryCondition.location != "isProducerApproved" || queryCondition.location != "isRetailerApproved") {
                    doc[queryCondition.modify] = queryCondition.userType;
               }

               if (queryCondition.location == "nc_MinimumOrder") {
                    doc.nc_VolumeDiscountRate = 0;
                    doc.nc_VolumeDiscountRate_lastModifiedBy = queryCondition.userType;
               }

               if (queryCondition.location == "nc_SalesTargetVolume") {
                    doc.nc_PerformanceBonusRate = 0;
                    doc.nc_PerformanceBonusRate_lastModifiedBy = queryCondition.userType;
               }

               doc.save(function(err, doc, numberAffected) {
                    if (err) {
                         return next(new Error(err));
                    }
                    io.sockets.emit('socketIO:contractDetailsUpdated', {
                         userType: queryCondition.userType,
                         seminar: queryCondition.seminar,
                         producerID: queryCondition.producerID,
                         retailerID: queryCondition.retailerID,
                         period: queryCondition.period
                    });
                    res.send(200, doc);
               });
          })
     }
}


exports.removeContractDetailsByContractcode = function(io) {
     return function(req, res, next) {
          contractVariantDetails.remove({
               contractCode: req.body.contractCode
          }, function(err, numberAffected) {
               if (err) {
                    return next(new Error(err))
               };
               res.send('Related contractDetails("' + req.body.contractCode + '") have been removed,  number affected : ' + numberAffected);
          });
     }
}

exports.removeContract = function(io) {
     return function(req, res, next) {
          contract.remove({
               contractCode: req.body.contractCode
          }, function(err, numberAffected) {
               if (err) {
                    return next(new Error(err))
               };
               res.send('Related contract("' + req.body.contractCode + '") have been removed,  number affected : ' + numberAffected);
          });
     }
}


//TODO: Complete this function: Get retailer additional budget from Supplier of current period
//(1) other compensation 
//(2) volume discount 
//:seminar/:period/:retailerID
exports.getRetailerAdditionalBudget = function(req, res, next) {
     var result = 0;
     contractVariantDetails
          .find()
          .where('contractCode').in(['P1andR' + req.params.retailerID + '_' + req.params.seminar + '_' + req.params.period,
               'P2andR' + req.params.retailerID + '_' + req.params.seminar + '_' + req.params.period,
               'P3andR' + req.params.retailerID + '_' + req.params.seminar + '_' + req.params.period
          ])
          .exec(function(err, docs) {
               if (err) {
                    return next(new Error(err));
               } else {
                    if (docs.length != 0) {
                         for (var i = 0; i < docs.length; i++) {
                              if(docs[i].isProducerApproved && docs[i].isRetailerApproved){                                   
                                   result += docs[i].nc_OtherCompensation;
                              }
                         };

                         res.send(200, {
                              'result': result
                         });
                    } else {
                         res.send(200, {
                              'result': 0
                         });
                    }
               }
          });
}