var mongoose = require('mongoose'),
  	http = require('http'),
  	util = require('util'),
  	_ = require('underscore'),
  	request = require('request'),
  	q = require('q');

var oneQuarterExogenousDataSchema = mongoose.Schema({
    seminar                            : String,
    period                             : Number,
    marketID                           : Number,
    categoryID                         : Number,
    MinBMPriceVsCost                   : Number,
    MaxBMPriceVsCost                   : Number,
    IngredientsQualityVsATLGap         : Number,
    ActiveAgentVsSmoothenerGap         : Number,
    MaxTargetVolumeVsTotalMarket       : Number,
    MinOnlinePriceVsCost               : Number,
    MaxOnlinePriceVsCost               : Number,
    MaxCapacityReduction               : Number,
    MaxCapacityIncrease                : Number,
    Supplier4AcquiredLevelsGapForPL    : Number,
    MinPLPriceVsCost                   : Number,
    MaxPLPriceVsCost                   : Number,
    MinRetailPriceVsNetBMPrice         : Number,
    MaxRetailPriceVsNetBMPrice         : Number,
    MarketStudiesPrices                : [Number],
    
    //EXO
    ProdCost_IngredientPrices          : [],
    ProdCost_LogisticsCost             : Number,
    ProdCost_LabourCost                : Number,
    
    x_Sup_OnlineServiceLevel_Power_2   : Number,
    x_Sup_OnlineServiceLevel_Power_1   : Number,
    x_EMallCommisionPercentage         : Number,
    x_Sup_OnlineServiceLevel_Intercept : [serviceLevelDataSchema],
    x_InStoreCostPerSqMeter            : [serviceLevelDataSchema],
    x_StaffCostPerSqMeter              : [serviceLevelDataSchema],
})



var serviceLevelDataSchema = mongoose.Schema({
    serviceLevel : String,
    value : Number,
})

var oneQuarterExogenousData = mongoose.model('bg_oneQuarterExogenousData',oneQuarterExogenousDataSchema);
exports.oneQuarterExogenousData = mongoose.model('bg_oneQuarterExogenousData',oneQuarterExogenousDataSchema);

exports.addInfos = function(options){
    var deferred = q.defer();
   
   //Quarter exogenous Data will only be imported during initialize, from -3 ~ 9
    var startFrom = -3,
    endWith = 9;

   (function sendRequest(currentPeriod){        
      var reqOptions = {
          hostname: options.cgiHost,
          port: options.cgiPort,
          path: options.cgiPath + '?seminar=' + options.seminar + '&period=' + currentPeriod
      };

      http.get(reqOptions, function(response) { 
        var data = '';
        response.setEncoding('utf8');
        response.on('data', function(chunk){
          data += chunk;
        }).on('end', function(){
          //ask Oleg to fix here, should return 404 when result beyound the existed period.
          //console.log('response statusCode from CGI(' + options.cgiPath + ') for period ' + currentPeriod + ': ' + response.statusCode);
          if ( response.statusCode === (404 || 500) ) 
            deferred.reject({msg:'Get 404 error from CGI server, reqOptions:' + JSON.stringify(reqOptions)});
          else {
            try {
              var infoGroup = JSON.parse(data);
            } catch(e) {
              deferred.reject({msg: 'Read decision file failed or something else, cannot parse JSON data from CGI:' + data, options:options});
            }
          }      
          if (!infoGroup) return; 

          //console.log(' +++ '+ util.inspect(infoGroup, {depth:null}));
          (function singleUpdate(idx){
              oneQuarterExogenousData.update({seminar: infoGroup[idx].seminar, 
                                    marketID: infoGroup[idx].marketID,
                                    categoryID : infoGroup[idx].categoryID,
                                    period : infoGroup[idx].period},
                                    {
                                    MinBMPriceVsCost                : infoGroup[idx].MinBMPriceVsCost,
                                    MaxBMPriceVsCost                : infoGroup[idx].MaxBMPriceVsCost,
                                    IngredientsQualityVsATLGap      : infoGroup[idx].IngredientsQualityVsATLGap,
                                    ActiveAgentVsSmoothenerGap      : infoGroup[idx].ActiveAgentVsSmoothenerGap,
                                    MaxTargetVolumeVsTotalMarket    : infoGroup[idx].MaxTargetVolumeVsTotalMarket,
                                    MinOnlinePriceVsCost            : infoGroup[idx].MinOnlinePriceVsCost,
                                    MaxOnlinePriceVsCost            : infoGroup[idx].MaxOnlinePriceVsCost,
                                    MaxCapacityReduction            : infoGroup[idx].MaxCapacityReduction,
                                    MaxCapacityIncrease             : infoGroup[idx].MaxCapacityIncrease,
                                    Supplier4AcquiredLevelsGapForPL : infoGroup[idx].Supplier4AcquiredLevelsGapForPL,
                                    MinPLPriceVsCost                : infoGroup[idx].MinPLPriceVsCost,
                                    MaxPLPriceVsCost                : infoGroup[idx].MaxPLPriceVsCost,
                                    MinRetailPriceVsNetBMPrice      : infoGroup[idx].MinRetailPriceVsNetBMPrice,
                                    MaxRetailPriceVsNetBMPrice      : infoGroup[idx].MaxRetailPriceVsNetBMPrice,
                                    MarketStudiesPrices             : infoGroup[idx].MarketStudiesPrices,                                    

                                    ProdCost_IngredientPrices       : infoGroup[idx].ProdCost_IngredientPrices,
                                    ProdCost_LogisticsCost          : infoGroup[idx].ProdCost_LogisticsCost,
                                    ProdCost_LabourCost             : infoGroup[idx].ProdCost_LabourCost,

                                    x_Sup_OnlineServiceLevel_Power_2   : infoGroup[idx].x_Sup_OnlineServiceLevel_Power_2,
                                    x_Sup_OnlineServiceLevel_Power_1   : infoGroup[idx].x_Sup_OnlineServiceLevel_Power_1,
                                    x_EMallCommisionPercentage         : infoGroup[idx].x_EMallCommisionPercentage,
                                    x_Sup_OnlineServiceLevel_Intercept : infoGroup[idx].x_Sup_OnlineServiceLevel_Intercept,                                    
                                    x_InStoreCostPerSqMeter            : infoGroup[idx].x_InStoreCostPerSqMeter,
                                    x_StaffCostPerSqMeter              : infoGroup[idx].x_StaffCostPerSqMeter,
                                    },
                                    {upsert: true},
                                    function(err, numberAffected, raw){  
                                      if(err) deferred.reject({msg:err, options: options});       
                                      idx--;
                                      if(idx >= 0){
                                        singleUpdate(idx);
                                      } else {
                                        currentPeriod--;
                                        if (currentPeriod >= startFrom) {
                                           sendRequest(currentPeriod);
                                        } else {
                                          deferred.resolve({msg:'oneQuarterExogenousData(seminar:' + options.seminar + ') import done. from period' + startFrom + ' to ' + endWith, options: options});
                                        }
                                      }     
                                    });   

          })(infoGroup.length-1);
        });
      }).on('error', function(e){
        deferred.reject({msg:'errorFrom oneQuarterExogenousData import:' + e.message + ', requestOptions:' + JSON.stringify(reqOptions),options: options});
      });
    })(endWith);

    return deferred.promise;
}

exports.getReportPrice=function(req,res,next){
  return oneQuarterExogenousData.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        categoryID:1,
        marketID:1
    },function(err,doc){
        if(err){
            return next(new Error(err));
        }
        if(doc){
            res.send(200,doc.MarketStudiesPrices);
        }else{
            res.send(400,'fail');
        }
    })
}
exports.getPlayerReportOrderExpend=function(req,res,next){
  return oneQuarterExogenousData.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        categoryID:1,
        marketID:1
  },function(err,doc){
      if(err){
          return next(new Error(err));
      }
      if(doc){
          var result = 0;
          if (req.params.userType == "P") {
              require('./producerDecision.js').getProducerReportOrder(req.params.seminar,req.params.period,req.params.playerID).then(function(data){
                  for(var i = 0; i < data.length; i++){
                      if(data[i]){
                          result+=doc.MarketStudiesPrices[i]
                      }
                  }
                  res.send(200, {'result': result});
              });
          }else{
              require('./retailerDecision.js').getRetailerReportOrder(req.params.seminar,req.params.period,req.params.playerID).then(function(data){
                  for(var i = 0; i < data.length; i++){
                      if(data[i]){
                          result+=doc.MarketStudiesPrices[i]
                      }
                  }
                  res.send(200, {'result': result});
              });
          }
      }else{
          res.send(400,'fail');
      }  
  });
}

exports.getOneQuarterExogenousData=function(req,res,next){
    return oneQuarterExogenousData.findOne({
        seminar:req.params.seminar,
        period:req.params.period,
        categoryID:req.params.categoryID,
        marketID:req.params.marketID
    },function(err,doc){
        if(err){
            return next(new Error(err));
        }
        if(doc){
            res.send(200,doc);
        }else{
            res.send(400,'fail');
        }
    })
}