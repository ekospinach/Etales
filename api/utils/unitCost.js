var _ = require('underscore'),
    userRoles = require('../../app/js/routingConfig').userRoles,
    q = require('q'),
    util = require('util');



exports.getCurrentUnitCost = function(req, res, next){
  var query = {
    period : req.body.period,
    seminar : req.body.seminar,
    brandName : req.body.brandName,
    varName : req.body.varName,
    catID : req.body.catID,
    userRole : req.body.userRole,
    userID : req.body.userID,
  };

  console.log(query);
  //console.log('try to get production cost: ' + util.inspect(query));
  //get variant composition/catNow/isPrivateLabel/packFormat
  getProduct(query).then(function(variant){
    console.log('get variant:' + util.inspect(variant.result, {depth:true}));
    return getCumVolumes(query, variant.result);
  }).then(function(variant){
    console.log('get cumVolumes[0]:' + util.inspect(variant.result.cumVolumes[0], {depth:true}));
    console.log('get cumVolumes[1]:' + util.inspect(variant.result.cumVolumes[1], {depth:true}));
    console.log('get cumVolumes[2]:' + util.inspect(variant.result.cumVolumes[2], {depth:true}));

    var value = calculateUnitCost(variant.result.composition,
                             variant.result.packFormat,
                             variant.result.isPrivateLabel,
                             variant.result.cumVolumes,
                             variant.result.catNow);
    //console.log('done:' + value);
    res.send(200, {result: value.toFixed(2)});
  }, function(err){
    //console.log('err, ' + err.msg);
    res.send(404, err.msg);
  });
}

function getProduct(query){
  var deferred = q.defer();

  //console.log('query:' + util.inspect(query,{depth:true}));
  switch(parseInt(query.userRole)){
    case userRoles.producer:
        require('../models/producerDecision.js').proDecision.findOne({seminar:query.seminar, period:query.period, producerID:query.userID}, function(err, doc){
          if(doc){
            var brand = _.find(doc.proCatDecision[query.catID-1].proBrandsDecision, function(singleBrand){ return singleBrand.brandName == query.brandName;});
            if(brand){
              var variant = _.find(brand.proVarDecision, function(singleVariant){ return singleVariant.varName == query.varName;});
              if(variant){
                deferred.resolve({msg:'found variant', result:{
                  composition : variant.composition,
                  packFormat : variant.packFormat,
                  isPrivateLabel : false,
                  catNow : query.catID,
                  manufactorID : brand.producerID
                }})
              } else { 
                //console.log('reject variant'); 
                deferred.reject({msg:'UnitCost, cannot find variant by query: ' + query}); 
              }
            } else { deferred.reject({msg:'UnitCost, cannot find brand by query: ' + query}); }           
          } else { 
            //console.log('reject');
            deferred.reject({msg:'UnitCost, cannot find producerDecision doc by query: ' + query});
          }
        });
        break;
    case userRoles.retailer:
        require('../models/retailerDecision.js').retDecision.findOne({seminar:query.seminar, period:query.period, retailerID : query.userID}, function(err, doc){
          if(doc){
            var brand = _.find(doc.retCatDecision[query.catID-1].privateLabelDecision, function(singleBrand){return singleBrand.brandName == query.brandName;});
            if(brand){
              var variant = _.find(brand.privateLabelVarDecision, function(singleVariant){return singleVariant.varName == query.varName;});
              if(variant){
                deferred.resolve({msg:'found private label', result:{
                  composition : variant.composition,
                  packFormat : variant.packFormat,
                  isPrivateLabel : true,
                  catNow : query.catID,
                  manufactorID : 4
                }})
              } else { deferred.reject({msg:'UnitCost, cannot find variant by query: ' + query}); }
            } else { deferred.reject({msg:'UnitCost, cannot find brand by query: ' + query}); }           
          } else { deferred.reject({msg:'UnitCost, cannot find retailerDecision doc by query: ' + query}); }
        });
        break;
    default:
       deferred.reject({msg:'UnitCost, userRole error:' + query});
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
function getCumVolumes(query, variant){
  var deferred = q.defer();
  var cumVolumes = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
  var DL, TLE, RMQ;
  var AA, TLH, SMT;
  //DL - DesignLevel, TLE - Technology Level ELECSORRIES, RMQ - QUALITY of INGREDIENTS
  //AA - Active Agent, TLH - Technology Level HEALTHBEAUTIES, SMT - Smoother level 
  var CDL, CTEL, CRMQ;
  var CAA, CLH, CSMT;
  //C - cumulated volume 
  var preCumulatedDLvolume, preCumulatedTLvolume;
  var historyPeriod;
  //Pre - Previous period 

  historyPeriod = query.period - 1;
  switch(variant.catNow){
    //ELECSORRIES
    case '1':
          DL = variant.composition[0];
          TLE = variant.composition[1];
          RMQ = variant.composition[2];
          require('../models/companyHistory.js').findOne({seminar : query.seminar, period: historyPeriod}, function(err, doc){
            if(doc){
                var manufactor = _.find(doc.producerView, function(producer){return produerID == query.manufactorID;});
                if(manufactor){
                  preCumulatedDLvolume = manufactor.cumulatedDesignVolume;
                  preCumulatedTLvolume = manufactor.cumulatedTechnologyVolume;
                  
                  //normal products
                  if(query.manufactorID <= 3){
                    require('../models/producerDecision.js').proDecision.findOne({seminar:query.seminar, period:query.period, producerID:query.userID}, function(err, doc){
                      if(doc){
                        
                        
                      } else { deferred.reject({msg:'UnitCost, cannot find companyHistory doc by query: ' + query}); }
                    })                      
                  //private labels 
                  } else {
                    require('../models/retailerDecision.js').retDecision.findOne({seminar:query.seminar, period:query.period, retailerID : query.userID}, function(err, doc){
                      if(doc){

                      }      
                    })
                  }
                } else { deferred.reject({msg:'UnitCost, cannot find manufactor ' + query.manufactorID}); }
            } else { deferred.reject({msg:'UnitCost, cannot find companyHistory doc by query: ' + query});}
          })
          break;
    //HEALTHBEAUTIES
    case '2':
          break;
  }
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 22; j++) {
      cumVolumes[i,j] = 0;
    };
  };
  
  variant.cumVolumes = cumVolumes;
  deferred.resolve({msg: 'getCumVolume', result: variant});
  return deferred.promise;
}


function calculateUnitCost(composition, packFormat, isPrivateLabel, cumVolumes, catNow) {
  var prodCost =  [{
        marketID : 1,
        categoryID : 1,
        ingredientDetails : [
        [0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.000, 0.000],
        [0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.000, 0.000],
        [0.300, 0.298, 0.296, 0.294, 0.292, 0.290, 0.288, 0.286, 0.284, 0.282, 0.280, 0.278, 0.276, 0.274, 0.272, 0.270, 0.268, 0.266, 0.264, 0.262, 0.260, 0.258]],
        higherDesignImpact : 0.05,
        higherTechImpact : 0.1,
        logisticsCost : 0.70,
        minProductionVolume : 4.00,
        defaultDrop : -0.12,
        ECONOMY : 0.02,
        STANDARD : 0.03,
        PREMIUM : 0.05,
        marginOnPrivateLabel : 0.15,
      },{
        marketID : 1,
        categoryID : 2,
        ingredientDetails : [
        [0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.000, 0.000],
        [0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.000, 0.000],
        [0.700, 0.705, 0.710, 0.715, 0.720, 0.725, 0.730, 0.735, 0.740, 0.745, 0.750, 0.755, 0.760, 0.765, 0.770, 0.775, 0.780, 0.785, 0.790, 0.795, 0.800, 0.805]],
        higherDesignImpact : 0.10,
        higherTechImpact : 0.1,
        logisticsCost : 1.00,
        minProductionVolume : 3.00,
        defaultDrop : -0.15,
        ECONOMY : 0.01,
        STANDARD : 0.02,
        PREMIUM : 0.04,
        marginOnPrivateLabel : 0.25,        
      },{
        marketID : 2,
        categoryID : 1,
        ingredientDetails : [
        [0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.100, 0.000, 0.000],
        [0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.000, 0.000],
        [0.300, 0.298, 0.296, 0.294, 0.292, 0.290, 0.288, 0.286, 0.284, 0.282, 0.280, 0.278, 0.276, 0.274, 0.272, 0.270, 0.268, 0.266, 0.264, 0.262, 0.260, 0.258]],
        higherDesignImpact : 0.05,
        higherTechImpact : 0.1,        
        logisticsCost : 0.70,
        minProductionVolume : 6.00,
        defaultDrop : -0.12,
        ECONOMY : 0.02,
        STANDARD : 0.03,
        PREMIUM : 0.05,
        marginOnPrivateLabel : 0.15,             
      },{
        marketID : 2,
        categoryID : 2,
        ingredientDetails : [
        [0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.200, 0.000, 0.000],
        [0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.450, 0.000, 0.000],
        [0.700, 0.705, 0.710, 0.715, 0.720, 0.725, 0.730, 0.735, 0.740, 0.745, 0.750, 0.755, 0.760, 0.765, 0.770, 0.775, 0.780, 0.785, 0.790, 0.795, 0.800, 0.805]],
        higherDesignImpact : 0.10,
        higherTechImpact : 0.1,        
        logisticsCost : 1.00,
        minProductionVolume : 5.00,
        defaultDrop : -0.15,
        ECONOMY : 0.01,
        STANDARD : 0.02,
        PREMIUM : 0.04,
        marginOnPrivateLabel : 0.25,                   
      }],
      tempResult,
      geogNow = 2, 
      correctedVolumes = [0,0,0]; //Length:TSpecs(1~3)

      //SpecsMax = 3
      var currentProdCost = _.find(prodCost, function(assort){ return (assort.marketID==geogNow&&assort.categoryID==catNow)})
      // if(!currentProdCost) 
      //   //console.log('assort error');
      for (var i = 0; i < 3; i++) {
        correctedVolumes[i] = cumVolumes[i][composition[i]]; 
        //console.log('for, cumVolumes[' + i + '][' + composition[i] + ']:' + cumVolumes[i][composition[i]]); 
      };      
      //console.log('correctedVolumes:' + correctedVolumes);
      //MaxSpecsIndex = 22
      switch(catNow){
        case 1: //Elecsories
          for (var specsIndex = composition[0]; specsIndex < 22; specsIndex++) {
            correctedVolumes[0] = correctedVolumes[0] + (cumVolumes[0][specsIndex] * (specsIndex-(composition[0]-1)) * currentProdCost.higherDesignImpact);
          };
          for (var specsIndex = composition[1]; specsIndex < 22; specsIndex++) {
            correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex] * (specsIndex-(composition[1]-1)) * currentProdCost.higherTechImpact);
          };        
          break;
        case 2: //HealthBeauties
          for (var specsIndex = composition[1]; specsIndex < 22; specsIndex++) {
            correctedVolumes[1] = correctedVolumes[1] + (cumVolumes[1][specsIndex] * (specsIndex-(composition[1]-1)) * currentProdCost.higherTechImpact);
          };        
          break;
        default:
          //console.log('UnitCost: catNow error');
      }        

      //console.log('complete switch:' + correctedVolumes);

      tempResult = currentProdCost.logisticsCost;
       //console.log(tempResult);

      var a,b;
      for (var spec = 0; spec < 3; spec++){
        //console.log('currentProdCost.ingredientDetails[' +spec + ']['+ composition[spec] +']:' + currentProdCost.ingredientDetails[spec][composition[spec]]);
        a = currentProdCost.ingredientDetails[spec][composition[spec]] * composition[spec]
        b = 0;
        for (var aMarket = 1; aMarket < 3; aMarket++) {
          var PC = _.find(prodCost, function(assort){ return assort.marketID==aMarket&&assort.categoryID==catNow; })
          if(!PC){ 
            //console.log('UnitCost: get PC error in aMarket');
          }
          b = b + PC.minProductionVolume;
        };
        b = (Math.max(correctedVolumes[spec], b))/ b;
        b = Math.pow(b, currentProdCost.defaultDrop);
        tempResult = tempResult + a*b;
      }

      //console.log(tempResult);

      switch(packFormat){
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

      if(isPrivateLabel) tempResult = tempResult * (1.0 + currentProdCost.marginOnPrivateLabel);
      return tempResult;

}