var _ = require('underscore'),
  userRoles = require('../../app/js/routingConfig').userRoles,
  q = require('q'),
  util = require('util');

exports.getCurrentUnitCost = function(req, res, next) {
  var query = {
    period: req.body.period,
    seminar: req.body.seminar,
    brandName: req.body.brandName,
    varName: req.body.varName,
    catID: req.body.catID,
    userRole: req.body.userRole,
    userID: req.body.userID,
  };

  var prodCost = [];

  //console.log('try to get production cost: ' + util.inspect(query));
  //get variant composition/catNow/isPrivateLabel/packFormat
  prepareProdCost(query.seminar, query.period).then(function(success){
    
    prodCost = success.result;
    console.log(prodCost);

    return getProduct(query);
  }).then(function(variant) {
    return getCumVolumes(query, variant.result);
  }).then(function(variant) {

    variant.result.cumVolumes = [
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
    ];

    console.log(variant.result.cumVolumes);

    var value = calculateUnitCost(variant.result.catNow,
      variant.result.isPrivateLabel,
      variant.result.packFormat,
      variant.result.composition,
      variant.result.cumVolumes,
      prodCost);

    //console.log('done:' + value);
    res.send(200, {
      result: value.toFixed(2)
    });
  }, function(err) {
    console.log('err, ' + util.inspect(err));
    res.send(404, err.msg);
  });
}

function calculateUnitCost(catNow, isPrivateLabel, packFormat, composition,  cumVolumes, prodCost) {
    var tempResult,
    geogNow = 2,
    correctedVolumes = [0, 0, 0]; //Length:TSpecs(1~3)

   // console.log(prodCost);
  //SpecsMax = 3
  var currentProdCost = _.find(prodCost, function(assort) {
      return (assort.marketID == geogNow && assort.categoryID == catNow)
    })
    // if(!currentProdCost) 
    //   //console.log('assort error');
  for (var i = 0; i < 3; i++) {
    correctedVolumes[i] = cumVolumes[i][composition[i]];
    //console.log('for, cumVolumes[' + i + '][' + composition[i] + ']:' + cumVolumes[i][composition[i]]); 
  };
  
  console.log('  step 1, correctedVolumes:' + correctedVolumes);
  //MaxSpecsIndex = 22
  switch (catNow) {
    case 1: //Elecsories
      for (var specsIndex = composition[0]; specsIndex < 22; specsIndex++) {
        correctedVolumes[0] = correctedVolumes[0] + (cumVolumes[0][specsIndex] * (specsIndex - (composition[0] - 1)) * currentProdCost.higherDesignImpact);
      };
      for (var specsIndex = composition[1]; specsIndex < 22; specsIndex++) {
        correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex] * (specsIndex - (composition[1] - 1)) * currentProdCost.higherTechImpact);
      };
      break;
    case 2: //HealthBeauties
      for (var specsIndex = composition[1]; specsIndex < 22; specsIndex++) {
        correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex] * (specsIndex - (composition[1] - 1)) * currentProdCost.higherTechImpact);
      };
      break;
    default:
      //console.log('UnitCost: catNow error');
  }

  console.log('  step 2, complete switch: ' + correctedVolumes);

  tempResult = currentProdCost.logisticsCost;
  console.log('  step 3, logisticsCost: ' + tempResult);

  var a, b;
  for (var spec = 0; spec < 3; spec++) {
    //console.log('currentProdCost.ingredientDetails[' +spec + ']['+ composition[spec] +']:' + currentProdCost.ingredientDetails[spec][composition[spec]]);
    a = currentProdCost.ingredientDetails[spec][composition[spec]] * composition[spec]
    b = 0;
    for (var aMarket = 1; aMarket < 3; aMarket++) {
      var PC = _.find(prodCost, function(assort) {
        return assort.marketID == aMarket && assort.categoryID == catNow;
      })
      if (!PC) {
        //console.log('UnitCost: get PC error in aMarket');
      }
      b = b + PC.minProductionVolume;
    };
    b = (Math.max(correctedVolumes[spec], b)) / b;
    b = Math.pow(b, currentProdCost.defaultDrop);
    tempResult = tempResult + a * b;
  }

  console.log('  step 4, before packformat: ' + tempResult);

  switch (packFormat) {
    case 'ECONOMY':
      tempResult = tempResult * (1.0 + currentProdCost.ECONOMY)
      break;
    case 'STANDARD':
      tempResult = tempResult * (1.0 + currentProdCost.STANDARD)
      break;
    case 'PREMIUM':
      tempResult = tempResult * (1.0 + currentProdCost.PREMIUM)
      break;
    default:
      //console.log('UnitCost: packFormat error');
  }

  console.log('  step 4, after packformat: ' + tempResult);

  if (isPrivateLabel) tempResult = tempResult * (1.0 + currentProdCost.marginOnPrivateLabel);

  console.log('  step 5, after privateLabel: ' + tempResult);

  return tempResult;

}

function prepareProdCost(seminar, period){
  var deferred = q.defer(), tempAssort;
  var prodCost = [{marketID : 1, categoryID : 1},{marketID : 1, categoryID : 2},{marketID : 2, categoryID : 1},{marketID : 2, categoryID : 2}];

  require('./../models/BG_oneQuarterExogenousData.js').oneQuarterExogenousData.find({seminar: seminar, period : period }, function(err, docs){
    if(err){ console.log('ERR:' + err); deferred.reject({msg:'oneQuarterExogenousData find err, seminar: ' + seminar + ', period: ' + period});}
    if(docs){
      tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 1; });
      prodCost[0].ingredientDetails = tempAssort.ProdCost_IngredientPrices;
      prodCost[0].logisticsCost = tempAssort.ProdCost_LogisticsCost;
      prodCost[0].labourCost = tempAssort.ProdCost_LabourCost;

      tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 2; });
      prodCost[1].ingredientDetails = tempAssort.ProdCost_IngredientPrices;
      prodCost[1].logisticsCost = tempAssort.ProdCost_LogisticsCost;
      prodCost[1].labourCost = tempAssort.ProdCost_LabourCost;

      tempAssort = _.find(docs, function(assort) { return assort.marketID == 2 && assort.categoryID == 1; });
      prodCost[2].ingredientDetails = tempAssort.ProdCost_IngredientPrices;
      prodCost[2].logisticsCost = tempAssort.ProdCost_LogisticsCost;
      prodCost[2].labourCost = tempAssort.ProdCost_LabourCost;

      tempAssort = _.find(docs, function(assort) { return assort.marketID == 2 && assort.categoryID == 2; });
      prodCost[3].ingredientDetails = tempAssort.ProdCost_IngredientPrices;
      prodCost[3].logisticsCost = tempAssort.ProdCost_LogisticsCost;
      prodCost[3].labourCost = tempAssort.ProdCost_LabourCost;

      require('./../models/BG_oneQuarterParameterData.js').oneQuarterParameterData.find({seminar: seminar}, function(err, docs){
          if(err){ console.log('ERR:' + err); deferred.reject({msg:'oneQuarterExogenousData find err, seminar: ' + seminar + ', period: ' + period});}
          if(docs){
              tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 1; });
              prodCost[0].higherDesignImpact = tempAssort.ProdCost_HigherDesignImpact;  
              prodCost[0].higherTechImpact = tempAssort.ProdCost_HigherTechImpact;    
              prodCost[0].defaultDrop = tempAssort.ProdCost_DefaultDrop;         
              prodCost[0].marginOnPrivateLabel = tempAssort.ProdCost_MarginOnPrivateLabel;
              prodCost[0].minProductionVolume = tempAssort.MinProductionVolume;         
              prodCost[0].ECONOMY = tempAssort.ProdCost_ECONOMY;             
              prodCost[0].STANDARD = tempAssort.ProdCost_STANDARD;            
              prodCost[0].PREMIUM = tempAssort.ProdCost_PREMIUM;      

              tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 2; });
              prodCost[1].higherDesignImpact = tempAssort.ProdCost_HigherDesignImpact;  
              prodCost[1].higherTechImpact = tempAssort.ProdCost_HigherTechImpact;    
              prodCost[1].defaultDrop = tempAssort.ProdCost_DefaultDrop;         
              prodCost[1].marginOnPrivateLabel = tempAssort.ProdCost_MarginOnPrivateLabel;
              prodCost[1].minProductionVolume = tempAssort.MinProductionVolume;         
              prodCost[1].ECONOMY = tempAssort.ProdCost_ECONOMY;             
              prodCost[1].STANDARD = tempAssort.ProdCost_STANDARD;            
              prodCost[1].PREMIUM = tempAssort.ProdCost_PREMIUM;      

              tempAssort = _.find(docs, function(assort) { return assort.marketID == 2 && assort.categoryID == 1; });
              prodCost[2].higherDesignImpact = tempAssort.ProdCost_HigherDesignImpact;  
              prodCost[2].higherTechImpact = tempAssort.ProdCost_HigherTechImpact;    
              prodCost[2].defaultDrop = tempAssort.ProdCost_DefaultDrop;         
              prodCost[2].marginOnPrivateLabel = tempAssort.ProdCost_MarginOnPrivateLabel;
              prodCost[2].minProductionVolume = tempAssort.MinProductionVolume;         
              prodCost[2].ECONOMY = tempAssort.ProdCost_ECONOMY;             
              prodCost[2].STANDARD = tempAssort.ProdCost_STANDARD;            
              prodCost[2].PREMIUM = tempAssort.ProdCost_PREMIUM;      

              tempAssort = _.find(docs, function(assort) { return assort.marketID == 2 && assort.categoryID == 2; });
              prodCost[3].higherDesignImpact = tempAssort.ProdCost_HigherDesignImpact;  
              prodCost[3].higherTechImpact = tempAssort.ProdCost_HigherTechImpact;    
              prodCost[3].defaultDrop = tempAssort.ProdCost_DefaultDrop;         
              prodCost[3].marginOnPrivateLabel = tempAssort.ProdCost_MarginOnPrivateLabel;
              prodCost[3].minProductionVolume = tempAssort.MinProductionVolume;         
              prodCost[3].ECONOMY = tempAssort.ProdCost_ECONOMY;             
              prodCost[3].STANDARD = tempAssort.ProdCost_STANDARD;            
              prodCost[3].PREMIUM = tempAssort.ProdCost_PREMIUM;      
              
              deferred.resolve({result : prodCost});
          } else {
              deferred.reject({msg:'prepareProdCost failed : no one oneQuarterParameterData, seminar: ' + seminar + ', period: ' + period});      
          }
      });
    } else {
      deferred.reject({msg:'prepareProdCost failed : no one oneQuarterExogenousData, seminar: ' + seminar + ', period: ' + period});
    }
  });


  return deferred.promise;  
}

function getProduct(query) {
  var deferred = q.defer();

  //console.log('query:' + util.inspect(query,{depth:true}));
  switch (parseInt(query.userRole)) {
    case userRoles.producer:
      require('../models/producerDecision.js').proDecision.findOne({
        seminar: query.seminar,
        period: query.period,
        producerID: query.userID
      }, function(err, doc) {
        if (doc) {
          var brand = _.find(doc.proCatDecision[query.catID - 1].proBrandsDecision, function(singleBrand) {
            return singleBrand.brandName == query.brandName;
          });
          if (brand) {
            var variant = _.find(brand.proVarDecision, function(singleVariant) {
              return singleVariant.varName == query.varName;
            });
            if (variant) {
              deferred.resolve({
                msg: 'found variant',
                result: {
                  composition: variant.composition,
                  packFormat: variant.packFormat,
                  isPrivateLabel: false,
                  catNow: query.catID,
                  manufactorID: doc.producerID
                }
              })
            } else {
              //console.log('reject variant'); 
              deferred.reject({
                msg: 'UnitCost, cannot find variant by query: ' + query
              });
            }
          } else {
            deferred.reject({
              msg: 'UnitCost, cannot find brand by query: ' + query
            });
          }
        } else {
          //console.log('reject');
          deferred.reject({
            msg: 'UnitCost, cannot find producerDecision doc by query: ' + query
          });
        }
      });
      break;
    case userRoles.retailer:
      require('../models/retailerDecision.js').retDecision.findOne({
        seminar: query.seminar,
        period: query.period,
        retailerID: query.userID
      }, function(err, doc) {
        if (doc) {
          var brand = _.find(doc.retCatDecision[query.catID - 1].privateLabelDecision, function(singleBrand) {
            return singleBrand.brandName == query.brandName;
          });
          if (brand) {
            var variant = _.find(brand.privateLabelVarDecision, function(singleVariant) {
              return singleVariant.varName == query.varName;
            });
            if (variant) {
              deferred.resolve({
                msg: 'found private label',
                result: {
                  composition: variant.composition,
                  packFormat: variant.packFormat,
                  isPrivateLabel: true,
                  catNow: query.catID,
                  manufactorID: 4
                }
              })
            } else {
              deferred.reject({
                msg: 'UnitCost, cannot find variant by query: ' + query
              });
            }
          } else {
            deferred.reject({
              msg: 'UnitCost, cannot find brand by query: ' + query
            });
          }
        } else {
          deferred.reject({
            msg: 'UnitCost, cannot find retailerDecision doc by query: ' + query
          });
        }
      });
      break;
    default:
      deferred.reject({
        msg: 'UnitCost, userRole error:' + query
      });
  }

  return deferred.promise;
}

/*
{                                                                                              }
{ --- CUMULATED VOLUMES  --- how to prepare them ? ------------------------------------------- }
{                                                                                              }
{ ELECSORRIES: - DESIGN: Previously cumulated plus sum of current volumes                      }
{                        produced with the same level. (across all variants)                   }
{                        Similarly, the volumes with higher level are also taken into account. }
{                                                                                              }
{              - TECHNOLOGY: same as above.                                                    }
{                                                                                              }
{              - QUALITY of INGREDIENTS: only current volume cumulated across all variants     }
{                                        with the same quality index.                          }
{                                                                                              }
{ HEALTHBEAUTIES: - ACTIVE AGENT: only current volume cumulated across all variants with the   }
{                                 same level.                                                  }
{                                                                                              }
{                   TECHNOLOGY: Previously cumulated plus sum of current volumes produced with }
{                               the same level (across all variants). Similarly, the volumes   }
{                               with higher level are also taken into account.                 }
{                                                                                              }
{                   SMOOTHENER: only current volume cumulated across all variants with the     }
{                               same level.                                                    }
{       

Where to find previously cumulatedd plus sum of current volumes?
scrInfo_CumulatedDesignVolume         : array[TCategories] of TDesignsDetails;
scrInfo_CumulatedTechnologyVolume     : array[TCategories] of TTechnologiesDetails;
*/
function getCumVolumes(query, variant) {
  var deferred = q.defer();
  var cumVolumes = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];
  var DL, TLE, RMQ;
  var AA, TLH, SMT;
  //DL - DesignLevel, TLE - Technology Level ELECSORRIES, RMQ - QUALITY of INGREDIENTS
  //AA - Active Agent, TLH - Technology Level HEALTHBEAUTIES, SMT - Smoother level 
  var CDL = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CTLE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CRMQ = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var CAA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CTLH = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    CSMT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  //C - cumulated volume 
  var preCumulatedDLvolume, preCumulatedTLvolume;
  var historyPeriod;
  //Pre - Previous period 

  historyPeriod = query.period - 1;

  if (variant.catNow == 1) {
    //Find previous cumulated volume first...          
    require('../models/companyHistoryInfo.js').companyHistory.findOne({
      seminar: query.seminar,
      period: historyPeriod
    }, function(err, doc) {
      if (err) {
        deferred.reject({
          msg: 'err from companyHistory'
        });
      };
      if (doc) {
        //console.log(doc);
        var manufactor = _.find(doc.producerView, function(producer) {
          return producer.producerID == variant.manufactorID;
        });

        if (manufactor) {
          for (var i = 0; i < 20; i++) {
            CDL[i] = manufactor.cumulatedDesignVolume[variant.catNow - 1][i];
            CTLE[i] = manufactor.cumulatedTechnologyVolume[variant.catNow - 1][i];
          };
          // CDL = manufactor.cumulatedDesignVolume[variant.catNow - 1];
          // CTLE = manufactor.cumulatedTechnologyVolume[variant.catNow - 1];   
          console.log('----- M' + variant.manufactorID + ' previous cumulated volume -------')
          console.log('manufactor.cumulatedDesignVolume: ' + manufactor.cumulatedDesignVolume[variant.catNow - 1]);
          console.log('manufactor.cumulatedTechnologyVolume: ' + manufactor.cumulatedTechnologyVolume[variant.catNow - 1]);
          console.log('CDL: ' + CDL);
          console.log('CTLE: ' + CTLE);
          console.log('CRMQ: ' + CRMQ);


          //normal products                      
          if (variant.manufactorID <= 3) {
            require('../models/producerDecision.js').proDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              producerID: variant.manufactorID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.proCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                //console.log(util.inspect(catDec, {depth:null}));

                console.log('----- portfolio -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].proBrandsDecision.length; j++) {

                    for (var k = 0; k < catDec[i].proBrandsDecision[j].proVarDecision.length; k++) {
                      if (catDec[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && catDec[i].proBrandsDecision[j].proVarDecision[k].varName != "") {

                        console.log(catDec[i].proBrandsDecision[j].brandName + catDec[i].proBrandsDecision[j].proVarDecision[k].varName + ': ' + catDec[i].proBrandsDecision[j].proVarDecision[k].composition + ' / production: ' + catDec[i].proBrandsDecision[j].proVarDecision[k].production);
                        for (var specIdx = 0; specIdx < 22; specIdx++) {
                          var realSpecIdx = specIdx + 1;
                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[0] >= realSpecIdx) {
                            CDL[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[1] >= realSpecIdx) {
                            CTLE[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[2] == realSpecIdx) {
                            CRMQ[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }
                        }
                      };
                    }

                  }
                }

                console.log('----- after -------')
                console.log('CDL: ' + CDL);
                console.log('CTLE: ' + CTLE);
                console.log('CRMQ: ' + CRMQ);

                cumVolumes[0] = CDL;
                cumVolumes[1] = CTLE;
                cumVolumes[2] = CRMQ;
                variant.cumVolumes = cumVolumes;
                deferred.resolve({
                  msg: 'getCumVolume',
                  result: variant
                });
              } else {
                deferred.reject({
                  msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
                });
              }
            })
            //private labels 
          } else {
            console.log('period:' + query.period);
            require('../models/retailerDecision.js').retDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              retailerID: query.userID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.retCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                console.log('----- private portfolio(with orders) -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].privateLabelDecision.length; j++) {
                    for (var k = 0; k < catDec[i].privateLabelDecision[j].privateLabelVarDecision.length; k++) {
                      if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varID != 0 && catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName != "") {

                        var PLorder_Market1 = _.find(doc.retMarketDecision[0].retMarketAssortmentDecision[variant.catNow - 1].retVariantDecision, function(order) {
                          return ((order.varName == catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName) && (order.brandName == catDec[i].privateLabelDecision[j].brandName));
                        });
                        var PLorder_Market2 = _.find(doc.retMarketDecision[1].retMarketAssortmentDecision[variant.catNow - 1].retVariantDecision, function(order) {
                          return ((order.varName == catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName) && (order.brandName == catDec[i].privateLabelDecision[j].brandName));
                        });
                        //If those private label are ordered in the Urban or Rural 
                        var M1Order = 0;
                        var M2Order = 0;
                        if (PLorder_Market1 != undefined) {
                          M1Order = PLorder_Market1.order;
                        }
                        if (PLorder_Market2 != undefined) {
                          M2Order = PLorder_Market2.order;
                        }

                        // console.log(PLorder_Market1);
                        // console.log(PLorder_Market2);

                        var totalOrder;

                        totalOrder = M1Order + M2Order;

                        if ((PLorder_Market1 != undefined) || (PLorder_Market2 != undefined)) {
                          console.log(catDec[i].privateLabelDecision[j].brandName + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName + ': ' + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition + ' / total order volume : ' + totalOrder);

                          for (var specIdx = 0; specIdx < 22; specIdx++) {
                            var realSpecIdx = specIdx + 1;
                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[0] >= realSpecIdx) {
                              CDL[specIdx] += totalOrder;
                            }

                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[1] >= realSpecIdx) {
                              CTLE[specIdx] += totalOrder;
                            }

                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[2] == realSpecIdx) {
                              CRMQ[specIdx] += totalOrder;
                            }
                          }

                        }

                      };
                    }
                  }

                }
                console.log('----- after -------')
                console.log('CDL: ' + CDL);
                console.log('CTLE: ' + CTLE);
                console.log('CRMQ: ' + CRMQ);
                cumVolumes[0] = CDL;
                cumVolumes[1] = CTLE;
                cumVolumes[2] = CRMQ;
                variant.cumVolumes = cumVolumes;
                deferred.resolve({
                  msg: 'getCumVolume',
                  result: variant
                });
              } else {
                deferred.reject({
                  msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
                });
              }
            })
          }
        } else {
          deferred.reject({
            msg: 'UnitCost, cannot find manufactor ' + variant.manufactorID
          });
        }
      } else {
        deferred.reject({
          msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
        });
      }
    })
  } else if (variant.catNow == 2) {
    //Find previous cumulated volume first...          
    require('../models/companyHistoryInfo.js').companyHistory.findOne({
      seminar: query.seminar,
      period: historyPeriod
    }, function(err, doc) {
      if (err) {
        deferred.reject({
          msg: 'err from companyHistory'
        });
      };
      if (doc) {
        //console.log(doc);
        var manufactor = _.find(doc.producerView, function(producer) {
          return producer.producerID == variant.manufactorID;
        });

        if (manufactor) {
          for (var i = 0; i < 20; i++) {
            CTLH[i] = manufactor.cumulatedTechnologyVolume[variant.catNow - 1][i];
          };
          // CTLH = manufactor.cumulatedTechnologyVolume[variant.catNow - 1];   
          console.log('----- M' + variant.manufactorID + ' previous cumulated volume -------')
          console.log('manufactor.cumulatedTechnologyVolume: ' + manufactor.cumulatedTechnologyVolume[variant.catNow - 1]);
          console.log('CAA: ' + CAA);
          console.log('CTLH: ' + CTLH);
          console.log('CSMT: ' + CSMT);


          //normal products                      
          if (variant.manufactorID <= 3) {
            require('../models/producerDecision.js').proDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              producerID: variant.manufactorID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.proCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                //console.log(util.inspect(catDec, {depth:null}));

                console.log('----- portfolio -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].proBrandsDecision.length; j++) {

                    for (var k = 0; k < catDec[i].proBrandsDecision[j].proVarDecision.length; k++) {
                      if (catDec[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && catDec[i].proBrandsDecision[j].proVarDecision[k].varName != "") {

                        console.log(catDec[i].proBrandsDecision[j].brandName + catDec[i].proBrandsDecision[j].proVarDecision[k].varName + ': ' + catDec[i].proBrandsDecision[j].proVarDecision[k].composition + ' / production: ' + catDec[i].proBrandsDecision[j].proVarDecision[k].production);
                        for (var specIdx = 0; specIdx < 22; specIdx++) {
                          var realSpecIdx = specIdx + 1;
                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[0] == realSpecIdx) {
                            CAA[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[1] >= realSpecIdx) {
                            CTLH[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[2] == realSpecIdx) {
                            CSMT[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }
                        }
                      };
                    }

                  }
                }

                console.log('----- after -------')
                console.log('CAA: ' + CAA);
                console.log('CTLH: ' + CTLH);
                console.log('CSMT: ' + CSMT);

                cumVolumes[0] = CAA;
                cumVolumes[1] = CTLH;
                cumVolumes[2] = CSMT;
                variant.cumVolumes = cumVolumes;
                deferred.resolve({
                  msg: 'getCumVolume',
                  result: variant
                });
              } else {
                deferred.reject({
                  msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
                });
              }
            })
            //private labels 
          } else {
            console.log('period:' + query.period);
            require('../models/retailerDecision.js').retDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              retailerID: query.userID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.retCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                console.log('----- private portfolio(with orders) -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].privateLabelDecision.length; j++) {
                    for (var k = 0; k < catDec[i].privateLabelDecision[j].privateLabelVarDecision.length; k++) {
                      if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varID != 0 && catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName != "") {

                        var PLorder_Market1 = _.find(doc.retMarketDecision[0].retMarketAssortmentDecision[variant.catNow - 1].retVariantDecision, function(order) {
                          return ((order.varName == catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName) && (order.brandName == catDec[i].privateLabelDecision[j].brandName));
                        });
                        var PLorder_Market2 = _.find(doc.retMarketDecision[1].retMarketAssortmentDecision[variant.catNow - 1].retVariantDecision, function(order) {
                          return ((order.varName == catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName) && (order.brandName == catDec[i].privateLabelDecision[j].brandName));
                        });
                        //If those private label are ordered in the Urban or Rural 
                        var M1Order = 0;
                        var M2Order = 0;
                        if (PLorder_Market1 != undefined) {
                          M1Order = PLorder_Market1.order;
                        }
                        if (PLorder_Market2 != undefined) {
                          M2Order = PLorder_Market2.order;
                        }

                        // console.log(PLorder_Market1);
                        // console.log(PLorder_Market2);

                        var totalOrder;

                        totalOrder = M1Order + M2Order;

                        if ((PLorder_Market1 != undefined) || (PLorder_Market2 != undefined)) {
                          console.log(catDec[i].privateLabelDecision[j].brandName + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName + ': ' + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition + ' / total order volume : ' + totalOrder);

                          for (var specIdx = 0; specIdx < 22; specIdx++) {
                            var realSpecIdx = specIdx + 1;
                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[0] == realSpecIdx) {
                              CAA[specIdx] += totalOrder;
                            }

                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[1] >= realSpecIdx) {
                              CTLH[specIdx] += totalOrder;
                            }

                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[2] == realSpecIdx) {
                              CSMT[specIdx] += totalOrder;
                            }
                          }

                        }

                      };
                    }
                  }

                }
                console.log('----- after -------')
                console.log('CAA: ' + CAA);
                console.log('CTLH: ' + CTLH);
                console.log('CSMT: ' + CSMT);
                cumVolumes[0] = CAA;
                cumVolumes[1] = CTLH;
                cumVolumes[2] = CSMT;
                variant.cumVolumes = cumVolumes;
                deferred.resolve({
                  msg: 'getCumVolume',
                  result: variant
                });
              } else {
                deferred.reject({
                  msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
                });
              }
            })
          }
        } else {
          deferred.reject({
            msg: 'UnitCost, cannot find manufactor ' + variant.manufactorID
          });
        }
      } else {
        deferred.reject({
          msg: 'UnitCost, cannot find companyHistory doc by query: ' + query
        });
      }
    })
  }

  return deferred.promise;
}

