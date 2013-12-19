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
  //get variant composition/catNow/isPrivateLabel/packFormat

  getProduct(query).then(function(variant){
    console.log('get variant:' + util.inspect(variant.result, {depth:true}));
    return getCumVolumes(query, variant.result);
  }).then(function(variant){
    console.log('get cumVolumes:' + util.inspect(variant.result, {depth:true}));
    var value = calculateUnitCost(variant.result.composition,
                             variant.result.packFormat,
                             variant.result.isPrivateLabel,
                             variant.result.cumVolumes,
                             variant.result.catNow);
    console.log('done:' + value);
    res.send(200, {result: value.toFixed(2)});
  }, function(err){
    console.log('err, ' + err.msg);
    res.send(404, err.msg);
  });
}

function getProduct(query){
  var deferred = q.defer();

  console.log('query:' + util.inspect(query,{depth:true}));
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
                  catNow : query.catID                  
                }})
              } else { console.log('reject variant'); deferred.reject({msg:'UnitCost, cannot find variant by query: ' + query}); }
            } else { deferred.reject({msg:'UnitCost, cannot find brand by query: ' + query}); }           
          } else { console.log('reject');deferred.reject({msg:'UnitCost, cannot find producerDecision doc by query: ' + query}); }
        })
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
                  catNow : query.catID
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

function getCumVolumes(query, variant){
  var deferred = q.defer();
  var cumVolumes = [[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]];
  // for (var i = 0; i < 3; i++) {
  //   for (var j = 0; j < 22; j++) {
  //     cumVolumes[i,j] = 0;
  //   };
  // };
  
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
      if(!currentProdCost) console.log('assort error');
      for (var i = 0; i < 3; i++) {
        correctedVolumes[i] = cumVolumes[i][composition[i]]; 
        console.log('for, cumVolumes[' + i + '][' + composition[i] + ']:' + cumVolumes[i][composition[i]]); 
      };      
      console.log('correctedVolumes:' + correctedVolumes);
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
          console.log('UnitCost: catNow error');
      }        

      console.log('complete switch:' + correctedVolumes);

      tempResult = currentProdCost.logisticsCost;
       console.log(tempResult);

      var a,b;
      for (var spec = 0; spec < 3; spec++){
        console.log('currentProdCost.ingredientDetails[' +spec + ']['+ composition[spec] +']:' + currentProdCost.ingredientDetails[spec][composition[spec]]);
        a = currentProdCost.ingredientDetails[spec][composition[spec]] * composition[spec]
        b = 0;
        for (var aMarket = 1; aMarket < 3; aMarket++) {
          var PC = _.find(prodCost, function(assort){ return assort.marketID==aMarket&&assort.categoryID==catNow; })
          if(!PC){ console.log('UnitCost: get PC error in aMarket');}
          b = b + PC.minProductionVolume;
        };
        b = (Math.max(correctedVolumes[spec], b))/ b;
        b = Math.pow(b, currentProdCost.defaultDrop);
        tempResult = tempResult + a*b;
      }

      console.log(tempResult);

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
          console.log('UnitCost: packFormat error');
      }

      if(isPrivateLabel) tempResult = tempResult * (1.0 + currentProdCost.marginOnPrivateLabel);
      return tempResult;

}