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

  debugUnitCost('try to get production cost: ' + util.inspect(query));
  //get variant composition/catNow/isPrivateLabel/packFormat
  prepareProdCost(query.seminar, query.period).then(function(success){
    
    prodCost = success.result;
   // debugUnitCost(prodCost);

    return getProduct(query);
  }).then(function(variant) {
    return getCumVolumes(query, variant.result);
  }).then(function(variant) {

    variant.result.cumVolumes = [
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
      [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400]
    ];

    //debugUnitCost(variant.result.cumVolumes);

    var value = calculateUnitCost(variant.result.catNow,
      variant.result.isPrivateLabel,
      variant.result.packFormat,
      variant.result.composition,
      variant.result.cumVolumes,
      prodCost);

    debugUnitCost('done:' + value);
    res.send(200, {
      result: value.toFixed(2)
    });
  }, function(err) {
    debugUnitCost('err, ' + util.inspect(err));
    res.send(404, err.msg);
  });
}

function debugUnitCost(msg){
  console.log(msg);
}

function calculateUnitCost(catNow, isPrivateLabel, packFormat, composition,  cumVolumes, prodCost) {
    var tempResult,
  // { GeogNow must uniquely take a value smaller than MrktsMaxTotal                                   }
  // {         as there are no files with parameters and exogenous values for a total across markets.  }
  // {         This will hapen if at least one market is selected, otherwise the dummy value set above }
  // {         will not be used.                                                                       }
  // {         Most of relevant here parameters have the same value in all markets.                    }
  // {         If a grand total (or average) across markets is needed it is explicitly calculated.     }
  // for aMarket := 1 to MrktsMax do
  //   if ( Markets_IDs[aMarket] > 0 ) then
  //   begin
  //     MarketsNow := MarketsNow + [aMarket];
  //     if ( GeogNow = MrktsMaxTotal) then GeogNow := aMarket;
  //   end;
    geogNow = 1,
    correctedVolumes = [0, 0, 0]; //Length:TSpecs(1~3)

  //SpecsMax = 3
  var currentProdCost = _.find(prodCost, function(assort) {
      return (assort.marketID == geogNow && assort.categoryID == catNow)
    })
    // if(!currentProdCost) 
    //   //debugUnitCost('assort error');
  debugUnitCost('currentProdCost, market : ' + currentProdCost.marketID + ', cat : ' + currentProdCost.categoryID);
  debugUnitCost('currentProdCost : ' + currentProdCost);


  for (var i = 0; i < 3; i++) {
    correctedVolumes[i] = cumVolumes[i][composition[i]];
    //debugUnitCost('for, cumVolumes[' + i + '][' + composition[i] + ']:' + cumVolumes[i][composition[i]]); 
  };
  
  debugUnitCost('  step 1, correctedVolumes:' + correctedVolumes);
  debugUnitCost('  step 1.1, composition:' + composition + ', catNow:' + catNow);  

  //MaxSpecsIndex = 22
  switch (catNow) {
    case '1': //Elecsories
      for (var specsIndex = composition[0]; specsIndex <= 22; specsIndex++) {
        correctedVolumes[0] = correctedVolumes[0] + (cumVolumes[0][specsIndex-1] * (specsIndex - composition[0] ) * currentProdCost.higherDesignImpact);
        //debugUnitCost('  step 1.2,  (specsIndex - composition[0] ) : ' +  (specsIndex - composition[0] ) );
        //debugUnitCost('  step 1.3, correctedVolumes[0]: ' + correctedVolumes[0]);

      };
      for (var specsIndex = composition[1]; specsIndex <= 22; specsIndex++) {
        correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex-1] * (specsIndex - composition[1] ) * currentProdCost.higherTechImpact);
      };
      break;
    case '2': //HealthBeauties
      for (var specsIndex = composition[1]; specsIndex <= 22; specsIndex++) {
        correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex-1] * (specsIndex - composition[1] ) * currentProdCost.higherTechImpact);
      };
      break;
    default:
      debugUnitCost('UnitCost: catNow error');
  }

  debugUnitCost('  step 1.5, after dealing, correctedVolumes:' + correctedVolumes);

  debugUnitCost('  step 2, complete switch: ' + correctedVolumes);

  tempResult = currentProdCost.logisticsCost;
  tempResult = tempResult + currentProdCost.labourCost;

  debugUnitCost('  step 3, logisticsCost + labourCost: ' + tempResult + ' (labourCost = ' + currentProdCost.labourCost + ')');

  var a, b;
  for (var spec = 0; spec < 3; spec++) {
    //debugUnitCost('currentProdCost.ingredientDetails[' +spec + ']['+ composition[spec] +']:' + currentProdCost.ingredientDetails[spec][composition[spec]]);
    a = currentProdCost.ingredientDetails[spec][composition[spec]-1] * composition[spec]
    //debugUnitCost(' step 3.05, currentProdCost.ingredientDetails[spec][composition[spec]]: ' + currentProdCost.ingredientDetails[spec][composition[spec]]);
    //debugUnitCost(' step 3.05, composition[spec]: ' + composition[spec]);
    //debugUnitCost(' step 3.05, a: ' + a);
    b = 0;
    for (var aMarket = 1; aMarket < 3; aMarket++) {
      var PC = _.find(prodCost, function(assort) {
        return assort.marketID == aMarket && assort.categoryID == catNow;
      })
      if (!PC) {
        ////debugUnitCost('UnitCost: get PC error in aMarket');
      }
      b = b + PC.minProductionVolume;
    };
    //debugUnitCost(' step 3.1, b: ' + b);
    b = (Math.max(correctedVolumes[spec], b)) / b;
    //debugUnitCost(' step 3.1, b after max: ' + b);    
    b = Math.pow(b, currentProdCost.defaultDrop);
    //debugUnitCost(' step 3.1, b after power: ' + b);    
    tempResult = tempResult + a * b;
  }

  debugUnitCost('  step 3.5, correctedVolumes: ' + correctedVolumes);
  debugUnitCost('  step 3.6, defaultDrop: ' + currentProdCost.defaultDrop);  
  debugUnitCost('  step 4, before packformat: ' + tempResult);

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
      //debugUnitCost('UnitCost: packFormat error');
  }

  debugUnitCost('  step 4, after packformat: ' + tempResult);

  if (isPrivateLabel) tempResult = tempResult * (1.0 + currentProdCost.marginOnPrivateLabel);

  debugUnitCost('  step 5, after privateLabel: ' + tempResult);

  return tempResult;

}

function prepareProdCost(seminar, period){
  var deferred = q.defer(), tempAssort;
  var prodCost = [{marketID : 1, categoryID : 1},{marketID : 1, categoryID : 2},{marketID : 2, categoryID : 1},{marketID : 2, categoryID : 2}];

  debugUnitCost('Prepare prodCost, seminar :'+ seminar + ', period :' + period);
  require('./../models/BG_oneQuarterExogenousData.js').oneQuarterExogenousData.find({seminar: seminar, period : period }, function(err, docs){
    if(err){ debugUnitCost('ERR:' + err); deferred.reject({msg:'oneQuarterExogenousData find err, seminar: ' + seminar + ', period: ' + period});}
    if(docs){      
      tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 1; });

      if(tempAssort){
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
            if(err){ debugUnitCost('ERR:' + err); deferred.reject({msg:'oneQuarterExogenousData find err, seminar: ' + seminar + ', period: ' + period});}
            if(docs){
                //console.log('debug:' + util.inspect(docs));

                tempAssort = _.find(docs, function(assort) { return assort.marketID == 1 && assort.categoryID == 1; });         
                if(!tempAssort){
                  return deferred.reject({msg:'tempAssort is undefined, Cannot find parameters...'});
                }
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
        deferred.reject({msg:'cannot find right tempAssort in docs : ' + docs});
      }
    } else {
      deferred.reject({msg:'prepareProdCost failed : no one oneQuarterExogenousData, seminar: ' + seminar + ', period: ' + period});
    }
  });


  return deferred.promise;  
}

function getProduct(query) {
  var deferred = q.defer();

  //debugUnitCost('query:' + util.inspect(query,{depth:true}));
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
              //debugUnitCost('reject variant'); 
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
          //debugUnitCost('reject');
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
        //debugUnitCost(doc);
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
          debugUnitCost('----- M' + variant.manufactorID + ' previous cumulated volume -------')
          debugUnitCost('manufactor.cumulatedDesignVolume: ' + manufactor.cumulatedDesignVolume[variant.catNow - 1]);
          debugUnitCost('manufactor.cumulatedTechnologyVolume: ' + manufactor.cumulatedTechnologyVolume[variant.catNow - 1]);
          debugUnitCost('CDL: ' + CDL);
          debugUnitCost('CTLE: ' + CTLE);
          debugUnitCost('CRMQ: ' + CRMQ);


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
                //debugUnitCost(util.inspect(catDec, {depth:null}));

                debugUnitCost('----- portfolio -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].proBrandsDecision.length; j++) {

                    for (var k = 0; k < catDec[i].proBrandsDecision[j].proVarDecision.length; k++) {
                      if (catDec[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && catDec[i].proBrandsDecision[j].proVarDecision[k].varName != "") {

                        debugUnitCost(catDec[i].proBrandsDecision[j].brandName + catDec[i].proBrandsDecision[j].proVarDecision[k].varName + ': ' + catDec[i].proBrandsDecision[j].proVarDecision[k].composition + ' / production: ' + catDec[i].proBrandsDecision[j].proVarDecision[k].production);
                        
                        for (var specIdx = 0; specIdx < 22; specIdx++) {
                          var realSpecIdx = specIdx + 1;
                          if ( realSpecIdx >= catDec[i].proBrandsDecision[j].proVarDecision[k].composition[0]){
                            CDL[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (realSpecIdx >= catDec[i].proBrandsDecision[j].proVarDecision[k].composition[1]) {
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

                debugUnitCost('----- after -------')
                debugUnitCost('CDL: ' + CDL);
                debugUnitCost('CTLE: ' + CTLE);
                debugUnitCost('CRMQ: ' + CRMQ);

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
            debugUnitCost('period:' + query.period);
            require('../models/retailerDecision.js').retDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              retailerID: query.userID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.retCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                debugUnitCost('----- private portfolio(with orders) -------')
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

                        // debugUnitCost(PLorder_Market1);
                        // debugUnitCost(PLorder_Market2);

                        var totalOrder;

                        totalOrder = M1Order + M2Order;

                        if ((PLorder_Market1 != undefined) || (PLorder_Market2 != undefined)) {
                          debugUnitCost(catDec[i].privateLabelDecision[j].brandName + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName + ': ' + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition + ' / total order volume : ' + totalOrder);

                          for (var specIdx = 0; specIdx < 22; specIdx++) {
                            var realSpecIdx = specIdx + 1;
                            if (realSpecIdx >= catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[0]) {
                              CDL[specIdx] += totalOrder;
                            }

                            if (realSpecIdx >= catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[1]) {
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
                debugUnitCost('----- after -------')
                debugUnitCost('CDL: ' + CDL);
                debugUnitCost('CTLE: ' + CTLE);
                debugUnitCost('CRMQ: ' + CRMQ);
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
        //debugUnitCost(doc);
        var manufactor = _.find(doc.producerView, function(producer) {
          return producer.producerID == variant.manufactorID;
        });

        if (manufactor) {
          for (var i = 0; i < 20; i++) {
            CTLH[i] = manufactor.cumulatedTechnologyVolume[variant.catNow - 1][i];
          };
          // CTLH = manufactor.cumulatedTechnologyVolume[variant.catNow - 1];   
          debugUnitCost('----- M' + variant.manufactorID + ' previous cumulated volume -------')
          debugUnitCost('manufactor.cumulatedTechnologyVolume: ' + manufactor.cumulatedTechnologyVolume[variant.catNow - 1]);
          debugUnitCost('CAA: ' + CAA);
          debugUnitCost('CTLH: ' + CTLH);
          debugUnitCost('CSMT: ' + CSMT);


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
                //debugUnitCost(util.inspect(catDec, {depth:null}));

                debugUnitCost('----- portfolio -------')
                for (var i = 0; i < catDec.length; i++) {
                  for (var j = 0; j < catDec[i].proBrandsDecision.length; j++) {

                    for (var k = 0; k < catDec[i].proBrandsDecision[j].proVarDecision.length; k++) {
                      if (catDec[i].proBrandsDecision[j].proVarDecision[k].varID != 0 && catDec[i].proBrandsDecision[j].proVarDecision[k].varName != "") {

                        debugUnitCost(catDec[i].proBrandsDecision[j].brandName + catDec[i].proBrandsDecision[j].proVarDecision[k].varName + ': ' + catDec[i].proBrandsDecision[j].proVarDecision[k].composition + ' / production: ' + catDec[i].proBrandsDecision[j].proVarDecision[k].production);
                        for (var specIdx = 0; specIdx < 22; specIdx++) {
                          var realSpecIdx = specIdx + 1;
                          if (catDec[i].proBrandsDecision[j].proVarDecision[k].composition[0] == realSpecIdx) {
                            CAA[specIdx] += catDec[i].proBrandsDecision[j].proVarDecision[k].production;
                          }

                          if (realSpecIdx >= catDec[i].proBrandsDecision[j].proVarDecision[k].composition[1]) {
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

                debugUnitCost('----- after -------')
                debugUnitCost('CAA: ' + CAA);
                debugUnitCost('CTLH: ' + CTLH);
                debugUnitCost('CSMT: ' + CSMT);

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
            debugUnitCost('period:' + query.period);
            require('../models/retailerDecision.js').retDecision.findOne({
              seminar: query.seminar,
              period: query.period,
              retailerID: query.userID
            }, function(err, doc) {
              if (doc) {
                var catDec = _.filter(doc.retCatDecision, function(obj) {
                  return (obj.categoryID == variant.catNow);
                });
                debugUnitCost('----- private portfolio(with orders) -------')
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

                        // debugUnitCost(PLorder_Market1);
                        // debugUnitCost(PLorder_Market2);

                        var totalOrder;

                        totalOrder = M1Order + M2Order;

                        if ((PLorder_Market1 != undefined) || (PLorder_Market2 != undefined)) {
                          debugUnitCost(catDec[i].privateLabelDecision[j].brandName + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].varName + ': ' + catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition + ' / total order volume : ' + totalOrder);

                          for (var specIdx = 0; specIdx < 22; specIdx++) {
                            var realSpecIdx = specIdx + 1;
                            if (catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[0] == realSpecIdx) {
                              CAA[specIdx] += totalOrder;
                            }

                            if (realSpecIdx >= catDec[i].privateLabelDecision[j].privateLabelVarDecision[k].composition[1]) {
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
                debugUnitCost('----- after -------')
                debugUnitCost('CAA: ' + CAA);
                debugUnitCost('CTLH: ' + CTLH);
                debugUnitCost('CSMT: ' + CSMT);
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